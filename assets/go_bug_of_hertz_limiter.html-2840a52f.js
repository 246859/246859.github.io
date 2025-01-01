import{_ as s,W as a,X as t,a0 as e,Y as n,Z as p,a1 as o}from"./framework-b5ea9e64.js";const c={},i=n("h1",{id:"记录hertz框架limiter的一个问题",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#记录hertz框架limiter的一个问题","aria-hidden":"true"},"#"),p(" 记录Hertz框架limiter的一个问题")],-1),l=n("figure",null,[n("img",{src:"https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202403131932279.png",alt:"",tabindex:"0",loading:"lazy"}),n("figcaption")],-1),u=o(`<hr><p>最近在尝试一个新的Web框架<code>Hertz</code>，使用起来跟gin没什么太大的区别，它的周边生态也有一些开源的中间件，在使用其中的limiter时遇到了问题，便记录了下来。</p><h2 id="发现" tabindex="-1"><a class="header-anchor" href="#发现" aria-hidden="true">#</a> 发现</h2><p>首先limiter的算法实现是BBR自适应限流算法，用起来没有问题，用法如下。</p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code><span class="token keyword">func</span> <span class="token function">limiterHandler</span><span class="token punctuation">(</span><span class="token punctuation">)</span> app<span class="token punctuation">.</span>HandlerFunc <span class="token punctuation">{</span>
	newLimiter <span class="token operator">:=</span> limiter<span class="token punctuation">.</span><span class="token function">NewLimiter</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
	<span class="token keyword">return</span> <span class="token keyword">func</span><span class="token punctuation">(</span>c context<span class="token punctuation">.</span>Context<span class="token punctuation">,</span> ctx <span class="token operator">*</span>app<span class="token punctuation">.</span>RequestContext<span class="token punctuation">)</span> <span class="token punctuation">{</span>
		done<span class="token punctuation">,</span> err <span class="token operator">:=</span> newLimiter<span class="token punctuation">.</span><span class="token function">Allow</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
		<span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span>
			ctx<span class="token punctuation">.</span><span class="token function">AbortWithStatusJSON</span><span class="token punctuation">(</span>consts<span class="token punctuation">.</span>StatusTooManyRequests<span class="token punctuation">,</span> types<span class="token punctuation">.</span>Response<span class="token punctuation">{</span>
				Code<span class="token punctuation">:</span> consts<span class="token punctuation">.</span>StatusTooManyRequests<span class="token punctuation">,</span>
				Data<span class="token punctuation">:</span> <span class="token boolean">nil</span><span class="token punctuation">,</span>
				Msg<span class="token punctuation">:</span>  <span class="token string">&quot;too many requests&quot;</span><span class="token punctuation">,</span>
			<span class="token punctuation">}</span><span class="token punctuation">)</span>
		<span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
			ctx<span class="token punctuation">.</span><span class="token function">Next</span><span class="token punctuation">(</span>c<span class="token punctuation">)</span>
			<span class="token function">done</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
		<span class="token punctuation">}</span>
	<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在编译之前进行语法检查，会得到如下报错，提示未定义的类型</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>github.com\\c9s\\goprocinfo@v0.0.0-20210130143923-c95fcf8c64a8\\linux\\disk.go:15:16: undefined: syscall.Statfs_t
github.com\\c9s\\goprocinfo@v0.0.0-20210130143923-c95fcf8c64a8\\linux\\disk.go:16:17: undefined: syscall.Statfs
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>首先会好奇这么个玩意是哪里来的，我好像也没用到过，先通过<code>go mod</code>命令看看是谁依赖了它</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ go mod graph <span class="token operator">|</span> <span class="token function">grep</span> goprocinfo
github.com/dstgo/tracker github.com/c9s/goprocinfo@v0.0.0-20210130143923-c95fcf8c64a8
github.com/hertz-contrib/limiter@v0.0.0-20221008063035-ad27db7cc386 github.com/c9s/goprocinfo@v0.0.0-20210130143923-c95fcf8c64a8
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>原来就是这个limiter导入了它，因为bbr算法的需要获取主机的一些负载信息所以导入了这个库。<code>syscall</code>是标准库中的系统调用库，它不太可能会出问题，那就是用它的库有问题，接下来去这个<code>goprocinfo</code>库里面看看怎么回事，找到的目标代码如下</p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code><span class="token keyword">package</span> linux

<span class="token keyword">import</span> <span class="token punctuation">(</span>
	<span class="token string">&quot;syscall&quot;</span>
<span class="token punctuation">)</span>

<span class="token keyword">type</span> Disk <span class="token keyword">struct</span> <span class="token punctuation">{</span>
	All        <span class="token builtin">uint64</span> <span class="token string">\`json:&quot;all&quot;\`</span>
	Used       <span class="token builtin">uint64</span> <span class="token string">\`json:&quot;used&quot;\`</span>
	Free       <span class="token builtin">uint64</span> <span class="token string">\`json:&quot;free&quot;\`</span>
	FreeInodes <span class="token builtin">uint64</span> <span class="token string">\`json:&quot;freeInodes&quot;\`</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token function">ReadDisk</span><span class="token punctuation">(</span>path <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token punctuation">(</span><span class="token operator">*</span>Disk<span class="token punctuation">,</span> <span class="token builtin">error</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
	fs <span class="token operator">:=</span> syscall<span class="token punctuation">.</span>Statfs_t<span class="token punctuation">{</span><span class="token punctuation">}</span>
	err <span class="token operator">:=</span> syscall<span class="token punctuation">.</span><span class="token function">Statfs</span><span class="token punctuation">(</span>path<span class="token punctuation">,</span> <span class="token operator">&amp;</span>fs<span class="token punctuation">)</span>
	<span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span>
		<span class="token keyword">return</span> <span class="token boolean">nil</span><span class="token punctuation">,</span> err
	<span class="token punctuation">}</span>
	disk <span class="token operator">:=</span> Disk<span class="token punctuation">{</span><span class="token punctuation">}</span>
	disk<span class="token punctuation">.</span>All <span class="token operator">=</span> fs<span class="token punctuation">.</span>Blocks <span class="token operator">*</span> <span class="token function">uint64</span><span class="token punctuation">(</span>fs<span class="token punctuation">.</span>Bsize<span class="token punctuation">)</span>
	disk<span class="token punctuation">.</span>Free <span class="token operator">=</span> fs<span class="token punctuation">.</span>Bfree <span class="token operator">*</span> <span class="token function">uint64</span><span class="token punctuation">(</span>fs<span class="token punctuation">.</span>Bsize<span class="token punctuation">)</span>
	disk<span class="token punctuation">.</span>Used <span class="token operator">=</span> disk<span class="token punctuation">.</span>All <span class="token operator">-</span> disk<span class="token punctuation">.</span>Free
	disk<span class="token punctuation">.</span>FreeInodes <span class="token operator">=</span> fs<span class="token punctuation">.</span>Ffree
	<span class="token keyword">return</span> <span class="token operator">&amp;</span>disk<span class="token punctuation">,</span> <span class="token boolean">nil</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这段代码的逻辑很简单，就是通过系统调用来获取某一个路径下文件夹使用额度，但是遗憾的是Windows系统并不支持<code>Statfs</code>这个系统调用，所以对于win系统而言，编译后并不会存在<code>Statfs_t</code>类型和<code>Statfs</code>函数，所以整个问题的原因就是<code>goprocinfo</code>这个库没有根据不同的系统做兼容而导致的。</p><h2 id="解决" tabindex="-1"><a class="header-anchor" href="#解决" aria-hidden="true">#</a> 解决</h2><p>由于我的开发工作是在windows上进行的，不可能去迁移到linux上，所以只能更换一个新的限流库，这里找到了<code>go-kratos</code>开源的一个bbr限流库。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>https://github.com/go-kratos/aegis/blob/main/ratelimit/
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>在更换过后，代码变化也不多</p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code><span class="token keyword">func</span> <span class="token function">limiterHandler</span><span class="token punctuation">(</span><span class="token punctuation">)</span> app<span class="token punctuation">.</span>HandlerFunc <span class="token punctuation">{</span>
	limiter <span class="token operator">:=</span> bbr<span class="token punctuation">.</span><span class="token function">NewLimiter</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
	<span class="token keyword">return</span> <span class="token keyword">func</span><span class="token punctuation">(</span>c context<span class="token punctuation">.</span>Context<span class="token punctuation">,</span> ctx <span class="token operator">*</span>app<span class="token punctuation">.</span>RequestContext<span class="token punctuation">)</span> <span class="token punctuation">{</span>
		done<span class="token punctuation">,</span> err <span class="token operator">:=</span> limiter<span class="token punctuation">.</span><span class="token function">Allow</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
		<span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span>
			ctx<span class="token punctuation">.</span><span class="token function">AbortWithStatusJSON</span><span class="token punctuation">(</span>consts<span class="token punctuation">.</span>StatusTooManyRequests<span class="token punctuation">,</span> types<span class="token punctuation">.</span>Response<span class="token punctuation">{</span>
				Code<span class="token punctuation">:</span> consts<span class="token punctuation">.</span>StatusTooManyRequests<span class="token punctuation">,</span>
				Data<span class="token punctuation">:</span> <span class="token boolean">nil</span><span class="token punctuation">,</span>
				Msg<span class="token punctuation">:</span>  <span class="token string">&quot;too many requests&quot;</span><span class="token punctuation">,</span>
			<span class="token punctuation">}</span><span class="token punctuation">)</span>
		<span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
			ctx<span class="token punctuation">.</span><span class="token function">Next</span><span class="token punctuation">(</span>c<span class="token punctuation">)</span>
			<span class="token function">done</span><span class="token punctuation">(</span>ratelimit<span class="token punctuation">.</span>DoneInfo<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span>
		<span class="token punctuation">}</span>
	<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>go-kratos</code>所使用的系统信息库是<code>gopsutil</code>，后者是一个专门兼容各个操作系统的系统信息库，对外屏蔽了复杂的系统调用，兼容性要更高。</p>`,18);function d(r,k){return a(),t("div",null,[i,l,e(" more "),u])}const m=s(c,[["render",d],["__file","go_bug_of_hertz_limiter.html.vue"]]);export{m as default};