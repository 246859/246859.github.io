---
date: 2024-07-19
article: true
star: false
sticky: false
category:
  - 电脑装机
tag:
  - win10
  - reagentc
---
# Win10重置电脑-找不到恢复环境，需要重装介质

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202407191536182.png)

<!-- more -->
---
我的电脑一直以来都是用的win10，因为觉得win11华而不实，除了UI界面好看点外没什么用。最近因为软件和文件安装多了看着心烦，想要把win10重置以后重新分配空间，这样来的的清净些，当我把备份做好后，准备重置时就出现了下面的提示。

<img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202407191536373.png" style="zoom: 80%;" />

因为我以前重置过一次，所以记得自带的重置功能是不需要外部介质（U盘之类）的，不过我也是第一次遇到这种情况，于是写下本文当作一个记录。



## 问题

在网上查找了一下后，发现是因为`C:\\Recovery\\WindowsRE`文件缺失了，通过`reagentc`命令来查看重置软件的启用情况，如下所示。

```
PS C:\Windows\System32> reagentc /info
Windows 恢复环境(Windows RE)和系统初始化配置
信息:

    Windows RE 状态:           Disabled
    Windows RE 位置:
    引导配置数据(BCD)标识符:   d0351a75-4283-11ec-8797-04421ad29d45
    恢复映像位置:
    恢复映像索引:              0
    自定义映像位置:
    自定义映像索引:            0

REAGENTC.EXE: 操作成功。

PS C:\Windows\System32> reagentc /enable
REAGENTC.EXE: 未找到 Windows RE 映像。
```

在上面可以看到`Windows RE 位置`是空的，以及`reagentc /enable`启用失败，说明WindowsRE文件确实是缺失了。



## 解决

我们需要下载win10的ISO镜像，并从中获取`Winre.wim`文件，然后复制到电脑的对应位置，这里推荐用系统库下载[MSDN系统库－致力于原版windows生态服务 (xitongku.com)](https://www.xitongku.com/index.html)，微软目前不再提供ISO镜像下载了。

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202407191617009.png)

将镜像文件解压，目标文件在如下目录中

```
iso/sources/install.wim/windows/system32/recovery
```

得到文件后将其放入本机的`C:\\Recovery\\WindowsRE\\`目录下，然后通过命令行设置文件位置。

```
PS C:\Windows\System32> reagentc /setreimage /path C:\Recovery\WindowsRE
目录设置为: \\?\GLOBALROOT\device\harddisk0\partition3\Recovery\WindowsRE

REAGENTC.EXE: 操作成功。

PS C:\Windows\System32> reagentc /info
Windows 恢复环境(Windows RE)和系统初始化配置
信息:

    Windows RE 状态:           Disabled
    Windows RE 位置:
    引导配置数据(BCD)标识符:   d0351a75-4283-11ec-8797-04421ad29d45
    恢复映像位置:
    恢复映像索引:              0
    自定义映像位置:
    自定义映像索引:            0

REAGENTC.EXE: 操作成功。
```

然后再通过`reagentc /enable`命令启用即可。



### bitlocker

有时可能会出现这种情况

```
PS C:\Windows\System32> reagentc /enable
REAGENTC.EXE: 不能在启用了 BitLocker 驱动器加密的卷上启用 Windows RE。
```

`BitLocker`是驱动器加密的一种技术，在win10`设置 > 更新和安全 > 设备加密`中关闭即可。
