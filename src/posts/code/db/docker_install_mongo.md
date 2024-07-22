---
date: 2023-07-24
article: true
star: false
sticky: false
category:
  - db
tag:
  - Redis
  - NoSQL
  - 文档数据库
---

# Docker上安装MongoDB

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202310111838486.png)
<!-- more -->
---

官网：[MongoDB](https://www.mongodb.com/zh-cn)

mongodb是一个高性能的非关系型数据库，或者说文档数据库因为它的基本单位就是文档，在我的一个开源项目中主要拿它来存游戏信息，比较灵活，存在mysql纯纯是找罪受。mongodb说实话第一次看到的时候，SQL写起来真的反人类，弄成了json的样子，如果语句长了点嵌套多了点，可读性骤然下降。

```
db.articles.aggregate( [
                        { $match : { score : { $gt : 70, $lte : 90 } } },
                        { $group: { _id: null, count: { $sum: 1 } } }
                       ] );
```

尤其是花括号看的真的眼花，这玩意在命令行里面敲起来是真滴折磨。



### 镜像

镜像地址：[mongo - Official Image | Docker Hub](https://hub.docker.com/_/mongo)

这里我就直接用mongo6

```sh
$ docker pull mongo:6.0
6.0: Pulling from library/mongo
707e32e9fc56: Pull complete 
c7ac84d07e95: Pull complete 
ce678af55db4: Pull complete 
e6212b74a0e2: Pull complete 
08077ff6df71: Pull complete 
dd57de346688: Pull complete 
fe042c164d9d: Pull complete 
a5e746310c93: Pull complete 
497b5f19e5e9: Pull complete 
Digest: sha256:fcd6d98809196eef559acb15bd2cdd0c17290c9d398e2b3fc1303a7166399f3b
Status: Downloaded newer image for mongo:6.0
docker.io/library/mongo:6.0
```

镜像拉下来以后看看

```
root@k8s-n1:~# docker images
REPOSITORY   TAG         IMAGE ID       CREATED        SIZE
mongo        6.0         427729062675   8 days ago     681MB
```

681MB说实话挺大了





### 配置

创建要挂载的数据目录

```sh
mkdir -p ~/db/mongo/data
```

创建默认的配置文件

```sh
touch ~/db/mongo/mongod.conf
```

写入如下配置

```yaml
net:
   bindIp: 0.0.0.0
   port: 27017
systemLog:
   destination: file
   path: "/etc/mongo/mongod.log"
   logAppend: true
```

创建默认的日志文件

```sh
touch ~/db/mongo/mongod.log
```





### 容器

运行如下命令创建容器

```sh
$ docker run --restart=always --name mongo6 \
	-v ~/db/mongo/mongod.conf:/etc/mongo/mongod.conf \
	-v ~/db/mongo/mongod.log:/etc/mongo/mongod.log \
	-v ~/db/mongo/data/:/data/db \
	-p 27017:27017 \
	-e LANG=C.UTF-8 \
	-d mongo:6.0 \
	mongod -f /etc/mongo/mongod.conf
```

其中的参数

- 环境变量`LANG`是为了设置数据库字符编码
- `-f /etc/mongo/mongod.conf`指定具体的配置文件地址

 容器创建完毕后，查看一下是否正常运行。

```sh
root@k8s-n1:~/db/mongo# docker ps
CONTAINER ID   IMAGE                COMMAND                   CREATED             STATUS              PORTS                                                  NAMES
b246162e5a3f   mongo:6.0            "docker-entrypoint.s…"   4 minutes ago       Up About a minute   0.0.0.0:27017->27017/tcp, :::27017->27017/tcp          mongo6
```

然后进入数据库命令行操作

```sh
root@k8s-n1:~/db/mongo# docker exec -it mongo6 /bin/bash
root@b246162e5a3f:~# mongosh
Current Mongosh Log ID: 6526b2e373d21e9bc1a719e2
Connecting to:          mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.0.1
Using MongoDB:          6.0.10
Using Mongosh:          2.0.1

For mongosh info see: https://docs.mongodb.com/mongodb-shell/


To help improve our products, anonymous usage data is collected and sent to MongoDB periodically (https://www.mongodb.com/legal/privacy-policy).
You can opt-out by running the disableTelemetry() command.

------
   The server generated these startup warnings when booting
   2023-10-11T14:31:28.184+00:00: Using the XFS filesystem is strongly recommended with the WiredTiger storage engine. See http://dochub.mongodb.org/core/prodnotes-filesystem
   2023-10-11T14:31:28.351+00:00: Access control is not enabled for the database. Read and write access to data and configuration is unrestricted
   2023-10-11T14:31:28.351+00:00: vm.max_map_count is too low
------

test> 
```

由于初始时是没有默认的用户和密码，所以进来就是test用户，接下来创建一个管理员账号，先写sql

```json
db.createUser({
	user:"admin",
	pwd:"123456",
	roles:[
		{
			role:"userAdminAnyDatabase",
			db:"admin"
		}
	]
})
```

主要有以下权限可以用

```
Read：允许用户读取指定数据库

readWrite：允许用户读写指定数据库

dbAdmin：允许用户在指定数据库中执行管理函数，如索引创建、删除，查看统计或访问system.profile

userAdmin：允许用户向system.users集合写入，可以找指定数据库里创建、删除和管理用户

clusterAdmin：只在admin数据库中可用，赋予用户所有分片和复制集相关函数的管理权限。

readAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的读权限

readWriteAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的读写权限

userAdminAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的userAdmin权限

dbAdminAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的dbAdmin权限。

root：只在admin数据库中可用。超级账号，超级权限
```

切换倒admin数据库后再创建

```sh
admin> use admin
admin> db.createUser({
...     user:"admin",
...     pwd:"123456",
...     roles:[
...             {
...                     role:"userAdminAnyDatabase",
...                     db:"admin"
...             }
...     ]
... })
{ ok: 1 }
admin> db.auth('admin','123456')
{ ok: 1 }
```

查看用户列表

```sh
admin> db.system.users.find()
[
  {
    _id: 'admin.admin',
    userId: new UUID("ce1b5964-baf0-440e-80af-3223b816a2bf"),
    user: 'admin',
    db: 'admin',
    credentials: {
      'SCRAM-SHA-1': {
        iterationCount: 10000,
        salt: '5nwa5T/qWrzRGDUWHFkeEg==',
        storedKey: 'X47HeMtquXIoEii9gjlUwYK/mMY=',
        serverKey: 'O8WilvO70SfzvEszOhByYwjkO60='
      },
      'SCRAM-SHA-256': {
        iterationCount: 15000,
        salt: 'O1lbsKr1LOIAcnjbXLZovtzBbFY0rIg1myaGEg==',
        storedKey: 'F5rTnCPW6/Qar6bOyIIS5E4QBMRLVQhGsiFjlv3StDM=',
        serverKey: 'l0Dk06m3laPqxjcybH9nXtDGtqInnfIEdr/eTB+rYFw='
      }
    },
    roles: [ { role: 'userAdminAnyDatabase', db: 'admin' } ]
  }
]
```

完成后，退出然后修改mongo的配置文件添加

```yaml
security:
    authorization: enabled
```

重启容器之后再重新登录

```sh
root@k8s-n1:~/db/mongo# docker exec -it mongo6 mongosh -u admin -p
Enter password: ******
Current Mongosh Log ID: 6526bbacf7edfe2170bd2249
Connecting to:          mongodb://<credentials>@127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.0.1
Using MongoDB:          6.0.10
Using Mongosh:          2.0.1

For mongosh info see: https://docs.mongodb.com/mongodb-shell/

test> 
```



### 连接

navicat也支持mongodb数据库，如果上面操作正确的话，连接应该是不会有问题的。

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202310112316660.png)
