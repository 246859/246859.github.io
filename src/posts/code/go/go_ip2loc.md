---
date: 2024-03-11
article: true
star: false
sticky: false
category:
  - 技术日志
  - go
tag:
  - go
  - IP转换
  - 
---

# 使用ip2location包转换IP地址

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202403111750936.png)

<!-- more -->
---
ip2loction是一个组织，它们提供IP数据库，可以通过IP地址解析道各种各样的信息，比如地区代码，时区等等，网站：https://lite.ip2location.com/。

免费数据库只能查询国家代码，更多功能只有付费数据库可以使用，它们的数据库也就是一个单独的文件或者CSV文件。

## 下载

下载地址：[Database Download (ip2location.com)](https://lite.ip2location.com/database-download)

文档地址：[IP2Location Go Package — IP2Location Go (ip2location-go.readthedocs.io)](https://ip2location-go.readthedocs.io/en/latest/index.html)





## 使用

它们提供了专门GO API来操作数据库，所以对于go而言可以直接导入它们编写好的库就可以直接使用。

```bash
$ go get github.com/ip2location/ip2location-go/v9
```

然后直接通过go代码打开文件数据库，lite版本的数据文件很小只有2MB左右，完全可以嵌入到程序中，下面是一个使用案例

```go
package main

import (
	"fmt"
	"github.com/ip2location/ip2location-go/v9"
)

func main() {
	db, err := ip2location.OpenDB("IP2LOCATION-LITE-DB1.BIN")
	if err != nil {
		panic(err)
	}
	info, err := db.Get_all("45.11.104.59")
	if err != nil{
		panic(err)
	}
	fmt.Println(info.Country_short)
	fmt.Println(info.Country_long)
	fmt.Println(info.Timezone)
}
```

输出

```
HK
Hong Kong
This parameter is unavailable for selected data file. Please upgrade the data file.
```

从输出可以看到，只能查询国家代码，如果想要时区之类的一些信息需要付费购买更高级的数据库，不过对大多数人而言国家代码已经够用了。



## 性能

下面是一个基准测试，来测试lite版本的查询性能如何

```go
func BenchmarkIp2Loc(t *testing.B) {
	t.ReportAllocs()
	t.ResetTimer()
	db, err := ip2location.OpenDB("IP2LOCATION-LITE-DB1.BIN")
	if err != nil {
		panic(err)
	}
	for i := 0; i < t.N; i++ {
		db.Get_all("45.11.104.59")
	}
}
```

结果如下

```bash
goos: windows
goarch: amd64
pkg: golearn
cpu: 11th Gen Intel(R) Core(TM) i7-11800H @ 2.30GHz
BenchmarkIp2Loc
BenchmarkIp2Loc-16         59758             18791 ns/op             616 B/op			9 allocs/op
PASS
```

可以看到的是单次查询性能在18微秒左右，还是比较可以的。