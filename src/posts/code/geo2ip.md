---
date: 2024-03-14
article: true
star: false
sticky: false
category:
  - 技术日志
tag:
  - geo
  - go
  - 
---

# 使用geo2ip将IP地址转换为地理信息

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202403141721383.png)
<!-- more -->
---
之前推荐了一个ip地理信息库`ip2location`，其免费版只能查询国家代码，并且离线数据库不支持全量加载到内存中，由于这些缺点，我找了一个新的替代品`geoip2`，该离线数据库仍然是由一个商业公司在运营，但是相比前者要良心非常多，免费版支持定位到城市，且支持多语言，同时支持`csv`，`mmdb`两种格式。



## 下载

首先需要在网站注册一个账号，然后才能下载免费版

官网：[Industry leading IP Geolocation and Online Fraud Prevention | MaxMind](https://www.maxmind.com/en/home)

下载地址：[Download GeoIP Databases | MaxMind](https://www.maxmind.com/en/accounts/986554/geoip/downloads)

然后安装他们提供的go SDK库

```bash
$ go get github.com/oschwald/geoip2-golang@latest
```



## 使用

使用起来有两种，一种是从文件读

```go
db, err := geoip2.Open("GeoLite2-City.mmdb")
```

另一种是把数据库全量加载到内存中，总共也才30MB不到，这样做可以省去文件IO

```go
bytes, err := os.ReadFile("GeoLite2-City.mmdb")
if err != nil{
    panic(err)
}
db, err = geoip2.FromBytes(bytes)
```



## 案例

通过IP地址查询地区信息

```go
import (
	"github.com/cloudwego/hertz/pkg/common/test/assert"
	"github.com/oschwald/geoip2-golang"
	"net"
	"testing"
)

func TestGeoip2(t *testing.T) {
	bytes, err := FS.ReadFile("geoip2/GeoLite2-City.mmdb")
	assert.Nil(t, err)

	db, err := geoip2.FromBytes(bytes)
	assert.Nil(t, err)

	country, err := db.Country(net.ParseIP("125.227.86.48"))
	assert.Nil(t, err)
	t.Log(country.Country.Names)
	t.Log(country.Country.IsoCode)
}
```

输出

```
map[de:Taiwan en:Taiwan es:Taiwán fr:Taïwan ja:台湾 pt-BR:Taiwan ru:Тайвань zh-CN:台湾]
TW
```

通过IP地址查询城市信息

```go
import (
	"github.com/cloudwego/hertz/pkg/common/test/assert"
	"github.com/oschwald/geoip2-golang"
	"net"
	"testing"
)

func TestGeoip2(t *testing.T) {
	bytes, err := FS.ReadFile("geoip2/GeoLite2-City.mmdb")
	assert.Nil(t, err)

	db, err := geoip2.FromBytes(bytes)
	assert.Nil(t, err)

	city, err := db.City(net.ParseIP("125.227.86.48"))
	assert.Nil(t, err)
	t.Log(city.Country.IsoCode)
	t.Log(city.City.Names)
	t.Log(city.Location.TimeZone)
}
```

输出

```
TW
map[en:Taichung ja:台中市 ru:Тайчжун]
Asia/Taipei
```

通过上面的两个输出可以看到，它支持多种语言，时区等等信息，除此之外它还支持经纬度定位等其它功能，不过不是很准确。



## 性能

写一个简单的基准测试

```
func BenchmarkGeoip2(b *testing.B) {
    b.ReportAllocs()

    bytes, err := FS.ReadFile("geoip2/GeoLite2-City.mmdb")
    assert.Nil(b, err)

    db, err := geoip2.FromBytes(bytes)
    assert.Nil(b, err)

    for i := 0; i < b.N; i++ {
        db.City(net.ParseIP("125.227.86.48"))
    }
}
```

```
goos: windows
goarch: amd64
pkg: github.com/dstgo/tracker/assets
cpu: 11th Gen Intel(R) Core(TM) i7-11800H @ 2.30GHz
BenchmarkGeoip2
BenchmarkGeoip2-16        218502              5259 ns/op            2800 B/op              84 allocs/op
```

平均耗时在5微秒左右