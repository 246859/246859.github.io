---
date: 2024-07-24
article: true
star: false
sticky: false
category:
  - go
tag:
  - windows
  - go
  - registry
---

# go语言操作windows注册表

<img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202407241437452.png" style="zoom:200%;" />

<!-- more -->
---

## 简介

注册表是windows中很重要的一个功能，通过它可以实现很多功能，在Go语言中操作注册表就目前而言有三种方式

1. 命令：通过`exec.Command`执行`REGINI`命令来操作注册表，效率较低
2. 系统调用：在`syscall/zsyscall_windows.go`文件中包含了所有的注册表操作的系统调用，用编程的方式进行操作
3. 库：go官方编写了注册表库`registry`，其原理就是封装了系统调用

很显然，使用官方编写的库效率是最高的，不过它并没有加入标准库，需要我们单独下载。

```bash
$ go get golang.org/x/sys/windows/registry
```



## 示例

```go
const (
	// Windows defines some predefined root keys that are always open.
	// An application can use these keys as entry points to the registry.
	// Normally these keys are used in OpenKey to open new keys,
	// but they can also be used anywhere a Key is required.
	CLASSES_ROOT     = Key(syscall.HKEY_CLASSES_ROOT)
	CURRENT_USER     = Key(syscall.HKEY_CURRENT_USER)
	LOCAL_MACHINE    = Key(syscall.HKEY_LOCAL_MACHINE)
	USERS            = Key(syscall.HKEY_USERS)
	CURRENT_CONFIG   = Key(syscall.HKEY_CURRENT_CONFIG)
	PERFORMANCE_DATA = Key(syscall.HKEY_PERFORMANCE_DATA)
)
```

大部分注册表操作都是基于这些windows预定义好的键，库中以常量的方式定义了这些键，可以直接使用，下面演示一个创建GoLand右键菜单项的例子。

```go
func CreateKey(k Key, path string, access uint32) (newk Key, openedExisting bool, err error)
```

首先如果要修改右键菜单的话，就需要基于`CLASSES_ROOT`键，路径为`Directory\Background\shell\`，这里要加一个goland菜单，就是`Directory\Background\shell\goland`，还有一个值是`access`，就类似于访问文件的`perm`一样，关于这个的详细释义可以看[注册表项安全和访问权限 - Win32 apps | Microsoft Learn](https://learn.microsoft.com/zh-cn/windows/win32/sysinfo/registry-key-security-and-access-rights?redirectedfrom=MSDN)，那么代码如下

```go
golandkey, exist, err := registry.CreateKey(registry.CLASSES_ROOT, `Directory\Background\shell\goland`, registry.WRITE|registry.READ)
```

然后给它设置两个字符串值，类型为`REG_EXPAND_SZ`或`REG_MULTI_SZ`都行，键为空就表示默认值，内容会展示到菜单上，`Icon`即图标。

```go
bin := "D:\\work\\tools\\toolbox\\GoLand\\bin\\goland64.exe"
golandkey.SetStringValue("", "Open Goland Here")
golandkey.SetExpandStringValue("Icon", bin)
```

然后再创建一个子项`command`，表示动作，路径为`Directory\Background\shell\goland\command`

```go
golandCmdKey, exist, err := registry.CreateKey(registry.CLASSES_ROOT, `Directory\Background\shell\goland\command`, registry.WRITE|registry.READ)
```

它的默认值就是goland程序的地址

```go
golandCmdKey.SetExpandStringValue("",`"D:\work\tools\toolbox\GoLand\bin\goland64.exe" "%V"`)
```

完整代码如下

```go
package main

import (
	"fmt"
	"golang.org/x/sys/windows/registry"
	"log"
)

func main() {

	golandkey, exist, err := registry.CreateKey(registry.CLASSES_ROOT, `Directory\Background\shell\goland`, registry.WRITE|registry.READ)
	if exist {
		log.Println("Key already exists")
		return
	}
	if err != nil {
		fmt.Println(err)
		return
	}
	bin := "D:\\work\\tools\\toolbox\\GoLand\\bin\\goland64.exe"
	golandkey.SetStringValue("", "Open Goland Here")
	golandkey.SetExpandStringValue("Icon", bin)

	golandCmdKey, exist, err := registry.CreateKey(registry.CLASSES_ROOT, `Directory\Background\shell\goland\command`, registry.WRITE|registry.READ)
	if exist {
		log.Println("Key already exists")
		return
	}
	if err != nil {
		fmt.Println(err)
		return
	}
	golandCmdKey.SetExpandStringValue("", fmt.Sprintf(`"%s" "%%V"`, bin))
}
```

需要注意的是在运行时必须要以管理员模式执行，否则会拒绝访问。

成功后效果如下

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202407241536810.png)

以上就是一个Go操作注册表的简单示例，实际上整个库函数加起来也才不到6个左右，使用起来也很简单。
