---
date: 2023-08-21
article: true
star: false
sticky: false
category:
  - linux
tag:
  - linux
  - ubuntu
  - 虚拟机
---

# Vmware虚拟机Nat模式网络不通

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202401211617744.png)
<!-- more -->
---
我的主机是win10，主要拿来写代码，一些服务比如数据库什么的都是搭建在虚拟机里面，有一天打开的虚拟机的时候发现没法访问数据库了，尝试Ping了一下也不成功。

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202401211620640.png)

虚拟机用的是Ubuntu22.04版本，Nat模式出现这种情况可能就是网段不一致，在`cmd`上执行`ipconfig`命令看了看发现果然是这样

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202401211622174.png)

可以看到Vm8网卡的自动配置的IPV4地址网段与虚拟机并不一致，由于设置了自动配置，不知道什么时候改的，这里需要手动的设置一下。在win10界面打开控制面板查看网卡设置，选择Vm8虚拟网卡，接下来需要手动的配置IP地址。

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202401211624664.png)

将IP地址设置成与虚拟机同一个网段即可，DNS服务器选择国内通用的`114.114.114.114`，备用的DNS服务器是谷歌的`8.8.8.8`，完成后再来试一试。

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202401211626687.png)

并且虚拟机也可以ping通主机

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202401211629470.png)

于是问题就解决了。