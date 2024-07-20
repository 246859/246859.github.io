---
date: 2023-12-23
article: true
star: false
sticky: false
category:
  - 技术日志
  - go
tag:
  - 命令行
  - go
---

# Go读取Linux命令行管道参数

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202312231144152.jpg)

<!-- more -->
---

在用go编写命令行程序的时候，参数有三个来源

1. 命令行参数
2. 命令行标志
3. 管道

Linux管道是一个很常见的用法，用于将上一个命令的结果作为下一个命令的参数

```bash
$ cat hello.txt | grep hello
```

但并不是所有命令行程序都支持管道参数，比如`echo`就不支持，这种情况我们一般会用`xargs`来转化下。

```bash
$ cat hello.txt | xargs echo
```

它会读取管道参数然后作为标准命令行参数传递给下一个命令，不过它有可能会破坏源文件的内容，所以我们还是自身支持管道更好一些。

在使用管道时，实际上是将结果写入了标准输入`stdin`中，对于我们而言，就只需要从标准输入中读取就行了。很容易就能想到该怎么写

```go
args, _ := io.ReadAll(os.Stdin)
```

可如果只是直接从标准输入读取，如果在使用命令的时候没有使用管道，那么这行代码就会一直阻塞下去。所以我们得首先判断是否是管道模式，再去读取管道参数，所以应该这样写

```go
package main

import (
	"fmt"
	"io"
	"os"
)

func main() {
	stat, _ := os.Stdin.Stat()
	if stat.Mode()&os.ModeNamedPipe == os.ModeNamedPipe {
		bytes, _ := io.ReadAll(os.Stdin)
		fmt.Println(string(bytes))
		return
	}
	fmt.Println("do nothing")
}
```

看看使用情况

```bash
$ cat main.go | ./main.exe
package main

import (
        "fmt"
        "io"
        "os"
)

func main() {
        stat, _ := os.Stdin.Stat()
        if stat.Mode()&os.ModeNamedPipe == os.ModeNamedPipe {
                bytes, _ := io.ReadAll(os.Stdin)
                fmt.Println(string(bytes))
                return
        }
        fmt.Println("do nothing")
}
```

不使用管道

```bash
$ ./main.exe
do nothing
```

这样一来，就可以区分使用管道和不使用管道的情况了，在不使用管道的情况下就可以从标准命令行参数里面去读取。