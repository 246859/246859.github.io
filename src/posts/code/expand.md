---
date: 2023-05-20
article: true
star: false
sticky: false
category:
  - 技术日志
tag:
  - linux
  - docker
  - devicemapper

---

# Docker容器磁盘热扩容

![](https://w.wallhaven.cc/full/9m/wallhaven-9mjoy1.png)



本文主要讲解Docker容器磁盘热扩容，不需要重启docker服务，也不需要重启容器

<!-- more -->
---
最近项目里的需求需要实现Docker容器的热扩容，前一阵子给Docker驱动换到了`devicemapper`，对容器的资源限制可以更加精确和友好，刚好记录一下整个过程。



## 环境准备

系统：ubuntu22.04LTS

Docker：24.00

Go版本：1.20.4

::: tip

在开始之前你需要确保Docker驱动是`devicemapper`，并且宿主机和Docker的文件系统是`ext4`

:::



## 查看容器大小

这里拿一个nginx容器做实验，先进入容器查看一下大小，一般在创建容器时若不指定默认大小为10G。

```sh
root@wyh-virtual-machine:/nginx/html# docker exec -it nginx /bin/bash
root@6b5a87478fce:/# df -HT
Filesystem                                                                                      Type   Size  Used Avail Use% Mounted on
/dev/mapper/docker-8:3-2097855-40ca4227a94fe9cd1dc00963961cc16c8fc0bd6d650e72cfc0c10bc34a9c08f6 ext4    11G  156M  9.8G   2% /
tmpfs                                                                                           tmpfs   68M     0   68M   0% /dev
shm                                                                                             tmpfs   68M     0   68M   0% /dev/shm
/dev/sda3                                                                                       ext4    63G   15G   46G  25% /etc/hosts
tmpfs                                                                                           tmpfs  8.4G     0  8.4G   0% /proc/asound
tmpfs                                                                                           tmpfs  8.4G     0  8.4G   0% /proc/acpi
tmpfs                                                                                           tmpfs  8.4G     0  8.4G   0% /proc/scsi
tmpfs 
```

可以看到rootfs的size是11G，并且文件系统类型是`ext4`，这里需要将`/dev/mapper/docker-8:3-2097855-40ca4227a94fe9cd1dc00963961cc16c8fc0bd6d650e72cfc0c10bc34a9c08f6`记下来，后续操作会用到。



## 准备扩容

这时回到宿主机，查看之前复制的文件系统名占用的磁盘扇区数

```sh
root@wyh-virtual-machine:/nginx/html# dmsetup table /dev/mapper/docker-8:3-2097855-40ca4227a94fe9cd1dc00963961cc16c8fc0bd6d650e72cfc0c10bc34a9c08f6
0 20971520 thin 253:2 23
```

 可以看到扇区数是从0到20971520，假设要扩容到20G，需要的扇区数就是`20*1024*1024*1024/512=41943040`，然后再修改表

```sh
root@wyh-virtual-machine:/nginx/html# echo 0 41943040 thin 253:2 23 | dmsetup load /dev/mapper/docker-8:3-2097855-40ca4227a94fe9cd1dc00963961cc16c8fc0bd6d650e72cfc0c10bc34a9c08f6
```

重载一下

```sh
root@wyh-virtual-machine:/nginx/html# dmsetup resume /dev/mapper/docker-8:3-2097855-40ca4227a94fe9cd1dc00963961cc16c8fc0bd6d650e72cfc0c10bc34a9c08f6
```

再次查看扇区数

```
root@wyh-virtual-machine:/nginx/html# dmsetup table /dev/mapper/docker-8:3-2097855-40ca4227a94fe9cd1dc00963961cc16c8fc0bd6d650e72cfc0c10bc34a9c08f6
0 41943040 thin 253:2 23
```

可以看到扇区已经变成了41943040，最后需要调整文件系统的大小

```sh
root@wyh-virtual-machine:/nginx/html# resize2fs /dev/mapper/docker-8:3-2097855-40ca4227a94fe9cd1dc00963961cc16c8fc0bd6d650e72cfc0c10bc34a9c08f6
resize2fs 1.46.5 (30-Dec-2021)
/dev/mapper/docker-8:3-2097855-40ca4227a94fe9cd1dc00963961cc16c8fc0bd6d650e72cfc0c10bc34a9c08f6 上的文件系统已被挂载于 /var/lib/docker/devicemapper/mnt/40ca4227a94fe9cd1dc00963961cc16c8fc0bd6d650e72cfc0c10bc34a9c08f6；需要进行在线调整大小
old_desc_blocks = 2, new_desc_blocks = 3
/dev/mapper/docker-8:3-2097855-40ca4227a94fe9cd1dc00963961cc16c8fc0bd6d650e72cfc0c10bc34a9c08f6 上的文件系统大小已经调整为 5242880 个块（每块 4k）。
```



## 确认大小

再次进入容器查看

```
root@wyh-virtual-machine:/nginx/html# docker exec -it nginx  /bin/bash
root@6b5a87478fce:/# df -HT
Filesystem                                                                                      Type   Size  Used Avail Use% Mounted on
/dev/mapper/docker-8:3-2097855-40ca4227a94fe9cd1dc00963961cc16c8fc0bd6d650e72cfc0c10bc34a9c08f6 ext4    22G  156M   20G   1% /
tmpfs                                                                                           tmpfs   68M     0   68M   0% /dev
shm                                                                                             tmpfs   68M     0   68M   0% /dev/shm
/dev/sda3                                                                                       ext4    63G   15G   46G  25% /etc/hosts
tmpfs                                                                                           tmpfs  8.4G     0  8.4G   0% /proc/asound
tmpfs                                                                                           tmpfs  8.4G     0  8.4G   0% /proc/acpi
tmpfs                                                                                           tmpfs  8.4G     0  8.4G   0% /proc/scsi
tmpfs                                                                                           tmpfs  8.4G     0  8.4G   0% /sys/firmware
```

可以看到确实变成了20G。





