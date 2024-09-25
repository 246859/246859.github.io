import{_ as s,W as a,X as e,a0 as t,Y as n,Z as o,a1 as p}from"./framework-b5ea9e64.js";const i={},c=n("h1",{id:"go读取linux命令行管道参数",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#go读取linux命令行管道参数","aria-hidden":"true"},"#"),o(" Go读取Linux命令行管道参数")],-1),l=n("figure",null,[n("img",{src:"https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202312231144152.jpg",alt:"",tabindex:"0",loading:"lazy"}),n("figcaption")],-1),u=p(`<hr><p>在用go编写命令行程序的时候，参数有三个来源</p><ol><li>命令行参数</li><li>命令行标志</li><li>管道</li></ol><p>Linux管道是一个很常见的用法，用于将上一个命令的结果作为下一个命令的参数</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">cat</span> hello.txt <span class="token operator">|</span> <span class="token function">grep</span> hello
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>但并不是所有命令行程序都支持管道参数，比如<code>echo</code>就不支持，这种情况我们一般会用<code>xargs</code>来转化下。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">cat</span> hello.txt <span class="token operator">|</span> <span class="token function">xargs</span> <span class="token builtin class-name">echo</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>它会读取管道参数然后作为标准命令行参数传递给下一个命令，不过它有可能会破坏源文件的内容，所以我们还是自身支持管道更好一些。</p><p>在使用管道时，实际上是将结果写入了标准输入<code>stdin</code>中，对于我们而言，就只需要从标准输入中读取就行了。很容易就能想到该怎么写</p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code>args<span class="token punctuation">,</span> <span class="token boolean">_</span> <span class="token operator">:=</span> io<span class="token punctuation">.</span><span class="token function">ReadAll</span><span class="token punctuation">(</span>os<span class="token punctuation">.</span>Stdin<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>可如果只是直接从标准输入读取，如果在使用命令的时候没有使用管道，那么这行代码就会一直阻塞下去。所以我们得首先判断是否是管道模式，再去读取管道参数，所以应该这样写</p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code><span class="token keyword">package</span> main

<span class="token keyword">import</span> <span class="token punctuation">(</span>
	<span class="token string">&quot;fmt&quot;</span>
	<span class="token string">&quot;io&quot;</span>
	<span class="token string">&quot;os&quot;</span>
<span class="token punctuation">)</span>

<span class="token keyword">func</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
	stat<span class="token punctuation">,</span> <span class="token boolean">_</span> <span class="token operator">:=</span> os<span class="token punctuation">.</span>Stdin<span class="token punctuation">.</span><span class="token function">Stat</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
	<span class="token keyword">if</span> stat<span class="token punctuation">.</span><span class="token function">Mode</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">&amp;</span>os<span class="token punctuation">.</span>ModeNamedPipe <span class="token operator">==</span> os<span class="token punctuation">.</span>ModeNamedPipe <span class="token punctuation">{</span>
		bytes<span class="token punctuation">,</span> <span class="token boolean">_</span> <span class="token operator">:=</span> io<span class="token punctuation">.</span><span class="token function">ReadAll</span><span class="token punctuation">(</span>os<span class="token punctuation">.</span>Stdin<span class="token punctuation">)</span>
		fmt<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span><span class="token function">string</span><span class="token punctuation">(</span>bytes<span class="token punctuation">)</span><span class="token punctuation">)</span>
		<span class="token keyword">return</span>
	<span class="token punctuation">}</span>
	fmt<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span><span class="token string">&quot;do nothing&quot;</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>看看使用情况</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">cat</span> main.go <span class="token operator">|</span> ./main.exe
package main

<span class="token function">import</span> <span class="token punctuation">(</span>
        <span class="token string">&quot;fmt&quot;</span>
        <span class="token string">&quot;io&quot;</span>
        <span class="token string">&quot;os&quot;</span>
<span class="token punctuation">)</span>

func <span class="token function-name function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        stat, _ :<span class="token operator">=</span> os.Stdin.Stat<span class="token punctuation">(</span><span class="token punctuation">)</span>
        <span class="token keyword">if</span> stat.Mode<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">&amp;</span>os.ModeNamedPipe <span class="token operator">==</span> os.ModeNamedPipe <span class="token punctuation">{</span>
                bytes, _ :<span class="token operator">=</span> io.ReadAll<span class="token punctuation">(</span>os.Stdin<span class="token punctuation">)</span>
                fmt.Println<span class="token punctuation">(</span>string<span class="token punctuation">(</span>bytes<span class="token punctuation">))</span>
                <span class="token builtin class-name">return</span>
        <span class="token punctuation">}</span>
        fmt.Println<span class="token punctuation">(</span><span class="token string">&quot;do nothing&quot;</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>不使用管道</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ ./main.exe
<span class="token keyword">do</span> nothing
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>这样一来，就可以区分使用管道和不使用管道的情况了，在不使用管道的情况下就可以从标准命令行参数里面去读取。</p>`,17);function d(r,k){return a(),e("div",null,[c,l,t(" more "),u])}const m=s(i,[["render",d],["__file","pipeline.html.vue"]]);export{m as default};
