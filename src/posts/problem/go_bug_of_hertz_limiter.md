---
date: 2024-03-13
article: true
star: false
sticky: false
category:
  - 问题记录
tag:
  - go
  - hertz
  - limiter
---

# 记录Hertz框架limiter的一个问题

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202403131932279.png)


<!-- more -->
---
最近在尝试一个新的Web框架`Hertz`，使用起来跟gin没什么太大的区别，它的周边生态也有一些开源的中间件，在使用其中的limiter时遇到了问题，便记录了下来。



## 发现

首先limiter的算法实现是BBR自适应限流算法，用起来没有问题，用法如下。

```go
func limiterHandler() app.HandlerFunc {
	newLimiter := limiter.NewLimiter()
	return func(c context.Context, ctx *app.RequestContext) {
		done, err := newLimiter.Allow()
		if err != nil {
			ctx.AbortWithStatusJSON(consts.StatusTooManyRequests, types.Response{
				Code: consts.StatusTooManyRequests,
				Data: nil,
				Msg:  "too many requests",
			})
		} else {
			ctx.Next(c)
			done()
		}
	}
}
```

在编译之前进行语法检查，会得到如下报错，提示未定义的类型

```
github.com\c9s\goprocinfo@v0.0.0-20210130143923-c95fcf8c64a8\linux\disk.go:15:16: undefined: syscall.Statfs_t
github.com\c9s\goprocinfo@v0.0.0-20210130143923-c95fcf8c64a8\linux\disk.go:16:17: undefined: syscall.Statfs
```

首先会好奇这么个玩意是哪里来的，我好像也没用到过，先通过`go mod`命令看看是谁依赖了它

```bash
$ go mod graph | grep goprocinfo
github.com/dstgo/tracker github.com/c9s/goprocinfo@v0.0.0-20210130143923-c95fcf8c64a8
github.com/hertz-contrib/limiter@v0.0.0-20221008063035-ad27db7cc386 github.com/c9s/goprocinfo@v0.0.0-20210130143923-c95fcf8c64a8
```

原来就是这个limiter导入了它，因为bbr算法的需要获取主机的一些负载信息所以导入了这个库。`syscall`是标准库中的系统调用库，它不太可能会出问题，那就是用它的库有问题，接下来去这个`goprocinfo`库里面看看怎么回事，找到的目标代码如下

```go
package linux

import (
	"syscall"
)

type Disk struct {
	All        uint64 `json:"all"`
	Used       uint64 `json:"used"`
	Free       uint64 `json:"free"`
	FreeInodes uint64 `json:"freeInodes"`
}

func ReadDisk(path string) (*Disk, error) {
	fs := syscall.Statfs_t{}
	err := syscall.Statfs(path, &fs)
	if err != nil {
		return nil, err
	}
	disk := Disk{}
	disk.All = fs.Blocks * uint64(fs.Bsize)
	disk.Free = fs.Bfree * uint64(fs.Bsize)
	disk.Used = disk.All - disk.Free
	disk.FreeInodes = fs.Ffree
	return &disk, nil
}
```

这段代码的逻辑很简单，就是通过系统调用来获取某一个路径下文件夹使用额度，但是遗憾的是Windows系统并不支持`Statfs`这个系统调用，所以对于win系统而言，编译后并不会存在`Statfs_t`类型和`Statfs`函数，所以整个问题的原因就是`goprocinfo`这个库没有根据不同的系统做兼容而导致的。



## 解决

由于我在开发是在windows上进行的，不可能去迁移到linux上，所以只能更换一个新的限流库，这里找到了`go-kratos`开源的一个bbr限流库。

```
https://github.com/go-kratos/aegis/blob/main/ratelimit/
```

在更换过后，代码变化也不多

```go
func limiterHandler() app.HandlerFunc {
	limiter := bbr.NewLimiter()
	return func(c context.Context, ctx *app.RequestContext) {
		done, err := limiter.Allow()
		if err != nil {
			ctx.AbortWithStatusJSON(consts.StatusTooManyRequests, types.Response{
				Code: consts.StatusTooManyRequests,
				Data: nil,
				Msg:  "too many requests",
			})
		} else {
			ctx.Next(c)
			done(ratelimit.DoneInfo{})
		}
	}
}
```

go-kratos`所使用的系统信息库是`gopsutil`，后者是一个专门兼容各个操作系统的系统信息库，对外屏蔽了复杂的系统调用，兼容要更高。