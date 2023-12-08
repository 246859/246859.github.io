import{_ as s,W as a,X as t,Y as p,Z as n,$ as e,a1 as o}from"./framework-a4c02b8f.js";const c={},l=n("h1",{id:"经典排序算法",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#经典排序算法","aria-hidden":"true"},"#"),e(" 经典排序算法")],-1),i=n("figure",null,[n("img",{src:"https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202312081421944.png",alt:"",tabindex:"0",loading:"lazy"}),n("figcaption")],-1),u=o(`<hr><h2 id="冒泡排序" tabindex="-1"><a class="header-anchor" href="#冒泡排序" aria-hidden="true">#</a> 冒泡排序</h2><p>冒泡排序是最简单的一种排序，也是最暴力的排序方法，对于大多数初学者而言，它是很多人接触的第一个排序方法。大致实现思路如下：从下标0开始，不断将两个数字相比较，如果前一个数大于后一个数字，那么就交换位置，直至末尾。外层循环每一轮结束后，就能确定一个值是第<code>i+1</code>大的元素，于是后续的元素就不再去交换，所以内层循环的终止条件是<code>len(slice)-(i+1)</code>。</p><p>下面是一个冒泡排序的泛型实现。</p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code><span class="token keyword">func</span> BubbleSort<span class="token punctuation">[</span>T any<span class="token punctuation">]</span><span class="token punctuation">(</span>s <span class="token punctuation">[</span><span class="token punctuation">]</span>T<span class="token punctuation">,</span> less <span class="token keyword">func</span><span class="token punctuation">(</span>a<span class="token punctuation">,</span> b T<span class="token punctuation">)</span> <span class="token builtin">bool</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
	<span class="token keyword">for</span> i <span class="token operator">:=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token function">len</span><span class="token punctuation">(</span>s<span class="token punctuation">)</span><span class="token punctuation">;</span> i<span class="token operator">++</span> <span class="token punctuation">{</span>
		<span class="token keyword">for</span> j <span class="token operator">:=</span> <span class="token number">0</span><span class="token punctuation">;</span> j <span class="token operator">&lt;</span> <span class="token function">len</span><span class="token punctuation">(</span>s<span class="token punctuation">)</span><span class="token operator">-</span><span class="token number">1</span><span class="token operator">-</span>i<span class="token punctuation">;</span> j<span class="token operator">++</span> <span class="token punctuation">{</span>
			<span class="token keyword">if</span> <span class="token function">less</span><span class="token punctuation">(</span>s<span class="token punctuation">[</span>j<span class="token operator">+</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">,</span> s<span class="token punctuation">[</span>j<span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
				s<span class="token punctuation">[</span>j<span class="token operator">+</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">,</span> s<span class="token punctuation">[</span>j<span class="token punctuation">]</span> <span class="token operator">=</span> s<span class="token punctuation">[</span>j<span class="token punctuation">]</span><span class="token punctuation">,</span> s<span class="token punctuation">[</span>j<span class="token operator">+</span><span class="token number">1</span><span class="token punctuation">]</span>
			<span class="token punctuation">}</span>
		<span class="token punctuation">}</span>
	<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>时间复杂度：O(n^2）</strong></p><p>不管情况好坏，它需要交换总共 (n-1)+(n-2)+(n-3)+...+1 次 ，对其进行数列求和为 (n^2-n)/2 ，忽略低阶项则为O(n^2)，即便整个切片已经是完全有序的。</p><p><strong>空间复杂度：O(1）</strong></p><p>算法进行过程中没用到任何的额外空间，所以为O(1)</p><p><strong>性能测试</strong></p><p>对其进行基准测试，分别使用100，1000，1w，10w个随机整数进行排序，测试数据如下</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>goos: windows
goarch: amd64
pkg: sorts
cpu: 11th Gen Intel(R) Core(TM) i7-11800H @ 2.30GHz
BenchmarkBubbleSort/100-16        104742             10910 ns/op               0 B/op          0 allocs/op
BenchmarkBubbleSort/1000-16          984           1149239 ns/op               0 B/op          0 allocs/op
BenchmarkBubbleSort/10000-16           7         158096014 ns/op               1 B/op          0 allocs/op
BenchmarkBubbleSort/100000-16          1        19641943300 ns/op              0 B/op          0 allocs/op
PASS
ok      sorts   23.037s
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>随着数据量的增多，冒泡排序所耗费的时间差不多是在以平方的级别在增长，到了10w级别的时候，要花费整整18秒才能完成排序，值得注意的是整个过程中没有发生任何的内存分配。百万数据量耗时太久了，就懒得测了。</p><p><strong>优化</strong></p><p>第一个优化点是原版冒泡即便在数据完全有序的情况下依然会去进行比较，所以当一趟循环完后如果发现数据是有序的应该可以直接退出，这是减少外层循环的次数。由于冒泡排序每轮会冒泡一个有序的数据到右边去，所以每轮循环后都会缩小冒泡的范围，假设数据右边已经是有序的了，那么这种操作就可以提前，而不需要等到指定循环次数之后才缩小范围，比如下面这种数据</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>4,1,3,2,5,6,7,8,9
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>这个范围的边界实际上就是上一轮循环最后一次发生交换的下标，这是减少了内循环次数。这里提一嘴使用位运算也可以实现数字交换，算是第三个优化点，但仅限于整数类型。优化后的代码如下</p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code><span class="token keyword">func</span> BubbleSort<span class="token punctuation">[</span>T any<span class="token punctuation">]</span><span class="token punctuation">(</span>s <span class="token punctuation">[</span><span class="token punctuation">]</span>T<span class="token punctuation">,</span> less <span class="token keyword">func</span><span class="token punctuation">(</span>a<span class="token punctuation">,</span> b T<span class="token punctuation">)</span> <span class="token builtin">bool</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
	<span class="token comment">// 记录最后一个交换的下标</span>
	last <span class="token operator">:=</span> <span class="token function">len</span><span class="token punctuation">(</span>s<span class="token punctuation">)</span> <span class="token operator">-</span> <span class="token number">1</span>
	<span class="token keyword">for</span> i <span class="token operator">:=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token function">len</span><span class="token punctuation">(</span>s<span class="token punctuation">)</span><span class="token punctuation">;</span> i<span class="token operator">++</span> <span class="token punctuation">{</span>
		<span class="token comment">// 记录整个切片是否已经有序</span>
		isSorted <span class="token operator">:=</span> <span class="token boolean">true</span>
		<span class="token comment">// 内循环只截至到last</span>
		<span class="token keyword">for</span> j <span class="token operator">:=</span> <span class="token number">0</span><span class="token punctuation">;</span> j <span class="token operator">&lt;</span> last<span class="token punctuation">;</span> j<span class="token operator">++</span> <span class="token punctuation">{</span>
			<span class="token keyword">if</span> <span class="token function">less</span><span class="token punctuation">(</span>s<span class="token punctuation">[</span>j<span class="token operator">+</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">,</span> s<span class="token punctuation">[</span>j<span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
				s<span class="token punctuation">[</span>j<span class="token operator">+</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">,</span> s<span class="token punctuation">[</span>j<span class="token punctuation">]</span> <span class="token operator">=</span> s<span class="token punctuation">[</span>j<span class="token punctuation">]</span><span class="token punctuation">,</span> s<span class="token punctuation">[</span>j<span class="token operator">+</span><span class="token number">1</span><span class="token punctuation">]</span>
				isSorted <span class="token operator">=</span> <span class="token boolean">false</span>
				last <span class="token operator">=</span> j
			<span class="token punctuation">}</span>
		<span class="token punctuation">}</span>

		<span class="token keyword">if</span> isSorted <span class="token punctuation">{</span>
			<span class="token keyword">return</span>
		<span class="token punctuation">}</span>
	<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>优化只能提高冒泡的平均时间效率，在最差情况下，也就是数据完全逆序/升序的时候，对其进行升序/逆序排序，渐进时间复杂度依旧是O(n^2)。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>goos: windows
goarch: amd64
pkg: sorts
cpu: 11th Gen Intel(R) Core(TM) i7-11800H @ 2.30GHz
BenchmarkBubbleSort/100-16        104742             10910 ns/op               0 B/op          0 allocs/op
BenchmarkBubbleSort/1000-16          984           1149239 ns/op               0 B/op          0 allocs/op
BenchmarkBubbleSort/10000-16           7         158096014 ns/op               1 B/op          0 allocs/op
BenchmarkBubbleSort/100000-16          1        19641943300 ns/op              0 B/op          0 allocs/op
BenchmarkBubbleSortPlus/100-16            115183             10537 ns/op               0 B/op          0 allocs/op
BenchmarkBubbleSortPlus/1000-16             1090           1092803 ns/op               0 B/op          0 allocs/op
BenchmarkBubbleSortPlus/10000-16               8         139880100 ns/op               0 B/op          0 allocs/op
BenchmarkBubbleSortPlus/100000-16              1        18904012900 ns/op              0 B/op          0 allocs/op
PASS
ok      sorts   51.565s
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>提升并不是特别明显，因为数据是完全随机的，可能很多生成的数据并没有走到优化点上，这也变相证明了冒泡排序不太适合实际使用。</p><h2 id="选择排序" tabindex="-1"><a class="header-anchor" href="#选择排序" aria-hidden="true">#</a> 选择排序</h2><p>选择排序的思路非常的清晰和容易实现，首先在数组的未排序部分找出其中的最大或最小值，也就是然后将最大值或最小值其与数组的中的第i个元素交换位置。第一个交换的一定是第一大或第一小的元素，第二个就是第二大或第二小的元素，这样一来就确认了有序的部分，如此在未排序的部分循环往复，直到整个数组有序。</p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code><span class="token keyword">func</span> SelectSort<span class="token punctuation">[</span>T any<span class="token punctuation">]</span><span class="token punctuation">(</span>s <span class="token punctuation">[</span><span class="token punctuation">]</span>T<span class="token punctuation">,</span> less <span class="token keyword">func</span><span class="token punctuation">(</span>a<span class="token punctuation">,</span> b T<span class="token punctuation">)</span> <span class="token builtin">bool</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
	<span class="token keyword">for</span> i <span class="token operator">:=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token function">len</span><span class="token punctuation">(</span>s<span class="token punctuation">)</span><span class="token punctuation">;</span> i<span class="token operator">++</span> <span class="token punctuation">{</span>
		minI <span class="token operator">:=</span> i
		<span class="token keyword">for</span> j <span class="token operator">:=</span> i <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">;</span> j <span class="token operator">&lt;</span> <span class="token function">len</span><span class="token punctuation">(</span>s<span class="token punctuation">)</span><span class="token punctuation">;</span> j<span class="token operator">++</span> <span class="token punctuation">{</span>
			<span class="token keyword">if</span> <span class="token function">less</span><span class="token punctuation">(</span>s<span class="token punctuation">[</span>j<span class="token punctuation">]</span><span class="token punctuation">,</span> s<span class="token punctuation">[</span>minI<span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
				minI <span class="token operator">=</span> j
			<span class="token punctuation">}</span>
		<span class="token punctuation">}</span>
		s<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">,</span> s<span class="token punctuation">[</span>minI<span class="token punctuation">]</span> <span class="token operator">=</span> s<span class="token punctuation">[</span>minI<span class="token punctuation">]</span><span class="token punctuation">,</span> s<span class="token punctuation">[</span>i<span class="token punctuation">]</span>
	<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>时间复杂度：O(n^2)</strong></p><p>不管在什么情况，在选择排序的过程中，它都会在每轮循环后的未排序部分去比较寻找最大值，所以比较次数为(n-1)+(n-2)+(n-3)....+1差不多就是(n<sup>2+n)/2，所以其时间复杂度为O(n</sup>2)。</p><p><strong>空间复杂度：O(1)</strong></p><p>排序过程中没有用到任何的额外空间来辅助，所以时间复杂度为O(1)。</p><p><strong>性能测试</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>goos: windows
goarch: amd64
pkg: sorts
cpu: 11th Gen Intel(R) Core(TM) i7-11800H @ 2.30GHz
BenchmarkSelectSort/100-16        109363             10377 ns/op               0 B/op          0 allocs/op
BenchmarkSelectSort/1000-16         1260            939461 ns/op               0 B/op          0 allocs/op
BenchmarkSelectSort/10000-16          13          88333308 ns/op               0 B/op          0 allocs/op
BenchmarkSelectSort/100000-16          1        9028276000 ns/op               0 B/op          0 allocs/op
PASS
ok      sorts   13.263s
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看到的是选择排序在10w数据量时选择排序花费的时间是冒泡的一半左右，这是因为冒泡每轮循环交换的次数比较多，而选择排序每轮循环只交换一次，总体上从时间来说是优于冒泡排序的。</p><p><strong>优化</strong></p><p>原版选择排序只会在切片的左边构建有序部分，在右边无序的部分去寻找最大或最小值，既然反正都是在无序部分寻找最大/最小值，那就可以在切片左右两边都构建有序区，假设是升序排序，左边是最小，右边是最大，中间就是无序区，这样一来就可以减少差不多一半的比较次数。优化后的代码如下</p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code><span class="token keyword">func</span> SelectSort<span class="token punctuation">[</span>T any<span class="token punctuation">]</span><span class="token punctuation">(</span>s <span class="token punctuation">[</span><span class="token punctuation">]</span>T<span class="token punctuation">,</span> less <span class="token keyword">func</span><span class="token punctuation">(</span>a<span class="token punctuation">,</span> b T<span class="token punctuation">)</span> <span class="token builtin">bool</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
	<span class="token comment">// 记录左右两边的边界</span>
	l<span class="token punctuation">,</span> r <span class="token operator">:=</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token function">len</span><span class="token punctuation">(</span>s<span class="token punctuation">)</span><span class="token operator">-</span><span class="token number">1</span>
	<span class="token keyword">for</span> l <span class="token operator">&lt;</span> r <span class="token punctuation">{</span>
		minI<span class="token punctuation">,</span> maxI <span class="token operator">:=</span> l<span class="token punctuation">,</span> r
		<span class="token keyword">for</span> j <span class="token operator">:=</span> l<span class="token punctuation">;</span> j <span class="token operator">&lt;=</span> r<span class="token punctuation">;</span> j<span class="token operator">++</span> <span class="token punctuation">{</span>
			<span class="token keyword">if</span> <span class="token function">less</span><span class="token punctuation">(</span>s<span class="token punctuation">[</span>j<span class="token punctuation">]</span><span class="token punctuation">,</span> s<span class="token punctuation">[</span>minI<span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
				minI <span class="token operator">=</span> j
			<span class="token punctuation">}</span>

			<span class="token keyword">if</span> <span class="token operator">!</span><span class="token function">less</span><span class="token punctuation">(</span>s<span class="token punctuation">[</span>j<span class="token punctuation">]</span><span class="token punctuation">,</span> s<span class="token punctuation">[</span>maxI<span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
				maxI <span class="token operator">=</span> j
			<span class="token punctuation">}</span>
		<span class="token punctuation">}</span>

		<span class="token comment">// 没找到就没必要交换</span>
		<span class="token keyword">if</span> minI <span class="token operator">!=</span> l <span class="token punctuation">{</span>
			s<span class="token punctuation">[</span>minI<span class="token punctuation">]</span><span class="token punctuation">,</span> s<span class="token punctuation">[</span>l<span class="token punctuation">]</span> <span class="token operator">=</span> s<span class="token punctuation">[</span>l<span class="token punctuation">]</span><span class="token punctuation">,</span> s<span class="token punctuation">[</span>minI<span class="token punctuation">]</span>

			<span class="token comment">// 如果maxI==l，说明maxI上已经不是原来的那个值了</span>
			<span class="token comment">// 因为l和minI已经交换过了，此时的l就是minI，所以要纠正一下</span>
			<span class="token keyword">if</span> l <span class="token operator">==</span> maxI <span class="token punctuation">{</span>
				maxI <span class="token operator">=</span> minI
			<span class="token punctuation">}</span>
		<span class="token punctuation">}</span>

		<span class="token keyword">if</span> maxI <span class="token operator">!=</span> r <span class="token punctuation">{</span>
			s<span class="token punctuation">[</span>maxI<span class="token punctuation">]</span><span class="token punctuation">,</span> s<span class="token punctuation">[</span>r<span class="token punctuation">]</span> <span class="token operator">=</span> s<span class="token punctuation">[</span>r<span class="token punctuation">]</span><span class="token punctuation">,</span> s<span class="token punctuation">[</span>maxI<span class="token punctuation">]</span>
		<span class="token punctuation">}</span>

		<span class="token comment">// 缩小边界</span>
		l<span class="token operator">++</span>
		r<span class="token operator">--</span>
	<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样一来，这样一来只需要看一边的比较次数就够了，不严谨的来说就是(n/2-1)+(n/2-2)+(n/2-3)...，最后时间复杂度依旧是O(n^2)，不过优化的时间效率上会有所提升。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>goos: windows
goarch: amd64
pkg: sorts
cpu: 11th Gen Intel(R) Core(TM) i7-11800H @ 2.30GHz
BenchmarkSelectSort/100-16        109363             10377 ns/op               0 B/op          0 allocs/op
BenchmarkSelectSort/1000-16         1260            939461 ns/op               0 B/op          0 allocs/op
BenchmarkSelectSort/10000-16          13          88333308 ns/op               0 B/op          0 allocs/op
BenchmarkSelectSort/100000-16          1        9028276000 ns/op               0 B/op          0 allocs/op
BenchmarkSelectSortPlus/100-16            133096              8826 ns/op               0 B/op          0 allocs/op
BenchmarkSelectSortPlus/1000-16             1447            794633 ns/op               0 B/op          0 allocs/op
BenchmarkSelectSortPlus/10000-16              14          77494886 ns/op               0 B/op          0 allocs/op
BenchmarkSelectSortPlus/100000-16              1        7745074200 ns/op               0 B/op          0 allocs/op
PASS
ok      sorts   29.479s
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>通过数据对比可以看到，在时间效率上大概提升了接近10-20%左右。</p><h2 id="插入排序" tabindex="-1"><a class="header-anchor" href="#插入排序" aria-hidden="true">#</a> 插入排序</h2><p>插入排序也是一种比较简单的排序方法，其基本思路为：假设0 ...i的元素已经有序，使用<code>s[i+1]</code>逆向与前i+1个元素进行逐个比较，如果在比较过程中第j个元素比第i+1个元素小/大，那么将其后移，如此循环往复，直到找到第一个大于/小于<code>s[i+1]</code>下标元素的元素时或者下标为0时，考虑到比<code>s[i]</code>小/大的元素都已经后移了，所以直接<code>s[i]</code>的值覆盖到<code>s[j+1]</code>上。</p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code><span class="token keyword">func</span> InsertSort<span class="token punctuation">[</span>T any<span class="token punctuation">]</span><span class="token punctuation">(</span>s <span class="token punctuation">[</span><span class="token punctuation">]</span>T<span class="token punctuation">,</span> less <span class="token keyword">func</span><span class="token punctuation">(</span>a<span class="token punctuation">,</span> b T<span class="token punctuation">)</span> <span class="token builtin">bool</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
	<span class="token keyword">for</span> i <span class="token operator">:=</span> <span class="token number">1</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token function">len</span><span class="token punctuation">(</span>s<span class="token punctuation">)</span><span class="token punctuation">;</span> i<span class="token operator">++</span> <span class="token punctuation">{</span>
		item <span class="token operator">:=</span> s<span class="token punctuation">[</span>i<span class="token punctuation">]</span>
		j <span class="token operator">:=</span> i
		<span class="token keyword">for</span> j <span class="token operator">=</span> i <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">;</span> j <span class="token operator">&gt;=</span> <span class="token number">0</span><span class="token punctuation">;</span> j<span class="token operator">--</span> <span class="token punctuation">{</span>
			<span class="token keyword">if</span> <span class="token function">less</span><span class="token punctuation">(</span>item<span class="token punctuation">,</span> s<span class="token punctuation">[</span>j<span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
				s<span class="token punctuation">[</span>j<span class="token operator">+</span><span class="token number">1</span><span class="token punctuation">]</span> <span class="token operator">=</span> s<span class="token punctuation">[</span>j<span class="token punctuation">]</span>
			<span class="token punctuation">}</span>
		<span class="token punctuation">}</span>
		s<span class="token punctuation">[</span>j<span class="token operator">+</span><span class="token number">1</span><span class="token punctuation">]</span> <span class="token operator">=</span> item
	<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>时间复杂度：O(n^2)</strong></p><p>如果是要升序排列，在最好情况下，要排序的切片已经是完全升序的了，那么只需要进行n-1次比较操作。最坏情况就是完全降序，那么就需要n+(n-1)+(n-2)+......+1次比较，总共就是(n^2+n)/2次。</p><p><strong>空间复杂度：O(1)</strong></p><p>整个过程中未用到额外的辅助空间</p><p><strong>性能测试</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>goos: windows
goarch: amd64
pkg: sorts
cpu: 11th Gen Intel(R) Core(TM) i7-11800H @ 2.30GHz
BenchmarkInsertSort/100-16        127532              8925 ns/op               0 B/op          0 allocs/op
BenchmarkInsertSort/1000-16         1611            736531 ns/op               0 B/op          0 allocs/op
BenchmarkInsertSort/10000-16          15          71716213 ns/op               0 B/op          0 allocs/op
BenchmarkInsertSort/100000-16          1        7104786500 ns/op               0 B/op          0 allocs/op
PASS
ok      sorts   11.312s
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>优化</strong></p><p>插入排序的优化方案很容易想到，假设是升序排列，在确保前n个元素已经是有序的情况下，我们需要去一个个遍历找到第一个小于<code>s[n+1]</code>的元素，既然它是有序的，那就可以使用二分查找来进行操作，然后再移动元素。移动次数没有减少，但比较次数减少了相当的多。优化后的代码如下</p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code><span class="token keyword">func</span> InsertSortPlus<span class="token punctuation">[</span>T any<span class="token punctuation">]</span><span class="token punctuation">(</span>s <span class="token punctuation">[</span><span class="token punctuation">]</span>T<span class="token punctuation">,</span> less <span class="token keyword">func</span><span class="token punctuation">(</span>a<span class="token punctuation">,</span> b T<span class="token punctuation">)</span> <span class="token builtin">bool</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
	<span class="token keyword">for</span> i <span class="token operator">:=</span> <span class="token number">1</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token function">len</span><span class="token punctuation">(</span>s<span class="token punctuation">)</span><span class="token punctuation">;</span> i<span class="token operator">++</span> <span class="token punctuation">{</span>
		target <span class="token operator">:=</span> s<span class="token punctuation">[</span>i<span class="token punctuation">]</span>
		<span class="token comment">// 对有序部分进行二分</span>
		l<span class="token punctuation">,</span> r <span class="token operator">:=</span> <span class="token number">0</span><span class="token punctuation">,</span> i<span class="token operator">-</span><span class="token number">1</span>
		<span class="token keyword">for</span> l <span class="token operator">&lt;=</span> r <span class="token punctuation">{</span>
			mid <span class="token operator">:=</span> l <span class="token operator">+</span> <span class="token punctuation">(</span>r<span class="token operator">-</span>l<span class="token punctuation">)</span><span class="token operator">/</span><span class="token number">2</span>
			<span class="token keyword">if</span> <span class="token function">less</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> s<span class="token punctuation">[</span>mid<span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
				r <span class="token operator">=</span> mid <span class="token operator">-</span> <span class="token number">1</span>
			<span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
				l <span class="token operator">=</span> mid <span class="token operator">+</span> <span class="token number">1</span>
			<span class="token punctuation">}</span>
		<span class="token punctuation">}</span>

		<span class="token comment">// 移动元素</span>
		<span class="token keyword">for</span> j <span class="token operator">:=</span> i <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">;</span> j <span class="token operator">&gt;=</span> l<span class="token punctuation">;</span> j<span class="token operator">--</span> <span class="token punctuation">{</span>
			s<span class="token punctuation">[</span>j<span class="token operator">+</span><span class="token number">1</span><span class="token punctuation">]</span> <span class="token operator">=</span> s<span class="token punctuation">[</span>j<span class="token punctuation">]</span>
		<span class="token punctuation">}</span>
		s<span class="token punctuation">[</span>l<span class="token punctuation">]</span> <span class="token operator">=</span> target
	<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>看看优化后的性能</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>goos: windows
goarch: amd64
pkg: sorts
cpu: 11th Gen Intel(R) Core(TM) i7-11800H @ 2.30GHz
BenchmarkInsertSort/100-16        127532              8925 ns/op               0 B/op          0 allocs/op
BenchmarkInsertSort/1000-16         1611            736531 ns/op               0 B/op          0 allocs/op
BenchmarkInsertSort/10000-16          15          71716213 ns/op               0 B/op          0 allocs/op
BenchmarkInsertSort/100000-16          1        7104786500 ns/op               0 B/op          0 allocs/op
BenchmarkInsertSortPlus/100-16            399487              2820 ns/op               0 B/op          0 allocs/op
BenchmarkInsertSortPlus/1000-16             7941            187614 ns/op               0 B/op          0 allocs/op
BenchmarkInsertSortPlus/10000-16              79          13721910 ns/op               0 B/op          0 allocs/op
BenchmarkInsertSortPlus/100000-16              1        1290984000 ns/op               0 B/op          0 allocs/op
PASS
ok      sorts   28.564s
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看到使用了二分的插入排序性能整整比原版提升了足足有70-80%左右，这已经是非常巨大的提升了。在最好的情况下，如果切片本身就是全部有序的话，就不需要移动元素，那么就只有查找会消耗时间，这样一来它的时间复杂度可以接近O(nlogn)。在最差的情况，每次都需要移动i-1个元素，那么就是(log(n-1)+n-1)+(log(n-2)+n-2)+(log(n-3)+n-3)....，当n足够大时，logn产生的影响已经微不足道了，虽然没有经过严格的计算，但简单估算下它的时间复杂度依旧不会小于O(n^2)。</p><p>不过值得高兴的是，到目前为止总算有一个方法能够有突破O(n^2)的可能性。</p><h2 id="希尔排序" tabindex="-1"><a class="header-anchor" href="#希尔排序" aria-hidden="true">#</a> 希尔排序</h2><h2 id="归并排序" tabindex="-1"><a class="header-anchor" href="#归并排序" aria-hidden="true">#</a> 归并排序</h2><h2 id="快速排序" tabindex="-1"><a class="header-anchor" href="#快速排序" aria-hidden="true">#</a> 快速排序</h2><h2 id="计数排序" tabindex="-1"><a class="header-anchor" href="#计数排序" aria-hidden="true">#</a> 计数排序</h2><h2 id="基数排序" tabindex="-1"><a class="header-anchor" href="#基数排序" aria-hidden="true">#</a> 基数排序</h2><h2 id="桶排序" tabindex="-1"><a class="header-anchor" href="#桶排序" aria-hidden="true">#</a> 桶排序</h2><h2 id="堆排序" tabindex="-1"><a class="header-anchor" href="#堆排序" aria-hidden="true">#</a> 堆排序</h2>`,60);function r(d,k){return a(),t("div",null,[l,i,p(" more "),u])}const m=s(c,[["render",r],["__file","sort.html.vue"]]);export{m as default};
