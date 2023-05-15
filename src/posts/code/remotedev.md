---
date: 2023-05-15
article: true
star: false
sticky: false
category:
  - 技术日志
tag:
  - goland
  - dlv
  - 远程开发

---

# Goland远程开发与远程调试

![](https://w.wallhaven.cc/full/j3/wallhaven-j35ev5.jpg)



本文讲解了如何使用Goland的远程开发和远程调试功能
<!-- more -->
---
最近的一个项目是要部署在Linux上运行，但我习惯了在Windows上进行开发，许多开发工具都是在Windows上，所以远程开发和远程调试非常有必要，代码依旧在本地写，只是编译和部署放在Linux上。先说一下我的环境：

本地环境：Windows10，go1.20.2 dlv1.20.2

远程环境：ubuntu20LTS（虚拟机），go1.20.4，dlv1.20.2



::: tip

虽然本文Linux用的是虚拟机，但是放在云服务器上一样使用。

:::

## Go Build 配置

首先在Goland运行配置里新建一个Go Build配置，然后选择Run On SSH

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202305151710958.png)

输入Host和要登录的用户名

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202305151711615.png)

登录成功后Goland会尝试执行`which go`命令，也许会失败，不过这并不影响，后面自己指定就行。再然后才是远程开发的重要配置

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202305151714447.png)

- `Project path on target`：该目录是后续操作的项目根目录，后续Goland自动上传的文件都会位于该目录下
- `Go Executable`：go二进制文件，该二进制文件并不是自己项目的二进制文件，而是go源代码的二进制文件，通常位于`$GOROOT/bin/`目录下
- `GOPATH`：不需要多做解释
- `Project sources directory`：Goland在编译时会先将源码上传到远程服务器上，该目录就是源码的指定位置，如果不填的话就会在项目根目录下随机生成目录，看起来很烦。
- `Compiled exectuables directory`：编译完成后二进制文件存放的文件夹。

完成后如下

![image-20230515172036551](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202305151720594.png)



然后再Go Build中记得勾选 `Build on remote target`，这样上面的配置才会生效

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202305151723033.png)

## Go Remote配置

在运行配置中新建Go Remote

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202305151725871.png)

然后填写你的调试服务器IP和端口

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202305151725949.png)

调试服务器就是dlv，如果在远程服务器中已经安装好了go环境，直接执行以下命令即可安装dlv

```
go install github.com/go-delve/delve/cmd/dlv@latest
```

使用dlv命令运行调试服务器

```
dlv --listen=:2345 --headless=true --api-version=2 --accept-multiclient exec ./dst_linux
```

每一个参数是什么作用可以在github上了解，exec参数后跟二进制文件的路径

## 开发流程

上述所有配置完毕后，开发流程就是：

1. 本地编写代码
2. Goland更新远程服务器的源代码并编译
3. 运行dlv调试服务器
4. 本地运行Go Remote进行调试

这样一来远程开发和远程调试的问题就都解决了，非常nice，远程调试起来也跟本地调试几乎没什么区别。