import{_ as i,W as o,X as l,Y as r,Z as n,$ as s,a0 as e,a1 as t,C as p}from"./framework-a4c02b8f.js";const c={},u=n("h1",{id:"rust安装",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#rust安装","aria-hidden":"true"},"#"),s(" Rust安装")],-1),d=n("figure",null,[n("img",{src:"https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202312061513880.png",alt:"",tabindex:"0",loading:"lazy"}),n("figcaption")],-1),v=n("hr",null,null,-1),g=n("p",null,"在这之前早已听说过rust的大名，虽然我在知乎上看到的rust貌似都是负面的评价？不过也看到了许多由Rust编写的工具，在了解到Rust的一些设计理念后，觉得有些方面做的要比Go好，就打算来试一试。",-1),h={href:"https://www.rust-lang.org/zh-CN/tools/install",target:"_blank",rel:"noopener noreferrer"},b=n("p",null,"由于我现在使用的是windows系统，所以本文采用win的环境来进行演示，与Linux上的安装方式差别也不算太大。",-1),m=n("h2",{id:"安装",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#安装","aria-hidden":"true"},"#"),s(" 安装")],-1),k=n("p",null,"学习语言的第一步就是就是安装它，这一块rust做的确实挺好的，官网的中文支持也非常好，有一个专门负责语言自身的安装工具：rustup，所以我们只需要下载rustup就行了。",-1),f=n("figure",null,[n("img",{src:"https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202312061514947.png",alt:"",tabindex:"0",loading:"lazy"}),n("figcaption")],-1),x={href:"https://visualstudio.microsoft.com/zh-hans/visual-cpp-build-tools/",target:"_blank",rel:"noopener noreferrer"},_=t(`<figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202408102125583.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>然后再下载rustup-init.exe，点击执行后是一个命令行，新手的话选默认安装即可，熟悉之后再自定义安装，然后它就会帮你安装好rust和cargo，并且配置环境变量。如果遇到下载缓慢问题，安装<a href="#%E9%95%9C%E5%83%8F">镜像</a>部分配置即可。</p><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202408102130005.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>组件安装成功后，执行如下命令确认安装成功</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ rustc <span class="token parameter variable">-V</span>
rustc <span class="token number">1.80</span>.1 <span class="token punctuation">(</span>3f5fd8dd4 <span class="token number">2024</span>-08-06<span class="token punctuation">)</span>

$ <span class="token function">cargo</span> <span class="token parameter variable">-V</span>
<span class="token function">cargo</span> <span class="token number">1.80</span>.1 <span class="token punctuation">(</span><span class="token number">376290515</span> <span class="token number">2024</span>-07-16<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>能够正确输出版本就说明安装成功了。</p><h2 id="镜像" tabindex="-1"><a class="header-anchor" href="#镜像" aria-hidden="true">#</a> 镜像</h2>`,7),y={href:"https://rsproxy.cn/",target:"_blank",rel:"noopener noreferrer"},q=t(`<p>设置 Rustup 镜像， 修改配置 ~/.zshrc 或 ~/.bashrc</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token builtin class-name">export</span> <span class="token assign-left variable">RUSTUP_DIST_SERVER</span><span class="token operator">=</span><span class="token string">&quot;https://rsproxy.cn&quot;</span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable">RUSTUP_UPDATE_ROOT</span><span class="token operator">=</span><span class="token string">&quot;https://rsproxy.cn/rustup&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div>`,2),w={href:"http://crates.io",target:"_blank",rel:"noopener noreferrer"},R=t(`<div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token punctuation">[</span>source.crates-io<span class="token punctuation">]</span>
replace-with <span class="token operator">=</span> <span class="token string">&#39;rsproxy&#39;</span>
<span class="token punctuation">[</span>source.rsproxy<span class="token punctuation">]</span>
registry <span class="token operator">=</span> <span class="token string">&quot;https://rsproxy.cn/crates.io-index&quot;</span>
<span class="token punctuation">[</span>source.rsproxy-sparse<span class="token punctuation">]</span>
registry <span class="token operator">=</span> <span class="token string">&quot;sparse+https://rsproxy.cn/index/&quot;</span>
<span class="token punctuation">[</span>registries.rsproxy<span class="token punctuation">]</span>
index <span class="token operator">=</span> <span class="token string">&quot;https://rsproxy.cn/crates.io-index&quot;</span>
<span class="token punctuation">[</span>net<span class="token punctuation">]</span>
git-fetch-with-cli <span class="token operator">=</span> <span class="token boolean">true</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="编辑器" tabindex="-1"><a class="header-anchor" href="#编辑器" aria-hidden="true">#</a> 编辑器</h2><p>这个就看个人喜好了，用什么其实都能写，neovim+cargo一样能写，毕竟rust自身的工具链很完善，不过我是windows系统，编辑器的话推荐vscode和rustover。</p><p>使用vscode的话要下载rust拓展，建议下载<code>rust-analyzer</code>，这是社区的rust插件，官方的已经不维护了。</p><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202312061524391.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>如果是rustover的话基本上就是开箱即用。</p><h2 id="工具链" tabindex="-1"><a class="header-anchor" href="#工具链" aria-hidden="true">#</a> 工具链</h2><p>rust安装后会下载一系列工具链，简单介绍以下</p><ul><li>cargo：rust包管理工具</li><li>rustc：rust编译器</li><li>clippy：静态代码优化工具</li><li>rustfmt：代码格式化工具</li><li>rust-std：标准库</li></ul><h2 id="项目" tabindex="-1"><a class="header-anchor" href="#项目" aria-hidden="true">#</a> 项目</h2><p>rust项目可以通过cargo工具来进行创建，rust项目分为两种类型</p><ul><li>bin：表示项目会被编译为二进制文件</li><li>lib：表示项目是一个依赖库</li></ul><p>默认创建bin类型的项目。</p><br><p>在开发本地项目时，cargo编译模式分两种</p><ul><li>debug：编译优化少，速度快，生成的二进制文件运行性能低下，就是开发模式</li><li>release：编译优化多，速度慢，生成的二进制文件性能高，也就是生产模式</li></ul><p>默认情况下采用debug模式。</p><br><p>一个初始的rust项目结构如下</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>|-- Cargo.lock
|-- Cargo.toml
|-- src/
|   \`-- main.rs
\`-- target/
    |-- debug/
    |-- release/
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>cargo.lock</code>和<code>cargo.toml</code>是用于管理依赖的，跟nodejs一样，项目的入口文件是<code>src/main.rs</code>，编译出来的文件会在<code>target</code>目录，以<code>debug</code>和<code>release</code>进行区分。</p><h2 id="hello-world" tabindex="-1"><a class="header-anchor" href="#hello-world" aria-hidden="true">#</a> Hello World</h2><p>使用cargo创建一个新项目</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">cargo</span> new rustlearn
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>编写hello world代码</p><div class="language-rust line-numbers-mode" data-ext="rs"><pre class="language-rust"><code><span class="token keyword">fn</span> <span class="token function-definition function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token macro property">println!</span><span class="token punctuation">(</span><span class="token string">&quot;hello world!&quot;</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>编译并以debug模式运行</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">cargo</span> run
   Compiling rustlearn v0.1.0 <span class="token punctuation">(</span>D:<span class="token punctuation">\\</span>work<span class="token punctuation">\\</span>code<span class="token punctuation">\\</span>learn<span class="token punctuation">\\</span>rustlearn<span class="token punctuation">)</span>
    Finished <span class="token variable"><span class="token variable">\`</span>dev<span class="token variable">\`</span></span> profile <span class="token punctuation">[</span>unoptimized + debuginfo<span class="token punctuation">]</span> target<span class="token punctuation">(</span>s<span class="token punctuation">)</span> <span class="token keyword">in</span> <span class="token number">1</span>.04s
     Running <span class="token variable"><span class="token variable">\`</span>target<span class="token punctuation">\\</span>debug<span class="token punctuation">\\</span>rustlearn.exe<span class="token variable">\`</span></span>
hello world<span class="token operator">!</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>以release模式运行</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">cargo</span> run <span class="token parameter variable">--release</span>
   Compiling rustlearn v0.1.0 <span class="token punctuation">(</span>D:<span class="token punctuation">\\</span>work<span class="token punctuation">\\</span>code<span class="token punctuation">\\</span>learn<span class="token punctuation">\\</span>rustlearn<span class="token punctuation">)</span>
    Finished <span class="token variable"><span class="token variable">\`</span>release<span class="token variable">\`</span></span> profile <span class="token punctuation">[</span>optimized<span class="token punctuation">]</span> target<span class="token punctuation">(</span>s<span class="token punctuation">)</span> <span class="token keyword">in</span> <span class="token number">0</span>.15s                               
     Running <span class="token variable"><span class="token variable">\`</span>target<span class="token punctuation">\\</span>release<span class="token punctuation">\\</span>rustlearn.exe<span class="token variable">\`</span></span>
hello world<span class="token operator">!</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="评价" tabindex="-1"><a class="header-anchor" href="#评价" aria-hidden="true">#</a> 评价</h2><p>Rust的难度并没有像Go一样简单到可以看几个例子就学会语法，个人感觉有些地方设计的非常好，比如错误处理，泛型，枚举，并且依赖管理这方面做的也比Go好很多。它也确实能让人感觉到是一个现代化的语言，自带语言版本管理工具，完善的依赖管理，丰富的文档，跨平台支持良好，就目前带给我的体验而言，感觉没有什么可以抱怨的点。</p>`,32);function z(C,V){const a=p("ExternalLinkIcon");return o(),l("div",null,[u,d,r(" more "),v,g,n("p",null,[s("文档："),n("a",h,[s("安装 Rust - Rust 程序设计语言 (rust-lang.org)"),e(a)])]),b,m,k,f,n("p",null,[s("在此之前还需要下载MSVC也就是"),n("a",x,[s("Microsoft C++ 生成工具"),e(a)]),s("，没有它的话就没法编译。")]),_,n("p",null,[s("在安装rustup以及用cargo安装依赖时，由于服务器在国外，避免不了下载速度缓慢的问题，这里建议使用字节跳动提供的rust镜像："),n("a",y,[s("RsProxy"),e(a)]),s("。")]),q,n("p",null,[s("设置 "),n("a",w,[s("crates.io"),e(a)]),s(" 镜像， 修改配置 ~/.cargo/config.toml，已支持git协议和sparse协议，>=1.68 版本建议使用 sparse-index，速度更快。")]),R])}const N=i(c,[["render",z],["__file","install.html.vue"]]);export{N as default};
