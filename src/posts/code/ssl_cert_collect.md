---
date: 2024-04-12
article: true
star: false
sticky: false
category:
  - 技术日志
tag:
  - SSL
  - 
  - 
---

# 免费SSL证书申请

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202404121531323.jpg)
<!-- more -->
---
如果想要让你的网站在公网中正常访问，SSL绝对是不可或缺的部分，没有SSL的话浏览器甚至会直接警告不要访问，搜索引擎的权重也会降低。对于个人开发者而言，如果只是部署一些文档或测试网站，购买昂贵的SSL证书并不是一个好的选择，所以这里收集了一系列SSL证书免费申请的网站，以供白嫖参考，下面是内容都是从免费证书的角度出发的，不具备商业参考性。



## 1.Let's Encrypt

这是一家很老牌的免费SSL证书颁发机构，他们的宗旨就是促进互联网向HTTPS发展。

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202404121558230.png)

官网：[Let's Encrypt - 免费的SSL/TLS证书 (letsencrypt.org)](https://letsencrypt.org/zh-cn/)

优点：完全免费，公益的组织，申请数量没有限制

缺点：证书只有3个月有效期（可通过脚本自动化续签），使用门槛较高，教程中英混杂，不适合普通小白用户。

适用人群：对于开源组织，个人开发者有一定技术力的人群来说来说，Let's Encrypt绝对是首选。



## 2.腾讯云

腾讯云是国内的一家云服务大厂，提供很多各种各样的云服务，其中包括SSL证书。

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202404121559166.png)

官网：[概览 - SSL 证书 - 腾讯云 (tencent.com)](https://console.cloud.tencent.com/certoverview)

优点：免费证书有效期12个月（24年4月25日后降至3个月），文档丰富，可视化界面管理，无域名额度限制，可绑定任意域名，集成站内应用比较方便。

缺点：对于免费证书而言，个人用户限制50个（企业用户10个），且不支持自动续签

适用人群：国内用户，小白



## 3.阿里云

阿里云同样提供免费的SSL证书，相比腾讯云就一般般了

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202404121616141.png)

缺点：个人用户免费证书只有20个，不支持根证书下载，证书有效期3个月，国内其它的云厂商大都类似



## 4.OHTTPS

OHTTPS 致力于为用户提供 零门槛、简单、高效 的HTTPS证书服务，它基于Let‘s Eencrypt，我的评价是神中神。

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202404121635289.png)

优点：可视化界面，自动化管理，并且是完全支持免费证书（单域名，多域名，泛域名），对于个人开发者来说算没有缺点了，唯一能算的就是证书有效期只有3个月，但是它支持自动更新，所以也就不是问题，并且还支持对接国内的云服务商。

缺点：唯一的缺点就是需要付费，不过新用户自动赠送的余额可以用好几年了

适用人群：所有人，只要想使用免费证书，OHTTPS就完全适合你。