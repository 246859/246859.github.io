---
date: 2023-09-25
article: true
star: false
sticky: false
category:
  - 技术日志
tag:
  - k8s
  - containerd
---

#  在Linux上搭建K8s集群

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202309251850239.png)



最近捣鼓了下用虚拟机搭建k8s集群，坑还是挺多的。

<!-- more -->
---

![](https://d33wubrfki0l68.cloudfront.net/2475489eaf20163ec0f54ddc1d92aa8d4c87c96b/e7c81/images/docs/components-of-kubernetes.svg)

最近在学习k8s，不得不说这玩意运行起来还是相当的麻烦，这里记录一下，以免后面忘了。事先准备好三台ubuntu22.04虚拟机，一台用作control plane，两台用作worker node。



## 前置准备

在开始安装k8s之前，需要做一些前置的准备。



### 关闭firewalld

k8s有着自己的网络策略配置功能，关闭friewalld是为了避免起冲突。

```sh
# 查看状态
$ ufw status
# 禁用
$ ufw disable
```



### 禁用selinux

selinux是linux的一个安全子系统，很多服务器未为了避免麻烦都会把它关了，ubuntu在装机的时候不会自带这玩意，但如果你装了的话可以按照下面的步骤关闭。

```sh
# 临时关闭
$ setenforce 0
# 永久关闭
$ vim /etc/selinux/config
SELINUX=disabled
```



### 关闭swap

kubelet运行时明确不支持swap，也就是交换内存，一部分原因是想让程序在内存耗尽以后正常OOM而不是一直靠swap苟着从而造成不必要的损失。如果未关闭swap直接启动的话，kubelet在启动时会显示如下信息告诉你应该关闭swap，否则不让你启动。

```
"command failed" err="failed to run Kubelet: running with swap on is not supported, please disable swap! or set --fail-swap-on flag to false. /proc/swaps contained: [Filename\t\t\t\tType\t\tSize\t\tUsed\t\tPriority /swapfile
```

 首先执行命令关闭交换分区

```sh
$ swapoff -a
```

然后修改`fstab`文件

```sh
$ vim /etc/fstab
```

注释掉如下行

```
# /swapfile                                 none            swap    sw              0       0
```

执行如下命令查看swap分区情况，如果关闭了的话就不会有任何显示

```sh
swapon -show
```



### 配置网络

转发 IPv4 并让 iptables 看到桥接流量

```sh
$ cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF

$ sudo modprobe overlay
$ sudo modprobe br_netfilter

# 设置所需的 sysctl 参数，参数在重新启动后保持不变
$ cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward                 = 1
EOF

# 应用 sysctl 参数而不重新启动
$ sudo sysctl --system
```

通过运行以下指令确认 `br_netfilter` 和 `overlay` 模块被加载：

```bash
$ lsmod | grep br_netfilter
$ lsmod | grep overlay
```

通过运行以下指令确认 `net.bridge.bridge-nf-call-iptables`、`net.bridge.bridge-nf-call-ip6tables` 和 `net.ipv4.ip_forward` 系统变量在你的 `sysctl` 配置中被设置为 1

```bash
$ sysctl net.bridge.bridge-nf-call-iptables net.bridge.bridge-nf-call-ip6tables net.ipv4.ip_forward
```







## CRI

Container Runtime Interface（CRI），即容器运行时接口，要想使用K8s的话，需要系统提供CRI，目前实现了CRI的软件的有

- containerd，推荐用这个，比较轻量。
- docker engine，并没有实现CRI但是可以通过其它方法桥接，不过一般安装了docker engine的系统都会有containerd，因为containerd就是docker的一部分，所以还是建议用containerd。
- CRI-O
- MCR

### containerd

下面会用containerd来做演示，其实containerd安装过程就是docker安装过程，先设置docker官方的apt仓库

```sh
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Add the repository to Apt sources:
echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get updat
```

最后就只安装containerd.io，不用安装dcoker-ce和docker-cli。

```sh
sudo apt-get install containerd.io
```

或者你也可以直接下载containerd的二进制文件，它也是用go写的。在安装好后，需要配置systemd cgroup驱动，在containerd配置文件中

```
/etc/containerd/config.toml
```

修改如下的配置项

```toml
[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]
    SystemdCgroup = true
```

::: tip

使用如下命令可以重置containerd配置

```sh
$ containerd config default > /etc/containerd/config.toml
```

:::

从软件包安装的话可能会默认禁用CRI，在配置文件中可能会看到这么一行，将其去掉就行。

```toml
disabled_plugins = ["CRI"]
```

修改完后重启containerd

```sh
sudo systemctl restart containerd
```



## 安装

配置下k8s的阿里云apt源

```sh
$ echo "deb https://mirrors.aliyun.com/kubernetes/apt kubernetes-xenial main" >> /etc/apt/sources.list
```

更新证书

```sh
$ curl https://mirrors.aliyun.com/kubernetes/apt/doc/apt-key.gpg | sudo apt-key add
```

再更新源

```sh
$ sudo apt update
```

最后安装`kubeadm`，`kubectl`，`kubelet`，这三个最好软件版本保持一致。

```sh
$ sudo apt-get install kubeadm kubelet kubectl
```

完成后确认版本

```sh
$ kubelet --version
Kubernetes v1.28.2
$ kubeadm version
kubeadm version: &version.Info{Major:"1", Minor:"28", GitVersion:"v1.28.2", GitCommit:"89a4ea3e1e4ddd7f7572286090359983e0387b2f", GitTreeState:"clean", BuildDate:"2023-09-13T09:34:32Z", GoVersion:"go1.20.8", Compiler:"gc", Platform:"linux/amd64"}
$ kubectl version
Client Version: v1.28.2
Kustomize Version: v5.0.4-0.20230601165947-6ce0bf390ce3
The connection to the server localhost:8080 was refused - did you specify the right host or port?
```

确认版本一致后，看看k8s的镜像，后续必须pull这些镜像，因为这是k8s集群运行的必要组件。

```sh
$ kubeadm config images list
registry.k8s.io/kube-apiserver:v1.28.2
registry.k8s.io/kube-controller-manager:v1.28.2
registry.k8s.io/kube-scheduler:v1.28.2
registry.k8s.io/kube-proxy:v1.28.2
registry.k8s.io/pause:3.9
registry.k8s.io/etcd:3.5.9-0
registry.k8s.io/coredns/coredns:v1.10.1
```

到目前为止，系统上会有下面这几个东西

- `kebuadm`，用来快速启动和搭建k8s集群的工具，可以省去我们很多操作。
- `kubelet`，k8s集群命令行管理工具
- `kubelet`，代表着一个节点，是k8s集群的基本单位。
- `crictl`，容器运行时管理工具，只不过它是为k8s工作的，正确使用的前提是系统上安装了支持CRI的软件并正确指定了endpoint。
- `ctr`，ctr是containerd的命令管理工具，containerd实现了CRI。



### cri endpoint

ctrctl虽然是容器运行时管理工具，但是它并没有具体的实现，只是定义了一组接口规范。要想正常工作还得依赖具体的实现了CRI的软件，之前已经安装好了containerd，所以运行前要先指定crictl的`runtime-endpoint`，也就是containerd的sock地址。

通过查看配置文件`etc/containerd/config.toml`可以得知

```toml
[grpc]
  address = "/run/containerd/containerd.sock"
  gid = 0
  max_recv_message_size = 16777216
  max_send_message_size = 16777216
  tcp_address = ""
  tcp_tls_ca = ""
  tcp_tls_cert = ""
  tcp_tls_key = ""
  uid = 0
```

那么endpoint就是

```
unix:///run/containerd/containerd.sock
```

所以执行如下命令配置crictl

```
sudo crictl config runtime-endpoint unix:///run/containerd/containerd.sock
```



### 拉镜像

kubeadm支持通过命令预先拉取需要用到的组件镜像，也就是之前list出来的镜像，执行如下命令就可以预先拉取要用到的镜像。

```sh
$ kubeadm config images pull
```

但是不出意外的话，意外就会发生了，上述的镜像仓库是`registry.k8s.io`，是由谷歌托管的，国内基本上没法访问，甚至于在线获取版本信息都不行

```
W0927 19:34:16.513175    4571 version.go:104] could not fetch a Kubernetes version from the internet: unable to get URL "https://dl.k8s.io/release/stable-1.txt": Get "https://cdn.dl.k8s.io/release/stable-1.txt": context deadline exceeded (Client.Timeout exceeded while awaiting headers)
W0927 19:34:16.513428    4571 version.go:105] falling back to the local client version: v1.28.2
```

解决方法就是国内的镜像，阿里云有一个镜像仓库，地址如下

```
registry.aliyuncs.com/google_containers
```

网上有很多教程直接在`kubeadm init`时直接指定了阿里云镜像仓库，这样会导致kubelet没法正常运行，会说找不到组件的镜像，因为kubelet运行的时候只认`registry.k8s.io`镜像，而通过阿里云镜像仓库拉下来的镜像的前缀是`registry.aliyuncs.com/google_containers`，所以kubelet自然就没法启动了。所以对应的，拉取完下面的镜像后，应该将其名字改回去。

```
registry.aliyuncs.com/google_containers/kube-apiserver:v1.28.2
registry.aliyuncs.com/google_containers/kube-controller-manager:v1.28.2
registry.aliyuncs.com/google_containers/kube-scheduler:v1.28.2
registry.aliyuncs.com/google_containers/kube-proxy:v1.28.2
registry.aliyuncs.com/google_containers/pause:3.9
registry.aliyuncs.com/google_containers/etcd:3.5.9-0
registry.aliyuncs.com/google_containers/coredns/coredns:v1.10.1
```

crictl并不能修改镜像名，这是ctr应该干的事情，为了能够查看到k8s的镜像，指定命名空间`k8s.io`

```sh
$ sudo ctr -n k8s.io images ls
```

一个个改名太麻烦了，所以我写了一个脚本，来自动化完成这个过程。

```sh
#!/bin/bash
aliyun="registry.aliyuncs.com/google_containers"
k8sio="registry.k8s.io"
echo "pulling needed k8s images from $aliyun"
kubeadm config images pull --image-repository "$aliyun"
echo "compare local with $k8sio"
# list all kubeadm needs images
for i in $(kubeadm config images list); do
    # get suffxi images name
	imagename=${i##*/}
    # concat new name
	aliimage="$aliyun/$imagename"
	echo "[rename] $aliimage >>>> $i"
    # rename registry to k8s.io
	ctr -n k8s.io i tag "$aliimage" "$i"
	echo "[remove] aliyun image $aliimage"
    # remove aliyun images
	ctr -n k8s.io i rm "$aliimage"
done;
```

或者也可以

```sh
$ curl https://raw.githubusercontent.com/246859/shell/main/k8s/aliyun_images_pull.sh | bash
```



### 初始化

接下来使用kubeadm来初始化，这个操作只用在master节点进行。init时有很多参数，开始前可以看看命令帮助。

```sh
$ kubeadm init -h
Usage:
  kubeadm init [flags]
  kubeadm init [command]

Available Commands:
  phase       Use this command to invoke single phase of the init workflow

Flags:
      --apiserver-advertise-address string   The IP address the API Server will advertise it's listening on. If not set the default network interface will be used.
      --apiserver-bind-port int32            Port for the API Server to bind to. (default 6443)
      --apiserver-cert-extra-sans strings    Optional extra Subject Alternative Names (SANs) to use for the API Server serving certificate. Can be both IP addresses and DNS names.
      --cert-dir string                      The path where to save and store the certificates. (default "/etc/kubernetes/pki")
      --certificate-key string               Key used to encrypt the control-plane certificates in the kubeadm-certs Secret.
      --config string                        Path to a kubeadm configuration file.
      --control-plane-endpoint string        Specify a stable IP address or DNS name for the control plane.
      --cri-socket string                    Path to the CRI socket to connect. If empty kubeadm will try to auto-detect this value; use this option only if you have more than one CRI installed or if you have non-standard CRI socket.
      --dry-run                              Don't apply any changes; just output what would be done.
      --feature-gates string                 A set of key=value pairs that describe feature gates for various features. Options are:
                                             EtcdLearnerMode=true|false (ALPHA - default=false)
                                             PublicKeysECDSA=true|false (ALPHA - default=false)
                                             RootlessControlPlane=true|false (ALPHA - default=false)
                                             UpgradeAddonsBeforeControlPlane=true|false (DEPRECATED - default=false)
...
...
```

接下来就开始初始化，如果上面的配置都做好了的话，是不会出现问题的。

```sh
$ sudo kubeadm init \
--apiserver-advertise-address=192.168.48.138 \
--image-repository=registry.aliyuncs.com/google_containers
```

