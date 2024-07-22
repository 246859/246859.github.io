---
date: 2023-06-29
article: true
star: false
sticky: false
category:
  - docker
tag:
  - docker
  - mysql


---

# docker安装mysql和redis

![](https://w.wallhaven.cc/full/ex/wallhaven-ex9gwo.png)
<!-- more -->
---

#### Mysql

首先拉取mysql的镜像，要确保major版本是8，例如8.0.33

```sh
$ docker pull mysql
```

这里要创建mysql的挂载文件夹，以防数据丢失，这里放在`/root/mysql`路径下为例子

```
$ mkdir -p ~/mysql/conf/ ~/mysql/data/ ~/mysql/log
```

随后在`/root/mysql/confg/`目录下创建`my.cnf`文件，内容如下

```ini
[client]
default_character_set=utf8mb4
[mysqld]
# 字符集
character_set_server = utf8mb4
collation-server = utf8mb4_general_ci
init_connect='SET NAMES utf8mb4'
# 错误日志
log_error = error.log
# 慢查询日志
slow_query_log = 1
slow_query_log_file = slow.log
```

然后运行如下命令启动容器即可，下面分别创建了mysql日志，mysql数据库，mysql配置的挂载数据卷，这里的`MYSQL_ROOT_PASSWORD=123456`就是数据库的root密码，可以自己改成其他的，环境变量`MYSQL_DATABASE=dst`会自动创建一个名为dst的数据库，按需修改。

```sh
$ docker run -p 3306:3306/tcp --name mysql8 \
--restart=always \
--privileged=true \
-v /root/mysql/conf/:/etc/mysql/conf.d \
-v /root/mysql/data/:/var/lib/mysql \
-v /root/mysql/log/:/var/log/mysql \
-e MYSQL_ROOT_PASSWORD=123456 \
-e MYSQL_DATABASE=dst \
-d mysql
```

创建完成后登录mysql看看成功没有

```sh
root@dtstest:~/mysql/conf# docker exec -it mysql8 mysql -u root -p
Enter password: 
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 12
Server version: 8.0.33 MySQL Community Server - GPL

Copyright (c) 2000, 2023, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| dst                |
| information_schema |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
5 rows in set (0.01 sec)

mysql> 
```

看到有dst数据库就说明mysql成功安装.

到此安装成功，然后记录下数据库的密码，后面后端会用到。

#### Redis

首先拉取redis镜像，保证redis版本在6以上

```sh
$ docker pull redis
```

创建redis的挂载目录

```
$ mkdir -p ~/redis/data
```

进入`~/redis/`目录，创建配置文件`redis.conf`，内容如下，密码自己定。

```
requirepass 123456
appendonly yes
```

然后运行容器

```sh
$ docker run -p 6379:6379/tcp --name=redis7 \
--restart=always --privileged=true \
-v /root/redis/data:/data \
-v /root/redis/redis.conf:/etc/redis/redis.conf \
-d redis \
redis-server /etc/redis/redis.conf
```

redis默认不允许远程访问，所以需要额外配置，修改配置文件如下

```
requirepass 123456
appendonly yes
protected-mode no
```

redis各版本配置文件：[Redis configuration | Redis](https://redis.io/docs/management/config/)