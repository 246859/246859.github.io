---
date: 2023-04-09
article: true
star: false
sticky: false
category:
  - 技术日志
tag:
  - DST
  - Linux
---

# 在Linux搭建DST专用服务器

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202304091448764.png)

本文主要讲解了如何在Linux环境下搭建Dont Starve Together的专用服务器，以及一些坑。
<!-- more -->
---

## 环境准备

在开始之前需要准备以下东西：

- 一台装了Linux系统的云服务器，本文使用的是Ubuntu20LTS。
- SSH客户端，本文使用的XShell
- SFTP客户端，本文使用的是FillZilla

云服务器安全组要放行10800到12000范围端口，饥荒服务端差不多都在这个范围内，协议使用UDP。

## 创建用户

与服务器进行ssh连接过后，创建一个专门用于DST管理的用户，这样与系统隔离，方便后续管理。

```sh
$ adduser dst
```

然后进入dst的ssh目录

```sh
$ cd ~/.ssh
```

生成ssh密钥对，将公钥注册到服务器中

```sh
$ ssh-keygen
$ cat id_rsa.pub > authorized_keys
```

把私钥保存下来这样后续就可以使用ssh私钥进行登录。

## 依赖准备

首先首先要给软件管理工具加一个i386的架构，有warning忽略掉，然后看看加进去没有

```sh
$ add-apt-repository multiverse
$ dpkg --add-architecture i386
$ dpkg --print-foreign-architectures
i386
```

 然后再下载所需要的32位依赖

```sh
$ apt-get update
$ apt install lib32gcc1 lib32z1 lib32stdc++6
$ apt instal libcurl3-gnutls:i386 # curl工具一定要安装32位的
$ apt install libcurl4-gnutls-dev:i386 # 上面那个不行就安装这一个
```

上述依赖是必须安装的，否则在运行可执行文件时会报错无法找到文件。

## 安装SteamCMD

::: tip
如何在Linux上安装SteamCMD官方有非常详细的中文教程，[Steam 控制台客户端 - Valve Developer Community (valvesoftware.com)](https://developer.valvesoftware.com/wiki/SteamCMD:zh-cn)
:::

先切换到dst用户

```sh
$ su - dst
$ sudo mkdir steam
$ sudo mkdir server
```

然后下载SteamCMD压缩包

```sh
$ sudo wget https://steamcdn-a.akamaihd.net/client/installer/steamcmd_linux.tar.gz
```

将其解压到steam目录

```sh
$ sudo tar -xvzf steamcmd_linux.tar.gz -C ~/steam
```

然后进入steam目录执行steamcmd.sh脚本启动进行安装

```sh
$ cd steam
$ ./steamcmd.sh
```

或者也可以直接下载软件包，然后再启动steamcmd

```sh
$ apt-get install steamcmd
$ steamcmd
```

等待安装完成后在steamcmd里面执行如下命令来设置安装目录

```sh
$ force_install_dir /home/dst/server
```

::: tip

需要注意的是设置安装目录必须在登录之前操作，登陆后不能再修改该项

:::

然后再登录steam，一般使用匿名登录。

```sh
$ login anonymous
```

等待登录完成后下载饥荒服务端，343050是它的appid，这里大概要等个几分钟，下载完毕后先退出。

```sh
$ app_update 343050 validate
$ quit
```

进入到server目录下看看是不是安装到指定目录了，如下就说明安装成功了

```sh
$ cd ~/server/bin
$ ls
dontstarve  dontstarve_dedicated_server_nullrenderer  dontstarve.xpm  lib32  scripts  steam_appid.txt
```

## 开服

前往克雷官网，登录并注册申请服务器token

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202304092018313.png)

点击添加新的服务器

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202304092018095.png)

完成后点击下载设置，使用sftp将该文件夹传入`/home/dst/.klei/DoNotStarveTogether`目录下，这是默认的存档位置，没有这个文件夹就自行创建该文件夹。

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202304092020790.png)

然后需要下载一个多终端管理工具screen

```sh
$ sudo apt install screen
```

然后在`/home/dst`目录下创建`master.sh`和`caves.sh`，内容如下

```sh
#!/bin/bash
cd /home/dst/server/bin/
screen -R master /home/dst/server/bin/dontstarve_dedicated_server_nullrenderer -console -cluster MyDediServer -shard Master
```

```
#!/bin/bash
cd /home/dst/server/bin/
screen -R caves /home/dst/server/bin/dontstarve_dedicated_server_nullrenderer -console -cluster MyDediServer -shard Caves
```

最后运行脚本即可，如下

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202304092026834.png)

当两个maser终端和caves终端都输出sim paused时，说明开服成功，进入游戏在搜索你设置的服务器名称

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202304092028986.png)

能够搜索到并成功进入服务器，说明服务器搭建完毕。

