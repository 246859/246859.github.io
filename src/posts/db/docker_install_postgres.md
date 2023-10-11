---
date: 2023-10-11
article: true
star: false
sticky: false
category:
  - 数据库
tag:
  - postgresql
  - SQL
  - 数据库
---

# Docker上安装PostgreSql

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202310111522417.png)
<!-- more -->
---

官网：[PostgreSQL: The world's most advanced open source database](https://www.postgresql.org/)

关系型数据库的话以前只学习过mysql一种，最近打算来捣鼓一下大名鼎鼎的postgresql，官网的标题就是**世界上最先进的关系型数据库**。为了方便学习，采用本地虚拟机+docker的方式进行安装。



### 镜像


首先在dockerhub看看镜像[postgres - Official Image | Docker Hub](https://hub.docker.com/_/postgres)

<img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202310111516192.png" alt="" style="zoom: 50%;" />

一看postgresql的维护版本这么多，不知道选什么就选最稳的`11`。

::: tip

16版本的话navicat还不太兼容

:::

```go
root@k8s-n1:/home/wyh/db/postgres# docker pull postgres:11-alpine
11-alpine: Pulling from library/postgres
96526aa774ef: Pull complete 
af5bdf29647f: Pull complete 
bd073dcbedbd: Pull complete 
edb6d1e27748: Pull complete 
aaa33f598b71: Pull complete 
04d1e72543e2: Pull complete 
b496b48df204: Pull complete 
8364467ecffa: Pull complete 
Digest: sha256:d07f0ca3a41267f5bc14c65f6aadaae5cadc2912e5f3203b9b6f524f28869aaf
Status: Downloaded newer image for postgres:11-alpine
docker.io/library/postgres:11-alpine
```

查看下镜像

```go
root@k8s-n1:/home/wyh/db/postgres# docker images
REPOSITORY   TAG         IMAGE ID       CREATED        SIZE
postgres     11-alpine   a05886c0c182   6 days ago     228MB
postgres     latest      2d74f8a2591c   3 weeks ago    417MB
redis        latest      e0ce02f88e58   2 months ago   130MB
mysql        latest      7c5ae0d3388c   2 months ago   577MB
mongo        latest      fb5fba25b25a   2 months ago   654MB
```



### 容器

运行如下命令创建容i去

```sh
docker run -p 5432:5432\
	-v /home/wyh/db/postgres/data:/var/lib/postgresql/data\
    -e POSTGRES_PASSWORD=123456\
    -e LANG=C.UTF-8\
    --restart=always\
    --name postg11\
    -d postgres:11-alpine
```

- `POSTGRES_PASSWORD`，环境变量，设置超级用户默认密码
- `LANG`，环境变量，设置字符集

跑起来看看看日志

```sh
root@k8s-n1:/home/wyh/db/postgres# docker logs postg16

PostgreSQL Database directory appears to contain a database; Skipping initialization

2023-10-11 08:00:26.738 UTC [1] LOG:  starting PostgreSQL 16.0 (Debian 16.0-1.pgdg120+1) on x86_64-pc-linux-gnu, compiled by gcc (Debian 12.2.0-14) 12.2.0, 64-bit
2023-10-11 08:00:26.738 UTC [1] LOG:  listening on IPv4 address "0.0.0.0", port 5432
2023-10-11 08:00:26.738 UTC [1] LOG:  listening on IPv6 address "::", port 5432
2023-10-11 08:00:26.741 UTC [1] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
2023-10-11 08:00:26.745 UTC [29] LOG:  database system was interrupted; last known up at 2023-10-11 07:59:14 UTC
2023-10-11 08:00:26.756 UTC [29] LOG:  database system was not properly shut down; automatic recovery in progress
2023-10-11 08:00:26.760 UTC [29] LOG:  redo starts at 0/152BEE8
2023-10-11 08:00:26.761 UTC [29] LOG:  invalid record length at 0/152BF20: expected at least 24, got 0
2023-10-11 08:00:26.761 UTC [29] LOG:  redo done at 0/152BEE8 system usage: CPU: user: 0.00 s, system: 0.00 s, elapsed: 0.00 s
2023-10-11 08:00:26.763 UTC [27] LOG:  checkpoint starting: end-of-recovery immediate wait
2023-10-11 08:00:26.767 UTC [27] LOG:  checkpoint complete: wrote 3 buffers (0.0%); 0 WAL file(s) added, 0 removed, 0 recycled; write=0.001 s, sync=0.001 s, total=0.005 s; sync files=2, longest=0.001 s, average=0.001 s; distance=0 kB, estimate=0 kB; lsn=0/152BF20, redo lsn=0/152BF20
2023-10-11 08:00:26.770 UTC [1] LOG:  database system is ready to accept connections
```

再看看ps

```sh
root@k8s-n1:/home/wyh/db/postgres# docker ps
CONTAINER ID   IMAGE             COMMAND                   CREATED          STATUS             PORTS                                                  NAMES
cab7fbfe1ba4   postgres:latest   "docker-entrypoint.s…"   54 seconds ago   Up 54 seconds      0.0.0.0:5432->5432/tcp, :::5432->5432/tcp              postg16
34482c8bb94a   redis             "docker-entrypoint.s…"   2 months ago     Up About an hour   0.0.0.0:6379->6379/tcp, :::6379->6379/tcp              redis7
f169975e256c   mysql             "docker-entrypoint.s…"   2 months ago     Up About an hour   0.0.0.0:3306->3306/tcp, :::3306->3306/tcp, 33060/tcp   mysql8
```



### 命令行

容器成功运行以后，到数据库命令行里面看看，默认的超级用户名为`postgres`。

```sh
docker exec -it postg16 pgql -U postgres -W
```

pg的命令行有独特的命令，不像`mysql`全是SQL语句，一般以下划线`\`开头，`\?`查看帮助命令。查看所有的数据库

```sh
postgres-# \l
                                                      List of databases
   Name    |  Owner   | Encoding | Locale Provider |  Collate   |   Ctype    | ICU Locale | ICU Rules |   Access privileges   
-----------+----------+----------+-----------------+------------+------------+------------+-----------+-----------------------
 postgres  | postgres | UTF8     | libc            | en_US.utf8 | en_US.utf8 |            |           | 
 template0 | postgres | UTF8     | libc            | en_US.utf8 | en_US.utf8 |            |           | =c/postgres          +
           |          |          |                 |            |            |            |           | postgres=CTc/postgres
 template1 | postgres | UTF8     | libc            | en_US.utf8 | en_US.utf8 |            |           | =c/postgres          +
           |          |          |                 |            |            |            |           | postgres=CTc/postgres
(3 rows)
```

查看所有用户

```sh
postgres-# \du
                             List of roles
 Role name |                         Attributes                         
-----------+------------------------------------------------------------
 postgres  | Superuser, Create role, Create DB, Replication, Bypass RLS
```

查看两个配置文件的地址

```go
postgres=# show config_file;
               config_file                
------------------------------------------
 /var/lib/postgresql/data/postgresql.conf
(1 row)

postgres=# show hba_file;
               hba_file               
--------------------------------------
 /var/lib/postgresql/data/pg_hba.conf
(1 row)
```

退出命令行

```sh
postgres-# \q
```



### 远程登录

pg默认是允许远程登录的，必须得修改其配置文件。修改`postgresql.conf`文件的中监听地址为如下。

```
listen_addresses = '*'
```

然后再修改`pg_hba.conf`，添加如下规则

```
# TYPE  DATABASE        USER            ADDRESS                 METHOD
host 	all				all 			0.0.0.0/0 				md5
```

修改完后把容器重启下

```sh
docker restart postg11
```

<img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202310111643870.png" style="zoom: 80%;" />


然后就可以连接成功了。
