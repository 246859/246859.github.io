import{_ as s,W as l,X as d,Y as a,Z as e,$ as t,a0 as n,a1 as r,C as o}from"./framework-a4c02b8f.js";const u={},c=e("h1",{id:"flutter在windows桌面软件开发",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#flutter在windows桌面软件开发","aria-hidden":"true"},"#"),t(" Flutter在windows桌面软件开发")],-1),v=e("figure",null,[e("img",{src:"https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202307291114364.png",alt:"",tabindex:"0",loading:"lazy"}),e("figcaption")],-1),h=e("hr",null,null,-1),m=e("p",null,"最近打算试一试桌面软件的开发，苦于没有QT基础，并且go的GUI生态太拉跨了。后来在网上了解到Flutter，现在已经可以稳定开发windows桌面软件了，结合Dart进行开发，而且性能相当的可以，于是本文记录一下flutter的尝试。",-1),p={href:"https://flutter.cn/",target:"_blank",rel:"noopener noreferrer"},g={href:"https://flutter.cn/docs",target:"_blank",rel:"noopener noreferrer"},b={href:"https://flutter.cn/docs/get-started/install",target:"_blank",rel:"noopener noreferrer"},f=r('<h2 id="安装" tabindex="-1"><a class="header-anchor" href="#安装" aria-hidden="true">#</a> 安装</h2><p>第一件事是下载flutter，由于是谷歌开源的，部分网页需要魔法上网。</p><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202307291155426.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>下载下来后就是一个压缩包，Flutter SDK是包含了完整的Dart SDK，解压到自己想要的位置后将bin目录添加到系统变量中。</p><h2 id="换源" tabindex="-1"><a class="header-anchor" href="#换源" aria-hidden="true">#</a> 换源</h2><p>安装完成后，需要配置一下镜像源，因为flutter服务需要下载一些东西，默认配置的话国内网络多半是下载不了的。</p>',6),_={href:"https://mirrors.tuna.tsinghua.edu.cn/help/flutter/",target:"_blank",rel:"noopener noreferrer"},w=r(`<p>可以使用清华镜像源，将以下几个替换掉</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>// flutter sdk镜像
setx FLUTTER_GIT_URL &quot;https://mirrors.tuna.tsinghua.edu.cn/git/flutter-sdk.git&quot;

// dart 包镜像
setx PUB_HOSTED_URL &quot;https://mirrors.tuna.tsinghua.edu.cn/dart-pub&quot;

// flutter镜像
setx FLUTTER_STORAGE_BASE_URL &quot;https://mirrors.tuna.tsinghua.edu.cn/flutter&quot;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>或者也可以手动去设置上面三个环境变量。</p>`,3),x={class:"hint-container tip"},F=e("p",{class:"hint-container-title"},"提示",-1),E={href:"https://flutter.cn/community/china#%E7%A4%BE%E5%8C%BA%E8%BF%90%E8%A1%8C%E7%9A%84%E9%95%9C%E5%83%8F%E7%AB%99%E7%82%B9",target:"_blank",rel:"noopener noreferrer"},k=e("h2",{id:"检查依赖",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#检查依赖","aria-hidden":"true"},"#"),t(" 检查依赖")],-1),y=e("p",null,"Flutter的跨平台构建应用是需要依赖其他的一些软件的，windows桌面软件开发需要依赖微软的vs，app的话需要Android Studio，这里只安装vs。",-1),q={href:"https://learn.microsoft.com/zh-cn/visualstudio/install/install-visual-studio?view=vs-2022",target:"_blank",rel:"noopener noreferrer"},S=r(`<p>vs安装好后，执行</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>flutter doctor
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>PS D:\\WorkSpace\\Library\\flutter&gt; flutter doctor
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
      \`flutter config --android-sdk\` to update to that location.

[✓] Chrome - develop for the web
[✓] Visual Studio - develop for Windows (Visual Studio Community 2022 17.6.5)
[!] Android Studio (not installed)
[✓] IntelliJ IDEA Ultimate Edition (version 2022.3)
[✓] Connected device (3 available)
[!] Network resources
    ✗ A network error occurred while checking &quot;https://github.com/&quot;: 信号灯超时时间已到


! Doctor found issues in 4 categories.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看到我并没有安装安卓工具链，这里安装的是最新版flutter 3.10.6，正式版从2.0开始就稳定支持windows了。</p><h2 id="hello-world" tabindex="-1"><a class="header-anchor" href="#hello-world" aria-hidden="true">#</a> Hello World</h2><p>使用命令创建项目，过程中需要下载东西，要等一会儿，如果前面的镜像配置好了的话是不需要等多久的。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>flutter create flutter_learn
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>然后运行demo</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>flutter run
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>选择要运行的类型</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>Connected devices:
Windows (desktop) • windows • windows-x64    • Microsoft Windows [版本 10.0.19045.3208]
Chrome (web)      • chrome  • web-javascript • Google Chrome 115.0.5790.110
Edge (web)        • edge    • web-javascript • Microsoft Edge 115.0.1901.183
[1]: Windows (windows)
[2]: Chrome (chrome)
[3]: Edge (edge)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里有web和windows可选，都可以试一试</p><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202307291234496.png" alt="windows桌面软件" tabindex="0" loading="lazy"><figcaption>windows桌面软件</figcaption></figure><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202307291235487.png" alt="web" tabindex="0" loading="lazy"><figcaption>web</figcaption></figure><h2 id="体验" tabindex="-1"><a class="header-anchor" href="#体验" aria-hidden="true">#</a> 体验</h2><p>整个过程的初体验还是很不错的，没有深入了解的情况下不太好评价其他地方。在打开web的时候发现整个界面不是传统的html元素，相当于是flutter自己渲染的一套canvas，只能说有点东西。</p><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202307291238083.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>等到后面学习的足够深入了再回头做一个系统点的评价。</p>`,18);function A(C,T){const i=o("ExternalLinkIcon");return l(),d("div",null,[c,v,a(" more "),h,m,e("p",null,[t("Flutter官网："),e("a",p,[t("Flutter: 为所有屏幕创造精彩 - Flutter 中文开发者网站 - Flutter"),n(i)])]),e("p",null,[t("Flutter文档："),e("a",g,[t("Flutter 开发文档 - Flutter 中文文档 - Flutter 中文开发者网站 - Flutter"),n(i)])]),e("p",null,[t("Flutter安装："),e("a",b,[t("安装和环境配置 - Flutter 中文文档 - Flutter 中文开发者网站 - Flutter"),n(i)])]),f,e("p",null,[t("清华源："),e("a",_,[t("flutter | 镜像站使用帮助 | 清华大学开源软件镜像站 | Tsinghua Open Source Mirror"),n(i)])]),w,e("div",x,[F,e("p",null,[t("其他一些可用的镜像站点："),e("a",E,[t("在中国网络环境下使用 Flutter - Flutter 中文文档 - Flutter 中文开发者网站 - Flutter"),n(i)])])]),k,y,e("p",null,[t("vs安装："),e("a",q,[t("安装 Visual Studio | Microsoft Learn"),n(i)])]),S])}const U=s(u,[["render",A],["__file","fluttertry.html.vue"]]);export{U as default};
