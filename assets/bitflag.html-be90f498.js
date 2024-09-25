import{_ as s,W as a,X as e,a0 as p,Y as n,Z as o,a1 as t}from"./framework-b5ea9e64.js";const l={},c=n("h1",{id:"位运算保存状态",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#位运算保存状态","aria-hidden":"true"},"#"),o(" 位运算保存状态")],-1),i=n("figure",null,[n("img",{src:"https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202311291911647.png",alt:"",tabindex:"0",loading:"lazy"}),n("figcaption")],-1),r=t(`<hr><h2 id="理论" tabindex="-1"><a class="header-anchor" href="#理论" aria-hidden="true">#</a> 理论</h2><p>在go里面，没有提供枚举这一类型，所以我们会通过声明常量来表示一些特定的状态，比如下面这种形式</p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code><span class="token keyword">const</span> <span class="token punctuation">(</span>
	A <span class="token operator">=</span> <span class="token number">1</span> <span class="token operator">+</span> <span class="token boolean">iota</span>
	B
	C
	D
<span class="token punctuation">)</span>

<span class="token keyword">var</span> status <span class="token builtin">uint8</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>通过<code>const</code> + <code>iota</code>的方式来定义一些状态，这样做的缺点在于，一个变量只能同时存储一个状态，如果要同时表示多个状态，就需要使用多个变量，而使用位来存储这些状态可以很好的解决这种问题，其过程只涉及到了简单的位运算。</p><p>比特位存储状态原理是每一个比特位表示一个状态，1表示拥有此状态，0表示未拥有此状态，那么总共能表示多少个状态取决于有多少个比特位，在go语言中，使用<code>uint64</code>类型可以最多可以表示64个状态。在这种情况下，其所存储状态的值就有一定的要求，其值必须是2的整数次方，比如2的2次方</p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code><span class="token number">0b10</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>2的8次方</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>0b10000000
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>假设现在用一个无符号8位整数来存储这些状态，意味着可以有8个比特位可以使用，也就是<code>uint8(0)</code></p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code><span class="token keyword">const</span> <span class="token punctuation">(</span>
	A <span class="token operator">=</span> <span class="token number">0b1</span> <span class="token operator">&lt;&lt;</span> <span class="token boolean">iota</span>
	B
	C
	D
<span class="token punctuation">)</span>

<span class="token keyword">var</span> status <span class="token builtin">uint8</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>将其与<code>0b10</code>进行或运算，或运算的符号是<code>|</code></p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code>    <span class="token number">00000010</span>
 <span class="token operator">|</span>  <span class="token number">00000000</span>
<span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span>
    <span class="token number">00000010</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>或运算的规则是同为0取0，否则取1，进行或运算后，就可以将该状态的标志位记录到变量中。同理，也可以存储多个其它不同的状态，将上面计算的结果与<code>0b10000000</code>再次进行或运算后，此时状态变量的二进制位中，已经有两个比特位为1。</p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code>    <span class="token number">10000000</span>
 <span class="token operator">|</span>  <span class="token number">00000010</span>
<span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span>
    <span class="token number">10000010</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果要一次性存储多个状态，可以先将几个状态进行或运算，再存储到状态变量中，比如一次性存储状态ABCD</p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code>    <span class="token number">00000001</span>
 <span class="token operator">|</span>  <span class="token number">00000010</span>
<span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span>
    <span class="token number">00000011</span>
 <span class="token operator">|</span>  <span class="token number">00000100</span>
<span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span>
    <span class="token number">00000111</span>
 <span class="token operator">|</span>  <span class="token number">00001000</span>
<span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span>
    <span class="token number">00001111</span>
 <span class="token operator">|</span>  <span class="token number">00000000</span>
<span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span>
    <span class="token number">00001111</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>最终<code>status</code>的值就是</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>0b00001111
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>既然有存储状态，就肯定要读取状态，读取状态的原理同样十分简单。假如要确认状态<code>A</code>是否存在于<code>status</code>变量中，使用与运算<code>&amp;</code>即可，其规则为同为1取1，否则取0，由于这些状态值全都是2的正整数次方，二进制位中永远只有一个位为1，所以两者进行与运算时，只有相同的那一个比特位才能为1，其余全为0，如果计算结果为0，说明指定位不相同，则不包含此状态，计算过程如下。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>    00000001
 &amp;  00001111
------------
    00000001
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>同理，如果想判断多个状态是否存在于<code>status</code>中，将多个状态值进行或运算，然后将结果与<code>status</code>进行与运算即可，比如下面判断是否同时包含状态ABC。</p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code>    <span class="token number">00000001</span>
 <span class="token operator">|</span>  <span class="token number">00000000</span>
<span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span>
    <span class="token number">00000001</span>
 <span class="token operator">|</span>  <span class="token number">00000010</span>
<span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span>
    <span class="token number">00000011</span>
 <span class="token operator">|</span>  <span class="token number">00000100</span>
<span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span>
    <span class="token number">00000111</span>
 <span class="token operator">&amp;</span>  <span class="token number">00001111</span>
<span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span>
    <span class="token number">00000111</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>最后一个操作就是撤销状态，将指定状态从<code>status</code>中删除，经过上面两个操作的讲解后相信可以很容易就能想到删除的原理。实际上有两种方法可以操作，其结果都是一样的，第一种是将指定状态取反，然后将结果与<code>status</code>相与，就能得到删除指定状态后的<code>status</code>。假设删除状态<code>D</code>其过程如下，</p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code> ~  <span class="token number">00001000</span>
<span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span>
    <span class="token number">11110111</span>
 <span class="token operator">&amp;</span>  <span class="token number">00001111</span>
<span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span>
    <span class="token number">00000111</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>取反会将自身的每一个比特位反转，反转后只有一个比特位为0，也就是要删除的比特位，这样一来将与<code>status</code>进行与运算，就能将指定比特位置0。另一个方法就是直接将两者进行异或运算，异或的规则是不相同取1，相同取0，计算过程如下</p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code>    <span class="token number">00001000</span>
 <span class="token operator">^</span>  <span class="token number">00001111</span>
<span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span>
    <span class="token number">00000111</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看得出来异或就等于取反后相与，两者是完全等价的。如果要删除多个状态，跟之前同理，多个状态进行或运算后再进行异或，比如下面删除状态ABC</p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code>    <span class="token number">00000001</span>
 <span class="token operator">|</span>  <span class="token number">00000000</span>
<span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span>
    <span class="token number">00000001</span>
 <span class="token operator">|</span>  <span class="token number">00000010</span>
<span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span>
    <span class="token number">00000011</span>
 <span class="token operator">|</span>  <span class="token number">00000100</span>
<span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span>
    <span class="token number">00000111</span>
 <span class="token operator">^</span>  <span class="token number">00001111</span>
<span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span>
    <span class="token number">00001000</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="实现" tabindex="-1"><a class="header-anchor" href="#实现" aria-hidden="true">#</a> 实现</h2><p>理论部分讲完过后，下面看看怎么用代码来进行实现，这种操作是不限语言的，这里使用go语言来进行实现。需要注意的是，go语言中取反运算符和异或运算符是同一个，都是<code>^</code>符号。</p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code><span class="token keyword">type</span> BitFlag <span class="token builtin">uint64</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>首先可以声明一个<code>BitFlag</code>类型，其底层类型为<code>uint64</code>，最多可以同时存储64个状态，在实际代码中可以直接使用位运算来进行操作，这里选择稍微封装了一下。</p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code><span class="token keyword">type</span> BitFlag <span class="token builtin">uint64</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>bf <span class="token operator">*</span>BitFlag<span class="token punctuation">)</span> <span class="token function">Store</span><span class="token punctuation">(</span>flags <span class="token operator">...</span><span class="token builtin">uint64</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
	<span class="token keyword">for</span> <span class="token boolean">_</span><span class="token punctuation">,</span> flag <span class="token operator">:=</span> <span class="token keyword">range</span> flags <span class="token punctuation">{</span>
		<span class="token operator">*</span>bf <span class="token operator">|=</span> <span class="token function">BitFlag</span><span class="token punctuation">(</span>flag<span class="token punctuation">)</span>
	<span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>bf <span class="token operator">*</span>BitFlag<span class="token punctuation">)</span> <span class="token function">Check</span><span class="token punctuation">(</span>flags <span class="token operator">...</span><span class="token builtin">uint64</span><span class="token punctuation">)</span> <span class="token builtin">bool</span> <span class="token punctuation">{</span>
	<span class="token keyword">var</span> f <span class="token builtin">uint64</span>
	<span class="token keyword">for</span> <span class="token boolean">_</span><span class="token punctuation">,</span> flag <span class="token operator">:=</span> <span class="token keyword">range</span> flags <span class="token punctuation">{</span>
		f <span class="token operator">|=</span> flag
	<span class="token punctuation">}</span>

	<span class="token keyword">return</span> <span class="token operator">*</span>bf<span class="token operator">&amp;</span><span class="token function">BitFlag</span><span class="token punctuation">(</span>f<span class="token punctuation">)</span> <span class="token operator">!=</span> <span class="token number">0</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>bf <span class="token operator">*</span>BitFlag<span class="token punctuation">)</span> <span class="token function">Revoke</span><span class="token punctuation">(</span>flags <span class="token operator">...</span><span class="token builtin">uint64</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
	<span class="token keyword">var</span> f <span class="token builtin">uint64</span>
	<span class="token keyword">for</span> <span class="token boolean">_</span><span class="token punctuation">,</span> flag <span class="token operator">:=</span> <span class="token keyword">range</span> flags <span class="token punctuation">{</span>
		f <span class="token operator">|=</span> flag
	<span class="token punctuation">}</span>
	<span class="token operator">*</span>bf <span class="token operator">^=</span> <span class="token function">BitFlag</span><span class="token punctuation">(</span>f<span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看到代码量非常少，实现起来也很简单，下面是一个简单的使用案例</p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code><span class="token keyword">const</span> <span class="token punctuation">(</span>
	A <span class="token operator">=</span> <span class="token number">0b1</span> <span class="token operator">&lt;&lt;</span> <span class="token boolean">iota</span>
	B
	C
	D
	E
	F
	G
<span class="token punctuation">)</span>

<span class="token keyword">func</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
	<span class="token keyword">var</span> flag BitFlag
	flag<span class="token punctuation">.</span><span class="token function">Store</span><span class="token punctuation">(</span>A<span class="token punctuation">,</span> B<span class="token punctuation">,</span> C<span class="token punctuation">,</span> D<span class="token punctuation">,</span> E<span class="token punctuation">)</span>
	fmt<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span>flag<span class="token punctuation">.</span><span class="token function">Check</span><span class="token punctuation">(</span>A<span class="token punctuation">,</span> E<span class="token punctuation">)</span><span class="token punctuation">)</span>
	fmt<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span>flag<span class="token punctuation">.</span><span class="token function">Check</span><span class="token punctuation">(</span>F<span class="token punctuation">,</span> G<span class="token punctuation">)</span><span class="token punctuation">)</span>
	flag<span class="token punctuation">.</span><span class="token function">Revoke</span><span class="token punctuation">(</span>A<span class="token punctuation">,</span> D<span class="token punctuation">)</span>
	fmt<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span>flag<span class="token punctuation">.</span><span class="token function">Check</span><span class="token punctuation">(</span>A<span class="token punctuation">,</span> D<span class="token punctuation">)</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>输出</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>true
false
false
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,38);function d(u,k){return a(),e("div",null,[c,i,p(" more "),r])}const m=s(l,[["render",d],["__file","bitflag.html.vue"]]);export{m as default};
