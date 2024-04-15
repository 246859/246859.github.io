import{_ as s,W as a,X as t,Y as e,Z as n,$ as p,a1 as o}from"./framework-a4c02b8f.js";const c={},i=n("h1",{id:"go语言实现按照行数逆序读取文件-模拟tail命令",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#go语言实现按照行数逆序读取文件-模拟tail命令","aria-hidden":"true"},"#"),p(" Go语言实现按照行数逆序读取文件 - 模拟tail命令")],-1),l=n("figure",null,[n("img",{src:"https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202404152051856.png",alt:"",tabindex:"0",loading:"lazy"}),n("figcaption")],-1),u=o(`<hr><h2 id="编写" tabindex="-1"><a class="header-anchor" href="#编写" aria-hidden="true">#</a> 编写</h2><p>Linux中的tail命令很多人应该都用过，我们经常用它来看日志</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">tail</span> <span class="token parameter variable">-n</span> <span class="token number">100</span> /etc/nginx/access.log
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>如果在用go语言实现这一个功能，也是非常的简单，要点就是利用<code>Seek</code>这一函数</p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code><span class="token comment">// Seek sets the offset for the next Read or Write on file to offset, interpreted</span>
<span class="token comment">// according to whence: 0 means relative to the origin of the file, 1 means</span>
<span class="token comment">// relative to the current offset, and 2 means relative to the end.</span>
<span class="token comment">// It returns the new offset and an error, if any.</span>
<span class="token function">Seek</span><span class="token punctuation">(</span>offset <span class="token builtin">int64</span><span class="token punctuation">,</span> whence <span class="token builtin">int</span><span class="token punctuation">)</span> <span class="token punctuation">(</span>ret <span class="token builtin">int64</span><span class="token punctuation">,</span> err <span class="token builtin">error</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>它的第一个参数是偏移量，第二个参数总共有三个值</p><ul><li><code>0</code>，相对于文件头</li><li><code>1</code>，相对于当前的偏移量</li><li><code>2</code>，相对于文件末尾</li></ul><p>一个需要注意的点就是换行符问题，在linux上换行符是CR<code>\\n</code>，而在windows上则是CRLF<code>\\r\\n</code>，在计算偏移量的时候这个问题不能忽视掉，在逆序读取的时候就一个字节一个字节的读，当遇到<code>\\n</code>时就停止，然后再根据不同系统来更新偏移量。最后还需要注意的是逆序读取的偏移量不能小于文件大小的负数，否则就越过文件的起始位置了，在思路明确了以后，编码就比较轻松了，代码整体如下所示。</p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code><span class="token keyword">func</span> <span class="token function">Tail</span><span class="token punctuation">(</span>filename <span class="token builtin">string</span><span class="token punctuation">,</span> n <span class="token builtin">int</span><span class="token punctuation">)</span> <span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">byte</span><span class="token punctuation">,</span> <span class="token builtin">error</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
	file<span class="token punctuation">,</span> err <span class="token operator">:=</span> os<span class="token punctuation">.</span><span class="token function">Open</span><span class="token punctuation">(</span>filename<span class="token punctuation">)</span>
	<span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span>
		<span class="token keyword">return</span> <span class="token boolean">nil</span><span class="token punctuation">,</span> err
	<span class="token punctuation">}</span>
	<span class="token keyword">defer</span> file<span class="token punctuation">.</span><span class="token function">Close</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

    <span class="token comment">// 得到文件的大小</span>
	stat<span class="token punctuation">,</span> err <span class="token operator">:=</span> file<span class="token punctuation">.</span><span class="token function">Stat</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
	<span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span>
		<span class="token keyword">return</span> <span class="token boolean">nil</span><span class="token punctuation">,</span> err
	<span class="token punctuation">}</span>
	size <span class="token operator">:=</span> stat<span class="token punctuation">.</span><span class="token function">Size</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

	<span class="token comment">// 起始偏移量-1</span>
	<span class="token keyword">var</span> offset <span class="token builtin">int64</span> <span class="token operator">=</span> <span class="token operator">-</span><span class="token number">1</span>
	lines <span class="token operator">:=</span> <span class="token function">make</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">byte</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> n<span class="token punctuation">)</span>
	char <span class="token operator">:=</span> <span class="token function">make</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">byte</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span>

	<span class="token keyword">for</span> n <span class="token operator">&gt;</span> <span class="token number">0</span> <span class="token punctuation">{</span>
		<span class="token comment">// 行缓存</span>
		buf <span class="token operator">:=</span> <span class="token function">make</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">byte</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">16</span><span class="token punctuation">)</span>

		<span class="token comment">// 一个字节一个字节的逆序读取</span>
		<span class="token keyword">for</span> offset <span class="token operator">&gt;=</span> <span class="token operator">-</span>size <span class="token punctuation">{</span>
			<span class="token boolean">_</span><span class="token punctuation">,</span> err <span class="token operator">:=</span> file<span class="token punctuation">.</span><span class="token function">Seek</span><span class="token punctuation">(</span>offset<span class="token punctuation">,</span> io<span class="token punctuation">.</span>SeekEnd<span class="token punctuation">)</span>
			<span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span>
				<span class="token keyword">return</span> <span class="token boolean">nil</span><span class="token punctuation">,</span> err
			<span class="token punctuation">}</span>

			<span class="token boolean">_</span><span class="token punctuation">,</span> err <span class="token operator">=</span> file<span class="token punctuation">.</span><span class="token function">Read</span><span class="token punctuation">(</span>char<span class="token punctuation">)</span>
			<span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span>
				<span class="token keyword">return</span> <span class="token boolean">nil</span><span class="token punctuation">,</span> err
			<span class="token punctuation">}</span>
			<span class="token keyword">if</span> char<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span> <span class="token operator">==</span> <span class="token char">&#39;\\n&#39;</span> <span class="token punctuation">{</span>
				<span class="token keyword">break</span>
			<span class="token punctuation">}</span>
			buf <span class="token operator">=</span> <span class="token function">append</span><span class="token punctuation">(</span>buf<span class="token punctuation">,</span> char<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
			offset<span class="token operator">--</span>
		<span class="token punctuation">}</span>
		
        <span class="token comment">// 由于是逆序读取，需要将行反转</span>
		slices<span class="token punctuation">.</span><span class="token function">Reverse</span><span class="token punctuation">(</span>buf<span class="token punctuation">)</span>
		lines <span class="token operator">=</span> <span class="token function">append</span><span class="token punctuation">(</span>lines<span class="token punctuation">,</span> buf<span class="token punctuation">)</span>
		n<span class="token operator">--</span>

        
		offset<span class="token operator">--</span>
        <span class="token comment">// 如果是windows系统，则需要额外移动偏移量</span>
		<span class="token keyword">if</span> runtime<span class="token punctuation">.</span>GOOS <span class="token operator">==</span> <span class="token string">&quot;windows&quot;</span> <span class="token punctuation">{</span> <span class="token comment">// CRLF</span>
			offset<span class="token operator">--</span>
		<span class="token punctuation">}</span>

		<span class="token comment">// 防止seek指针移动到起始位置之外</span>
		<span class="token keyword">if</span> offset <span class="token operator">&lt;</span> <span class="token operator">-</span>size <span class="token punctuation">{</span>
			<span class="token keyword">break</span>
		<span class="token punctuation">}</span>
	<span class="token punctuation">}</span>

    <span class="token comment">// 最后再整体反转</span>
	slices<span class="token punctuation">.</span><span class="token function">Reverse</span><span class="token punctuation">(</span>lines<span class="token punctuation">)</span>
	<span class="token keyword">return</span> lines<span class="token punctuation">,</span> err
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="测试" tabindex="-1"><a class="header-anchor" href="#测试" aria-hidden="true">#</a> 测试</h2><p>文件<code>test.txt</code></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>hello nihao
buhao
wohao
dajiahao
aaa
bbb
ccccccdddda
z\\nzcda
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>一个简单的测试代码</p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code><span class="token keyword">func</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
	tails<span class="token punctuation">,</span> err <span class="token operator">:=</span> <span class="token function">Tail</span><span class="token punctuation">(</span><span class="token string">&quot;test.txt&quot;</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">)</span>
	<span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span>
		log<span class="token punctuation">.</span><span class="token function">Fatal</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span>
	<span class="token punctuation">}</span>
	<span class="token keyword">for</span> <span class="token boolean">_</span><span class="token punctuation">,</span> tail <span class="token operator">:=</span> <span class="token keyword">range</span> tails <span class="token punctuation">{</span>
		fmt<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span><span class="token function">string</span><span class="token punctuation">(</span>tail<span class="token punctuation">)</span><span class="token punctuation">)</span>
	<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>输出</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>ccccccdddda
z\\nzcda
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div>`,17);function r(d,k){return a(),t("div",null,[i,l,e(" more "),u])}const m=s(c,[["render",r],["__file","go_tail_read_file.html.vue"]]);export{m as default};
