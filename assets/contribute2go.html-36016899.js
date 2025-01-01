import{_ as t,W as i,X as l,a0 as c,Y as n,Z as s,$ as a,a1 as o,C as r}from"./framework-b5ea9e64.js";const p={},d=n("h1",{id:"如何向go贡献代码",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#如何向go贡献代码","aria-hidden":"true"},"#"),s(" 如何向Go贡献代码")],-1),u=n("figure",null,[n("img",{src:"https://spf13.com/presentation/how-to-contribute-to-go/front.jpg",alt:"",tabindex:"0",loading:"lazy"}),n("figcaption")],-1),g=o(`<hr><h2 id="前言" tabindex="-1"><a class="header-anchor" href="#前言" aria-hidden="true">#</a> 前言</h2><p>有一天我突发奇想，想自己编写一个契合我个人使用习惯的go版本管理命令行工具，方便随时切换不同的go版本。作为一个版本管理工具，首要的一个功能就是可以随时获取到最新的go版本，以及所有可用的版本列表，go官方有一个API可以查询所有可用的版本列表，如下：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>https://go.dev/dl/?mode=json&amp;include=all
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>在通过该接口得到数据后，我尝试用go在1.21新加的一个库<code>go/version</code>来进行排序，可排序后得到的结果让人非常的诧异，示例代码如下所示</p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code><span class="token keyword">package</span> main

<span class="token keyword">import</span> <span class="token punctuation">(</span>
	<span class="token string">&quot;encoding/json&quot;</span>
	<span class="token string">&quot;fmt&quot;</span>
	<span class="token string">&quot;go/version&quot;</span>
	<span class="token string">&quot;net/http&quot;</span>
	<span class="token string">&quot;slices&quot;</span>
<span class="token punctuation">)</span>

<span class="token keyword">type</span> GoVersion <span class="token keyword">struct</span> <span class="token punctuation">{</span>
	Version <span class="token builtin">string</span>    <span class="token string">\`json:&quot;version&quot;\`</span>
	Stable  <span class="token builtin">bool</span>      <span class="token string">\`json:&quot;stable&quot;\`</span>
	Files   <span class="token punctuation">[</span><span class="token punctuation">]</span>Version <span class="token string">\`json:&quot;files&quot;\`</span>
<span class="token punctuation">}</span>

<span class="token keyword">type</span> Version <span class="token keyword">struct</span> <span class="token punctuation">{</span>
	Filename <span class="token builtin">string</span> <span class="token string">\`json:&quot;filename&quot;\`</span>
	Os       <span class="token builtin">string</span> <span class="token string">\`json:&quot;os&quot;\`</span>
	Version  <span class="token builtin">string</span> <span class="token string">\`json:&quot;version&quot;\`</span>
	Sha256   <span class="token builtin">string</span> <span class="token string">\`json:&quot;sha256&quot;\`</span>
	Size     <span class="token builtin">int64</span>  <span class="token string">\`json:&quot;size&quot;\`</span>
	Kind     <span class="token builtin">string</span> <span class="token string">\`json:&quot;kind&quot;\`</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
	resp<span class="token punctuation">,</span> err <span class="token operator">:=</span> http<span class="token punctuation">.</span><span class="token function">Get</span><span class="token punctuation">(</span><span class="token string">&quot;https://go.dev/dl/?mode=json&amp;include=all&quot;</span><span class="token punctuation">)</span>
	<span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span>
		<span class="token function">panic</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span>
	<span class="token punctuation">}</span>
	<span class="token keyword">var</span> goVersions <span class="token punctuation">[</span><span class="token punctuation">]</span>GoVersion
	err <span class="token operator">=</span> json<span class="token punctuation">.</span><span class="token function">NewDecoder</span><span class="token punctuation">(</span>resp<span class="token punctuation">.</span>Body<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">Decode</span><span class="token punctuation">(</span><span class="token operator">&amp;</span>goVersions<span class="token punctuation">)</span>
	<span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span>
		<span class="token function">panic</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span>
	<span class="token punctuation">}</span>
	slices<span class="token punctuation">.</span><span class="token function">SortFunc</span><span class="token punctuation">(</span>goVersions<span class="token punctuation">,</span> <span class="token keyword">func</span><span class="token punctuation">(</span>v1<span class="token punctuation">,</span> v2 GoVersion<span class="token punctuation">)</span> <span class="token builtin">int</span> <span class="token punctuation">{</span>
		<span class="token keyword">return</span> version<span class="token punctuation">.</span><span class="token function">Compare</span><span class="token punctuation">(</span>v1<span class="token punctuation">.</span>Version<span class="token punctuation">,</span> v2<span class="token punctuation">.</span>Version<span class="token punctuation">)</span>
	<span class="token punctuation">}</span><span class="token punctuation">)</span>
	<span class="token keyword">for</span> <span class="token boolean">_</span><span class="token punctuation">,</span> version <span class="token operator">:=</span> <span class="token keyword">range</span> goVersions<span class="token punctuation">[</span><span class="token punctuation">:</span><span class="token number">10</span><span class="token punctuation">]</span> <span class="token punctuation">{</span>
		fmt<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span>version<span class="token punctuation">.</span>Version<span class="token punctuation">)</span>
	<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>它的输出是</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>go1.9.2rc2
go1
go1.2.2
go1.3rc1
go1.3rc2
go1.3
go1.3.1
go1.3.2
go1.3.3
go1.4beta1
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>排第一的版本是<code>go1.9.2rc2</code>，而不是最老的版本<code>go1</code>，发现这个问题后我去研究了下<code>go/verison</code>的源代码，发现了下面这一段</p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code><span class="token comment">// Parse patch if present.</span>
<span class="token keyword">if</span> x<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span> <span class="token operator">==</span> <span class="token char">&#39;.&#39;</span> <span class="token punctuation">{</span>
    v<span class="token punctuation">.</span>Patch<span class="token punctuation">,</span> x<span class="token punctuation">,</span> ok <span class="token operator">=</span> <span class="token function">cutInt</span><span class="token punctuation">(</span>x<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">:</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
    <span class="token keyword">if</span> <span class="token operator">!</span>ok <span class="token operator">||</span> x <span class="token operator">!=</span> <span class="token string">&quot;&quot;</span> <span class="token punctuation">{</span>
        <span class="token comment">// Note that we are disallowing prereleases (alpha, beta, rc) for patch releases here (x != &quot;&quot;).</span>
        <span class="token comment">// Allowing them would be a bit confusing because we already have:</span>
        <span class="token comment">//	1.21 &lt; 1.21rc1</span>
        <span class="token comment">// But a prerelease of a patch would have the opposite effect:</span>
        <span class="token comment">//	1.21.3rc1 &lt; 1.21.3</span>
        <span class="token comment">// We&#39;ve never needed them before, so let&#39;s not start now.</span>
        <span class="token keyword">return</span> Version<span class="token punctuation">{</span><span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> v
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>大致意思就是说，补丁的预发布版本很少会使用到，且可能会产生歧义就将其视为非法的版本，而非法的版本总是会小于合法的版本，这就是为什么<code>go.1.9.2rc2</code>是最小的版本，编写这个标准库的正是go团队的主要领头人Russ cox。</p><p>虽然官方是这样说，但我并不认为这样就是正确的，目前我发现的拥有预发布版本的补丁版本总共有三个：</p><ul><li>1.8.5rc5</li><li>1.8.5rc4</li><li>1.9.2rc2</li></ul><p>尤其是<code>1.9.2rc2</code>，它既然可以在官方接口中可以被查询到，那就说明它是一个可用的版本，但很遗憾的是下面这段代码的结果是false。</p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code><span class="token keyword">func</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
	fmt<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span>version<span class="token punctuation">.</span><span class="token function">IsValid</span><span class="token punctuation">(</span><span class="token string">&quot;go1.9.2rc2&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,15),v={href:"https://github.com/golang/go/issues/68634",target:"_blank",rel:"noopener noreferrer"},m=n("h2",{id:"准备",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#准备","aria-hidden":"true"},"#"),s(" 准备")],-1),h={href:"https://go.dev/doc/contribute#commit_messages",target:"_blank",rel:"noopener noreferrer"},b=n("h3",{id:"cla",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#cla","aria-hidden":"true"},"#"),s(" CLA")],-1),k=n("p",null,"CLA（Contributor License Agreement），中文名为开源贡献者协议，一般有两种，",-1),f=n("ul",null,[n("li",null,"DCO：由linux基金会提出，社区属性比较强，每次提交的时候都要签署"),n("li",null,"CLA：由公司法务指定，具有一定法律性质，一次性签署，社区属性弱")],-1),_={href:"https://cla.developers.google.com/about",target:"_blank",rel:"noopener noreferrer"},y=n("figure",null,[n("img",{src:"https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202408010102024.png",alt:"",tabindex:"0",loading:"lazy"}),n("figcaption")],-1),x=n("p",null,"有个人版和企业版，对于个人版而言仅需要提供你的名字和邮件联系方式即可，如果你未签署CLA就直接提交PR，github上会有机器人来提醒你签署CLA，在此之前你的PR不会被受理。",-1),q=n("figure",null,[n("img",{src:"https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202408010105232.png",alt:"",tabindex:"0",loading:"lazy"}),n("figcaption")],-1),w=n("h3",{id:"geerit",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#geerit","aria-hidden":"true"},"#"),s(" Geerit")],-1),G={href:"https://go-review.googlesource.com/dashboard/self",target:"_blank",rel:"noopener noreferrer"},P=o(`<figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202408010115925.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>你需要在这里注册一个账号，因为所有的PR都会被机器人转发到gerrit，负责代码审查的人员会在这里对你的代码提出规范和建议，所以不要在GitHub的PR页面做出任何回复和评论，机器人会告诉你到哪里去查看。</p><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202408010116746.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>如果你后续需要修改代码，只需要提交到Github上即可，代码审查的工作在Gerrit上进行。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ go <span class="token function">install</span> golang.org/x/review/git-codereview@latest

$ <span class="token function">git</span> codereview <span class="token builtin class-name">help</span>
Usage: git-codereview <span class="token operator">&lt;</span>command<span class="token operator">&gt;</span> <span class="token punctuation">[</span>-n<span class="token punctuation">]</span> <span class="token punctuation">[</span>-v<span class="token punctuation">]</span>

Git-codereview is a <span class="token function">git</span> helper <span class="token builtin class-name">command</span> <span class="token keyword">for</span> managing pending commits
against an upstream server, typically a Gerrit server.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>建议在本地安装go官方的一个review命令行工具，下面是一些简单的用法</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> codereview <span class="token function">sync</span> <span class="token comment"># 同步代码</span>
$ <span class="token function">git</span> codereview change <span class="token comment"># 修改提交信息</span>
$ <span class="token function">git</span> codereview mail <span class="token comment"># 将修改后的信息提交到gerrit</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="冻结期" tabindex="-1"><a class="header-anchor" href="#冻结期" aria-hidden="true">#</a> 冻结期</h3><p>每年的5-7月，11-1月是go语言的冻结期，这段时间一般是为了发布新的次级版本而做准备，在这段时间内代码审查的工作会放缓，只有一小部分比较重要的更改会被合并，在此期间只接受修复已有的bug和文档更新类的修改，如果你是在这个时间点内提交其他类型的PR，可能会要等一段时间才会有回应，直到冻结期结束。</p><h2 id="编码" tabindex="-1"><a class="header-anchor" href="#编码" aria-hidden="true">#</a> 编码</h2><p>当你做好上述准备工作以后，就可以开始着手准备写代码了。</p><h3 id="仓库结构" tabindex="-1"><a class="header-anchor" href="#仓库结构" aria-hidden="true">#</a> 仓库结构</h3>`,12),C={href:"https://go.googlesource.com/",target:"_blank",rel:"noopener noreferrer"},R={href:"https://github.com/golang",target:"_blank",rel:"noopener noreferrer"},V=n("p",null,[n("strong",null,"主仓库")],-1),A={href:"http://go.googlesource.com/go",target:"_blank",rel:"noopener noreferrer"},I={href:"http://github.com/golang/go",target:"_blank",rel:"noopener noreferrer"},L=n("p",null,"主仓库存放了go语言绝大部分代码，大部分修改都在这里进行，比如语法，运行时，gc，和一些标准库之类的。",-1),T=n("p",null,[n("strong",null,"proposal")],-1),$={href:"http://go.googlesource.com/proposal",target:"_blank",rel:"noopener noreferrer"},j={href:"http://github.com/golang/proposal",target:"_blank",rel:"noopener noreferrer"},z=n("p",null,"go语言提案库，所有涉及到go语言特性的重大变更都必须先在这里发起一个提案",-1),B=n("p",null,[n("strong",null,"tools")],-1),S={href:"http://go.googlesource.com/tools",target:"_blank",rel:"noopener noreferrer"},E={href:"http://github.com/golang/tools",target:"_blank",rel:"noopener noreferrer"},O=n("p",null,[s("对应"),n("code",null,"golang.org/x/tools"),s("，tools仓库存放着一些官方编写的工具，比如goimports，stringer，gopls之类")],-1),D=n("p",null,[n("strong",null,"net")],-1),N={href:"http://go.googlesource.com/net",target:"_blank",rel:"noopener noreferrer"},F={href:"http://github.com/golang/net",target:"_blank",rel:"noopener noreferrer"},U=n("p",null,[s("对应"),n("code",null,"golang.org/x/net"),s("，net库是官方对net标准库的一个补充")],-1),H=n("p",null,[n("strong",null,"crypot")],-1),K={href:"http://go.googlesource.com/crypto",target:"_blank",rel:"noopener noreferrer"},M={href:"http://github.com/golang/crypto",target:"_blank",rel:"noopener noreferrer"},W=n("p",null,[s("对应"),n("code",null,"golang.org/x/crypto"),s("，是对crypto标准库的一个补充")],-1),X=n("p",null,[n("strong",null,"gofrontend")],-1),Y={href:"http://go.googlesource.com/gofrontend",target:"_blank",rel:"noopener noreferrer"},Z={href:"http://github.com/golang/gofrontend",target:"_blank",rel:"noopener noreferrer"},J=n("p",null,"gccgo，go编译器前端",-1),Q=n("p",null,[n("strong",null,"vscode-go")],-1),nn={href:"http://go.googlesource.com/vscode-go",target:"_blank",rel:"noopener noreferrer"},sn={href:"http://github.com/golang/vscode-go",target:"_blank",rel:"noopener noreferrer"},en=n("p",null,"go语言的vscode插件",-1),an=n("p",null,"里面还有很多项目，这里就不一一列出了，可以前往谷歌仓库自行查阅。",-1),on=n("h3",{id:"安全漏洞",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#安全漏洞","aria-hidden":"true"},"#"),s(" 安全漏洞")],-1),tn={href:"https://go.dev/doc/security/policy",target:"_blank",rel:"noopener noreferrer"},ln=n("strong",null,"vulnerability",-1),cn={href:"https://bughunters.google.com/report",target:"_blank",rel:"noopener noreferrer"},rn=o(`<h3 id="本地编译" tabindex="-1"><a class="header-anchor" href="#本地编译" aria-hidden="true">#</a> 本地编译</h3><p>在决定好向哪一个仓库贡献代码后，用git将其克隆到本地，比如我这里是主仓库，使用Github地址与谷歌的地址是等效的，单纯是因为我更习惯Github上的操作。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>git clone git@github.com:golang/go.git
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>在将代码拉下来后，首先要做的第一件事就是先编译go项目，编译器用的是本地go自带的gc，进入src目录（必须在src目录执行），执行make脚本，如果你是windows平台，就执行<code>make.bat</code>，其他平台就执行<code>make.bash</code>，在编译完成后，二进制文件会存放在go/bin目录下，工具链会存放在go/pkg目录下。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">time</span> ./make.bat
Building Go cmd/dist using D:<span class="token punctuation">\\</span>work<span class="token punctuation">\\</span>libs<span class="token punctuation">\\</span>golang<span class="token punctuation">\\</span>root<span class="token punctuation">\\</span>go1.22.5. <span class="token punctuation">(</span>go1.22.5 windows/amd64<span class="token punctuation">)</span>
Building Go toolchain1 using D:<span class="token punctuation">\\</span>work<span class="token punctuation">\\</span>libs<span class="token punctuation">\\</span>golang<span class="token punctuation">\\</span>root<span class="token punctuation">\\</span>go1.22.5.
Building Go bootstrap cmd/go <span class="token punctuation">(</span>go_bootstrap<span class="token punctuation">)</span> using Go toolchain1.
Building Go toolchain2 using go_bootstrap and Go toolchain1.
Building Go toolchain3 using go_bootstrap and Go toolchain2.
Building packages and commands <span class="token keyword">for</span> windows/amd64.

real    1m36.028s
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>go仓库光是go代码就有250w+行，还不包含其他的一些文件，不过整体编译时间并不需要很久，测了下平均耗时在一分半左右。</p><p>官方准备了三种类型的脚本，它们的作用如下</p><ul><li>make.bash，仅编译</li><li>run.bash，不编译，运行所有的测试用例</li><li>all.bash，先编译，然后再运行所有的测试用例</li></ul><p>可以看自己的需要来使用哪一个。</p><h3 id="代码规范" tabindex="-1"><a class="header-anchor" href="#代码规范" aria-hidden="true">#</a> 代码规范</h3><p>在开始写代码之前，你首先需要创建一个新的分支，然后在新分支上做出修改，分支名称并没有严格规范，像github平时那样就好</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> checkout <span class="token parameter variable">-b</span> mybranch
$ <span class="token punctuation">[</span>edit files<span class="token punctuation">..</span>.<span class="token punctuation">]</span>
$ <span class="token function">git</span> <span class="token function">add</span> <span class="token punctuation">[</span>files<span class="token punctuation">..</span>.<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>你每新建一个go文件，就需要在文件头部加上如下的注释，其中的年份是你提交修改的年份，注释中不要提及任何人的姓名</p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code><span class="token comment">// Copyright 2024 The Go Authors. All rights reserved.</span>
<span class="token comment">// Use of this source code is governed by a BSD-style</span>
<span class="token comment">// license that can be found in the LICENSE file.</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果你新建了一个包，就需要在包级注释中说明这个包是干什么用的，就像标准库<code>bytes</code></p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code><span class="token comment">// Copyright 2009 The Go Authors. All rights reserved.</span>
<span class="token comment">// Use of this source code is governed by a BSD-style</span>
<span class="token comment">// license that can be found in the LICENSE file.</span>

<span class="token comment">// Package bytes implements functions for the manipulation of byte slices.</span>
<span class="token comment">// It is analogous to the facilities of the [strings] package.</span>
<span class="token keyword">package</span> bytes
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后就是提交规范，这是官方给的一个示例</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>math: improve Sin, Cos and Tan precision for very large arguments

The existing implementation has poor numerical properties for
large arguments, so use the McGillicutty algorithm to improve
accuracy above 1e10.

The algorithm is described at https://wikipedia.org/wiki/McGillicutty_Algorithm

Fixes #159
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>格式如下</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>scope: summary

main content

referencing issues
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第一行需要标注出影响范围和对本次提交的简短总结，必须以冒号分隔，如果有多个影响范围可以用逗号隔开，总结必须小写字母开头且尽量精简到76个字母以内，示例如下</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>syscall,misc/wasm: fix path expansion on non-unix platforms
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>然后是主要内容，不能使用markdown，html，latex等任何标记语言，这一部分需要描述的尽可能详细，需要说明起因和结果，并且附上尽可能详细的数据，比如修改的代码涉及到性能，可以附上基准测试的数据。下面是一个示例，该提交涉及到了内存逃逸方面。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>sync: reduce OnceFunc (and variants) heap allocations

The lifetime of the variables are identical; capture
them in a single struct to avoid individual allocations.
The inner closure can also avoid allocation by using the
capture of the outer closure.

Escape analysis for OnceValues:

  /go/src/sync/oncefunc.go:74:29: moved to heap: sync.f
  /go/src/sync/oncefunc.go:76:3: moved to heap: sync.once
  /go/src/sync/oncefunc.go:77:3: moved to heap: sync.valid
  /go/src/sync/oncefunc.go:78:3: moved to heap: sync.p
  /go/src/sync/oncefunc.go:79:3: moved to heap: sync.r1
  /go/src/sync/oncefunc.go:80:3: moved to heap: sync.r2
  /go/src/sync/oncefunc.go:82:7: func literal escapes to heap
  /go/src/sync/oncefunc.go:83:9: func literal does not escape
  /go/src/sync/oncefunc.go:93:9: func literal escapes to heap

After provided changes:

  /go/src/sync/oncefunc.go:86:2: moved to heap: sync.d
  /go/src/sync/oncefunc.go:96:9: func literal escapes to heap
  /go/src/sync/oncefunc.go:99:13: func literal does not escape
  /go/src/sync/oncefunc.go:100:10: func literal does not escape
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>最后就是需要引用相关的issue，最好每一个PR都与一个issue相关联，方便溯源。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>Fixes #159
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="本地测试" tabindex="-1"><a class="header-anchor" href="#本地测试" aria-hidden="true">#</a> 本地测试</h3><p>在完成所有的编码工作后，你需要编写相应的单元测试，这一点是必须要做的。然后在src目录下（必须在src目录下执行）执行<code>all.bash/bat</code>脚本，该脚本会编译go代码并执行所有的测试</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token builtin class-name">cd</span> go/src <span class="token operator">&amp;&amp;</span> ./all.bash
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>由于需要将go代码中所有的测试都执行完，耗时可能会比较久，大概在10分钟左右，所有测试通过后会显示下面一行内容</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>ALL TESTS PASSED
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>如果你只是对某一个标准库做了修改，你也可以不用执行全部的测试，你可以使用编译好后的go指定执行某一个标准库的测试用例，比如</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>$ cd $GOROOT/src/crypto/sha1
$ [make changes...]
$ $GOROOT/bin/go test .
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>不过我还是建议执行所有的测试用例，因为单独执行测试用例我基本上就没怎么成功过。</p><h3 id="pull-request" tabindex="-1"><a class="header-anchor" href="#pull-request" aria-hidden="true">#</a> Pull Request</h3><p>在完成所有的修改后，将其推送到Github，然后向go仓库发起Pull Request，如下图</p><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202408011203739.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>过一会儿会有机器人来告诉你PR已经被转发到Gerrit</p><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202408011205270.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>之后的代码审查工作就是在gerrit进行，gerrit的评论也会同步到Github，不过不要在这里做出任何回复。</p>`,40),pn={class:"hint-container tip"},dn=o(`<p class="hint-container-title">提示</p><p>如果你使用<code>git codereview mail</code>来将这些修改推送到gerrit，可能会有如下错误，因为Gerrit不接受来自中国IP的任何提交</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>fatal: remote error: Access Denied (not available from your location)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,3),un={href:"https://github.com/golang/go/issues/20065",target:"_blank",rel:"noopener noreferrer"},gn=o(`<h2 id="代码审查" tabindex="-1"><a class="header-anchor" href="#代码审查" aria-hidden="true">#</a> 代码审查</h2><p>代码审查的流程是最长的，如果你是社区贡献人员（谷歌员工的PR合并会快很多），并且改动比较大的话，那么通常需要好几轮审查才能确认将代码合并到主线当中，这一过程可能会耗时一两个星期甚至一个月。</p><p>大多数第一次提交代码的人会犯一些比较典型的错误</p><ul><li>提交信息不符合规范</li><li>缺少对Github Issue的引用</li><li>在冻结期提交修改</li></ul><p>第一点是最重要的，因为你的提交会被合并到主线当中，所以必须要符合规范。第二点的话如果你只是改了个注释或者什么其他微不足道的修改，也不需要引用issue。第三点其实也没那么重要，时间一过自然会发邮件通知审查你的代码的，无非只是等的时间长了点。</p><h3 id="审查人员" tabindex="-1"><a class="header-anchor" href="#审查人员" aria-hidden="true">#</a> 审查人员</h3><p>审查人员大多都是go团队的成员或者是谷歌公司的员工，以及部分社区人员组成，PR被转发到Gerrit后，如果你是第一次向Go贡献代码的话，为了避免这是垃圾邮件可能要过一段时间才会来审查的你的代码。如果有需要的话，你也可以直接指定谁来审查你的代码</p><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202408011510744.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>你可以在Change Info部分中指定审查人员和CC</p><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202408011511213.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>或者你也可以用命令行的方式</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>$ git codereview mail -r joe@golang.org -cc mabel@example.com,math-nuts@swtch.com
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>通常来说对于第一次贡献代码的人来说，如果你不知道指定谁，可以先发个issue看看，有哪些人会回答你的问题，如果他刚好是维护者的话就可以指定他来审查。如果你没有指定，那么系统也会自动为你分配审查人员的。</p><h3 id="trybots" tabindex="-1"><a class="header-anchor" href="#trybots" aria-hidden="true">#</a> Trybots</h3><p>当一个审查人员初步浏览了你的代码后，会启动Trybots，来进行自动化测试，就跟之前在本地测试的一样，不同的是trybots会在各个不同的环境进行测试，就跟Github Actions差不多类似。如果运行失败了，就需要查明哪里出了问题，然后修改代码重新提交。</p><h3 id="投票" tabindex="-1"><a class="header-anchor" href="#投票" aria-hidden="true">#</a> 投票</h3><p>审查人员和其他无关的第三方人员都可以给你的PR投票，第三方人员可以投一个<code>+1</code>，表示这个代码写的还不错，但还需要审查人员来进行评审，只有在获得审查人员的<code>+2</code>投票后，代码才能被合并，如果审查人员给你投了一个<code>+1</code>的话表示代码整体可以，但还需要做一些小的修改。</p><p>总的来说，如果你的PR想要被合并，就必须要两名审查人员的参与，至少一个<code>+1</code>和<code>+2</code>投票才能继续流程。</p><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202408011536498.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>对于一个PR而言，通常决定能否提交的指标下面这几个</p><ul><li>CR（code-review）：表示codereview是否完成</li><li>NUC（non-unresolved-comment）：，没有未处理的审查</li><li>RE（Review-enforcement）：执行了codereview</li><li>TP（trybots-passes）：trybots测试通过</li></ul><p>如果你是其他类型的修改可能会需要完成更多的CI测试，比如KCP（kokoro-CI-Passes），LP（LUCI-Passes），LTP（legacy-trybos-passes）等等，如果对应的CI测试通过了就会加分，相应的如果失败了就会扣分。</p><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202408011541602.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="修改" tabindex="-1"><a class="header-anchor" href="#修改" aria-hidden="true">#</a> 修改</h3><p>一般来说很少会有一次性通过的代码，审查人员会检查你代码中的逻辑错误，即便是一些注释问题也会指出来，这时候他们会留下评论，如下图所示</p><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202408011548843.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>如果你是通过Github机器人来与Gerrit交互的，那么你只需要将你本地的代码推送Github上就行了，机器人会自动更新修改，完成一个评论后点击Done按钮来告诉审查人员已解决。</p><h3 id="合并" tabindex="-1"><a class="header-anchor" href="#合并" aria-hidden="true">#</a> 合并</h3><p>当所有的工作都完成且通过，没有任何异议的时候，代码就会被合并，如下图所示。</p><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202408011543561.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>想要被顺利合并通常要花费不少时间，不要着急就对了。</p><h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结" aria-hidden="true">#</a> 总结</h2><p>给Go贡献代码并不只是简单的写代码做修改就完事了，要注意的流程和规范非常多，这样严格管理的好处是不容易出问题，能够保证代码质量。这一套codereview流程，对于刚接触的人来说会觉得很繁琐和麻烦，不过熟悉了过后就没什么了，了解这一套codereview流程也便于养成好的编程习惯，毕竟谷歌是由数万人组成的大型公司，良好的规范可以让屎山堆的更慢一些。</p>`,33);function vn(mn,hn){const e=r("ExternalLinkIcon");return i(),l("div",null,[d,u,c(" more "),g,n("p",null,[s("将一个对外可用的版本视为非法的版本，这很明显就是错误的，于是我便想着自己修改，给Go语言提了一个issue："),n("a",v,[s("Issue #68634 · golang/go"),a(e)]),s("，并且后续向go发起了一个Pull Request来修复这一错误，由于我是第一次向go仓库贡献代码，中间做了许多额外的准备，所以便写下本文做一个记录。")]),m,n("p",null,[s("在真正开始写代码之前，你需要做一些准备来符合PR的规范，否则官方不会受理你的代码。官方文档详细地描述了如何正确地向Go提交代码"),n("a",h,[s("Contribution Guide - The Go Programming Language"),a(e)]),s("。")]),b,k,f,n("p",null,[s("go是谷歌公司的产品， 向其贡献代码前就必须要签署"),n("a",_,[s("Google CLA"),a(e)]),s("，如下图所示")]),y,x,q,w,n("p",null,[s("Gerrit是谷歌开源的一个代码评审平台，可以企业自托管。go的代码审查也是用的gerrit，地址在"),n("a",G,[s("Go |Gerrit Code Review"),a(e)]),s("，界面大致如下图。")]),P,n("p",null,[s("go语言有很多仓库，它们无一例外全都托管谷歌仓库中，你可以在"),n("a",C,[s("Git repositories on go | Google"),a(e)]),s("查看到所有和go有关的项目，你也可以在"),n("a",R,[s("github.com/golang"),a(e)]),s("组织下看到这些项目的镜像，不过并不是所有项目都保持活跃，有些可能被遗弃了，在提交代码的时候记得注意这一点。下面简单介绍下最主要的几个，你需要弄清楚自己做出的修改要提交到哪里去才行。")]),V,n("p",null,[s("地址："),n("a",A,[s("go.googlesource.com/go"),a(e)])]),n("p",null,[s("镜像："),n("a",I,[s("github.com/golang/go"),a(e)])]),L,T,n("p",null,[s("地址："),n("a",$,[s("go.googlesource.com/proposal"),a(e)])]),n("p",null,[s("镜像："),n("a",j,[s("github.com/golang/proposal"),a(e)])]),z,B,n("p",null,[s("地址："),n("a",S,[s("go.googlesource.com/tools"),a(e)])]),n("p",null,[s("镜像："),n("a",E,[s("github.com/golang/tools"),a(e)])]),O,D,n("p",null,[s("地址："),n("a",N,[s("go.googlesource.com/net"),a(e)])]),n("p",null,[s("镜像："),n("a",F,[s("github.com/golang/net"),a(e)])]),U,H,n("p",null,[s("地址："),n("a",K,[s("go.googlesource.com/crypto"),a(e)])]),n("p",null,[s("镜像："),n("a",M,[s("github.com/golang/crypto"),a(e)])]),W,X,n("p",null,[s("地址："),n("a",Y,[s("go.googlesource.com/gofrontend"),a(e)])]),n("p",null,[s("镜像："),n("a",Z,[s("github.com/golang/gofrontend"),a(e)])]),J,Q,n("p",null,[s("地址："),n("a",nn,[s("go.googlesource.com/vscode-go"),a(e)])]),n("p",null,[s("镜像："),n("a",sn,[s("github.com/golang/vscode-go"),a(e)])]),en,an,on,n("p",null,[s("这篇文章详细说明了如何报告安全漏洞："),n("a",tn,[s("Go Security Policy - The Go Programming Language"),a(e)])]),n("p",null,[s("如果你发现了安全漏洞，不要在github上提issue或PR，go有一个专门处理安全问题的团队，将你遇到的问题详细描述（用英文）然后发邮件给这个地址：security@golang.org，团队成功会尽快在7天内做出回复，为了避免被当成垃圾邮件，请确保邮件里面包含了"),ln,s("这个单词，意思就是漏洞，或者也可以去这里"),n("a",cn,[s("Report Overview | Google Bug Hunters - Google Bug Hunters"),a(e)]),s("反馈安全漏洞。")]),rn,n("div",pn,[dn,n("p",null,[s("并不是因为Go团队有地域歧视，原因看这个"),n("a",un,[s("access to Gerrit denied because of location · Issue #20065 · golang/go (github.com)"),a(e)]),s("。如果你不想换IP的话，可以在Github上发PR让机器人帮你推送到Gerrit上，这样是最简单的方式")])]),gn])}const kn=t(p,[["render",vn],["__file","contribute2go.html.vue"]]);export{kn as default};