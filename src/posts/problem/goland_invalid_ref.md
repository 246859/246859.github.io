---
date: 2023-10-17
article: true
star: false
sticky: false
category:
  - 问题记录
tag:
  - jetbrain
  - goland
  - IDE

---

#  goland索引失效

问题相当的恼火
<!-- more -->
---

### 问题

最近在用goland写代码的时候，经常会出现某个包的类型无法解析的情况，但实际上没有任何的错误。比如这一行代码引用了`user.PageOption`，

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202310221542332.png)

goland报错提示引用无法正常解析

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202310221543827.png)

但实际上根本就没有任何的错误

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202310221544683.png)

`go vet`也检测不到任何的错误，编译也可以正常通过。出现这种情况的话就没法进行引用快速跳转，智能提示等，这种情况还会发生在函数，接口，结构体，字段上，并且一旦有其它类型引用了这些它们，那么该类型也会变得“无法正常解析”，突出一个离谱，这样很影响效率。



### 解决

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202310221556764.png)

解决不了，摆烂！这个问题我已经在youtrack反映过了，问题链接：[youtrack](https://youtrack.jetbrains.com/issue/GO-15632/reference-index-invalid-frequently)。工作人员让我升级到2023.2.3，但实际上我就是在2.3版本发现问题才降到2.2的。

<img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202310221552165.png" style="zoom:50%;" />

结果发现降下来没有任何的改善，在bug修复之前唯一能做的就只有等待。不过总归要有一个临时的解决办法，既然是索引出了问题，那就把索引清空了重新对项目进行索引。

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202310221551987.png)

但如果每次发生这种情况都要重启一次的话，那就太浪费时间了，goland重启+构建索引的时间基本上有几分钟了，但凡gomod的依赖多一点，花的时间就更久，不过除此之外也没别的办法了。