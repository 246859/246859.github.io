---
date: 2022-11-07
article: true
star: false
sticky: false
category:
  - 数据库
tag:
  - Mysql
  - SQL
  - 关系数据库
---

# Docker上安装Mysql

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202310111830040.png)
<!-- more -->
---

官网：[MySQL :: MySQL Documentation](https://dev.mysql.com/doc/)

mysql是很经典的一个数据库了，刚接触到这个数据库的时候还是刚刚大一下那会，那会在windows上安装把密码给整忘了捣鼓了老半天才整回来。日后在学习的时候，捣鼓中间件都是在本地的Linux虚拟机上+docker捣鼓，再也不会把这些玩意安装在windows上了。



### 镜像

镜像地址：[mysql - Official Image | Docker Hub](https://hub.docker.com/_/mysql)

Mysql常用的版本只有8和5，最常用的应该是5.7，不过我在写代码的时候用的都是mysql8。

```sh
root@k8s-n1:~# docker pull mysql:8.0
8.0: Pulling from library/mysql
5262579e8e45: Pull complete 
c6f87bacd0dd: Pull complete 
581ee7db3e65: Pull complete 
6d5c555a4100: Pull complete 
51f4afa7a279: Pull complete 
d9e414f0b7c6: Pull complete 
aab3a444c469: Pull complete 
aab51168fe3a: Pull complete 
2a63757e7c9c: Pull complete 
830e4b0cc0bc: Pull complete 
cc0cd1f61ed7: Pull complete 
Digest: sha256:4753043f21f0297253b35a5809a0ec3f12597e8dbeeb709647307edc943ea7b1
Status: Downloaded newer image for mysql:8.0
docker.io/library/mysql:8.0
```

查看下镜像

```sh
root@k8s-n1:~# docker images
REPOSITORY   TAG         IMAGE ID       CREATED        SIZE
mysql        8.0         82ebbd05b8a9   2 months ago   577MB
```



### 准备

创建本地用于挂载数据的文件夹

```sh
mkdir -p ~/db/mysql/{data,conf,log}
```

创建mysql配置文件`~/db/mysql/conf/my.cnf`

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

运行如下命令，创建容器

```sh
$ docker run -p 3306:3306 --name mysql8 \
    --restart=always \
    -v ~/db/mysql/conf/:/etc/mysql/conf.d \
    -v ~/db/mysql/data/:/var/lib/mysql \
    -v ~/db/mysql/log/:/etc/mysql/log \
    -e MYSQL_ROOT_PASSWORD=123456 \
    -e MYSQL_DATABASE=hello \
    -d mysql:8.0
```

- `MYSQL_ROOT_PASSWORD`，root用户的默认密码，不指定的话会在输出中显示默认密码
- `MYSQL_DATABASE`，默认创建的数据库名

看看mysql容器有没有成功运行。

```sh
root@k8s-n1:~/db# docker ps
CONTAINER ID   IMAGE                COMMAND                   CREATED          STATUS          PORTS                                                  NAMES
062dc35ac579   mysql:8.0            "docker-entrypoint.s…"   22 seconds ago   Up 21 seconds   0.0.0.0:3306->3306/tcp, :::3306->3306/tcp, 33060/tcp   mysql8
```

使用mysql命令访问数据库

```sh
root@k8s-n1:~/db# docker exec -it mysql8 /bin/bash
bash-4.4# mysql -u root -p
Enter password: 
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 8
Server version: 8.0.34 MySQL Community Server - GPL

Copyright (c) 2000, 2023, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> 
```

查看有哪些数据库，可以看到hello数据库被成功创建了

```sh
mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| hello              |
| information_schema |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
5 rows in set (0.01 sec)
```

查看hello数据库中的表，可以看到空空如也

```sh
mysql> use hello;
Database changed
mysql> show tables;
Empty set (0.00 sec)
```



### 连接

切换到`mysql`数据库，然后查看`user`表

```sh
mysql> use mysql
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed
mysql> select user, host from user;
+------------------+-----------+
| user             | host      |
+------------------+-----------+
| root             | %         |
| mysql.infoschema | localhost |
| mysql.session    | localhost |
| mysql.sys        | localhost |
| root             | localhost |
+------------------+-----------+
5 rows in set (0.00 sec)
```

可以看到root账户默认是允许远程登录的，一般建议创建一个新的账号来用，然后再禁用root远程登录，如果只是自己学习的话那无所谓了，修改完以后记得刷新下。

```sh
mysql> flush privileges;
```

然后再用navicat连接

<img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202310111949722.png" style="zoom:50%;" />
