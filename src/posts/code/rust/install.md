---
date: 2023-12-06
article: true
star: false
sticky: false
category:
  - rust
tag:
  - rust
  - 
  - 
---

# Rust安装与入门

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202312061513880.png)
<!-- more -->
---
在这之前早已听说过rust的大名，虽然我在知乎上看到的rust貌似都是负面的评价？但这不影响我去了解这门比较热门的新语言，貌似2015年才正式发布。以前就听说过rust的学习难度非常陡峭，现在就来会一会。

文档：[安装 Rust - Rust 程序设计语言 (rust-lang.org)](https://www.rust-lang.org/zh-CN/tools/install)



## 准备环境

学习语言的第一步就是就是安装它，这一块rust做的确实挺好的，有一个专门的安装和版本管理工具rustup，所以我们只需要下载rustup就行了。

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202312061514947.png)

在此之前还需要下载MSVC也就是[Microsoft C++ 生成工具](https://visualstudio.microsoft.com/zh-hans/visual-cpp-build-tools/)，没有它的话就没法编译。然后再下载rustup-init.exe，点击执行后是一个命令行，全选默认选项即可，然后它就会帮你安装好rust和cargo，并且配置环境变量。重启一下命令行，执行

```sh
PS C:\Users\Stranger> rustc -V
rustc 1.74.0 (79e9716c9 2023-11-13)
PS C:\Users\Stranger> cargo -V
cargo 1.74.0 (ecb9851af 2023-10-18)
PS C:\Users\Stranger>
```

能够正确输出版本就说明安装成功了。



## 编辑器

这个就看个人喜好了，用什么其实都能写，推荐使用Vscode，JB家新出了一个RustOver，但是还不稳定。使用vscode的话要下载rust拓展，建议下载`rust-analyzer`，这是社区的rust插件，官方的已经不维护了。

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202312061524391.png)



## cargo

cargo是rust的包管理工具，相当于gomod，npm这类工具，但是要完善的许多。