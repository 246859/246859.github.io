---
date: 2024-07-19
article: true
star: false
sticky: false
category:
  - Windows
tag:
  - win10
  - reagentc
---
# Win10重置电脑

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

提取ISO中的目标文件

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



### 无恢复分区

有一种情况是，电脑没有恢复分区时，重启后的蓝屏界面将不会有重置电脑的选项，如下图。

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202407191734992.png)

首先需要确保电脑是否有恢复分区，下图中是我电脑上的分区情况，如果没有的话就需要手动创建，否则无法正常进行重置操作。

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202407191734024.png)

恢复分区最好是和C盘在一个磁盘中，且在C盘前后，空间大小要求400MB左右，我这里给足空间直接设置了2GB（或许以后会有更新，所以预留足够的空间），NTFS，并且不需要卷标，其它全部默认设置。待分区创建完毕后就需要将其进行配置。

首先禁用恢复设置，这里必须先禁用否则后续的设置不会生效

```
reagentc /disable
```

通过`reagentc`命令重新指定WindowsRE文件位置，记得将`Winre.wim`文件移动新分区中的对应位置。

```
reagentc /setreimage /path L:\Recovery\WindowsRE\Winre.wim
```

然后再重新启用

```
reagentc /enable
```

设置完毕后，通过`diskpart`对恢复分区进行配置，首先通过`list disk`命令列出所有的磁盘

```
DISKPART> list disk

  磁盘 ###  状态           大小     可用     Dyn  Gpt
  --------  -------------  -------  -------  ---  ---
  磁盘 0    联机              476 GB  2048 KB        *
```

然后执行命令`sel disk`选中恢复分区所在磁盘，这里我只有一个所以就选中磁盘0，

```
DISKPART> sel disk 0

磁盘 0 现在是所选磁盘。
```

然后用`list part`列出该磁盘中所有的分区

```
DISKPART> list part

  分区 ###       类型              大小     偏移量
  -------------  ----------------  -------  -------
  分区      1    系统                 260 MB  1024 KB
  分区      2    保留                  16 MB   261 MB
  分区      3    主要                 151 GB   277 MB
  分区      5    主要                2047 MB   151 GB
  分区      4    主要                 322 GB   153 GB
```

然后选择该分区

```
DISKPART> sel part 5

分区 5 现在是所选分区。
```

分区5的大小是2047MB也就是恢复分区，接下来通过修改分区ID来将其标记为恢复分区，windows下恢复分区的ID是

```
de94bba4-06d1-4d40-a16a-bfd50179d6ac
```

执行如下命令设置ID即可

```
DISKPART> set id = de94bba4-06d1-4d40-a16a-bfd50179d6ac
```

然后设置属性

```
DISKPART> gpt attributes=0x8000000000000001

DiskPart 成功地将属性分配给选择的 GPT 分区。
```

最后一定要退出，不然不会生效。

```
DISKPART> exit

退出 DiskPart...
```

此时重新打开磁盘管理工具就会显示恢复分区了。

重新创建后的恢复分区会在资源管理中可见，如果想临时隐藏可以通过如下命令来临时删掉盘符

```
DISKPART> remove
```

倘若要永久隐藏的话可以修改其属性即可

```
DISKPART> gpt attributes=0xC000000000000001
```

