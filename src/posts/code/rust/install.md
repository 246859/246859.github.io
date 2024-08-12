---
date: 2023-12-06
article: true
star: false
sticky: false
category:
  - rust
tag:
  - rust
  - rustup
  - 
---

# Rust安装

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202312061513880.png)
<!-- more -->
---
在这之前早已听说过rust的大名，虽然我在知乎上看到的rust貌似都是负面的评价？不过也看到了许多由Rust编写的工具，在了解到Rust的一些设计理念后，觉得有些方面做的要比Go好，就打算来试一试。

文档：[安装 Rust - Rust 程序设计语言 (rust-lang.org)](https://www.rust-lang.org/zh-CN/tools/install)

由于我现在使用的是windows系统，所以本文采用win的环境来进行演示，与Linux上的安装方式差别也不算太大。



## 安装

学习语言的第一步就是就是安装它，这一块rust做的确实挺好的，官网的中文支持也非常好，有一个专门负责语言自身的安装工具：rustup，所以我们只需要下载rustup就行了。

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202312061514947.png)

在此之前还需要下载MSVC也就是[Microsoft C++ 生成工具](https://visualstudio.microsoft.com/zh-hans/visual-cpp-build-tools/)，没有它的话就没法编译。

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202408102125583.png)

然后再下载rustup-init.exe，点击执行后是一个命令行，新手的话选默认安装即可，熟悉之后再自定义安装，然后它就会帮你安装好rust和cargo，并且配置环境变量。如果遇到下载缓慢问题，安装[镜像](#镜像)部分配置即可。

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202408102130005.png)

组件安装成功后，执行如下命令确认安装成功

```bash
$ rustc -V
rustc 1.80.1 (3f5fd8dd4 2024-08-06)

$ cargo -V
cargo 1.80.1 (376290515 2024-07-16)
```

能够正确输出版本就说明安装成功了。



## 镜像

在安装rustup以及用cargo安装依赖时，由于服务器在国外，避免不了下载速度缓慢的问题，这里建议使用字节跳动提供的rust镜像：[RsProxy](https://rsproxy.cn/)。

设置 Rustup 镜像， 修改配置 ~/.zshrc 或 ~/.bashrc

```bash
export RUSTUP_DIST_SERVER="https://rsproxy.cn"
export RUSTUP_UPDATE_ROOT="https://rsproxy.cn/rustup"
```

设置 crates.io 镜像， 修改配置 ~/.cargo/config.toml，已支持git协议和sparse协议，>=1.68 版本建议使用 sparse-index，速度更快。

```bash
[source.crates-io]
replace-with = 'rsproxy'
[source.rsproxy]
registry = "https://rsproxy.cn/crates.io-index"
[source.rsproxy-sparse]
registry = "sparse+https://rsproxy.cn/index/"
[registries.rsproxy]
index = "https://rsproxy.cn/crates.io-index"
[net]
git-fetch-with-cli = true
```



## 编辑器

这个就看个人喜好了，用什么其实都能写，neovim+cargo一样能写，毕竟rust自身的工具链很完善，不过我是windows系统，编辑器的话推荐vscode和rustover。

使用vscode的话要下载rust拓展，建议下载`rust-analyzer`，这是社区的rust插件，官方的已经不维护了。

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202312061524391.png)

如果是rustover的话基本上就是开箱即用。



## 工具链

rust安装后会下载一系列工具链，简单介绍以下

- cargo：rust包管理工具
- rustc：rust编译器
- clippy：静态代码优化工具
- rustfmt：代码格式化工具
- rust-std：标准库



## 项目

rust项目可以通过cargo工具来进行创建，rust项目分为两种类型

- bin：表示项目会被编译为二进制文件
- lib：表示项目是一个依赖库

默认创建bin类型的项目。

<br/>

在开发本地项目时，cargo编译模式分两种

- debug：编译优化少，速度快，生成的二进制文件运行性能低下，就是开发模式
- release：编译优化多，速度慢，生成的二进制文件性能高，也就是生产模式

默认情况下采用debug模式。



## Hello World

使用cargo创建一个新项目

```bash
$ cargo new rustlearn
```

编写hello world代码

```rust
fn main() {
    println!("hello world!")
}
```

编译并以debug模式运行

```bash
$ cargo run
   Compiling rustlearn v0.1.0 (D:\work\code\learn\rustlearn)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 1.04s
     Running `target\debug\rustlearn.exe`
hello world!

```

以release模式运行

```bash
$ cargo run --release
   Compiling rustlearn v0.1.0 (D:\work\code\learn\rustlearn)
    Finished `release` profile [optimized] target(s) in 0.15s                               
     Running `target\release\rustlearn.exe`
hello world!
```



## 评价

Rust的难度并没有像Go一样简单到可以看几个例子就学会语法，个人感觉有些地方设计的非常好，比如错误处理，泛型，枚举，并且依赖管理这方面做的也比Go好很多。它也确实能让人感觉到是一个现代化的语言，自带语言版本管理工具，完善的依赖管理，丰富的文档，跨平台支持良好，就目前带给我的体验而言，感觉没有什么可以抱怨的点。

