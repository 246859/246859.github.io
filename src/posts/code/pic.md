---
date: 2023-03-24
article: true
star: false
sticky: false
category:
  - 技术日志
tag:
  - 图床
  - Gitee
  - 对象存储
---
# Typora配合图床搭建教程
![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/wallhaven-953v9d.png)

Typora配合搭建完毕后的图床，可以有效的解决的md文件的图片引用问题。

<!-- more -->
---
Typroa是一款很流行的Markdown编辑器，但是苦图片引用问题久矣，本地编写好的md文件发送给别人后，就好经常出现图片丢失问题，这种情况下只有两个方法：

- 把图片一起打包
- 引用在线图片

一起打包显然会使得文件变得非常臃肿，在线图片也并不好找，同样的上述情况也适用于各个Markdown静态文档生成框架，举例VuePress，每个框架对于静态图片的引用都有着不同的规则，假设日后更换其他的框架图片引用问题将会非常的令人头疼。所以对于个人开发者而言，非常有必要搭建个人图床。

<br>

## PicGo

**一个用于快速上传图片并获取图片 URL 链接的工具**，支持许多云服务商的对象存储，例如阿里云，腾讯云，七牛云等等，同时也支持Gitee，Github，软件技术基于Vue+Electron。

PicGo下载：[Molunerfinn/PicGo: A simple & beautiful tool for pictures uploading built by vue-cli-electron-builder (github.com)](https://github.com/Molunerfinn/PicGo#下载安装)

![image-20230324201548045](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/image-20230324201548045.png)



下载完成后，打开是下面这个样子。

![image-20230324201612971](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/image-20230324201612971.png)



这个是最简陋的版本，一个个手动上传肯定是很累的，这里打开Typora的设置（如果是其他Markdown编辑器应该也是同理）

![image-20230324201808929](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/image-20230324201808929.png)



但此时PicGo还未配置成功，点击验证图片上床肯定是会失败的，接下来有两个选择。



## GItee

这里之所以使用Gitee而不使用Github，主要是Github国内的访问速度太感人了，想要达到正常速度必须自行搭建CDN，所以这里利用一下免费的GItee。不过Gitee前不久已经加了防盗链，如果是在网站上引用图床肯定是会失效的，但如果只是在本地Markdown文件引用依旧可以成功。

### 创建仓库

首先需要创建一个**公开**的仓库，不公开访问不了，名称建议英文，最好不要带特殊符号。

![image-20230324202452126](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/image-20230324202452126.png)



### 私人令牌

接下来要获取私人令牌

![image-20230324202548316](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/image-20230324202548316.png)



在个人设置中创建一个私人令牌。

![image-20230324202639749](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/image-20230324202639749.png)

描述随意，建议只放开这几个权限，生成后记住你的私人令牌。

### 下载插件

打开PciGo软件，点开插件设置，搜索Gitee，下载gitee-Uploader。



![image-20230324202915702](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/image-20230324202915702.png)



等待安装完毕后，在图床设置中填写gitee的配置项

![image-20230324203304435](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/image-20230324203304435.png)



完成后点击确认，并设置为默认图床，然后到上传区测试结果即可

![image-20230324205101674](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202303242051716.png)



<br>

## 腾讯云Cos

作者恰好前不久买了腾讯云对象存储的资源包，就刚好拿来当图床用，其他云服务商的配置过程都是类似的。首先在对象存储控制台中访问密钥

### 申请密钥

![image-20230324203515364](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/image-20230324203515364.png)



然后前往密钥界面

![image-20230324203613705](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/image-20230324203613705.png)



记住`APPID`，`SecretId`，`SecretKey`

### 创建桶

![image-20230324204211170](https://gitee.com/FLoat1024/pic/raw/master/img/image-20230324204211170.png)



在创建存储桶时必须要保证桶的权限是公共读私有写，也就是可以匿名访问，记住`BucketId`和区域后就可以前往PicoGo中填写配置。

### 填写配置

![image-20230324203822706](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/image-20230324203822706.png)



填写完配置项后确认并设置为默认图床，然后在上传区测试即可。

![image-20230324203857990](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/image-20230324203857990.png)



<br>

## 最后

配置完成后的效果是Typora直接复制图片就会上传到个人图床，这样日后文件迁移也会方便的多，当然前提是得有一个稳定的图床。