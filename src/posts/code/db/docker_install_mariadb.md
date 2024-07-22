---
date: 2023-10-06
article: true
star: false
sticky: false
category:
  - db
tag:
  - MairaDB
  - SQL
  - 关系数据库
---

# Docker上安装MariaDB

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202310111859077.png)
<!-- more -->
---

官网：[MariaDB](https://mariadb.org/)

开源地址：https://github.com/MariaDB/server

在Mysql被Oracle收购以后，MySql之父觉得此时的Mysql不再是一个纯粹的开源数据库了。于是没多久便出走了，随后他便从Mysql社区fork出来一个新的分支：MariaDB，到目前为止已经是一的独立的项目了。该数据库以作者女儿的名字来命名的，相比于Mysql而言它是一个完全开源的数据库，在协议和表定义方面也兼容，相比于mysql社区版支持更多的存储引擎和功能。



### 镜像

镜像地址：[mariadb - Official Image | Docker Hub](https://hub.docker.com/_/mariadb)

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202310121029029.png)

目前的维护版本有11和10，因为是开源社区维护的，所以版本迭代要比mysql快很多，这里选择相对稳定的10

```sh
root@k8s-n1:~# docker pull mariadb:10
10: Pulling from library/mariadb
707e32e9fc56: Already exists 
4e342cc0fc32: Pull complete 
8c036f60ad2b: Pull complete 
bb0246c52237: Pull complete 
3352be57b4c5: Pull complete 
c9fc61d5a68c: Pull complete 
4c23450a7a9d: Pull complete 
3a747ebfb0b2: Pull complete 
Digest: sha256:16b181cf0cbca0bc8e5f8ef3695a82c7bd9ba36cc4fc587f4b357c558faeeccd
Status: Downloaded newer image for mariadb:10
docker.io/library/mariadb:10
root@k8s-n1:~# docker images
REPOSITORY   TAG         IMAGE ID       CREATED        SIZE
mariadb      10          32c5888d2fa9   8 days ago     403MB
```



### 准备

准备好要挂载数据的文件夹

```sh
mkdir -p ~/db/mariadb/{data,log,conf}
```

maridadb在这些方面都与mysql兼容，所以基本类似，创建配置文件`~/db/mariadb/conf/my.cnf`

```ini
[client]
default_character_set=utf8mb4

[mysqld]
# 字符集
character_set_server = utf8mb4
collation-server = utf8mb4_general_ci
# 设置默认时区东八区
default-time_zone = '+8:00'
# 错误日志
log-error=/etc/mysql/log/error.log
```



### 容器

运行如下命令创建容器，mariadb使用的配置目录跟mysql完全一致

```sh
$ docker run -p 3307:3306 --name maria10 \
    --restart=always \
    -v ~/db/mariadb/conf/:/etc/mysql/conf.d \
    -v ~/db/mariadb/data/:/var/lib/mysql \
    -v ~/db/mariadb/log/:/etc/mysql/log \
    -e MYSQL_ROOT_PASSWORD=123456 \
    -e MYSQL_DATABASE=hello \
    -d mariadb:10
```

创建起容器后看看是否正常运行

```sh
root@k8s-n1:~# docker ps
CONTAINER ID   IMAGE                COMMAND                   CREATED         STATUS         PORTS                                                  NAMES
e4156637905e   mariadb:10           "docker-entrypoint.s…"   2 seconds ago   Up 1 second    0.0.0.0:3307->3306/tcp, :::3307->3306/tcp              maria10
```

进入容器里面看看数据库命令行，这里使用`mysql`命令也可以登录。

```sh
root@k8s-n1:~# docker exec -it maria10 /bin/bash
root@e4156637905e:/# mariadb -u root -p
Enter password: 
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MariaDB connection id is 3
Server version: 10.11.5-MariaDB-1:10.11.5+maria~ubu2204 mariadb.org binary distribution

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

MariaDB [(none)]> 
```

看看数据库，可以看到默认的hello数据库成功创建

```sh
MariaDB [(none)]> show databases;
+--------------------+
| Database           |
+--------------------+
| hello              |
| information_schema |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
5 rows in set (0.001 sec)
```



### 连接

我用的navicat15，已经支持mariadb，正常来说它的协议应该跟mysql完全兼容。

<img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202310121055491.png" style="zoom: 80%;" />

就目前而言感受不到太大的区别，以后用的深了一点再来评价吧。
