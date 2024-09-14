---
date: 2024-09-06
article: true
star: false
sticky: false
category:
  - docker
tag:
  - elasticsearch
  - logstash
  - kibana
---

# Docker部署Elastic Stack8.x实践

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202409062109276.webp)

<!-- more -->
---

## 介绍

大家常说的Elastic Stack通常指的是就是ELK，它一般由几个组件组成

- [Elasticsearch](https://github.com/elastic/elasticsearch) - 开源分布式搜索引擎，核心组件
- [Logstash](https://github.com/elastic/logstash) - 开源数据流处理管道，负责把数据流输送给elasticsearch
- [Kibana](https://github.com/elastic/kibana) - elasticsearch的web UI界面
- [Beats](https://www.elastic.co/cn/beats) - 数据采集器，位于客户端侧，负责将收集到的数据发送到管道中（非必需）

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202409111607921.png)

beats的种类有很多，下面这些是官方开发的：

- Filebeat，采集日志文件
- Metricbeat，采集监控指标
- Packetbeat，采集网络数据
- Winlogbeat，采集windows事件日志
- Auditbeat，采集审计数据
- Hertbeat，运行状态采集

还有很多社区开发的beats，支持更多数据源，你可以前往[Community Beats](https://www.elastic.co/guide/en/beats/libbeat/current/community-beats.html)查看更多信息。



ELK通常的用途是用于构建一个强大的日志分析系统，一般为了容错率还会在传输链中额外加一个消息队列组件，数据的流向如下所示。

```
Beats => MQ => Logstash => Elastic => Kibana
```

在这类场景中，对消息队列的稳定性和一致性要求不高，只要能够堆积大量数据且足够快，所以Kafka成了最佳之选，不过这并不代表其他消息队列就不能用，像RabbitMQ，RocktMQ，以至于Redis Stream也都是支持的。

除此之外，ELK还可以配合数据同步组件，将其他负责存储的数据库（例如MySQL）中的数据增量/全量同步到Elasticsearch中，这样就能借由ElasticSearch来实现关系数据库所做不到的高速全文检索。



总之ELK是一套很强大的组合，它的功能应用很广泛，本文接下来会演示如何安装ELK这三个组件，并介绍基础使用，环境如下：

- OS：Debian12
- Elastic Stack版本`8.15.0`
- Docker版本：`27.2.0`

文章内容仅作学习参考，组件具体配置需要根据实际环境为准。

## Docker安装

我先演示如何用Docker逐个安装ELK组件，熟悉一下流程，这样后面在用Docker-Compose过程中出了什么问题也好定位。首先你需要创建一个目录用于存放四个组件的数据

```bash
$ mkdir -p /var/elk/{elastic,logstash,kibana,filebeat}
$ ls /var/elk
elastic  kibana  logstash  filebeat
```

::: tip

ELK这几个组件建议版本一致，且以Elasticsearch为准，否则可能会因为组件间API不匹配而导致无法正常工作。

:::



### 拉取镜像

先去DockerHub看看版本，然后再决定统一使用哪一个，十分不推荐使用`latest`版本（官方也不建议），原因上面已经说过了。

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202409062116576.png)



这里选择的Tag是`8.15.0`，相应的，后续logstash和kibana两个组件的版本也必须是`8.15.0`，如下所示

```
docker pull elasticsearch:8.15.0
docker pull kibana:8.15.0
docker pull logstash:8.15.0
docker pull elastic/filebeat:8.15.0
```

查看本地镜像列表

```bash
REPOSITORY         TAG       IMAGE ID       CREATED        SIZE
elasticsearch      8.15.0    a249dfc37cb5   4 weeks ago    1.26GB
logstash           8.15.0    d6b658c48349   4 weeks ago    869MB
kibana             8.15.0    e7cf2c9ee06c   4 weeks ago    1.18GB
elastic/filebeat   8.15.0    caabe62c6a7f   5 weeks ago    346MB
```



### Elasticsearch

先试运行elasticsearch容器（节点模式必须要指定，不然boots-check无法通过），总共就两种模式

- multi-node 多节点，生产用，该模式下必须指定host地址，不能使用回环地址，否则无法通过启动检查
- single-node 单节点，一般测试用的

你可以在[ElasticSearch Discovery](https://www.elastic.co/guide/en/elasticsearch/reference/8.15/bootstrap-checks.html#dev-vs-prod-mode)浏览有关启动检查的介绍。运行如下的命令创建容器，这只是试运行，用于生成配置文件和密钥。

```bash
$ docker run -it \
    --name elastic \
    -p 9200:9200 \
    -m 1g \
    -e "discovery.type=single-node" \
    elasticsearch:8.15.0
```

elasticsearch的最低运行内存建议是256M（Java写的东西都挺吃内存），这里我们直接设置为1G（通过`-m` 可以直接限制容器内存，这样就无需指定JVM内存），启动完毕后，会输出一大段JSON日志，注意看下有没有报错，不过可读性不是很高，如果最后成功了，会有如下的输出，它会显示生成的密码和Enrollment Token，如图。

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202409111432223.png)

密码

```
R0IBVdsn58CEvh4a+kxL
```

CA指纹

```
248d70f1b13f92ad04cd3a1347fef0de26a20090b196d6aa548958929178d06d
```

Kibana Token（有效期30分钟）

```
eyJ2ZXIiOiI4LjE0LjAiLCJhZHIiOlsiMTcyLjE4LjAuMjo5MjAwIl0sImZnciI6IjI0OGQ3MGYxYjEzZjkyYWQwNGNkM2ExMzQ3ZmVmMGRlMjZhMjAwOTBiMTk2ZDZhYTU0ODk1ODkyOTE3OGQwNmQiLCJrZXkiOiJrQ2pIMzVFQnJ3Z0MzSXowNXVfSzp4X3IyTkc2bFRYMnFZNUh1WDZjdmxBIn0=
```

集群Token

```
eyJ2ZXIiOiI4LjE0LjAiLCJhZHIiOlsiMTcyLjE4LjAuMjo5MjAwIl0sImZnciI6IjI0OGQ3MGYxYjEzZjkyYWQwNGNkM2ExMzQ3ZmVmMGRlMjZhMjAwOTBiMTk2ZDZhYTU0ODk1ODkyOTE3OGQwNmQiLCJrZXkiOiJrU2pIMzVFQnJ3Z0MzSXowNXVfSzpwVlV5bVc0YVI5NkpEaGR5RjJaQUxBIn0=
```

这些密码和Token只会在首次启动时输出在控制台，这也是为什么要以`it`模式运行容器，如果你没有记住的话可以通过如下命令来重新生成

```bash
$ docker exec -it elastic /usr/share/elasticsearch/bin/elasticsearch-reset-password -u elastic
$ docker exec -it elastic /usr/share/elasticsearch/bin/elasticsearch-create-enrollment-token -s kibana
```

然后通过下面的命令将配置文件和数据复制到宿主机，这样有需要可以自行修改配置文件

```bash
$ docker cp elastic:/usr/share/elasticsearch/config /usr/elk/elastic/ \
    && docker cp elastic:/usr/share/elasticsearch/data /usr/elk/elastic/ \
    && docker cp elastic:/usr/share/elasticsearch/plugins /usr/elk/elastic/ \
    && docker cp elastic:/usr/share/elasticsearch/logs /usr/elk/elastic/
```

配置文件内容如下，这些都是自动生成的本地SSL配置

```yml
# Enable security features
# 开启密码
xpack.security.enabled: true
xpack.security.enrollment.enabled: true
xpack.monitoring.collection.enabled: true


# Enable encryption for HTTP API client connections, such as Kibana, Logstash, and Agents
xpack.security.http.ssl:
  enabled: true
  keystore.path: certs/http.p12

# Enable encryption and mutual authentication between cluster nodes
xpack.security.transport.ssl:
  enabled: true
  verification_mode: certificate
  keystore.path: certs/transport.p12
  truststore.path: certs/transport.p12
```

赋予文件读写权限（我这是在本地虚拟机上测试才这样授权，一般情况下只给创建容器的用户读写权限就好了）

```bash
$ chmod -R a+rw /usr/elk/elastic
```

删除该容器

```bash
$ docker rm -f elastic
elastic
```

接下来创建正式的elasticsearch容器

```bash
$ docker run -d \
    --name elastic \
    --restart=always \
    -p 9200:9200 \
    -m 1g \
    -v /usr/elk/elastic/config:/usr/share/elasticsearch/config \
    -v /usr/elk/elastic/data:/usr/share/elasticsearch/data \
    -v /usr/elk/elastic/plugins:/usr/share/elasticsearch/plugins \
    -v /usr/elk/elastic/logs:/usr/share/elasticsearch/logs \
    -e "discovery.type=single-node" \
    -e "LANG=C.UTF-8" \
    -e "LC_ALL=C.UTF-8" \
    elasticsearch:8.15.0
```

启动完成后看看情况

```bash
CONTAINER ID   IMAGE                  COMMAND                   CREATED         STATUS          PORTS                                                                                  NAMES
70327827ad7e   elasticsearch:8.15.0   "/bin/tini -- /usr/l…"   3 seconds ago   Up 3 seconds    0.0.0.0:9200->9200/tcp, :::9200->9200/tcp, 0.0.0.0:9300->9300/tcp, :::9300->9300/tcp   elastic
```

再通过`docker logs elastic`看看日志，有下面这种输出`shards started`就说明成功了。

```json
{"@timestamp":"2024-09-09T07:06:21.336Z", "log.level": "INFO",  "current.health":"GREEN","message":"Cluster health status changed from [RED] to [GREEN] (reason: [shards started [[.security-7][0]]]).","previous.health":"RED","reason":"shards started [[.security-7][0]]" , "ecs.version": "1.2.0","service.name":"ES_ECS","event.dataset":"elasticsearch.server","process.thread.name":"elasticsearch[9c568f63350d][masterService#updateTask][T#1]","log.logger":"org.elasticsearch.cluster.routing.allocation.AllocationService","elasticsearch.cluster.uuid":"GouYYh1LQMaKI0wlG0tymA","elasticsearch.node.id":"O3ifaPLURLKbawOGRjTfdg","elasticsearch.node.name":"9c568f63350d","elasticsearch.cluster.name":"docker-cluster"}
```

将密码配置到环境变量中，你也可以将其配置到`bash_profile`来永久生效。

```bash
$ export ELASTIC_PASSWORD="R0IBVdsn58CEvh4a+kxL"
```

测试连通性

```bash
$ curl --cacert /usr/elk/elastic/config/certs/http_ca.crt -u elastic:$ELASTIC_PASSWORD https://localhost:9200
```

若有如下输出则说明成功

```bash
{
  "name" : "1bfd1c9c7476",
  "cluster_name" : "docker-cluster",
  "cluster_uuid" : "g_8SKjZ3RGWKSM1-yCmPkw",
  "version" : {
    "number" : "8.15.0",
    "build_flavor" : "default",
    "build_type" : "docker",
    "build_hash" : "1a77947f34deddb41af25e6f0ddb8e830159c179",
    "build_date" : "2024-08-05T10:05:34.233336849Z",
    "build_snapshot" : false,
    "lucene_version" : "9.11.1",
    "minimum_wire_compatibility_version" : "7.17.0",
    "minimum_index_compatibility_version" : "7.0.0"
  },
  "tagline" : "You Know, for Search"
}
```

### Kibana

kibana就只是一个Elasticsearch的Web可视化界面，用如下命令启动容器

```bash
$ docker run -d \
    --restart=always \
    --name kibana \
    -p 5601:5601 \
    kibana:8.15.0
```

由于是`-d`模式启动的容器，我们需要通过`docker logs kibana`来查看其输出，日志会提示我们该访问哪一个URL

```
[2024-09-09T08:10:03.291+00:00][INFO ][root] Kibana is starting
[2024-09-09T08:10:03.335+00:00][INFO ][node] Kibana process configured with roles: [background_tasks, ui]
[2024-09-09T08:10:08.299+00:00][INFO ][plugins-service] The following plugins are disabled: "cloudChat,cloudExperiments,cloudFullStory,profilingDataAccess,profiling,securitySolutionServerless,serverless,serverlessObservability,serverlessSearch".
[2024-09-09T08:10:08.351+00:00][INFO ][http.server.Preboot] http server running at http://0.0.0.0:5601
[2024-09-09T08:10:08.440+00:00][INFO ][plugins-system.preboot] Setting up [1] plugins: [interactiveSetup]
[2024-09-09T08:10:08.450+00:00][INFO ][preboot] "interactiveSetup" plugin is holding setup: Validating Elasticsearch connection configuration…
[2024-09-09T08:10:08.468+00:00][INFO ][root] Holding setup until preboot stage is completed.


i Kibana has not been configured.

# 出现这一段才说明服务器启动成功
Go to http://0.0.0.0:5601/?code=396495 to get started.


Your verification code is:  396 49
```

kibana告诉我们要去`http://0.0.0.0:5601/?code=396495`访问管理界面，如下图，将之前得到的Token填入其中，过期了需要按照之前的方法重置。

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202409091553925.png)



正在加载

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202409141135615.png)



再然后就需要登陆，用户密码就是之前Elastic生成的。

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202409091557951.png)



进入主界面如下，代表着启动成功。

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202409091603245.png)



复制配置文件

```bash
$ docker cp kibana:/usr/share/kibana/config /usr/elk/kibana/ \
	&& docker cp kibana:/usr/share/kibana/data /usr/elk/kibana/ \
	&& docker cp kibana:/usr/share/kibana/plugins /usr/elk/kibana/ \
	&& docker cp kibana:/usr/share/kibana/logs /usr/elk/kibana/
```

修改配置文件`/usr/elk/kibana/config/kibana.yml`，这里就只加了一个中文语言，其他的没改（这里不要修改host为容器名，否则自动生成的SSL证书会校验失败）

```yaml
### >>>>>>> BACKUP START: Kibana interactive setup (2024-09-11T06:41:04.118Z)

#
# ** THIS IS AN AUTO-GENERATED FILE **
#

# Default Kibana configuration for docker target
#server.host: "0.0.0.0"
#server.shutdownTimeout: "5s"
#elasticsearch.hosts: [ "http://elasticsearch:9200" ]
#monitoring.ui.container.elasticsearch.enabled: true
### >>>>>>> BACKUP END: Kibana interactive setup (2024-09-11T06:41:04.118Z)

# This section was automatically generated during setup.
i18n.locale: "zh-CN"
server.host: 0.0.0.0
server.shutdownTimeout: 5s
elasticsearch.hosts: ['https://172.18.0.2:9200']
monitoring.ui.container.elasticsearch.enabled: true
elasticsearch.serviceAccountToken: AAEAAWVsYXN0aWMva2liYW5hL2Vucm9sbC1wcm9jZXNzLXRva2VuLTE3MjYwMzY4NjM3ODc6QXNWY2Q5aC1UVE9MMFFSdzA0Wk5WQQ
elasticsearch.ssl.certificateAuthorities: [/usr/share/kibana/data/ca_1726036864116.crt]
xpack.fleet.outputs: [{id: fleet-default-output, name: default, is_default: true, is_default_monitoring: true, type: elasticsearch, hosts: ['https://172.18.0.2:9200'], ca_trusted_fingerprint: 248d70f1b13f92ad04cd3a1347fef0de26a20090b196d6aa548958929178d06d}]
```

给一下读写权限

```bash
$ chmod -R a+rw /usr/elk/kibana
```

将容器删除

```bash
$ docker rm -f kibana
kibana
```

使用如下命令创建新容器，挂载之前的目录

```bash
$ docker run -d \
    --name kibana \
    --restart=always \
    -p 5601:5601 \
    -v /usr/elk/kibana/config:/usr/share/kibana/config \
    -v /usr/elk/kibana/data:/usr/share/kibana/data \
    -v /usr/elk/kibana/plugins:/usr/share/kibana/plugins \
    -v /usr/elk/kibana/logs:/usr/share/kibana/logs \
    kibana:8.15.0
```

启动完成后，通过`docker logs kibana`查看日志，有如下输出表示启动成功

```
[2024-09-09T08:24:23.570+00:00][INFO ][status.plugins.licensing] licensing plugin is now available: License fetched
[2024-09-09T08:24:23.570+00:00][INFO ][status.plugins.taskManager] taskManager plugin is now available: Task Manager is healthy
[2024-09-09T08:24:23.650+00:00][INFO ][status] Kibana is now available
```

再次访问页面，看看能否登陆，能正常登陆就行，界面也变成了中文。

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202409111055900.png)



::: warning

处于容器内的Elasticserach服务，在生成的默认证书中，其SAN（Subjetc Alternative Names）不会包括容器名（或许是安全考虑），一个例子如下

```
0:0:0:0:0:0:0:1, 
127.0.0.1, 
172.18.0.2, # 容器IP
5fdea25a1e84, # 容器ID
localhost
```

如果你创建了自定义网络，且希望将容器名作为host来进行网络访问，例如下面这种HTTP请求，

```
https://elastic:9200/
```

大概率不会成功，报错会如下显示

```
Certificate for <elastic> doesn't match any of the subject alternative names: [0:0:0:0:0:0:0:1, 127.0.0.1, 172.18.0.2, 5fdea25a1e84, localhost]
```

解决方案有下面几种：

1. 使用容器IP（Bridge模式下IP不固定，除非你手动固定）
2. 使用容器ID
3. 重新生成证书，修改SAN，将容器名加入其中（挺麻烦的，我基本上没成功过，就算配好了也会出现一堆问题）
4. 直接用host网络模式，用localhost访问，这样最简单

个人测试用第四种最方便，实际环境可以用第二种或第三种

:::

### Logstash

Logstash的流程也基本上都一样，先创建容器生成配置文件

```bash
$ docker run -d \
    --name logstash \
    -p 9600:9600 \
    -p 5044:5044 \
    logstash:8.15.0
```

复制配置文件

```bash
$ docker cp logstash:/usr/share/logstash/config /usr/elk/logstash/ \
	&& docker cp logstash:/usr/share/logstash/pipeline /usr/elk/logstash/
```

除此之外我们还需要复制Elastisearch的证书

```bash
$ cp -r /usr/elk/elastic/config/certs/ /usr/elk/logstash/config/certs/
```

赋予读写和执行权限

```bash
$ chmod -R a+rwx /usr/elk/logstash/
```

::: tip

logstash默认以用户`logstash`身份运行，你可以在`config/startup.options`文件中看到相关信息，如果没有足够权限的话，它将无法访问TLS证书文件，启动时就会有如下报错

```
output {
    elasticsearch {
      # This setting must be a path
      # ["File does not exist or cannot be opened /usr/share/logstash/config/certs/http_ca.crt"]
      ssl_certificate_authorities => "/usr/share/logstash/config/certs/http_ca.crt"
      ...
    }
  }
```

相关的问题你也可以在[Discuss Elastic Issue #355961](https://discuss.elastic.co/t/regarding-the-logstash-cacerts-issue/355961)看到。

:::

修改配置文件`/usr/elk/logstash/config/logstash.yml`

```yml
xpack.monitoring.enabled: true
# 同Kibana配置文件中的地址
xpack.monitoring.elasticsearch.hosts: [ "https://172.18.0.2:9200" ]
# 用户名
xpack.monitoring.elasticsearch.username: "elastic"
# 密码
xpack.monitoring.elasticsearch.password: "R0IBVdsn58CEvh4a+kxL" 
# 容器内证书存放地址
xpack.monitoring.elasticsearch.ssl.certificate_authority: "/usr/share/logstash/config/certs/ca.pem"
# 之前生成的CA指纹
xpack.monitoring.elasticsearch.ssl.ca_trusted_fingerprint: "248d70f1b13f92ad04cd3a1347fef0de26a20090b196d6aa548958929178d06d"
```

修改`/usr/elk/logstash/pipeline/logstash.conf`管道文件，它由输入，过滤器，输出三个部分构成构成，如果不会可以看看[官方logstash文档](https://www.elastic.co/guide/en/logstash/current/config-examples.html)。我们用的是ELK组合，输出就是ElasticSearch，这里输入默认是beats协议的端口，暂时不配置过滤器。

```bash
input {
  beats {
    port => 5044
  }
}

output {
  elasticsearch {
    hosts => ["https://172.18.0.2:9200"]
    index => "elk-%{+YYYY.MM.dd}"
    user => "elastic"
    password => "R0IBVdsn58CEvh4a+kxL"
    ssl => true
    ssl_certificate_verification => true
    cacert => "/usr/share/logstash/config/certs/http_ca.crt"
    ca_trusted_fingerprint => "248d70f1b13f92ad04cd3a1347fef0de26a20090b196d6aa548958929178d06d"
  }
}
```

在logstash中，你也可以配置多个管道，每一个管道都需要一个单独的文件夹来存放配置和数据，默认的管道ID为`main`，你可以在`config/pipelines.yml`中看到相关信息

```yaml
# This file is where you define your pipelines. You can define multiple.
# For more information on multiple pipelines, see the documentation:
#   https://www.elastic.co/guide/en/logstash/current/multiple-pipelines.html

- pipeline.id: main
  path.config: "/usr/share/logstash/pipeline"
```

删除容器，重新创建

```bash
$ docker run -d \
    --name logstash \
    --restart=always \
    --privileged=true \
    -p 9600:9600 \
    -p 5044:5044 \
    -v /usr/elk/logstash/config:/usr/share/logstash/config \
    -v /usr/elk/logstash/config/certs/:/usr/share/logstash/config/certs \
    -v /usr/elk/logstash/pipeline:/usr/share/logstash/pipeline \
    logstash:8.15.0
```

启动后通过`docker logs logstash`查看日志

```
[2024-09-11T07:19:09,490][INFO ][logstash.agent           ] Pipelines running {:count=>2, :running_pipelines=>[:".monitoring-logstash", :main], :non_running_pipelines=>[]}
[2024-09-11T07:19:09,641][INFO ][org.logstash.beats.Server][main][4003355d5aaa1df8be3b217b50af9df431171c5565026d11937901df529ad370] Starting server on port: 5044
```

我们可以看到运行的管道有两个，服务器也启动成功，至此Logstash也安装成功了。



如果你安装成功了，此时在Kibana中查看的集群状态就应该如下所示

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202409112200949.png)



### Filebeat

::: tip

通常来说，filebeat的工作场景应该是位于客户端侧，这里的客户端指的是生产日志的一方，也就是Web服务，本文仅仅是为了方便所以才单机部署。

:::

Filebeat是最简单的一种，它是用来采集日志文件数据的，这里就用它来进行演示。先创建容器，以host网络模式启动，它只是负责日志文件采集，不需要对外暴露端口。

```bash
$ docker run -d \
    --name filebeat \
    --network host \
    elastic/filebeat:8.15.0 \
    filebeat -e  -c /usr/share/filebeat/filebeat.yml
```

再复制文件

```bash
$ docker cp filebeat:/usr/share/filebeat/filebeat.yml /usr/elk/filebeat/ \
	&& docker cp filebeat:/usr/share/filebeat/data /usr/elk/filebeat/ \
	&& docker cp filebeat:/usr/share/filebeat/logs /usr/elk/filebeat/
```

然后修改配置文件

```yml
filebeat.config:
  modules:
    path: ${path.config}/modules.d/*.yml
    reload.enabled: false

processors:
  - add_cloud_metadata: ~
  - add_docker_metadata: ~

output.logstash:
  enabled: true
  hosts: ["127.0.0.1:5044"]

filebeat.inputs:
- type: log
  enabled: true
  paths:
    - /usr/share/filebeat/target/server.log #要采集的日志文件
  scan_frequency: 10s
```

给一下权限

```bash
$ chown -R 1000:1000 /usr/elk/filebeat
```

重新创建新容器，`usr/server/logs`文件夹是你应用程序的日志路径

```bash
$ docker run -d \
	--name filebeat \
	--restart=always \
	--privileged=true \
    --network host \
    -v /usr/server/logs:/usr/share/filebeat/target \
    -v /usr/elk/filebeat/filebeat.yml:/usr/share/filebeat/filebeat.yml \
    -v /usr/elk/filebeat/data:/usr/share/filebeat/data \
 	-v /usr/elk/filebeat/logs:/usr/share/filebeat/logs \
    elastic/filebeat:8.15.0 \
    filebeat -e  -c /usr/share/filebeat/filebeat.yml
```

创建日志文件夹，记得要给读权限，不然没法正常工作。

```bash
$ mkdir -p /usr/server/logs
$ touch /usr/server/logs/server.log
```

此时再通过`docker logs filebeat`查看日志，filebeat每30秒输出一次运行时状态，有下面的输出就表示正常。

```json
{"log.level":"info","@timestamp":"2024-09-11T12:34:14.142Z","log.logger":"monitoring","log.origin":{"function":"github.com/elastic/beats/v7/libbeat/monitoring/report/log.(*reporter).logSnapshot","file.name":"log/log.go","file.line":192},"message":"Non-zero metrics in the last 30s","service.name":"filebeat","monitoring":{"metrics":{"beat":{"cgroup":{"memory":{"mem":{"usage":{"bytes":46563328}}}},"cpu":{"system":{"ticks":200,"time":{"ms":10}},"total":{"ticks":400,"time":{"ms":20},"value":400},"user":{"ticks":200,"time":{"ms":10}}},"handles":{"limit":{"hard":1048576,"soft":1048576},"open":10},"info":{"ephemeral_id":"1ed2e689-5eb7-4180-8921-3afdaa4c8f06","uptime":{"ms":720055},"version":"8.15.0"},"memstats":{"gc_next":34717440,"memory_alloc":17732008,"memory_total":44115528,"rss":113188864},"runtime":{"goroutines":34}},"filebeat":{"events":{"active":0},"harvester":{"open_files":1,"running":1}},"libbeat":{"config":{"module":{"running":0}},"output":{"events":{"active":0},"write":{"latency":{"histogram":{"count":0,"max":0,"mean":0,"median":0,"min":0,"p75":0,"p95":0,"p99":0,"p999":0,"stddev":0}}}},"pipeline":{"clients":1,"events":{"active":0},"queue":{"max_events":0}}},"registrar":{"states":{"current":1}},"system":{"load":{"1":0.67,"15":0.56,"5":0.59,"norm":{"1":0.0838,"15":0.07,"5":0.0738}}}},"ecs.version":"1.6.0"}}
```

至此，filebeat也部署成功

### 测试

我们可以自己写一个程序来测试下这一套工具链是否正常工作，最经典的使用场景就是HTTP日志，如下

```go
package main

import (
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"os"
)

func main() {
	filename := "/usr/server/logs/server.log"
	logFIle, err := os.OpenFile(filename, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		panic(err)
	}
	defer logFIle.Close()
	logger := slog.New(slog.NewJSONHandler(io.MultiWriter(logFIle, os.Stdout), &slog.HandlerOptions{
		Level: slog.LevelInfo,
	}))

	http.HandleFunc("GET /log", func(writer http.ResponseWriter, request *http.Request) {
		logger.Info("request logging",
			slog.String("from", request.RemoteAddr),
			slog.String("method", request.Method),
			slog.String("path", request.RequestURI),
		)
		writer.Write([]byte(fmt.Sprintf("writing log into %s", filename)))
	})

	fmt.Println("test server is listening on :8080")
	http.ListenAndServe(":8080", nil)
}

```

编译

```bash
$ go build -o test_server .
```

运行

```bash
$ ./test_server
test server is listening on :8080
```

通过curl测试下接口

```bash
$ curl http://localhost:8080/log
```

可以看到它输出的JSON风格日志

```json
{"time":"2024-09-11T20:54:51.595474978+08:00","level":"INFO","msg":"request logging","from":"127.0.0.1:39392","method":"GET","path":"/log"}
{"time":"2024-09-11T20:56:12.970216509+08:00","level":"INFO","msg":"request logging","from":"127.0.0.1:55504","method":"GET","path":"/log"}
```

此时打开Kibana，访问`http://127.0.0.1:5601/app/management/data/index_management/indices`，可以看到之前在`logstash`中`output`配置的索引，显示有17个文档

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202409112111678.png)



先创建一个ApiKey，在本地通过CURL查询到数据

```
YjFNNDRaRUJlb2hpUC1vQVE1V0s6R1FiUjJVOHRRbWVPclI5OXIwQnJvUQ==
```

配置临时环境变量

```bash
export ES_URL="https://localhost:9200"
export API_KEY="YjFNNDRaRUJlb2hpUC1vQVE1V0s6R1FiUjJVOHRRbWVPclI5OXIwQnJvUQ=="
```

请求接口，仅查询前两个文档

```bash
$ curl -X POST "${ES_URL}/elk-2024.09.11/_search?pretty" \
  --cacert /usr/elk/elastic/config/certs/http_ca.crt \
  -H "Authorization: ApiKey "${API_KEY}"" \
  -H "Content-Type: application/json" \
  -d'
{
  "from": 0,
  "size": 2,
  "query": {
    "query_string": {
      "query": "method"
    }
  }
}'
```

输出如下

```json
{
  "took" : 6,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 17,
      "relation" : "eq"
    },
    "max_score" : 0.028170876,
    "hits" : [
      {
        "_index" : "elk-2024.09.11",
        "_id" : "5VMm4ZEBeohiP-oA14g2",
        "_score" : 0.028170876,
        "_source" : {
          "input" : {
            "type" : "log"
          },
          "agent" : {
            "name" : "db-debian12",
            "type" : "filebeat",
            "version" : "8.15.0",
            "ephemeral_id" : "1ed2e689-5eb7-4180-8921-3afdaa4c8f06",
            "id" : "b7fb5a5b-221e-4d87-ad40-7e8e43f74c18"
          },
          "@version" : "1",
          "@timestamp" : "2024-09-11T12:54:54.359Z",
          "event" : {
            "original" : "{\"time\":\"2024-09-11T20:54:51.595474978+08:00\",\"level\":\"INFO\",\"msg\":\"request logging\",\"from\":\"127.0.0.1:39392\",\"method\":\"GET\",\"path\":\"/log\"}"
          },
          "ecs" : {
            "version" : "8.0.0"
          },
          "log" : {
            "offset" : 0,
            "file" : {
              "path" : "/usr/share/filebeat/target/server.log"
            }
          },
          "tags" : [
            "beats_input_codec_plain_applied"
          ],
          "host" : {
            "name" : "db-debian12"
          },
          "message" : "{\"time\":\"2024-09-11T20:54:51.595474978+08:00\",\"level\":\"INFO\",\"msg\":\"request logging\",\"from\":\"127.0.0.1:39392\",\"method\":\"GET\",\"path\":\"/log\"}"
        }
      },
      {
        "_index" : "elk-2024.09.11",
        "_id" : "4lMo4ZEBeohiP-oAKYkD",
        "_score" : 0.028170876,
        "_source" : {
          "input" : {
            "type" : "log"
          },
          "agent" : {
            "name" : "db-debian12",
            "type" : "filebeat",
            "version" : "8.15.0",
            "ephemeral_id" : "1ed2e689-5eb7-4180-8921-3afdaa4c8f06",
            "id" : "b7fb5a5b-221e-4d87-ad40-7e8e43f74c18"
          },
          "@version" : "1",
          "@timestamp" : "2024-09-11T12:56:19.373Z",
          "event" : {
            "original" : "{\"time\":\"2024-09-11T20:56:12.970216509+08:00\",\"level\":\"INFO\",\"msg\":\"request logging\",\"from\":\"127.0.0.1:55504\",\"method\":\"GET\",\"path\":\"/log\"}"
          },
          "log" : {
            "offset" : 140,
            "file" : {
              "path" : "/usr/share/filebeat/target/server.log"
            }
          },
          "ecs" : {
            "version" : "8.0.0"
          },
          "tags" : [
            "beats_input_codec_plain_applied"
          ],
          "host" : {
            "name" : "db-debian12"
          },
          "message" : "{\"time\":\"2024-09-11T20:56:12.970216509+08:00\",\"level\":\"INFO\",\"msg\":\"request logging\",\"from\":\"127.0.0.1:55504\",\"method\":\"GET\",\"path\":\"/log\"}"
        }
      }
    ]
  }
}
```

能够正常的搜索到，说明这一套ELK+Filebeat的工具链工作正常。

```bash
CONTAINER ID   IMAGE                     COMMAND                   CREATED       STATUS             PORTS                                                                                  NAMES
36fd1e20b7e2   elastic/filebeat:8.15.0   "/usr/bin/tini -- /u…"   5 hours ago   Up About an hour                                                                                          filebeat
eb8655684941   logstash:8.15.0           "/usr/local/bin/dock…"   6 hours ago   Up 6 hours         0.0.0.0:5044->5044/tcp, :::5044->5044/tcp, 0.0.0.0:9600->9600/tcp, :::9600->9600/tcp   logstash
b67dd4f4c5b3   kibana:8.15.0             "/bin/tini -- /usr/l…"   7 hours ago   Up 7 hours         0.0.0.0:5601->5601/tcp, :::5601->5601/tcp                                              kibana
1bfd1c9c7476   elasticsearch:8.15.0      "/bin/tini -- /usr/l…"   7 hours ago   Up 7 hours         0.0.0.0:9200->9200/tcp, :::9200->9200/tcp, 9300/tcp                                    elastic
```



## Docker Compose安装

Docker Compose也就是上面手动安装方法的自动化版，虽然只需编写一个YAML文件就行了，但从之前的步骤中可以看出，其中最大的麻烦就是配置文件，尤其是Elasticsearch，所以我们仍然需要在`up`之前就把这些配置文件准备好，为了便于测试，后续的网络模式统一采用`host`。



### 初始化



首先创建文件夹存放配置和数据

```bash
$ mkdir -p /usr/elk/{elastic,logstash,kibana,filebeat}
```

编写如下YAML文件，命名为`/usr/elk/elk-test.yml`，这份YAML文件只是为了生成后续需要的配置文件，所以不会挂载任何目录。

```yaml
services: 
  elasticsearch:
    image: elasticsearch:8.15.0
    network_mode: host
    container_name: elastic
    restart: always
    environment:
      - "discovery.type=single-node"
      - "bootstrap.memory_lock=true"
      - "ES_JAVA_OPTS=-Xms256m -Xmx1g" 
  
  kibana:
    image: kibana:8.15.0
    network_mode: host
    container_name: kibana
    restart: always
      
  logstash:
    image: logstash:8.15.0
    network_mode: host
    container_name: logstash
    restart: always
     
  filebeat:
    image: elastic/filebeat:8.15.0
    network_mode: host
    container_name: filebeat
    restart: always
```

执行命令`docker compose up`，创建project

```bash
$ docker compose -f /usr/elk/elk-test.yml -p elk-test up -d
[+] Running 4/4
 ✔ Container logstash        Started	0.4s                                      
 ✔ Container filebeat        Started	0.4s 
 ✔ Container elastic         Started	0.5s 
 ✔ Container kibana          Started	0.6s
```

查看project，看看是否成功启动

```bash
$ docker compose ls
NAME                STATUS              CONFIG FILES
elk-test            running(4)          /usr/elk/elk-test.yml
```



<br/>

接下来复制文件，把`data`，`plugins`，`logs`这些目录一并复制过来主要是为了省的我们手动去创建目录结构，以及部分组件对文件权限要求很严格（比如filebeat），直接复制过来可以省一些麻烦。首先是Elasticsearch，配置文件我们只需要两个，一个是服务器配置文件`elasticsearch.yml`，另一个是插件配置文件`elasticsearch-plugins.yml`，其他的就不用复制了。

```bash
$ docker cp elastic:/usr/share/elasticsearch/config /usr/elk/elastic/ \
    && docker cp elastic:/usr/share/elasticsearch/data /usr/elk/elastic/ \
    && docker cp elastic:/usr/share/elasticsearch/plugins /usr/elk/elastic/ \
    && docker cp elastic:/usr/share/elasticsearch/logs /usr/elk/elastic/
```

再然后就是Kibana

```bash
$ docker cp kibana:/usr/share/kibana/config /usr/elk/kibana/ \
	&& docker cp kibana:/usr/share/kibana/data /usr/elk/kibana/ \
	&& docker cp kibana:/usr/share/kibana/plugins /usr/elk/kibana/ \
	&& docker cp kibana:/usr/share/kibana/logs /usr/elk/kibana/
```

Logstash

```bash
$ docker cp logstash:/usr/share/logstash/config /usr/elk/logstash/ \
	&& docker cp logstash:/usr/share/logstash/pipeline /usr/elk/logstash/
```

Filebeat

```bash
$ docker cp filebeat:/usr/share/filebeat/filebeat.yml /usr/elk/filebeat/ \
	&& docker cp filebeat:/usr/share/filebeat/data /usr/elk/filebeat/ \
	&& docker cp filebeat:/usr/share/filebeat/logs /usr/elk/filebeat/
```

然后记得要给文件权限

```bash
$ chown -R 1000:1000 /usr/elk
```

然后把`elk-test`项目删除

```bash
$ docker compose -p elk-test down
[+] Running 5/5
 ✔ Container logstash  Removed 
 ✔ Container elastic   Removed
 ✔ Container filebeat  Removed
 ✔ Container kibana    Removed
 ✔ Network elk         Removed
```



### 创建项目

接下来编写用于正式创建的YAML文件`elk.yml`，相比于之前的版本，主要是多了数据挂载信息。

```yaml
services: 
  elasticsearch:
    image: elasticsearch:8.15.0
    network_mode: host
    container_name: elastic
    restart: always
    environment:
      - "discovery.type=single-node"
      - "bootstrap.memory_lock=true"
      - "ES_JAVA_OPTS=-Xms256m -Xmx1g" 
    volumes: 
      - "/usr/elk/elastic/config/:/usr/share/elasticsearch/config"
      - "/usr/elk/elastic/plugins:/usr/share/elasticsearch/plugins"
      - "/usr/elk/elastic/data:/usr/share/elasticsearch/data"
      - "/usr/elk/elastic/logs:/usr/share/elasticsearch/logs"
  
  
  kibana:
    image: kibana:8.15.0
    network_mode: host
    container_name: kibana
    depends_on:
      - elasticsearch
    restart: always
    volumes: 
      - "/usr/elk/kibana/config:/usr/share/kibana/config"
      - "/usr/elk/kibana/data:/usr/share/kibana/data"
      - "/usr/elk/kibana/plugins:/usr/share/kibana/plugins"dock
      - "/usr/elk/kibana/logs:/usr/share/kibana/logs"
      
  logstash:
    image: logstash:8.15.0
    container_name: logstash
    network_mode: host
    depends_on:
      - elasticsearch
    restart: always
    volumes:
      - "/usr/elk/logstash/config:/usr/share/logstash/config"
      - "/usr/elk/logstash/pipeline:/usr/share/logstash/pipeline"
     
  filebeat:
    image: elastic/filebeat:8.15.0
    container_name: filebeat
    network_mode: host
    depends_on: 
      - elasticsearch
      - logstash
      - kibana
    restart: always
    entrypoint: filebeat -e -c /usr/share/filebeat/filebeat.yml
    volumes:
      - "/usr/server/logs:/usr/share/filebeat/target"
      - "/usr/elk/filebeat/filebeat.yml:/usr/share/filebeat/filebeat.yml"
      - "/usr/elk/filebeat/data:/usr/share/filebeat/data"
      - "/usr/elk/filebeat/logs:/usr/share/filebeat/logs"
```

创建新的project

```bash
$ docker compose -f /usr/elk/elk.yml -p elk up -d
[+] Running 5/5
 ✔ Network elk         Created
 ✔ Container elastic   Started
 ✔ Container kibana    Started do
 ✔ Container logstash  Started
 ✔ Container filebeat  Started
```



### 生成凭证

由于是`-d`模式启动，我们需要用Elasticsearch手动生成下面这些凭证，然后才能配置其他组件

<br/>

生成密码

```bash
$ docker exec -it elastic /usr/share/elasticsearch/bin/elasticsearch-reset-password -u elastic
Please confirm that you would like to continue [y/N]y
Password for the [elastic] user successfully reset.
New value: TETJ8IY+ifbt8SLc+RRQ
```

生成集群Token

```bash
$ docker exec -it elastic /usr/share/elasticsearch/bin/elasticsearch-create-enrollment-token -s node
eyJ2ZXIiOiI4LjE0LjAiLCJhZHIiOlsiMTcyLjE3LjAuMTo5MjAwIl0sImZnciI6ImMwZTk4NjdjN2Q0NDZiZmY3MmZlNDZlN2U5ZmUzNDU1ZTk3MGE4YWRiMGQzZGYwZTE0NzJkNTVkYjI2MTJjZDUiLCJrZXkiOiJSVFdvNzVFQkxTVTl1YnFnSVJ3Mzp4aGV4Y1A0ZVJJZTE2bnNGbjhXaUpRIn0=
```

生成Kibana Token

```bash
$ docker exec -it elastic /usr/share/elasticsearch/bin/elasticsearch-create-enrollment-token -s kibana
eyJ2ZXIiOiI4LjE0LjAiLCJhZHIiOlsiMTcyLjE4LjAuNTo5MjAwIl0sImZnciI6IjUxNWU1ZjdkZDVkN2ZjNWU0ZjQ0NGU5ZTU2MTcxOGQyNTUyYTg2ZTAzYjMwMGYyNzM3NDBlMDk5NTNiYjgxYTIiLCJrZXkiOiJSMVN1NlpFQjVQSVo0dW5WZmk5WDo3NjgtUlFJbFJ6dXYzR1BKWFZNd1FBIn0=
```

生成Kibana service token（你可以前往[Elastic | service tokens](https://www.elastic.co/guide/en/elasticsearch/reference/current/service-tokens-command.html)了解更多信息)

```bash
$ docker exec -it elastic /usr/share/elasticsearch/bin/elasticsearch-service-tokens create elastic/kibana kibana-service
SERVICE_TOKEN elastic/kibana/kibana-service = AAEAAWVsYXN0aWMva2liYW5hL2tpYmFuYS1zZXJ2aWNlOl8wYTZvX293U2VpRnZfbmlDS0lnbFE
```

生成CA指纹

```bash
$ docker exec -it elastic openssl x509 -in /usr/share/elasticsearch/config/certs/http_ca.crt -sha256 -fingerprint | grep -i sha256 | sed 's/://g'
SHA256 Fingerprint=C0E9867C7D446BFF72FE46E7E9FE3455E970A8ADB0D3DF0E1472D55DB2612CD5
```



### 生成证书（可选）

elastic7和以前的版本中，SSL证书都是要手动生成的，到版本8.x以后默认会自动生成一个开箱即用的证书，这个证书的SAN是不会包括容器名的，所以下面这个请求也就无法通过SSL验证

```bash
https://elastic:9200/
```

由于我们采用的是Host模式，通过`localhost`访问即可。如果想要自己生成证书，可以按照下面的步骤试试，反正我在`bridge`模式下生成的证书基本上没生效过，一会服务端证书出问题了，一会客户端证书出问题了，官网相关的解答也很少。



由于过程比较繁琐，我们需要进入容器内部进行操作，然后进入`/usr/share/elasticsearch/bin`目录，里面有生成工具

```bash
$ docker exec -it elastic /bin/bash
$ cd bin
```

先生成CA文件，整个过程都是互动式的，它会让你指定文件名和密码，这里都选择默认，然后在`/usr/share/elasticsearch`目录下就会生成CA文件`elastic-stack-ca.p12`。

```bash
$ elasticsearch-certutil ca
Please enter the desired output file [elastic-stack-ca.p12]:
# CA密码
Enter password for elastic-stack-ca.p12 :
```

生成凭证和私钥，它会基于之前的CA生成一个zip压缩文件`elastic-certificates.p12`，里面包含了凭证，私钥，以及CA凭证。

```bash
$ elasticsearch-certutil cert --ca elastic-stack-ca.p12
# 之前设置的CA密码
Enter password for CA (elastic-stack-ca.p12) :
Please enter the desired output file [elastic-certificates.p12]:
# 为凭证设置密码
Enter password for elastic-certificates.p12 :
```

如果你设置了密码，需要将其添加到keystore和trusstore中

```bash
$ elasticsearch-keystore add xpack.security.transport.ssl.keystore.secure_password
$ elasticsearch-keystore add xpack.security.transport.ssl.truststore.secure_password
```

将`elastic-certificates.p12`复制出来，它是集群内节点通信的凭证。

```bash
$ docker cp elastic:/usr/share/elasticsearch/elastic-certificates.p12 /usr/elk/elastic/config/certs/transport.p12
Successfully copied 5.12kB to /usr/elk/elastic/config/certs/
```

<br/>

最后生成SSL证书，这个过程比较长，第一步询问是否生成CSR，默认不生成即可，这个是给第三方认证用的，CA证书在我们手里就不需要。

```bash
$ elasticsearch-certutil http
## Do you wish to generate a Certificate Signing Request (CSR)?
Generate a CSR? [y/N]
```

指定已有的CA文件，有密码就输密码，没密码就跳过

```bash
## Do you have an existing Certificate Authority (CA) key-pair that you wish to use to sign your certificate?
Use an existing CA? [y/N]y
## What is the path to your CA?
CA Path: /usr/share/elasticsearch/elastic-stack-ca.p12
Password for elastic-stack-ca.p12:
```

设置证书过期时间，默认5年，使用默认即可

```bash
## How long should your certificates be valid?
For how long should your certificate be valid? [5y]
```

是否为每一个节点都生成一个证书和私钥，如果你是多节点集群部署可能会需要（多节点集群也可以只使用一个证书），但我们这里是单机部署就不需要

```bash
## Do you wish to generate one certificate per node?
Generate a certificate per node? [y/N]
```

重点来了，指定HostNames，这些字段会被添加SAN中，也正是我们生成证书的目的，这里加入`elasitc`，`localhost`两个就够了。

```bash
## Which hostnames will be used to connect to your nodes?
You entered the following hostnames.

 - elastic # 容器名
 - localhost

Is this correct [Y/n]
```

可访问的IP地址，加入`127.0.0.1`，`172.18.0.2`

```bash
## Which IP addresses will be used to connect to your nodes?
You entered the following IP addresses.

 - 127.0.0.1
 - 172.18.0.2

Is this correct [Y/n]
```

剩下的配置默认即可

```bash
## Other certificate options
Key Name: elastic
Subject DN: CN=elastic
Key Size: 2048

Do you wish to change any of these options? [y/N]

## What password do you want for your private key(s)?
Provide a password for the "http.p12" file:  [<ENTER> for none]
```

指定文件路径，没有特别需要的话默认就行，完事后就会生成文件`/usr/share/elasticsearch/elasticsearch-ssl-http.zip`

```bash
## Where should we save the generated files?
What filename should be used for the output zip file? [/usr/share/elasticsearch/elasticsearch-ssl-http.zip] 
Zip file written to /usr/share/elasticsearch/elasticsearch-ssl-http.zip
```

如果你为SSL证书设置了密码，需要将其添加到keystore中

```bash
$ elasticsearch-keystore add xpack.security.http.ssl.keystore.secure_password
```

这个压缩包就是我们最终需要的东西，将其复制到容器外面

```bash
$ docker cp elastic:/usr/share/elasticsearch/elasticsearch-ssl-http.zip /usr/elk/elastic/elasticsearch-ssl-http.zip
Successfully copied 9.22kB to /usr/elk/elastic/elasticsearch-ssl-http.zip
```

解压，然后复制到elasticsearch的证书目录下

```bash
$ unzip elasticsearch-ssl-http.zip -d elasticsearch-ssl-http >> /dev/null
$ tree elasticsearch-ssl-http
elasticsearch-ssl-http
├── elasticsearch
│   ├── http.p12
│   ├── README.txt
│   └── sample-elasticsearch.yml
└── kibana
    ├── elasticsearch-ca.pem
    ├── README.txt
    └── sample-kibana.yml

3 directories, 6 files
$ cp elasticsearch-ssl-http/elasticsearch/http.p12 config/certs/http.p12
$ cp elasticsearch-ssl-http/kibana/elasticsearch-ca.pem config/certs/ca.pem
$ ls config/certs
ca.pem  http.p12  transport.p12
```

目前为止我们有了下面几个文件

- `transport.p12`，集群中节点加密通信凭证
- `http.p12`，证书文件，包含了证书和私钥，服务端用
- `ca.pem`，包含了证书的公钥，客户端用 ，如Kibana，Logstash

然后将它们放入到`config/certs`目录下，修改对应的配置。

::: tip

如果你更换了证书，那么所有的凭证都需要重新生成。

:::







### 修改配置

由于许多东西都是我们手动生成的，相比与之前的安装方式，要改的地方有点多。



<br/>

Elasticsearch配置，路径为`/usr/elk/elastic/config/elasticsearch.yml`，证书文件名大都与之前一样，几乎不用变。

```yaml
cluster.name: "docker-cluster"
network.host: 0.0.0.0

#----------------------- BEGIN SECURITY AUTO CONFIGURATION -----------------------
#
# The following settings, TLS certificates, and keys have been automatically      
# generated to configure Elasticsearch security features on 12-09-2024 03:58:49
#
# --------------------------------------------------------------------------------

# Enable security features
xpack.security.enabled: true
xpack.monitoring.collection.enabled: true
xpack.security.enrollment.enabled: true

# Enable encryption for HTTP API client connections, such as Kibana, Logstash, and Agents
xpack.security.http.ssl:
  enabled: true
  # 对应我们生成的HTTPS证书http.p12
  keystore.path: certs/http.p12

# Enable encryption and mutual authentication between cluster nodes
xpack.security.transport.ssl:
  enabled: true
  verification_mode: certificate
  # 对应我们生成的证书transport.p12
  keystore.path: certs/transport.p12
  truststore.path: certs/transport.p12
#----------------------- END SECURITY AUTO CONFIGURATION -------------------------
```

复制证书到Kibana目录下

```bash
$ mkdir /usr/elk/kibana/config/certs/
$ cp /usr/elk/elastic/config/certs/http_ca.crt /usr/elk/kibana/config/certs/
# 记得给权限
$ chmod -R go+rw /usr/elk/kibana/config/certs/
```

然后再修改Kibana配置文件内容，路径为`/usr/elk/kibana/config/kibana.yml`

```yaml
i18n.locale: "zh-CN"
server.host: 0.0.0.0
server.shutdownTimeout: 5s
elasticsearch.hosts: ['https://localhost:9200']
monitoring.ui.container.elasticsearch.enabled: true
elasticsearch.serviceAccountToken: AAEAAWVsYXN0aWMva2liYW5hL2tpYmFuYS1zZXJ2aWNlOl8wYTZvX293U2VpRnZfbmlDS0lnbFE
elasticsearch.ssl.certificateAuthorities: [/usr/share/kibana/config/certs/http_ca.crt]
```

配置Logstash，复制证书

```bash
$ mkdir /usr/elk/logstash/config/certs/
$ cp /usr/elk/elastic/config/certs/http_ca.crt /usr/elk/logstash/config/certs/
```

再修改配置文件，路径为`/usr/elk/logstash/config/logstash.yml`

```yaml
xpack.monitoring.enabled: true
xpack.monitoring.elasticsearch.hosts: [ "https://localhost:9200" ]
xpack.monitoring.elasticsearch.username: "elastic"
xpack.monitoring.elasticsearch.password: "TETJ8IY+ifbt8SLc+RRQ" 
xpack.monitoring.elasticsearch.ssl.certificate_authority: "/usr/share/logstash/config/certs/http_ca.crt"
xpack.monitoring.elasticsearch.ssl.ca_trusted_fingerprint: "C0E9867C7D446BFF72FE46E7E9FE3455E970A8ADB0D3DF0E1472D55DB2612CD5"
```

然后是main管道配置文件`/usr/elk/logstash/pipeline/logstash.conf`

```bash
input {
  beats {
    port => 5044
  }
}

output {
  elasticsearch {
    hosts => ["https://localhost:9200"]
    index => "elk-%{+YYYY.MM.dd}"
    user => "elastic"
    password => "TETJ8IY+ifbt8SLc+RRQ"
    ssl_enabled => true
    ssl_certificate_verification => true
    ssl_certificate_authorities => "/usr/share/logstash/config/certs/http_ca.crt"
    ca_trusted_fingerprint => "C0E9867C7D446BFF72FE46E7E9FE3455E970A8ADB0D3DF0E1472D55DB2612CD5"
  }
}
```

还有Filebeat的配置`/usr/elk/filebeat/filebeat.yml`

```yaml
filebeat.config:
  modules:
    path: ${path.config}/modules.d/*.yml
    reload.enabled: false

processors:
  - add_cloud_metadata: ~
  - add_docker_metadata: ~

output.logstash:
  enabled: true
  hosts: ["localhost:5044"]

filebeat.inputs:
- type: log
  enabled: true
  paths:
    - /usr/share/filebeat/target/server.log #要采集的日志文件
  scan_frequency: 10s
```

修改完成后，给一下权限

```bash
$ chownd -R 1000:1000 /usr/elk
```

然后重启项目

```bash
$ docker compose -p elk restart
[+] Restarting 4/4
 ✔ Container logstash  Started
 ✔ Container filebeat  Started
 ✔ Container elastic   Started
 ✔ Container kibana    Started
```

稍微等一会儿，再查看容器状态，都在运行说明配置成功了

```bash
$ docker ps
CONTAINER ID   IMAGE                     COMMAND                   CREATED          STATUS         PORTS                                                  NAMES
f9faf01d4f88   elastic/filebeat:8.15.0   "/usr/bin/tini -- /u…"   30 minutes ago   Up 7 minutes                                                          filebeat
1c328cc9baa4   kibana:8.15.0             "/bin/tini -- /usr/l…"   30 minutes ago   Up 6 minutes                                                          kibana
09c87507afd3   logstash:8.15.0           "/usr/local/bin/dock…"   30 minutes ago   Up 4 minutes                                                          logstash
86cbff18376b   elasticsearch:8.15.0      "/bin/tini -- /usr/l…"   30 minutes ago   Up 7 minutes                                                          elastic
```



### 测试

测试一下Elasticsearch HTTP API是否正常工作，有如下输出说明正常

```bash
$ curl --cacert /usr/elk/elastic/config/certs/http_ca.crt -u elastic:"TETJ8IY+ifbt8SLc+RRQ" https://localhost:9200
{
  "name" : "db-debian12",
  "cluster_name" : "docker-cluster",
  "cluster_uuid" : "OMbDIsNwTFiuyjNF9Xnpbw",
  "version" : {
    "number" : "8.15.0",
    "build_flavor" : "default",
    "build_type" : "docker",
    "build_hash" : "1a77947f34deddb41af25e6f0ddb8e830159c179",
    "build_date" : "2024-08-05T10:05:34.233336849Z",
    "build_snapshot" : false,
    "lucene_version" : "9.11.1",
    "minimum_wire_compatibility_version" : "7.17.0",
    "minimum_index_compatibility_version" : "7.0.0"
  },
  "tagline" : "You Know, for Search"
}
```

启动测试服务器

```bash
$ /usr/server/test_server
test server is listening on :8080
```

然后通过curl发送请求，重复若干次

```bash
$ curl http://localhost:8080/log
writing log into /usr/server/logs/server.log
```

访问`http://localhost:5601/login`，登陆Kibana，输入用户名密码



![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202409141807623.png)



然后我们就可以看到日志对应的文档

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202409141809889.png)



说明测试服务器的数据已经输出到了Elasticsearch中，至此部署成功。

## 小结

ELK配合容器可以很简单的部署，分布式拓展也很方便，它能干的事情也远远不止日志分析，总之它是一个很强大的技术栈，甚至有些公司会专门聘请Elastic专家，不过我目前仅仅只是才入门而已，写下本文算是为了记录一下学习的过程。



### 引用


1. [Install Elasticsearch with Docker](https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html)
1. [Security basic setup](https://www.elastic.co/guide/en/elasticsearch/reference/8.2/security-basic-setup.html)
1. [Elastic Beats](https://www.elastic.co/cn/beats)
1. [certutil](https://www.elastic.co/guide/en/elasticsearch/reference/current/certutil.html)
