---
date: 2024-07-26
article: true
star: false
sticky: false
category:
  - go
tag:
  - Golang
  - Makefile
  - Build
---

# 使用Makefile来构建Go程序

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202408271022015.png)

<!-- more -->

## 简介

Make起源于1977年的贝尔实验室中，目的就是为了能更好的构建大型程序，贝尔实验室的大型程序自然就是Unix操作系统。在后来诞生了它的许多变种，比较知名是下面两个。

- GNU Make
- BSD Make

GNU Make应该是现在用的最多的一个，Linux和MacOS都是用的GNU Make，本文在讲解的时候也会使用这一个。Makefile在C/C++项目中用的比较多，但它并不限制于特定的语言，Go同样也可以使用Makefile来构建程序，不过由于Go是一个比较现代化的语言，在编译时它已经将大部分事情都做好了，不需要我们去处理依赖，链接等，所以也就很少会用到makefile中那些复杂的规则，用的最多的也就是`.PHONY`伪目标来执行特定的命令。



## 语法

本文这里只是简单介绍下makefile中的语法，如果你想进行细致的学习的可以前往[Document | GNU make](https://www.gnu.org/software/make/manual/make.html)进行了解。



### 伪目标

makefile是由一个个目标（target）组成的，在makefile中目标表示的文件，Go中不需要对文件单独处理，所以我们会使用伪目标，表示它只执行命令，我们会用`.PHONY`来表示它是一个伪目标，如下。

```makefile
.PHONY: hello one

hello:
	echo "hello is a phony target"
	
one:
	echo "one"
```

在目标中执行的命令必须要用tab进行缩进，如果你觉得一行命令太长可以用`\`来换行，记得换行符后面不要有任何字符。

```makefile
hello:
	echo "hello is a \
		phony target"
```

执行看看效果

```bash
$ make hello
echo "hello is a phony target"
hello is a phony target
```

会发现它将要执行的命令打印出来了，如果你不想这么做可以加上`-s`标志

```bash
$ make hello -s
```

或者在`echo`命令前加上`@`

```makefile
hello:
	@echo "hello is a phony target"
```

两种方法都可以阻止make打印命令。



### 变量

makefile中的变量用`=`来进行赋值，比如

```makefile
name = "jack"
```

变量没有类型，全都是字符串，没有被赋值的变量就是一个空字符串，赋值时必须要用空格相隔，不需要双引号也可以表示字符串

```makefile
name = jack
```

如果只是输出的话他们并没有什么区别，但实际上两者并不相等

```makefile
name1 = "jack"
name2 = jack

all:
ifeq ($(name1), $(name2))
	echo "equal"
else
	echo "not equal"
endif
```

输出的结果会是不相等

```bash
$ make -s
not equal
```

在使用的时候就需要稍微注意一下。

变量取值的时候可以用`$(var)`或者`${var}`两种方法获取变量的值，比如

```makefile
one = 1
two = $(one)
three = ${two}
```

用`=`定义的变量默认是懒加载的，在使用到的时候才会展开，而用`:=`定义的变量会立即展开，如下

```makefile
one = $(three)
two := $(three)
three = 3


.PHONY: hello

hello:
	echo 1 $(one)
	echo 2 $(two)
```

在这里例子中变量`two`是被`:=`定义的，在它展开时变量`three`还未被定义，所以它就是一个空字符串。

```makefile
$ make hello -s
1 3
2
```

通过`shell`函数，可以将执行命令的返回值赋值给变量

```makefile
content := $(shell cat hosts.txt)
```

也可以不理会返回值，仅执行命令。



### 条件

makefile中条件判断有下面几种

- `ifeq`，判断是否相等

  ```makefile
  ifeq ($(a), $(b))
  	...
  else
  	...
  end if
  ```

- `ifneq`，判断不相等

  ```makefile
  ifneq ($(a), $(b))
  	...
  else
  	...
  end if
  ```

- `ifdef`，判断变量是否定义

  ```makefile
  abc = 
  ifdef abc
  	...
  else
  	...
  end if
  ```

- `ifndef`，判断变量是否未定义

  ```makefile
  abc = 
  ifndef abc
  	...
  else
  	...
  end if
  ```



### 循环

makefile中的循环实际上是一个函数，格式如下

```makefile
$(foreach item, list, action)
```

它最终会将处理后的元素返回成一个新数组，如果你只是用作循环也可以完全不管这个返回值。在makefile中，由空格作为分隔符的字符串可以看作是数组，如下

```makefile
list := jack lili mike
```

迭代这个数组，然后将名字拼接成新字符串，然后返回一个新数组

```makefile
list := jack lili mike
list2 := $(foreach name, $(list), "hello $(name)!")

.PHONY: hello
hello:
	echo $(list2)
```

最终输出

```bash
$ make hello
echo  "hello jack!"  "hello lili!"  "hello mike!"
hello jack! hello lili! hello mike!
```

也可以是多重循环

```makefile
first_names := jack lili
second_names := david john

names := $(foreach fname, $(first_names), \
         		$(foreach sname, $(second_names), $(fname)-$(sname)))
.PHONY: hello
hello:
	@echo $(names)
```

输出

```bash
$ make hello
jack-david jack-john lili-david lili-john
```



### 递归

对于一个目标而言，我们可以在目标中使用`$(make)`来进行递归，比如下面这一个例子

```makefile
.PHONY: hello
hello:
	echo "hello"
	$(MAKE) hello
```

这个例子中会无限递归执行目标`hello`。你也可以用这种方法执行其他目标

```makefile
.PHONY: hello
hello:
	echo "hello"
	$(MAKE) bye

.PHONY: bye
bye:
	echo "bye"
```

输出

```bash
$ make hello
echo "hello"
hello
make[1]: Entering directory '/learn/makefile'
echo "bye"
bye
make[1]: Leaving directory '/learn/makefile'
```

递归的原本目的是为了解析子文件夹下的makefile，所以它会显示`Entering directory`表示进入某个文件夹，如果你不想看到这些输出加上`-s`标志执行就行了。

```bash
$ make hello -s
hello
bye
```



### 替换

字符串替换使用`$(patsubst)`来完成，它有下面几个参数

```makefile
$(patsubst pattern, replacement, text)
```

通常我们会使用它的简写方式，通配符`%`表示匹配的部分

```makefile
$(text:%pattern=%replacement)
```

比如

```makefile
name = jack
result := $(name:j%=m%)
```

那么它最后会是

```
mack
```



### 注释

makefile中的注释由`#`来表示

```bash
# 这是一段注释
name = "comment"
```

值得一提的是，在执行目标的时候，如果没有设置静默输出的话，注释也会一并打印出来。



## 构建

在简单地解了上面的几种语法后，对于构建Go程序而言已经完全足够使用了，你可以通过编写如下的makefile来编译一个go程序。

```makefile
.PHONY: build
build:
	go build -o main.exe main.go
```

但如果只是这么简单的使用，实在是没有必要使用makefile，集成开发环境就能满足了，所以我们要写点复杂的。

比如可以在编译前进行代码检查

```makefile
.PHONY: build
build:
	# lint
	go vet ./...
	# build
	go build -o main.exe main.go
```

或者进行交叉编译时，设置环境变量

```makefile
.PHONY: build
build:
	# lint
	go vet ./...

	go env -w GOOS=linux
	go env -w GOARCH=arm

	# build
	go build -o main.exe main.go

	go env -w GOOS=windows
	go env -w GOARCH=amd64
```

不过这些还是太简单了，其实通过makefile更轻松的给程序注入元信息，进行其他的一些处理，比如下面是我自己经常用的一个makefile模板，做的处理就非常多了。

```makefile
# basic info
app := myapp
module := github.com/246859/makefile
# meta info
author = 246859
build_time := $(shell date +"%Y.%m%d.%H%M%S")
git_version := $(shell git tag --sort=-version:refname | sed -n 1p)

# build info
mode := debug
output := $(shell pwd)/bin
host_os := $(shell go env GOHOSTOS)
host_arch := $(shell go env GOHOSTARCH)
os := $(host_os)
arch := $(host_arch)
ldflags := $(nullstring)

# reduce binary size at release mode
ifeq ($(mode), release)
	ldflags += -s -w
endif

# inject meta info
ifneq ($(app), $(nullstring))
	ldflags += -X main.AppName=$(app)
endif
ifneq ($(author), $(nullstring))
	ldflags += -X main.Author=$(author)
endif
ifneq ($(build_time), $(nullstring))
	ldflags += -X main.BuildTime=$(build_time)
endif
ifneq ($(git_version), $(nullstring))
	ldflags += -X main.Version=$(git_version)
endif

# binary extension
exe = $(nullstring)
ifeq ($(os), windows)
	exe = .exe
endif

.PHONY: build
build:
	# go lint
	go vet ./...

	# prepare target environment $(os)/$(arch)
	go env -w GOOS=$(os)
	go env -w GOARCH=$(arch)

	# build go module
	go build -trimpath \
		-ldflags="$(ldflags)" \
		-o $(output)/$(app)-$(os)-$(arch)-$(mode)/$(app)$(exe) \
		$(module)

	# resume host environment $(host_os)/$(host_arch)
	go env -w GOOS=$(host_os)
	go env -w GOARCH=$(host_arch)
```

这个模板基本上满足大部分Go项目的需求了，假如说要多平台编译的话，还可以再加上下面这段

```makefile
# support platforms
windows := 386 amd64 arm64 arm
linux := 386 amd64 arm64 arm
darwin := amd64 arm64
platforms := windows linux darwin

.PHONY: build_all
build_all:
	@$(foreach os_i, $(platforms), \
		$(foreach arch_j, $(call $(os_i)), \
			$(shell $(MAKE) build os=$(os_i) arch=$(arch_j) mode=$(mode))))
```

通过双循环执行目标`build`，这样一来就可以将所有预定平台的二进制文件全部自动编译出来，完整版在这里[makefile | Github Gist](https://gist.github.com/246859/1a36cc805b96fb3cc164c70a1df9bee6)。