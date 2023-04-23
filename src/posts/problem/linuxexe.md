---
date: 2023-04-08
article: true
star: false
sticky: false
category:
  - 问题记录
tag:
  - linux
  - 可执行文件
  - 
---
# 64位Ubuntu上运行32位可执行文件

记录64位Ubuntu上运行32位可执行文件的问题

<!-- more -->
---

最近在捣鼓Steamcmd开游戏专用服务器，下载下来的tar包中，解压出来的steamcmd可执行文件是32位的，命令如下


```sh
$ file steamcmd
steamcmd: ELF 32-bit LSB shared object, Intel 80386, version 1 (SYSV), dynamically linked, interpreter /lib/ld-linux.so.2, for GNU/Linux 2.6.24, BuildID[sha1]=230b2c1359fbcc9d738427efc5a5c31a69a4d16b, not stripped
```

当时的使用系统uname如下

```sh
$ uname -a
Linux VM-16-3-ubuntu 5.4.0-96-generic #109-Ubuntu SMP Wed Jan 12 16:49:16 UTC 2022 x86_64 x86_64 x86_64 GNU/Linux
```

64位系统是无法直接运行32位可执行文件的，最开始半天不知道怎么回事，一直报`No such file and directory`，发现问题后下载32位依赖运行库即可

```sh
$ apt install lib32z1
```

下载完成后即可正常运行。
