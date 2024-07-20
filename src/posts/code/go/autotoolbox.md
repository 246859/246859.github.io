---
date: 2022-10-23
article: true
star: true
sticky: false
category:
  - 技术日志
  - go
tag:
  - ToolBox
  - JetBrain
  - Golang
---
# AutoToolBox
![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/toolbox.png)

一个用Go编写的小工具 - Windows下ToolBox菜单自动生成器
<!-- more -->
---
## 简介

[youtrack问题链接](https://youtrack.jetbrains.com/issue/TBX-2540/Associate-file-extenstions-with-correct-Toolbox-app-or-with-the-Toolbox-itself-so-that-files-can-be-launched-from-Windows)

JetBrain旗下的ToolBox是一款方便管理IDE版本的工具软件，但是对于右键菜单打开项目的功能却迟迟不支持，但是在youtrack上的相关问题最早可以追溯到五年前。网上的大多数方法都是直接将对应IDE的`exe`文件路径写入注册表中，此种方法对于使用ToolBox的用户来说，更新和回退版本后就会导致原有的菜单失效，并且手动修改注册表也十分的繁琐。所幸的是，ToolBox提供了一个稳定的Shell脚本路径，通过将该路径下的脚本注册到注册表中，便可以实现右键菜单的功能。AutoToolBox做的就是根据正确的输入路径，生成两份Windows注册表脚本，直接点击脚本运行就可以修改注册表，由于该目录下的脚本是ToolBox维护的，所以不用担心更新和回退版本失效的问题。

项目地址：[246859/AutoToolBox: A simple tool that can automatically generate ToolBox registry scripts, only for Windows systems. (github.com)](https://github.com/246859/AutoToolBox)

## 脚本路径

首先你需要找到shell脚本路径，脚本路径可以在ToolBox的设置中直接查看，例如



![image-20230217210439344](https://github.com/246859/AutoToolBox/raw/main/assets/README/image-20230217210439344.png)

路径为

```sh
C:\Users\Stranger\AppData\Local\JetBrains\Toolbox\scripts
```

这个路径就是程序的输入路径

## 目录结构

```
dir
|
|---ico
|   |
|   |---idea.ico
|   |
|   |---goland.ico
|   |
|   |---toolbox.ico
|
|---idea.cmd
|
|---goland.cmd
```

在使用之前，先确保输入目录的结构如上，`ico`文件夹是图标文件夹，ToolBox不会自动创建该目录，需要用户自行创建然后去对应的IDE目录里面寻找对应的图标文件，需要注意的是`cmd`文件与`ico`文件名称要一致。

## 生成脚本

使用Github上最新的Relaese的二进制可执行文件，执行如下命令

```
./autotoolbox.exe -path "C:\Users\Stranger\AppData\Local\JetBrains\Toolbox\scripts"
```

最后会在目标目录下生成下面的文件夹

```
C:\Users\Stranger\AppData\Local\JetBrains\Toolbox\scripts\AutoToolBox
```

文件夹内有两个脚本：

- `toolboxAdd.reg` - 用于修改注册表，使用后将会添加到右键菜单中
- `toolboxRemove.reg` - 用于撤销对注册表的修改，使用后将会从右键菜单中删除已修改的项

[![image-20230217211635959](https://github.com/246859/AutoToolBox/raw/main/assets/README/image-20230217211635959.png)](https://github.com/246859/AutoToolBox/blob/main/assets/README/image-20230217211635959.png)

在Windows系统下`reg`脚本可以直接点击执行，当你看到如下输出时，说明执行成功。

```
[TIP]   reg files has been successfully generated in the directory C:\Users\Stranger\AppData\Local\JetBrains\Toolbox\scripts\AutoToolBox
```

## 效果

最终效果是无论右键文件夹或是右键点击文件夹背景都可以看到如下类似的菜单

![image-20230217212654787](https://github.com/246859/AutoToolBox/raw/main/assets/README/image-20230217212654787.png)
