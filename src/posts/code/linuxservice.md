---
date: 2023-01-28
article: true
star: false
sticky: false
category:
  - 技术日志
tag:
  - linux
  - service
  -
---

# ubuntu自定义系统服务

![](https://w.wallhaven.cc/full/kx/wallhaven-kx36mq.png)


<!-- more -->
---
在开发项目时，对于一些后台应用，可以自定义成linux的service，这样能够更加方便的管理。

首先在`/etc/systemd/system`下，创建一个`xxx.service`的文件，`xxx`是服务名。

service文件有特殊的配置格式，下面是一个简单的例子

```txt
[Unit]
Description=dstm daemon
# 依赖docker服务
Requires=docker.service
# 必须在docker服务成功启动后再启动
After=docker.service

[Service]
Type=forking
# 总是重启，开机自启
Restart=always

# 重启等待时间
RestartSec=2s
# 启动超时时间
TimeoutStartSec=10s
# 停止超时时间
TimeoutStopSec=10s
# 停止方式，仅杀死服务应用程序
KillMode=process

# 提示消息
ExecStartPre=/bin/echo "starting dstm daemon"
ExecStartPost=/bin/echo "dstm daemon started done"
ExecStopPost=/bin/echo "stop dstm daemon done"

# 服务启动命令，这里填写具体部署时应用执行文件的绝对路径
ExecStart=/root/hello
# 服务关闭命令
ExecStop=/bin/kill -SIGINT $MAINPID
# 服务重启命令
ExecReload=/bin/bash -c "/bin/kill -SIGINT $MAINPID && /root/hello"

[Install]
# 多用户情况下
WantedBy=multi-user.target
# 别名
Alias=hello.service
```

其中`type`有以下几种取值

- Type=simple：默认值，执行ExecStart指定的命令，启动主进程

- Type=forking：以 fork 方式从父进程创建子进程，创建后父进程会立即退出

- Type=oneshot：一次性进程，Systemd 会等当前服务退出，再继续往下执行

- Type=dbus：当前服务通过D-Bus启动

- Type=notify：当前服务启动完毕，会通知Systemd，再继续往下执行

- Type=idle：若有其他任务执行完毕，当前服务才会运行，即后台运行

    

Restart：定义了退出后，Systemd 的重启方式。可以设置的值如下：

- no（默认值）：退出后不会重启；

- on-success：当进程正常退出时（退出状态码为0），才会重启；

- on-failure：当进程非正常退出时(退出状态码非0)，包括被信号终止和超时，才会重启；

- on-abnormal：当被信号终止和超时，才会重启；

- on-abort：当收到没有捕捉到的信号终止时，才会重启；

- on-watchdog：看门狗超时退出，才会重启；

- always：总是重启。



KillMode：定义 Systemd 如何停止服务，可以设置的值如下：

- control-group（默认值）：当前控制组里面的所有子进程，都会被杀掉；

- process：只杀主进程；

- mixed：主进程将收到 SIGTERM 信号，子进程收到 SIGKILL 信号；

- none：没有进程会被杀掉。



创建完成后，执行命令重新加载服务文件

```sh
systemctl daemon-reload
```

随后使用`service hello service ` 即可开启

