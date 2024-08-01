---
date: 2024-07-31
article: true
star: false
sticky: false
category:
  - go
tag:
  - golang
  - gerrit
  - codereview
---
# 如何向Go贡献代码
![](https://spf13.com/presentation/how-to-contribute-to-go/front.jpg)

<!-- more -->
---

## 前言

有一天我突发奇想，想自己编写一个契合我个人使用习惯的go版本管理命令行工具，方便随时切换不同的go版本。作为一个版本管理工具，首要的一个功能就是可以随时获取到最新的go版本，以及所有可用的版本列表，go官方有一个API可以查询所有可用的版本列表，如下：

```
https://go.dev/dl/?mode=json&include=all
```

在通过该接口得到数据后，我尝试用go在1.21新加的一个库`go/version`来进行排序，可排序后得到的结果让人非常的诧异，示例代码如下所示

```go
package main

import (
	"encoding/json"
	"fmt"
	"go/version"
	"net/http"
	"slices"
)

type GoVersion struct {
	Version string    `json:"version"`
	Stable  bool      `json:"stable"`
	Files   []Version `json:"files"`
}

type Version struct {
	Filename string `json:"filename"`
	Os       string `json:"os"`
	Version  string `json:"version"`
	Sha256   string `json:"sha256"`
	Size     int64  `json:"size"`
	Kind     string `json:"kind"`
}

func main() {
	resp, err := http.Get("https://go.dev/dl/?mode=json&include=all")
	if err != nil {
		panic(err)
	}
	var goVersions []GoVersion
	err = json.NewDecoder(resp.Body).Decode(&goVersions)
	if err != nil {
		panic(err)
	}
	slices.SortFunc(goVersions, func(v1, v2 GoVersion) int {
		return version.Compare(v1.Version, v2.Version)
	})
	for _, version := range goVersions[:10] {
		fmt.Println(version.Version)
	}
}
```

它的输出是

```
go1.9.2rc2
go1
go1.2.2
go1.3rc1
go1.3rc2
go1.3
go1.3.1
go1.3.2
go1.3.3
go1.4beta1
```

排第一的版本是`go1.9.2rc2`，而不是最老的版本`go1`，发现这个问题后我去研究了下`go/verison`的源代码，发现了下面这一段

```go
// Parse patch if present.
if x[0] == '.' {
    v.Patch, x, ok = cutInt(x[1:])
    if !ok || x != "" {
        // Note that we are disallowing prereleases (alpha, beta, rc) for patch releases here (x != "").
        // Allowing them would be a bit confusing because we already have:
        //	1.21 < 1.21rc1
        // But a prerelease of a patch would have the opposite effect:
        //	1.21.3rc1 < 1.21.3
        // We've never needed them before, so let's not start now.
        return Version{}
    }
    return v
}
```

大致意思就是说，补丁的预发布版本很少会使用到，且可能会产生歧义就将其视为非法的版本，而非法的版本总是会小于合法的版本，这就是为什么`go.1.9.2rc2`是最小的版本，编写这个标准库的正是go团队的主要领头人Russ cox。

虽然官方是这样说，但我并不认为这样就是正确的，目前我发现的拥有预发布版本的补丁版本总共有三个：

- 1.8.5rc5
- 1.8.5rc4
- 1.9.2rc2

尤其是`1.9.2rc2`，它既然可以在官方接口中可以被查询到，那就说明它是一个可用的版本，但很遗憾的是下面这段代码的结果是false。

```go
func main() {
	fmt.Println(version.IsValid("go1.9.2rc2"))
}
```

将一个对外可用的版本视为非法的版本，这很明显就是错误的，于是我便想着自己修改，给Go语言提了一个issue：[Issue #68634 · golang/go](https://github.com/golang/go/issues/68634)，并且后续向go发起了一个Pull Request来修复这一错误，由于我是第一次向go仓库贡献代码，中间做了许多额外的准备，所以便写下本文做一个记录。



## 准备

在真正开始写代码之前，你需要做一些准备来符合PR的规范，否则官方不会受理你的代码。官方文档详细地描述了如何正确地向Go提交代码[Contribution Guide - The Go Programming Language](https://go.dev/doc/contribute#commit_messages)。



### CLA

CLA（Contributor License Agreement），中文名为开源贡献者协议，一般有两种，

- DCO：由linux基金会提出，社区属性比较强，每次提交的时候都要签署
- CLA：由公司法务指定，具有一定法律性质，一次性签署，社区属性弱

go是谷歌公司的产品， 向其贡献代码前就必须要签署[Google CLA](https://cla.developers.google.com/about)，如下图所示

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202408010102024.png)

有个人版和企业版，对于个人版而言仅需要提供你的名字和邮件联系方式即可，如果你未签署CLA就直接提交PR，github上会有机器人来提醒你签署CLA，在此之前你的PR不会被受理。

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202408010105232.png)



### Geerit

Gerrit是谷歌开源的一个代码评审平台，可以企业自托管。go的代码审查也是用的gerrit，地址在[Go |Gerrit Code Review](https://go-review.googlesource.com/dashboard/self)，界面大致如下图。

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202408010115925.png)

你需要在这里注册一个账号，因为所有的PR都会被机器人转发到gerrit，负责代码审查的人员会在这里对你的代码提出规范和建议，所以不要在GitHub的PR页面做出任何回复和评论，机器人会告诉你到哪里去查看。

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202408010116746.png)

如果你后续需要修改代码，只需要提交到Github上即可，代码审查的工作在Gerrit上进行。

```bash
$ go install golang.org/x/review/git-codereview@latest

$ git codereview help
Usage: git-codereview <command> [-n] [-v]

Git-codereview is a git helper command for managing pending commits
against an upstream server, typically a Gerrit server.
```

建议在本地安装go官方的一个review命令行工具，下面是一些简单的用法

```bash
$ git codereview sync # 同步代码
$ git codereview change # 修改提交信息
$ git codereview mail # 将修改后的信息提交到gerrit
```



### 冻结期

每年的5-7月，11-1月是go语言的冻结期，这段时间一般是为了发布新的次级版本而做准备，在这段时间内代码审查的工作会放缓，只有一小部分比较重要的更改会被合并，在此期间只接受修复已有的bug和文档更新类的修改，如果你是在这个时间点内提交其他类型的PR，可能会要等一段时间才会有回应，直到冻结期结束。





## 编码

当你做好上述准备工作以后，就可以开始着手准备写代码了。



### 仓库结构

go语言有很多仓库，它们无一例外全都托管谷歌仓库中，你可以在[Git repositories on go | Google](https://go.googlesource.com/)查看到所有和go有关的项目，你也可以在[github.com/golang](https://github.com/golang)组织下看到这些项目的镜像，不过并不是所有项目都保持活跃，有些可能被遗弃了，在提交代码的时候记得注意这一点。下面简单介绍下最主要的几个，你需要弄清楚自己做出的修改要提交到哪里去才行。



**主仓库**

地址：go.googlesource.com/go

镜像：github.com/golang/go

主仓库存放了go语言绝大部分代码，大部分修改都在这里进行，比如语法，运行时，gc，和一些标准库之类的。



**proposal**

地址：go.googlesource.com/proposal

镜像：github.com/golang/proposal

go语言提案库，所有涉及到go语言特性的重大变更都必须先在这里发起一个提案



**tools**

地址：go.googlesource.com/tools

镜像：github.com/golang/tools

对应`golang.org/x/tools`，tools仓库存放着一些官方编写的工具，比如goimports，stringer，gopls之类



**net**

地址：go.googlesource.com/net

镜像：github.com/golang/net

对应`golang.org/x/net`，net库是官方对net标准库的一个补充



**crypot**

地址：go.googlesource.com/crypto

镜像：github.com/golang/crypto

对应`golang.org/x/crypto`，是对crypto标准库的一个补充



**gofrontend**

地址：go.googlesource.com/gofrontend

镜像：github.com/golang/gofrontend

gccgo，go编译器前端



**vscode-go**

地址：go.googlesource.com/vscode-go

镜像：github.com/golang/vscode-go

go语言的vscode插件



里面还有很多项目，这里就不一一列出了，可以前往谷歌仓库自行查阅。



### 安全漏洞

这篇文章详细说明了如何报告安全漏洞：[Go Security Policy - The Go Programming Language](https://go.dev/doc/security/policy)

如果你发现了安全漏洞，不要在github上提issue或PR，go有一个专门处理安全问题的团队，将你遇到的问题详细描述（用英文）然后发邮件给这个地址：security@golang.org，团队成功会尽快在7天内做出回复，为了避免被当成垃圾邮件，请确保邮件里面包含了**vulnerability**这个单词，意思就是漏洞，或者也可以去这里[Report Overview | Google Bug Hunters - Google Bug Hunters](https://bughunters.google.com/report)反馈安全漏洞。



### 本地编译

在决定好向哪一个仓库贡献代码后，用git将其克隆到本地，比如我这里是主仓库，使用Github地址与谷歌的地址是等效的，单纯是因为我更习惯Github上的操作。

```
git clone git@github.com:golang/go.git
```

在将代码拉下来后，首先要做的第一件事就是先编译go项目，编译器用的是本地go自带的gc，进入src目录（必须在src目录执行），执行make脚本，如果你是windows平台，就执行`make.bat`，其他平台就执行`make.bash`，在编译完成后，二进制文件会存放在go/bin目录下，工具链会存放在go/pkg目录下。

```shell
$ time ./make.bat
Building Go cmd/dist using D:\work\libs\golang\root\go1.22.5. (go1.22.5 windows/amd64)
Building Go toolchain1 using D:\work\libs\golang\root\go1.22.5.
Building Go bootstrap cmd/go (go_bootstrap) using Go toolchain1.
Building Go toolchain2 using go_bootstrap and Go toolchain1.
Building Go toolchain3 using go_bootstrap and Go toolchain2.
Building packages and commands for windows/amd64.

real    1m36.028s
```

go仓库光是go代码就有250w+行，还不包含其他的一些文件，不过整体编译时间并不需要很久，测了下平均耗时在一分半左右。

官方准备了三种类型的脚本，它们的作用如下

- make.bash，仅编译
- run.bash，不编译，运行所有的测试用例
- all.bash，先编译，然后再运行所有的测试用例

可以看自己的需要来使用哪一个。



### 代码规范

在开始写代码之前，你首先需要创建一个新的分支，然后在新分支上做出修改，分支名称并没有严格规范，像github平时那样就好

```bash
$ git checkout -b mybranch
$ [edit files...]
$ git add [files...]
```

你每新建一个go文件，就需要在文件头部加上如下的注释，其中的年份是你提交修改的年份，注释中不要提及任何人的姓名

```go
// Copyright 2024 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.
```

如果你新建了一个包，就需要在包级注释中说明这个包是干什么用的，就像标准库`bytes`

```go
// Copyright 2009 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

// Package bytes implements functions for the manipulation of byte slices.
// It is analogous to the facilities of the [strings] package.
package bytes
```

然后就是提交规范，这是官方给的一个示例

```
math: improve Sin, Cos and Tan precision for very large arguments

The existing implementation has poor numerical properties for
large arguments, so use the McGillicutty algorithm to improve
accuracy above 1e10.

The algorithm is described at https://wikipedia.org/wiki/McGillicutty_Algorithm

Fixes #159
```

格式如下

```
scope: summary

main content

referencing issues
```

第一行需要标注出影响范围和对本次提交的简短总结，必须以冒号分隔，如果有多个影响范围可以用逗号隔开，总结必须小写字母开头且尽量精简到76个字母以内，示例如下

```
syscall,misc/wasm: fix path expansion on non-unix platforms
```

然后是主要内容，不能使用markdown，html，latex等任何标记语言，这一部分需要描述的尽可能详细，需要说明起因和结果，并且附上尽可能详细的数据，比如修改的代码涉及到性能，可以附上基准测试的数据。下面是一个示例，该提交涉及到了内存逃逸方面。

```
sync: reduce OnceFunc (and variants) heap allocations

The lifetime of the variables are identical; capture
them in a single struct to avoid individual allocations.
The inner closure can also avoid allocation by using the
capture of the outer closure.

Escape analysis for OnceValues:

  /go/src/sync/oncefunc.go:74:29: moved to heap: sync.f
  /go/src/sync/oncefunc.go:76:3: moved to heap: sync.once
  /go/src/sync/oncefunc.go:77:3: moved to heap: sync.valid
  /go/src/sync/oncefunc.go:78:3: moved to heap: sync.p
  /go/src/sync/oncefunc.go:79:3: moved to heap: sync.r1
  /go/src/sync/oncefunc.go:80:3: moved to heap: sync.r2
  /go/src/sync/oncefunc.go:82:7: func literal escapes to heap
  /go/src/sync/oncefunc.go:83:9: func literal does not escape
  /go/src/sync/oncefunc.go:93:9: func literal escapes to heap

After provided changes:

  /go/src/sync/oncefunc.go:86:2: moved to heap: sync.d
  /go/src/sync/oncefunc.go:96:9: func literal escapes to heap
  /go/src/sync/oncefunc.go:99:13: func literal does not escape
  /go/src/sync/oncefunc.go:100:10: func literal does not escape
```

最后就是需要引用相关的issue，最好每一个PR都与一个issue相关联，方便溯源。

```
Fixes #159
```



### 本地测试

在完成所有的编码工作后，你需要编写相应的单元测试，这一点是必须要做的。然后在src目录下（必须在src目录下执行）执行`all.bash/bat`脚本，该脚本会编译go代码并执行所有的测试

```bash
$ cd go/src && ./all.bash
```

由于需要将go代码中所有的测试都执行完，耗时可能会比较久，大概在10分钟左右，所有测试通过后会显示下面一行内容

```
ALL TESTS PASSED
```

如果你只是对某一个标准库做了修改，你也可以不用执行全部的测试，你可以使用编译好后的go指定执行某一个标准库的测试用例，比如

```
$ cd $GOROOT/src/crypto/sha1
$ [make changes...]
$ $GOROOT/bin/go test .
```

不过我还是建议执行所有的测试用例，因为单独执行测试用例我基本上就没怎么成功过。



### Pull Request

在完成所有的修改后，将其推送到Github，然后向go仓库发起Pull Request，如下图

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202408011203739.png)

过一会儿会有机器人来告诉你PR已经被转发到Gerrit

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202408011205270.png)

之后的代码审查工作就是在gerrit进行，gerrit的评论也会同步到Github，不过不要在这里做出任何回复。

::: tip

如果你使用`git codereview mail`来将这些修改推送到gerrit，可能会有如下错误，因为Gerrit不接受来自中国IP的任何提交

```
fatal: remote error: Access Denied (not available from your location)
```

并不是因为Go团队有地域歧视，原因看这个[access to Gerrit denied because of location · Issue #20065 · golang/go (github.com)](https://github.com/golang/go/issues/20065)。如果你不想换IP的话，可以在Github上发PR让机器人帮你推送到Gerrit上，这样是最简单的方式

:::



## 代码审查

代码审查的流程是最长的，如果你是社区贡献人员（谷歌员工的PR合并会快很多），并且改动比较大的话，那么通常需要好几轮审查才能确认将代码合并到主线当中，这一过程可能会耗时一两个星期甚至一个月。

大多数第一次提交代码的人会犯一些比较典型的错误

- 提交信息不符合规范
- 缺少对Github Issue的引用
- 在冻结期提交修改

第一点是最重要的，因为你的提交会被合并到主线当中，所以必须要符合规范。第二点的话如果你只是改了个注释或者什么其他微不足道的修改，也不需要引用issue。第三点其实也没那么重要，时间一过自然会发邮件通知审查你的代码的，无非只是等的时间长了点。



### 审查人员

审查人员大多都是go团队的成员或者是谷歌公司的员工，以及部分社区人员组成，PR被转发到Gerrit后，如果你是第一次向Go贡献代码的话，为了避免这是垃圾邮件可能要过一段时间才会来审查的你的代码。如果有需要的话，你也可以直接指定谁来审查你的代码

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202408011510744.png)

你可以在Change Info部分中指定审查人员和CC

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202408011511213.png)

或者你也可以用命令行的方式

```
$ git codereview mail -r joe@golang.org -cc mabel@example.com,math-nuts@swtch.com
```

通常来说对于第一次贡献代码的人来说，如果你不知道指定谁，可以先发个issue看看，有哪些人会回答你的问题，如果他刚好是维护者的话就可以指定他来审查。如果你没有指定，那么系统也会自动为你分配审查人员的。



### Trybots

当一个审查人员初步浏览了你的代码后，会启动Trybots，来进行自动化测试，就跟之前在本地测试的一样，不同的是trybots会在各个不同的环境进行测试，就跟Github Actions差不多类似。如果运行失败了，就需要查明哪里出了问题，然后修改代码重新提交。



### 投票

审查人员和其他无关的第三方人员都可以给你的PR投票，第三方人员可以投一个`+1`，表示这个代码写的还不错，但还需要审查人员来进行评审，只有在获得审查人员的`+2`投票后，代码才能被合并，如果审查人员给你投了一个`+1`的话表示代码整体可以，但还需要做一些小的修改。

总的来说，如果你的PR想要被合并，就必须要两名审查人员的参与，至少一个`+1`和`+2`投票才能继续流程。

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202408011536498.png)

对于一个PR而言，通常决定能否提交的指标下面这几个

- CR（code-review）：表示codereview是否完成
- NUC（non-unresolved-comment）：，没有未处理的审查
- RE（Review-enforcement）：执行了codereview
- TP（trybots-passes）：trybots测试通过

如果你是其他类型的修改可能会需要完成更多的CI测试，比如KCP（kokoro-CI-Passes），LP（LUCI-Passes），LTP（legacy-trybos-passes）等等，如果对应的CI测试通过了就会加分，相应的如果失败了就会扣分。

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202408011541602.png)



### 修改

一般来说很少会有一次性通过的代码，审查人员会检查你代码中的逻辑错误，即便是一些注释问题也会指出来，这时候他们会留下评论，如下图所示

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202408011548843.png)

如果你是通过Github机器人来与Gerrit交互的，那么你只需要将你本地的代码推送Github上就行了，机器人会自动更新修改，完成一个评论后点击Done按钮来告诉审查人员已解决。



### 合并

当所有的工作都完成且通过，没有任何异议的时候，代码就会被合并，如下图所示。

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202408011543561.png)

想要被顺利合并通常要花费不少时间，不要着急就对了。



## 总结

给Go贡献代码并不只是简单的写代码做修改就完事了，要注意的流程和规范非常多，这样严格管理的好处是不容易出问题，能够保证代码质量。这一套codereview流程，对于刚接触的人来说会觉得很繁琐和麻烦，不过熟悉了过后就没什么了，了解这一套codereview流程也便于养成好的编程习惯，毕竟谷歌是由数万人组成的大型公司，良好的规范可以让屎山堆的更慢一些。

