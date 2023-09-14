---
date: 2023-09-14
article: true
star: false
sticky: false
category:
  - 技术日志
tag:
  - clash
  - ubuntu
  - proxy
---

# 在Linux上使用clash

![](https://github.com/Dreamacro/clash/raw/master/docs/logo.png)
<!-- more -->
---
最近在测试SteamAPI Client，不得不吐槽一下steam提供的web接口返回的响应结构真是**多种多样**，可以看的出来都是陈年老项目了。不过重点不是这个，虽然Steam的游戏服务在国内不需要梯子也可以访问，但是他们提供的接口如果不走代理的话，那基本上请求十次八次超时，为了解决这个问题只好在测试机上弄clash。

clash是用go编写的，一大好处就是安装非常方便，因为除了一个二进制文件其它什么都不需要，并且还是开源跨平台的。



## 安装

开源地址：[Dreamacro/clash: A rule-based tunnel in Go. (github.com)](https://github.com/Dreamacro/clash)

从release中找到最新版，然后找到对应的版本。

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202309141836378.png)

wget下载到本地
```sh
$ wget https://github.com/Dreamacro/clash/releases/download/v1.18.0/clash-linux-amd64-v1.18.0.gz
```

gzip解压

```sh
$ gzip -d clash-linux-amd64-v1.18.0.gz
```

为了方便使用将其链接到bin目录下

```sh
$ ln -s clash-linux-amd64-v1.18.0 /usr/local/bin/clash
```

完事后查看版本，输出没问题就是安装成功了

```sh
$ clash -v
Clash v1.18.0 linux amd64 with go1.21.0 Thu Aug 17 14:46:28 UTC 2023
```



## 代理

导入配置文件，clash的配置文件相当复杂，一般你的代理服务商都会提供现有的配置以供导入，比如我使用的glados

```sh
$ curl http_config_url > glados.yaml
```

 然后启动clash，指定配置文件和路径，`-d`指的是配置目录，clash在刚开始时会尝试下载country.db如果不存在的话。

```sh
$ clash -f  glados.yaml -d .
```

有如下输出即可

```
INFO[0000] Start initial compatible provider Auto-Failover 
INFO[0000] Start initial compatible provider Auto-Edge  
INFO[0000] Start initial compatible provider OPENAI-NOT-STABLE 
INFO[0000] Start initial compatible provider NETFLIX    
INFO[0000] Start initial compatible provider Video      
INFO[0000] Start initial compatible provider Auto-Fast  
INFO[0000] Start initial compatible provider Auto       
INFO[0000] Start initial compatible provider Proxy      
INFO[0000] Start initial compatible provider Express    
INFO[0000] inbound http://127.0.0.1:7890 create success. 
INFO[0000] inbound socks://127.0.0.1:7891 create success. 
INFO[0000] RESTful API listening at: 127.0.0.1:9090
```

可以看到http代理端口`7890`，由于socks不需要就不配置。

```sh
$ export http_proxy=http://127.0.0.1:7890
$ export https_proxy=https://127.0.0.1:7890
```

在配置生效前来看看请求steamapi是什么效果，可以看到失败了。

```sh
$ curl https://api.steampowered.com/ISteamWebAPIUtil/GetServerInfo/v1/
curl: (56) OpenSSL SSL_read: error:0A000126:SSL routines::unexpected eof while reading, errno 0
```

在开启clash后

```sh
$ curl https://api.steampowered.com/ISteamWebAPIUtil/GetServerInfo/v1/
{"servertime":1694693304,"servertimestring":"Thu Sep 14 05:08:24 2023"}
```

clash日志这里也有输出，是走了代理的

```
NFO[0036] [TCP] 127.0.0.1:32822 --> api.steampowered.com:443 match DomainSuffix(steampowered.com) using GLaDOS-D1-01
```

如果有需求的话，可以做成系统服务，进行更加方便的管理。
