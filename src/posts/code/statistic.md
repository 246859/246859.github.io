---
date: 2022-07-12
article: true
star: false
sticky: false
category:
  - 技术日志
tag:
  - VuePress
  - 流量统计
---
# VuePress使用百度统计分析网站流量
![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202304021705229.png)

VuePress结合百度统计，分析网站的访问情况

<!-- more -->
---

关于网站统计和分析，常用的有如下这些服务商，统计系统主要只是统计数据，分析系统在统计的同时还可以进一步分析数据，对于我而言仅仅只是需要统计一下网站的访问量即可，所以选择统计系统。

![](https://picx.zhimg.com/80/45924912141b6a0162c61cf7e0764b5f_1440w.webp?source=1940ef5c)

本文主要讲的是百度统计，国内使用起来方便一些，虽然百度统计有些功能下线了，可能是因为业务不行吧，但是对我这种轻度用户来说足够使用了，谷歌分析会涉及到一些翻墙的事情。

## 注册

百度统计：[百度统计——一站式智能数据分析与应用平台 ](https://tongji.baidu.com/web5/10000539386/welcome/login)，首先前往百度统计页面，登录账号，完成后进入产品即可，个人开发者使用免费版即可。

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202304021714418.png)

## 新增网站

来到**使用设置/网站列表**页面，点击新增网站

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202304021715003.png)

按照你自己的网站信息去填写表单

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202304021716906.png)

## 获取代码

添加成功后，来到代码管理，复制生成的JS代码

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202304021719873.png)

如果只是一般的HTML页面，可以选择直接将复制后的代码放入`index.html`中的`<head>`标签内，但我是用的VuePress，不可能每次编译完后手动加到生成的`index.html`中，所以找到项目中的配置文件`.vuepress/config.ts`，像如下编写即可。

```typescript
export default defineUserConfig({
    head: [
        [
            "script", {},
            `var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "you baidu src";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();`
        ]
    ],
});
```

::: tip

VuePress复制代码时不需要`<script>`标签

:::

## 安装检查

上述操作弄完后，将网站重新部署，然后在使用设置页面的网站列表点击安装检查

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202304021726479.png)

一般在部署完十几分钟后可以正常使用，如果代码安装检查失败可以检查一下是不是在外网或者域名填写错误。

## 统计查看

在网站概况中可以很清晰的看到网站的浏览量趋势统计和图表

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202304021729234.png)

也可以看到访问者的地域分布统计

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202304022049101.png)

对于我的小站来说，上述功能已经足够使用了，更多功能的话还请自己去慢慢发现。