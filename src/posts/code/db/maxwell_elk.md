---
date: 2024-09-15
article: true
star: false
sticky: false
category:
  - db
tag:
  - maxwell
  - mysql
  - elasticsearch
---

# Maxwell同步MySQL数据到ELK

<img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202409201602228.png" style="zoom:150%;" />

<!-- more -->
---

## 简介

Maxwell是一个Zendesk开源的MySQL数据库实时捕获和同步的工具，它基于MySQL binlog，并输出JSON格式的数据流，类似的工具还有阿里开源的canal，debezium等，不过后者支持的数据类型更丰富，通过将数据推送到Elasticsearch中，就可以实现MySQL所做不到的大数据量级的全文检索，不过一般很少会直接推送的Elasticsearch，中间会经过一个消息队列，它的好处在于可以堆积消息，因为消息是持久化的，即便突然宕机，堆积的消息在机器重启后依然可以被消费而不至于丢失，在这种情况下，数据的流向如下所示

```
mysql binlog -> maxwell -> mq -> logstash -> elasticsearch
```

本文会讲解如何通过Maxwell将Mysql数据中的变化增量输出到Logstash，再通过logstash输出到Elasticsearch中，采用的MQ为Redis List，实际环境中的话建议使用kafka。

## 准备环境

首先准备一台虚拟机，安装了MySQL和Redis，环境为Debian12，IP：192.168.153.130（具体地址请根据实际情况来），记得将MySQL的binlog模式修改为`binlog_format=row`。

```bash
$ docker ps
CONTAINER ID   IMAGE       COMMAND                   CREATED             STATUS             PORTS                                                  NAMES
e1b0f3d4f113   mysql:8.0   "docker-entrypoint.s…"   About an hour ago   Up About an hour   0.0.0.0:3306->3306/tcp, :::3306->3306/tcp, 33060/tcp   mysql8
6b778d728ba3   redis:7.0   "docker-entrypoint.s…"   11 days ago         Up 2 days          0.0.0.0:6379->6379/tcp, :::6379->6379/tcp              redis7
```

首先要创建一个名为`maxwell`的数据库

```sql
CREATE DATABASE IF NOT EXISTS maxwell1
CHARACTER SET utf8mb4
COLLATE utf8mb4_bin;
```

然后创建一个`maxwell`用户，赋予对应权限

```sql
# 创建用户
CREATE USER 'maxwell'@'%' IDENTIFIED BY '123456';
# 赋予用户对maxwell数据的所有访问权限
GRANT ALL ON maxwell.* TO 'maxwell'@'%';
# 赋予用户maxwell对其他用户的限制权限
GRANT SELECT, REPLICATION CLIENT, REPLICATION SLAVE ON *.* TO 'maxwell'@'%';
```

第二台虚拟机，安装了ELK组件，环境为Debian12，IP：192.168.153.132，（访问[Docker部署Elastic Stack8.x实践](https://246859.github.io/posts/code/docker/docker_install_elk.html)以了解如何安装ELK）

```bash
$ docker ps
CONTAINER ID   IMAGE                     COMMAND                   CREATED      STATUS             PORTS     NAMES
8c647eabf572   logstash:8.15.0           "/usr/local/bin/dock…"   5 days ago   Up About an hour             logstash
391ca3e0ce8f   kibana:8.15.0             "/bin/tini -- /usr/l…"   5 days ago   Up About an hour             kibana
04c8359bacb2   elasticsearch:8.15.0      "/bin/tini -- /usr/l…"   5 days ago   Up About an hour             elastic
```

环境准备好后才进行下面的工作。



## 安装maxwell

我们将maxwell与mysql安装在同一台虚拟机，先在Dockerhub查看最新版本的tag

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202409192038996.png)

将对应的镜像拉下来

```bash
$ docker pull zendesk/maxwell:v1.41.2
v1.41.2: Pulling from zendesk/maxwell
1efc276f4ff9: Pull complete 
a2f2f93da482: Pull complete 
12cca292b13c: Pull complete 
69e15dccd787: Pull complete 
79219af6aa7c: Pull complete 
f39f1bdf1c84: Pull complete 
3261018f1785: Pull complete 
4f4fb700ef54: Pull complete 
be1353da9f00: Pull complete 
627d862c87f8: Pull complete 
Digest: sha256:68d51e27b6de2315ea710c0fe88972d4bd246ffb2519c82a49aa90a980d6cf64
Status: Downloaded newer image for zendesk/maxwell:v1.41.2
docker.io/zendesk/maxwell:v1.41.2
```

编写配置文件，我们可以在maxwell官网看到maxwell支持的producer类型，访问[Reference - Maxwell's Daemon (maxwells-daemon.io)](https://maxwells-daemon.io/config/#redis-producer)，大概有下面这些

- file
- kafka
- kinesis
- sqs
- sns
- nats
- pubsub
- bigquery
- rabbitmq
- redis

其中redis支持pubsub，stream，list三种类型，本文使用lpush类型（严格来说stream才算是像样的消息队列，不过logstash的input不支持），编写如下配置文件

```properties
# maxwell配置
daemon=true
log_level=info
client_id=maxwell_1

# redis生产者配置
producer=redis
redis_host=192.168.153.130
redis_port=6379
redis_auth=123456
# pubsub | xadd | lpush | rpush
redis_type=lpush
redis_key=maxwell

# 过滤器配置
filter=include: lobby.*

# mysql配置
host=192.168.153.130
port=3306
user=maxwell
password=123456
schema_database=maxwell
```

保存至`/usr/db/maxwell/config.properties`文件中，然后运行容器

```bash
$ docker run -d \
	--name=maxwell \
	-v /usr/db/maxwell/:/etc/maxwell/ \
	zendesk/maxwell:v1.41.2 \
	bin/maxwell --config /etc/maxwell/config.properties
```

完事后看看情况，可以看到正常连接到MySQL了

```bash
$ docker logs maxwell
2024-09-19 13:47:55 INFO  Maxwell - Starting Maxwell. maxMemory: 1545601024 bufferMemoryUsage: 0.25
2024-09-19 13:47:55 INFO  SchemaStoreSchema - Creating maxwell database
2024-09-19 13:47:55 INFO  Maxwell - Maxwell v1.41.2 is booting (MaxwellRedisProducer), starting at Position[BinlogPosition[binlog.000002:8104], lastHeartbeat=0]
2024-09-19 13:47:55 INFO  AbstractSchemaStore - Maxwell is capturing initial schema
2024-09-19 13:47:55 INFO  BinlogConnectorReplicator - Setting initial binlog pos to: binlog.000002:8104
2024-09-19 13:47:56 INFO  BinaryLogClient - Connected to 192.168.153.130:3306 at binlog.000002/8104 (sid:6379, cid:27)
2024-09-19 13:47:56 INFO  BinlogConnectorReplicator - Binlog connected.
```

查看maxwell数据库，能看到元数据表，就说明可以了

```sql
USE maxwell;
SHOW tables;

+-------------------+
| Tables_in_maxwell |
+-------------------+
| bootstrap         |
| columns           |
| databases         |
| heartbeats        |
| positions         |
| schemas           |
| tables            |
+-------------------+
```



## 测试Redis

在连接到ELK之前，我们先测试下maxwell是否能正常将MySQL中的数据推送到Redis Stream中，测试服务器是[dstgo/lobby: Query Http Api for don't strave togehter lobby servers (github.com)](https://github.com/dstgo/lobby)，启动`lobby`服务器，它会定时向`lobby.servers`数据库写入最新的在线服务器数据。

```bash
$ ./lobby -f conf.toml
2024-09-19 22:04:23 INF [lobby] logging in level: INFO
2024-09-19 22:04:24 INF [lobby] message queue is listening
2024-09-19 22:04:24 INF [lobby] created 2 cron jobs
2024-09-19 22:04:24 INF [lobby] server is listiening at 127.0.0.1:8080
2024-09-19 22:06:00 INF [lobby] cron job prepared round=0 name=lobby-collect entry=1 prev="2024-09-19 22:06:00 +0800 CST" next="2024-09-19 22:08:00 +0800 CST"
2024-09-19 22:06:12 INF [lobby] cron job finished name=lobby-collect round=0 elapsed=12.0738719s entry=1 prev="2024-09-19 22:06:00 +0800 CST" next="2024-09-19 22:08:00 +0800 CST" result.collected=23512
```

通过结果我们可以看到在本轮任务中收集到了`23512`条数据，并成功插入到数据库中，此时我们看看Redis中的情况

```
> LLEN maxwell
288763
```

我们可以看到JSON格式的消息大概如下所示

```json
{
    "database": "lobby",
    "table": "secondaries",
    "type": "insert",
    "ts": 1726814525,
    "xid": 1188,
    "commit": true,
    "data": {
        "id": 12596,
        "sid": "3252044372",
        "steam_id": "90201905397408796",
        "address": "162.191.225.248",
        "port": 11001,
        "owner_id": 15397
    }
}
```

目前为止Maxwell和Redis一切工作正常，接下来将需要将Redis中的消息推送到ELK中



## 推送到ELK

接下来我们需要配置Logstash的输入源，管道配置文件如下所示，关于Redis Input的相关信息可以在[Plugins Inputs Redis](https://www.elastic.co/guide/en/logstash/8.15/plugins-inputs-redis.html)中了解更多。

```
input {
  redis {
    host => "192.168.153.130"
    port => 6379
    password => "123456"
    data_type => "list"
    key => "maxwell"
    batch_count => 2000 
  }
}

filter {
  grok {
    # 过滤类型，我们只需要insert的数据
    match => {
       "type" => "(?insert)"
    }
    tag_on_failure => ["_grokparsefailure"]
  }
}

output {
  # 匹配失败的数据就不要了
  if "_grokparsefailure" not in [tags] {
      elasticsearch {
          hosts => ["https://localhost:9200"]
          index => "%{database}-%{table}"
          user => "elastic"
          password => "TETJ8IY+ifbt8SLc+RRQ"
          ssl_enabled => true
          ssl_certificate_verification => true
          ssl_certificate_authorities => "/usr/share/logstash/config/certs/http_ca.crt"
          ca_trusted_fingerprint => "C0E9867C7D446BFF72FE46E7E9FE3455E970A8ADB0D3DF0E1472D55DB2612CD5"
      }
  }
}
```

重启logstash

```bash
$ docker restart logstash
```

登陆Kibana，查看索引情况，可以看到四张表的数据都被同步过来了。

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202409201520656.png)



查看servers索引中的其中一个文档，里面的`data`字段就是mysql中的一行数据，`type`表示的是操作类型

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202409201522955.png)

至此就完成了。



## 全量同步

之前的方式都是增量同步，如果你想全量同步的话，maxwell也提供了工具`maxwell-bootstrap`，它还支持where来过滤数据，它的参数如下

```bash
Option                             Description                                                                                                   
------                             -----------                                                                                                   
--config <String>                  location of config.properties file                                                                            
--env_config <String>              json object encoded config in an environment variable                                                         

--database <String>                database that contains the table to bootstrap                                                                 
--table <String>                   table to bootstrap                                                                                            
--where [String]                   where clause to restrict the rows bootstrapped from the specified table. e.g. my_date >= '2017-01-01 11:07:13'

--abort <String>                   bootstrap_id to abort                                                                                         
--monitor <String>                 bootstrap_id to monitor                                                                                       

--client_id <String>               maxwell client to perform the bootstrap                                                                       
--log_level <String>               log level, one of DEBUG|INFO|WARN|ERROR. default: WARN                                                        

--host <String>                    mysql host containing 'maxwell' database. default: localhost                                                  
--user <String>                    mysql username. default: maxwell                                                                              
--password [String]                mysql password                                                                                                
--port <String>                    mysql port. default: 3306                                                                                     

--replication_host <String>        mysql host to query. default: (host)                                                                          
--replication_user <String>        username. default: maxwell                                                                                    
--replication_password [String]    password                                                                                                      
--replication_port <String>        port. default: 3306                                                                                           

--comment <String>                 arbitrary comment to be added to every bootstrap row record                                                   
--schema_database <String>         database that contains maxwell schema and state                                                               
--help                             display help
```

使用示例如下，你需要手动指定所有配置

```bash
$ docker exec -it maxwell \
	/app/bin/maxwell-bootstrap --config /etc/maxwell/config.properties \
	--host 192.168.153.130 --port 3306 --user maxwell --pasword 123456 \
	--client_id maxwell_1 \
	--database lobby --table servers --where 'id>=10'
```



## 小结

折腾了这么多你可能会问，为什么不直接在业务中将数据同时存到数据库和Elasticsearch中，这样不是更方便？这么做主要有几个原因，下面简单说一说。

如果你是同步存的话，因为Mysql本身的操作时间也不低，那么性能势必会降低不少。假如说是异步存的话，你可能会将其放到消息队列中，然后再定时消费，但你需要自己维护一套逻辑，如果是系统设计之初就决定要这么做了，那也不失为一个可行的方案。

但软件工程从来都不是尽善尽美的，没有人能考虑到所有的情况，如果是在项目后期业务增长遇到了数据库瓶颈才加入的Elasticsearch，前面这两种方式都需要对原有的代码进行改动，这会增加不少工作量。而通过Maxwell这类工具，直接从数据库层面就可以观测到数据的变化并汇总一个数据流，然后推送给Elasticsearch，这一套工具在外部就可以工作，不需要对原来的业务代码做过多的更改，这便是它最大的优点，除此之外maxwell还具有开箱即用，简单方便的优点。

如果你想了解更多有关CDC（Change Data Capture 数据捕获）工具，可以前往[wushujames/mysql-cdc-projects Wiki (github.com)](https://github.com/wushujames/mysql-cdc-projects/wiki)。
