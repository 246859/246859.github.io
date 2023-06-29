---
date: 2023-06-29
article: true
star: false
sticky: false
category:
  - 问题记录
tag:
  - docker
  - 内存异常

---

# docker内存显示异常的bug



源于项目开发过程中的一个发现

<!-- more -->
---
此前接了一个开发饥荒虚拟容器管理平台的项目，其中有一个功能就是实时显示容器的内存使用状况，后来奇怪的发现容器的内存趋势图在容器创建后的5分钟内达到了几乎100%

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202306292022189.png)

初次遇到这个问题，百思不得其解，以为是自己程序的编写错误，后来在容器中`top`了一下发现真实占用可能就40%左右。后面去翻阅了docker cli计算内存占用的源代码，[Docker Cli 计算内存源代码地址](https://github.com/moby/moby/blob/eb131c5383db8cac633919f82abad86c99bffbe5/cli/command/container/stats_helpers.go#LL110C62-L110C62)，逻辑基本上是一致，那么只剩一种可能，这的确就是docker的bug。

在经过测试后，这个bug诱发的原因是饥荒容器在创建时会下载一个接近4个g的游戏服务端，在此过程中会消耗一定的资源，内存占用会逐渐攀升，但是等到下载完毕后增长的趋势依旧不停，从而造成了内存虚高。

为此编写了一个测试，这在github的issue里有更详细的介绍，[issue address](https://github.com/moby/moby/issues/45727)