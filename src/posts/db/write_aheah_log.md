---
date: 2023-11-17
article: true
star: false
sticky: false
category:
  - 数据库
tag:
  - wal
---

# WAL——预写日志

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202311292055936.png)
<!-- more -->
---
WAL全名叫Write Ahead Logging，译为预写日志，常用在数据库系统中，用来保证ACID事务中的原子性和持久性。WAL的写入方式通常是`append only`，每一次写入都是在向其中添加数据，而非`in place`原地修改，那么这样做的好处非常明显，由于是顺序IO，写入性能会比随机IO好很多。