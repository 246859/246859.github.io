---
date: 2022-01-17
article: true
star: false
sticky: false
category:
  - db
tag:
  - Redis
  - NoSQL
  - KV数据库
---

# Docker上安装Redis

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202310111832973.png)
<!-- more -->
---

官网：[Redis](https://redis.io/)

Redis是我接触的第一个NoSQL数据库，一般是拿来做缓存用，不支持windows。刚开始用的windows版，一看版本redis2，几年没维护了，后面只能在虚拟机上捣鼓了，算是我接触虚拟机和Linux系统的一个契机。



### 镜像

镜像地址：[redis - Official Image | Docker Hub](https://hub.docker.com/_/redis)

redis现在的维护版本有6和7，两个的区别就是RESP协议的区别，一个是RESP2，一个是RESP3，理论上来说RESP3应该是兼容RESP2的，不过Redis社区声称以后不会兼容RESP2。这里用的是版本7。

```sh
root@k8s-n1:~/db# docker pull redis:7.0
7.0: Pulling from library/redis
a803e7c4b030: Pull complete 
41184dfc6b2d: Pull complete 
5e1a2c60601a: Pull complete 
cb708665a094: Pull complete 
474f3ac19790: Pull complete 
4f4fb700ef54: Pull complete 
9e2123517e06: Pull complete 
Digest: sha256:7d11c3a67e89510af2b8554e0564f99e292a47f270adac024b4a3226a7fdb275
Status: Downloaded newer image for redis:7.0
docker.io/library/redis:7.0
```

查看下镜像

```sh
root@k8s-n1:~/db# docker images
REPOSITORY   TAG         IMAGE ID       CREATED        SIZE
redis        7.0         4d015f1fd3b1   4 weeks ago    145MB
```



### 配置

配置文件地址：https://redis.io/docs/management/config/

redis默认是不允许远程连接，而且没有密码，这些需要在配置文件中指定，对应指定版本的redis需要去官网下载配置文件。

<img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202310112029549.png" style="zoom: 67%;" />

这里选择的是7.0版本的配置文件，首先创建容器的数据挂载文件夹

```sh
mkdir -p ~/db/redis/data
```

然后下载配置文件，因为是外网可能不太好下载

```sh
wget https://raw.githubusercontent.com/redis/redis/7.0/redis.conf
```

然后将里面的如下四个配置修改如下值，然后保存退出。

```
# 任意地址
bind * -::*
# 关闭保护模式
protect-mode no
# 设置密码
requirepass 123456
# 开启appendonly持久化
appendonly yes
# 日志文件
logfile "/etc/redis/redis.log"
# 日志级别
loglevel notice
# 内存达到上限时，key的删除策略 noeviction就是谁也不删，直接在写入时返回错误
maxmemory-policy noeviction
```

配置文件的路径位于`~/db/redis/redis.conf`，然后还要记得把日志文件自己创建下。

```sh
touch ~/db/redis/redis.log
chamod a+wr ~/db/redis/redis.log
```



### 容器

运行如下命令

```sh
$ docker run -p 6379:6379 --name=redis7 \
    --restart=always \
    --privileged=true \
    -v ~/db/redis/data:/data \
    -v ~/db/redis/:/etc/redis/ \
    -d redis:7.0 \
    redis-server /etc/redis/redis.conf
```

创建后查看下有没有正常运行

```sh
root@k8s-n1:~/db/redis/conf# docker ps
CONTAINER ID   IMAGE                COMMAND                   CREATED         STATUS         PORTS                                                  NAMES
6322049a489b   redis:7.0            "docker-entrypoint.s…"   5 minutes ago   Up 5 seconds   0.0.0.0:6379->6379/tcp, :::6379->6379/tcp              redis7
```

进入容器测试下命令行

```sh
root@k8s-n1:~/db/redis# docker exec -it redis7 /bin/bash
root@6322049a489b:/data# redis-cli   
127.0.0.1:6379> auth 123456
OK
127.0.0.1:6379> set 1 2
OK
127.0.0.1:6379> get 1
"2"
127.0.0.1:6379> 
```



### 连接

redis客户端软件的话推荐两个，虽然navicat也支持redis连接，但还是那种行列方式看起来相当膈应。

- [Redis Manager](https://github.com/RedisInsight/RedisDesktopManager)，开源，c++项目，性能应该要好很多
- [Another Redis Manager](https://github.com/qishibo/AnotherRedisDesktopManager)，开源，nodejs项目，目测应该是electron之类构建的，性能没测试过。

上面两个都是开源的，且都支持中文，我都有在用，前者毕竟c++写的项目，nodejs性能跟它没法比，但后者界面更加人性化，功能要多很多。

<img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202310112123845.png" style="zoom: 67%;" />

如果前面的配置正常来搞的话这里连接是不会出问题的。

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202310112125867.png)

可以看到关于redis的很多统计信息。
