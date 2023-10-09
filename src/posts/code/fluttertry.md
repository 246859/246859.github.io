---
date: 2023-07-29
article: true
star: false
sticky: false
category:
  - 技术日志
tag:
  - flutter
  - dart
  - 
---
# Flutter在windows桌面软件开发
![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202307291114364.png)
<!-- more -->
---
最近打算试一试桌面软件的开发，苦于没有QT基础，并且go的GUI生态太拉跨了。后来在网上了解到Flutter，现在已经可以稳定开发windows桌面软件了，结合Dart进行开发，而且性能相当的可以，于是本文记录一下flutter的尝试。

Flutter官网：[Flutter: 为所有屏幕创造精彩 - Flutter 中文开发者网站 - Flutter](https://flutter.cn/)

Flutter文档：[Flutter 开发文档 - Flutter 中文文档 - Flutter 中文开发者网站 - Flutter](https://flutter.cn/docs)

Flutter安装：[安装和环境配置 - Flutter 中文文档 - Flutter 中文开发者网站 - Flutter](https://flutter.cn/docs/get-started/install)

## 安装

第一件事是下载flutter，由于是谷歌开源的，部分网页需要魔法上网。

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202307291155426.png)

下载下来后就是一个压缩包，Flutter SDK是包含了完整的Dart SDK，解压到自己想要的位置后将bin目录添加到系统变量中。



## 换源

安装完成后，需要配置一下镜像源，因为flutter服务需要下载一些东西，默认配置的话国内网络多半是下载不了的。

清华源：[flutter | 镜像站使用帮助 | 清华大学开源软件镜像站 | Tsinghua Open Source Mirror](https://mirrors.tuna.tsinghua.edu.cn/help/flutter/)

可以使用清华镜像源，将以下几个替换掉

```
// flutter sdk镜像
setx FLUTTER_GIT_URL "https://mirrors.tuna.tsinghua.edu.cn/git/flutter-sdk.git"

// dart 包镜像
setx PUB_HOSTED_URL "https://mirrors.tuna.tsinghua.edu.cn/dart-pub"

// flutter镜像
setx FLUTTER_STORAGE_BASE_URL "https://mirrors.tuna.tsinghua.edu.cn/flutter"
```

或者也可以手动去设置上面三个环境变量。

::: tip

其他一些可用的镜像站点：[在中国网络环境下使用 Flutter - Flutter 中文文档 - Flutter 中文开发者网站 - Flutter](https://flutter.cn/community/china#社区运行的镜像站点)

:::



## 检查依赖

Flutter的跨平台构建应用是需要依赖其他的一些软件的，windows桌面软件开发需要依赖微软的vs，app的话需要Android Studio，这里只安装vs。

vs安装：[安装 Visual Studio | Microsoft Learn](https://learn.microsoft.com/zh-cn/visualstudio/install/install-visual-studio?view=vs-2022)

vs安装好后，执行

```
flutter doctor
```

```
PS D:\WorkSpace\Library\flutter> flutter doctor
Flutter assets will be downloaded from https://mirrors.tuna.tsinghua.edu.cn/flutter. Make sure you trust this source!
Doctor summary (to see all details, run flutter doctor -v):
[!] Flutter (Channel stable, 3.10.6, on Microsoft Windows [版本 10.0.19045.3208], locale zh-CN)
    ! Upstream repository https://github.com/flutter/flutter.git is not the same as FLUTTER_GIT_URL
[✓] Windows Version (Installed version of Windows is version 10 or higher)
[✗] Android toolchain - develop for Android devices
    ✗ Unable to locate Android SDK.
      Install Android Studio from: https://developer.android.com/studio/index.html
      On first launch it will assist you in installing the Android SDK components.
      (or visit https://flutter.dev/docs/get-started/install/windows#android-setup for detailed instructions).
      If the Android SDK has been installed to a custom location, please use
      `flutter config --android-sdk` to update to that location.

[✓] Chrome - develop for the web
[✓] Visual Studio - develop for Windows (Visual Studio Community 2022 17.6.5)
[!] Android Studio (not installed)
[✓] IntelliJ IDEA Ultimate Edition (version 2022.3)
[✓] Connected device (3 available)
[!] Network resources
    ✗ A network error occurred while checking "https://github.com/": 信号灯超时时间已到


! Doctor found issues in 4 categories.
```

可以看到我并没有安装安卓工具链，这里安装的是最新版flutter 3.10.6，正式版从2.0开始就稳定支持windows了。



## Hello World

使用命令创建项目，过程中需要下载东西，要等一会儿，如果前面的镜像配置好了的话是不需要等多久的。

```
flutter create flutter_learn
```

然后运行demo

```
flutter run
```

选择要运行的类型

```
Connected devices:
Windows (desktop) • windows • windows-x64    • Microsoft Windows [版本 10.0.19045.3208]
Chrome (web)      • chrome  • web-javascript • Google Chrome 115.0.5790.110
Edge (web)        • edge    • web-javascript • Microsoft Edge 115.0.1901.183
[1]: Windows (windows)
[2]: Chrome (chrome)
[3]: Edge (edge)
```

这里有web和windows可选，都可以试一试

![windows桌面软件](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202307291234496.png)

![web](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202307291235487.png)

## 体验

整个过程的初体验还是很不错的，没有深入了解的情况下不太好评价其他地方。在打开web的时候发现整个界面不是传统的html元素，相当于是flutter自己渲染的一套canvas，只能说有点东西。

![](https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202307291238083.png)

等到后面学习的足够深入了再回头做一个系统点的评价。