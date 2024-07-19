import{_ as s,W as a,X as c,Y as l,Z as e,$ as n,a0 as r,a1 as i,C as t}from"./framework-a4c02b8f.js";const o={},v=e("h1",{id:"win10重置电脑-找不到恢复环境-需要重装介质",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#win10重置电脑-找不到恢复环境-需要重装介质","aria-hidden":"true"},"#"),n(" Win10重置电脑-找不到恢复环境，需要重装介质")],-1),m=e("figure",null,[e("img",{src:"https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202407191536182.png",alt:"",tabindex:"0",loading:"lazy"}),e("figcaption")],-1),u=i(`<hr><p>我的电脑一直以来都是用的win10，因为觉得win11华而不实，除了UI界面好看点外没什么用。最近因为软件和文件安装多了看着心烦，想要把win10重置以后重新分配空间，这样来的的清净些，当我把备份做好后，准备重置时就出现了下面的提示。</p><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202407191536373.png" style="zoom:80%;"><p>因为我以前重置过一次，所以记得自带的重置功能是不需要外部介质（U盘之类）的，不过我也是第一次遇到这种情况，于是写下本文当作一个记录。</p><h2 id="问题" tabindex="-1"><a class="header-anchor" href="#问题" aria-hidden="true">#</a> 问题</h2><p>在网上查找了一下后，发现是因为<code>C:\\\\Recovery\\\\WindowsRE</code>文件缺失了，通过<code>reagentc</code>命令来查看重置软件的启用情况，如下所示。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>PS C:\\Windows\\System32&gt; reagentc /info
Windows 恢复环境(Windows RE)和系统初始化配置
信息:

    Windows RE 状态:           Disabled
    Windows RE 位置:
    引导配置数据(BCD)标识符:   d0351a75-4283-11ec-8797-04421ad29d45
    恢复映像位置:
    恢复映像索引:              0
    自定义映像位置:
    自定义映像索引:            0

REAGENTC.EXE: 操作成功。

PS C:\\Windows\\System32&gt; reagentc /enable
REAGENTC.EXE: 未找到 Windows RE 映像。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在上面可以看到<code>Windows RE 位置</code>是空的，以及<code>reagentc /enable</code>启用失败，说明WindowsRE文件确实是缺失了。</p><h2 id="解决" tabindex="-1"><a class="header-anchor" href="#解决" aria-hidden="true">#</a> 解决</h2>`,9),b=e("code",null,"Winre.wim",-1),g={href:"https://www.xitongku.com/index.html",target:"_blank",rel:"noopener noreferrer"},p=i(`<figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202407191617009.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>将镜像文件解压，目标文件在如下目录中</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>iso/sources/install.wim/windows/system32/recovery
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>得到文件后将其放入本机的<code>C:\\\\Recovery\\\\WindowsRE\\\\</code>目录下，然后通过命令行设置文件位置。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>PS C:\\Windows\\System32&gt; reagentc /setreimage /path C:\\Recovery\\WindowsRE
目录设置为: \\\\?\\GLOBALROOT\\device\\harddisk0\\partition3\\Recovery\\WindowsRE

REAGENTC.EXE: 操作成功。

PS C:\\Windows\\System32&gt; reagentc /info
Windows 恢复环境(Windows RE)和系统初始化配置
信息:

    Windows RE 状态:           Disabled
    Windows RE 位置:
    引导配置数据(BCD)标识符:   d0351a75-4283-11ec-8797-04421ad29d45
    恢复映像位置:
    恢复映像索引:              0
    自定义映像位置:
    自定义映像索引:            0

REAGENTC.EXE: 操作成功。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后再通过<code>reagentc /enable</code>命令启用即可。</p><h3 id="bitlocker" tabindex="-1"><a class="header-anchor" href="#bitlocker" aria-hidden="true">#</a> bitlocker</h3><p>有时可能会出现这种情况</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>PS C:\\Windows\\System32&gt; reagentc /enable
REAGENTC.EXE: 不能在启用了 BitLocker 驱动器加密的卷上启用 Windows RE。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p><code>BitLocker</code>是驱动器加密的一种技术，在win10<code>设置 &gt; 更新和安全 &gt; 设备加密</code>中关闭即可。</p>`,10);function h(w,E){const d=t("ExternalLinkIcon");return a(),c("div",null,[v,m,l(" more "),u,e("p",null,[n("我们需要下载win10的ISO镜像，并从中获取"),b,n("文件，然后复制到电脑的对应位置，这里推荐用系统库下载"),e("a",g,[n("MSDN系统库－致力于原版windows生态服务 (xitongku.com)"),r(d)]),n("，微软目前不再提供ISO镜像下载了。")]),p])}const _=s(o,[["render",h],["__file","win10_reset.html.vue"]]);export{_ as default};
