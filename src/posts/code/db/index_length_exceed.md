---
date: 2023-09-20
article: true
star: false
sticky: false
category:
  - db
tag:
  - MySQL
  - 索引
---

# MsSQL索引字节数超出最大值

<!-- more -->
---

## 问题

最近在开发的时候遇到了一个索引上的问题，模型结构体如下

```go
type Permission struct {
	gorm.Model
	Name   string `gorm:"type:varchar(255);comment:perm name;"`
	Object string `gorm:"type:varchar(255);uniqueIndex:perm;comment:resource will be accessed;"`
	Action string `gorm:"type:varchar(255);uniqueIndex:perm;comment:resource action;"`
	Group  string `gorm:"type:varchar(255);uniqueIndex:perm;comment:permission group;"`
	Tag    string `gorm:"type:varchar(255);uniqueIndex:perm;comment:perm's tag,define type of perm;"`

	PermissionTable
}

```

从中可以看到创建了一个联合唯一索引`perm`，那么在使用gorm迁移数据库时，会报如下的错误

```bash
Specified key was too long; max key length is 3072 bytes
```

mysql已经提示说你的索引太长了，最大只能是`3072`个字节数，那么究竟占了多少个字节数呢，计算方法就是类型占用字节数，由于我的mysql版本是8.0，字符集设置的是`utf8mb4`，一般来说索引限制有两种情况

- ROW_FORMAT= COMPACT 或 REDUNDANT，单列索引支持的最大长达为767bytes。
- ROW_FORMAT= COMPRESSED 或 DYNAMIC，单列索引支持的最大长度为3072bytes。

一个字符占用的是4个字节，那么上面结构体中索引的所占用的字节就是`255 x 4 x 4 = 4080`，总共4080个字节大于3072，所以自然就无法成功创建。



## 解决

既然已经发现了问题所在，那么该如何解决？在经过一顿资料查找后，总结出了几种解决办法。

### 减少长度

在上面的结构中，其实很多字段是没有必要设置`255`长度的，比如对于`tag`来说，`50`的长度就差不多够用了，比如说修改成如下长度。

```go
type Permission struct {
	gorm.Model
	Name   string `gorm:"type:varchar(50);comment:perm name;"`
	Object string `gorm:"type:varchar(100);uniqueIndex:perm;comment:resource will be accessed;"`
	Action string `gorm:"type:varchar(50);uniqueIndex:perm;comment:resource action;"`
	Group  string `gorm:"type:varchar(30);uniqueIndex:perm;comment:permission group;"`
	Tag    string `gorm:"type:varchar(30);uniqueIndex:perm;comment:perm's tag,define type of perm;"`

	PermissionTable
}
```

`(100+50+30+30) x 4 = 840 `，总共840个字节，远小于3072的限制。但万一业务需要就得这么大的长度，这种情况就不适用了。

### 前缀索引
