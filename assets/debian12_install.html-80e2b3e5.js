import{_ as e,W as t,X as p,a0 as l,Y as i,Z as o,$ as a,a1 as c,C as g}from"./framework-b5ea9e64.js";const d={},r=i("h1",{id:"debian12-安装教程",tabindex:"-1"},[i("a",{class:"header-anchor",href:"#debian12-安装教程","aria-hidden":"true"},"#"),o(" Debian12 安装教程")],-1),s=i("img",{src:"https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202407221436679.png",style:{zoom:"200%"}},null,-1),u=i("p",null,"以前在个人电脑上一直使用的是Ubuntu，Debian仅作为服务器使用，作为前者的上游分支，Debian是一个完全开源稳定的操作系统，这次打算将其安装到本地的vmware，于是写下本文记录。",-1),m=i("hr",null,null,-1),h=i("h2",{id:"准备",tabindex:"-1"},[i("a",{class:"header-anchor",href:"#准备","aria-hidden":"true"},"#"),o(" 准备")],-1),f={href:"https://forums.debiancn.org/",target:"_blank",rel:"noopener noreferrer"},b={href:"https://www.debian.org/",target:"_blank",rel:"noopener noreferrer"},y={href:"https://www.debian.org/releases/stable/amd64/",target:"_blank",rel:"noopener noreferrer"},q={href:"https://www.vmware.com/content/vmware/vmware-published-sites/cn/products/workstation-pro/workstation-pro-evaluation.html.html.html",target:"_blank",rel:"noopener noreferrer"},x=c('<p>你需要有：</p><ul><li>基本的Linux使用能力</li><li>了解vmware的基本使用</li><li>一台足以支持Vmware12+运行的电脑</li><li>内存建议2GB以上</li><li>磁盘空间建议有20GB以上的剩余</li></ul><h2 id="安装" tabindex="-1"><a class="header-anchor" href="#安装" aria-hidden="true">#</a> 安装</h2><p>截至本文写下的时候，我的电脑系统是win10，Debian发行版已经来到了12.6，下面将讲述Debian12在Vmware16中的安装过程作为参考，最终目标即为系统可以与宿主机建立SSH连接，且能正常联网安装软件。</p><h3 id="镜像" tabindex="-1"><a class="header-anchor" href="#镜像" aria-hidden="true">#</a> 镜像</h3><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202407221459871.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>普通用户安装的时候镜像一般会用以下两种</p><ul><li>网络版（netinst）：只包含操作系统运行所需要的最基本工具，其他软件需要在安装时联网下载，大小600MB左右。</li><li>DVD版（dvd）：内置了大部分系统工具和软件，支持离线安装，大小为3.5GB左右。</li></ul><p>网络版在安装过程中的软件下载阶段默认使用的是官方的安全源，对于国内用户而言会极其缓慢，除非临时修改<code>sources.list</code>为国内源，而且只能纯手敲，关于这个问题你可以在网络上找到很多类似的回答，足以见得有多麻烦。</p><p>所以我的建议是使用DVD版，因为它支持离线安装，可以将操作系统完全安装成功后再去修改国内源，这种做法更为方便。</p><p><strong>下载</strong></p><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202412242035564.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>下方是下载链接，点进去后直接下载对应的ISO文件即可，本文用的是<code>amd64</code>，主流的指令集Debian基本上都支持，把<code>amd64</code>替换掉即可。官方的链接需要科学上网，国内用户使用中科大的即可。</p>',13),v=i("p",null,"网络版",-1),_={href:"https://cdimage.debian.org/debian-cd/current/amd64/iso-cd/",target:"_blank",rel:"noopener noreferrer"},z={href:"https://mirrors.ustc.edu.cn/debian-cd/current/amd64/iso-cd/",target:"_blank",rel:"noopener noreferrer"},w=i("p",null,"DVD版",-1),D={href:"https://cdimage.debian.org/debian-cd/current/amd64/iso-dvd/",target:"_blank",rel:"noopener noreferrer"},k={href:"https://mirrors.ustc.edu.cn/debian-cd/current/amd64/iso-dvd/",target:"_blank",rel:"noopener noreferrer"},L=c('<p>后面的内容统一使用DVD版进行讲解。</p><h3 id="创建" tabindex="-1"><a class="header-anchor" href="#创建" aria-hidden="true">#</a> 创建</h3><p>选择创建新的虚拟机，使用自定义创建</p><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202407221520993.png" style="zoom:67%;"><p>硬件兼容性看个人喜好，版本越低兼容性越好，如果你的电脑比较老的话建议选12</p><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202407221523400.png" style="zoom:67%;"><p>选择稍后安装操作系统</p><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202407221524047.png" style="zoom:67%;"><p>在客户机操作系统这一步选择Linux和Debian10.x 64位，列表中最高版本也只有10.x，不过这并不会有什么影响。</p><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202407221525396.png" style="zoom:67%;"><p>指定安装位置，建议放在除C盘以外的其他盘，因为虚拟机大小基本上20G起步，比较占空间。</p><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202407221527410.png" style="zoom:67%;"><p>CPU，内存，磁盘空间根据自己电脑的配置来选择，我的电脑有16核40G内存，所以这里选择的配置稍微高了一些，一般情况下默认就足够了。</p><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202407221528163.png" style="zoom:67%;"><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202407221529720.png" style="zoom:67%;">',15),V={href:"https://www.cnblogs.com/linjiaxin/p/6476480.html",target:"_blank",rel:"noopener noreferrer"},A=c(`<img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202407221538790.png" style="zoom:67%;"><p>IO控制器和磁盘类型都建议默认选项</p><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202407221539872.png" style="zoom:67%;"><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202407221540143.png" style="zoom:67%;"><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202407221540493.png" style="zoom:67%;"><p>磁盘容量建议设置20G以上，虚拟磁盘的存储类型根据个人需要来进行设置，建议选择存储为单个文件。</p><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202407221540005.png" style="zoom:67%;"><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202407221542662.png" style="zoom:67%;"><p>到最后一步，选择自定义硬件</p><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202407221542031.png" style="zoom:67%;"><p>然后在CD/DVD中设置之前下载好的系统镜像</p><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202407221543273.png" style="zoom:50%;"><p>到此虚拟机创建完毕，接下来是操作系统的引导过程。</p><h3 id="引导" tabindex="-1"><a class="header-anchor" href="#引导" aria-hidden="true">#</a> 引导</h3><p>启动虚拟机，会有下面这样一个界面，第一个是图形化安装，第二个是命令行安装，下面会以图形化安装的方式进行。</p><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202407221552944.png" style="zoom:67%;"><p>选系统语言和输入法</p><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202407221555755.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202407221555285.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202407221555031.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>随后Debian会自动设置必要的安装组件以及配置网络，主机名随便取，域名建议留空</p><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202407221557516.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202407221557323.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>然后设置root用户和登录用户的账号密码</p><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202407221558015.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202407221559859.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202407221600786.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>磁盘分区根据个人喜好来选择，第一种最省事</p><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202407221601879.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202407221601586.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202407221601544.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>磁盘分区设置好后Debian就会进行系统的基本配置，然后接下来配置软件包管理器就是重点了。选择否不扫描其他安装介质，因为我们并没有用驱动器进行安装。</p><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202407221603856.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>最重要的是镜像站点的选择这一步，如果你对自己的网速没有自信的话（不然下载三小时起步）建议选择否，即便你的网速很快我也建议不要使用镜像站点，因为系统安装好后有的是时间去配置镜像站点。</p><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202407221605768.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>是否参与调查看自己</p><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202407221608484.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>软件选择这块除了最下面三个，其他全是桌面环境，如果你不喜欢桌面环境也可以不要，不过记得勾选SSH Server。</p><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202407221650391.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202407221612558.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>安装GRUB引导器，虚拟机不需要在乎这个，一般是电脑装有双系统的时候才需要注意。</p><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202407221613449.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>选择<code>/dev/sda</code>分区，之前配置了全部文件都放在一个分区里面</p><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202407221615757.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>然后Debian会结束安装进程</p><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202407221615564.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202407221616619.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="配置" tabindex="-1"><a class="header-anchor" href="#配置" aria-hidden="true">#</a> 配置</h3><p>重启后登录用户</p><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202407221654698.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>完成输入法语言账号之类的初始配置即可使用</p><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202407221655893.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>debian12的登陆用户默认不会拥有sudoer的权限，所以我们要手动添加，文件位于<code>/etc/sudoers</code>，在<code>%sudo ALL=(ALL:ALL) ALL</code>的下面添加下面这一行，然后保存。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>jack ALL=(ALL:ALL) ALL
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202407221807337.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>然后在Vmware中选择安装Vmware Tools，默认存放在<code>/media/cdrom0</code>文件夹中。</p><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202407221702020.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>将其解压，建议解压到其他地方，我这里解压到了<code>/var/lib</code>下</p><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202407221716772.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>然后运行<code>vmware-install.pl</code>脚本，</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>$ sudo ./vmware-install.pl
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>过程中全部默认选项，完成后虚拟机就能以正常的分辨率显示了。</p><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202407221720013.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>ping一下网络确实可以访问</p><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202407221722385.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>但此时apt是用不了的，因为我们是离线安装，需要去修改<code>/etc/apt/sources.list</code>里面的内容，这里使用的是中科大源。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code># 默认注释了源码仓库，如有需要可自行取消注释
deb http://mirrors.ustc.edu.cn/debian bookworm main contrib non-free non-free-firmware
# deb-src http://mirrors.ustc.edu.cn/debian bookworm main contrib non-free non-free-firmware
deb http://mirrors.ustc.edu.cn/debian bookworm-updates main contrib non-free non-free-firmware
# deb-src http://mirrors.ustc.edu.cn/debian bookworm-updates main contrib non-free non-free-firmware

# backports 软件源，请按需启用
# deb http://mirrors.ustc.edu.cn/debian bookworm-backports main contrib non-free non-free-firmware
# deb-src http://mirrors.ustc.edu.cn/debian bookworm-backports main contrib non-free non-free-firmware
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>使用nano编辑（因为此时vim还没有安装）</p><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202407221731813.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>执行命令更新源</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>apt update -y &amp;&amp; apt upgrade
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202407221733972.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>安装vim测试一下</p><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202407221734043.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>目前基本上已经安装完毕，但还差最后一步，就是ssh，安装<code>net-tools</code>后执行<code>sudo ifconfig</code>命令查看虚拟机IP。</p><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202407221737788.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>然后宿主机尝试下是否能ping通，可以看到并没有问题</p><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202407221738575.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>修改ssh配置文件<code>/etc/ssh/sshd_config</code>，设置端口22。</p><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202407221743971.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>重启ssh服务</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>sudo service ssh restart
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202407221745258.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>此时虚拟IP地址为<code>192.168.43.168:22</code>，最后能进行ssh连接即可，我这里用的是xshell，用的密码登录。</p><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202407221751405.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202407221752221.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202407221752242.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>到此debian12的安装已经完成。</p>`,88);function B(G,C){const n=g("ExternalLinkIcon");return t(),p("div",null,[r,s,u,l(" more "),m,h,i("p",null,[o("Debian在国内有中文论坛，有什么问题可以去论坛搜索："),i("a",f,[o("Debian中文论坛 - (debiancn.org)"),a(n)])]),i("p",null,[o("官方网站完全支持中文："),i("a",b,[o("Debian -- 通用操作系统"),a(n)])]),i("p",null,[o("中文安装手册："),i("a",y,[o("Debian GNU/Linux 安装手册"),a(n)])]),i("p",null,[o("Vmware官网："),i("a",q,[o("下载 VMware Workstation Pro | CN"),a(n)])]),x,i("ul",null,[i("li",null,[v,i("ul",null,[i("li",null,[o("Debian："),i("a",_,[o("https://cdimage.debian.org/debian-cd/current/amd64/iso-cd/"),a(n)])]),i("li",null,[o("中科大："),i("a",z,[o("https://mirrors.ustc.edu.cn/debian-cd/current/amd64/iso-cd/"),a(n)])])])]),i("li",null,[w,i("ul",null,[i("li",null,[o("Debian："),i("a",D,[o("https://cdimage.debian.org/debian-cd/current/amd64/iso-dvd/"),a(n)])]),i("li",null,[o("中科大："),i("a",k,[o("https://mirrors.ustc.edu.cn/debian-cd/current/amd64/iso-dvd/"),a(n)])])])])]),L,i("p",null,[o("网络类型看个人需要，关于三种网络模式的详解请看："),i("a",V,[o("Vmware虚拟机三种网络模式"),a(n)]),o("，我一般使用桥接模式。")]),A])}const S=e(d,[["render",B],["__file","debian12_install.html.vue"]]);export{S as default};
