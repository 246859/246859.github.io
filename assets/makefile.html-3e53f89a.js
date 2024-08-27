import{_ as l,W as t,X as p,Y as o,Z as n,$ as a,a0 as e,a1 as i,C as c}from"./framework-a4c02b8f.js";const d={},u=n("h1",{id:"使用makefile来构建go程序",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#使用makefile来构建go程序","aria-hidden":"true"},"#"),a(" 使用Makefile来构建Go程序")],-1),r=n("figure",null,[n("img",{src:"https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202408271022015.png",alt:"",tabindex:"0",loading:"lazy"}),n("figcaption")],-1),v=i('<h2 id="简介" tabindex="-1"><a class="header-anchor" href="#简介" aria-hidden="true">#</a> 简介</h2><p>Make起源于1977年的贝尔实验室中，目的就是为了能更好的构建大型程序，贝尔实验室的大型程序自然就是Unix操作系统。在后来诞生了它的许多变种，比较知名是下面两个。</p><ul><li>GNU Make</li><li>BSD Make</li></ul><p>GNU Make应该是现在用的最多的一个，Linux和MacOS都是用的GNU Make，本文在讲解的时候也会使用这一个。Makefile在C/C++项目中用的比较多，但它并不限制于特定的语言，Go同样也可以使用Makefile来构建程序，不过由于Go是一个比较现代化的语言，在编译时它已经将大部分事情都做好了，不需要我们去处理依赖，链接等，所以也就很少会用到makefile中那些复杂的规则，用的最多的也就是<code>.PHONY</code>伪目标来执行特定的命令。</p><h2 id="语法" tabindex="-1"><a class="header-anchor" href="#语法" aria-hidden="true">#</a> 语法</h2>',5),k={href:"https://www.gnu.org/software/make/manual/make.html",target:"_blank",rel:"noopener noreferrer"},m=i(`<h3 id="伪目标" tabindex="-1"><a class="header-anchor" href="#伪目标" aria-hidden="true">#</a> 伪目标</h3><p>makefile是由一个个目标（target）组成的，在makefile中目标表示的文件，Go中不需要对文件单独处理，所以我们会使用伪目标，表示它只执行命令，我们会用<code>.PHONY</code>来表示它是一个伪目标，如下。</p><div class="language-makefile line-numbers-mode" data-ext="makefile"><pre class="language-makefile"><code><span class="token builtin-target builtin">.PHONY</span><span class="token punctuation">:</span> hello one

<span class="token target symbol">hello</span><span class="token punctuation">:</span>
	echo <span class="token string">&quot;hello is a phony target&quot;</span>
	
<span class="token target symbol">one</span><span class="token punctuation">:</span>
	echo <span class="token string">&quot;one&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在目标中执行的命令必须要用tab进行缩进，如果你觉得一行命令太长可以用<code>\\</code>来换行，记得换行符后面不要有任何字符。</p><div class="language-makefile line-numbers-mode" data-ext="makefile"><pre class="language-makefile"><code><span class="token target symbol">hello</span><span class="token punctuation">:</span>
	echo <span class="token string">&quot;hello is a \\
		phony target&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>执行看看效果</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">make</span> hello
<span class="token builtin class-name">echo</span> <span class="token string">&quot;hello is a phony target&quot;</span>
hello is a phony target
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>会发现它将要执行的命令打印出来了，如果你不想这么做可以加上<code>-s</code>标志</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">make</span> hello <span class="token parameter variable">-s</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>或者在<code>echo</code>命令前加上<code>@</code></p><div class="language-makefile line-numbers-mode" data-ext="makefile"><pre class="language-makefile"><code><span class="token target symbol">hello</span><span class="token punctuation">:</span>
	<span class="token operator">@</span>echo <span class="token string">&quot;hello is a phony target&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>两种方法都可以阻止make打印命令。</p><h3 id="变量" tabindex="-1"><a class="header-anchor" href="#变量" aria-hidden="true">#</a> 变量</h3><p>makefile中的变量用<code>=</code>来进行赋值，比如</p><div class="language-makefile line-numbers-mode" data-ext="makefile"><pre class="language-makefile"><code>name <span class="token operator">=</span> <span class="token string">&quot;jack&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>变量没有类型，全都是字符串，没有被赋值的变量就是一个空字符串，赋值时必须要用空格相隔，不需要双引号也可以表示字符串</p><div class="language-makefile line-numbers-mode" data-ext="makefile"><pre class="language-makefile"><code>name <span class="token operator">=</span> jack
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>如果只是输出的话他们并没有什么区别，但实际上两者并不相等</p><div class="language-makefile line-numbers-mode" data-ext="makefile"><pre class="language-makefile"><code>name1 <span class="token operator">=</span> <span class="token string">&quot;jack&quot;</span>
name2 <span class="token operator">=</span> jack

<span class="token target symbol">all</span><span class="token punctuation">:</span>
<span class="token keyword">ifeq</span> <span class="token punctuation">(</span><span class="token variable">$</span><span class="token punctuation">(</span>name1<span class="token punctuation">)</span>, <span class="token variable">$</span><span class="token punctuation">(</span>name2<span class="token punctuation">)</span><span class="token punctuation">)</span>
	echo <span class="token string">&quot;equal&quot;</span>
<span class="token keyword">else</span>
	echo <span class="token string">&quot;not equal&quot;</span>
<span class="token keyword">endif</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>输出的结果会是不相等</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">make</span> <span class="token parameter variable">-s</span>
not equal
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>在使用的时候就需要稍微注意一下。</p><p>变量取值的时候可以用<code>$(var)</code>或者<code>\${var}</code>两种方法获取变量的值，比如</p><div class="language-makefile line-numbers-mode" data-ext="makefile"><pre class="language-makefile"><code>one <span class="token operator">=</span> 1
two <span class="token operator">=</span> <span class="token variable">$</span><span class="token punctuation">(</span>one<span class="token punctuation">)</span>
three <span class="token operator">=</span> <span class="token variable">$</span><span class="token punctuation">{</span>two<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>用<code>=</code>定义的变量默认是懒加载的，在使用到的时候才会展开，而用<code>:=</code>定义的变量会立即展开，如下</p><div class="language-makefile line-numbers-mode" data-ext="makefile"><pre class="language-makefile"><code>one <span class="token operator">=</span> <span class="token variable">$</span><span class="token punctuation">(</span>three<span class="token punctuation">)</span>
two <span class="token operator">:=</span> <span class="token variable">$</span><span class="token punctuation">(</span>three<span class="token punctuation">)</span>
three <span class="token operator">=</span> 3


<span class="token builtin-target builtin">.PHONY</span><span class="token punctuation">:</span> hello

<span class="token target symbol">hello</span><span class="token punctuation">:</span>
	echo 1 <span class="token variable">$</span><span class="token punctuation">(</span>one<span class="token punctuation">)</span>
	echo 2 <span class="token variable">$</span><span class="token punctuation">(</span>two<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在这里例子中变量<code>two</code>是被<code>:=</code>定义的，在它展开时变量<code>three</code>还未被定义，所以它就是一个空字符串。</p><div class="language-makefile line-numbers-mode" data-ext="makefile"><pre class="language-makefile"><code>$ make hello -s
1 3
2
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>通过<code>shell</code>函数，可以将执行命令的返回值赋值给变量</p><div class="language-makefile line-numbers-mode" data-ext="makefile"><pre class="language-makefile"><code>content <span class="token operator">:=</span> <span class="token variable">$</span><span class="token punctuation">(</span><span class="token function">shell</span> cat hosts.txt<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>也可以不理会返回值，仅执行命令。</p><h3 id="条件" tabindex="-1"><a class="header-anchor" href="#条件" aria-hidden="true">#</a> 条件</h3><p>makefile中条件判断有下面几种</p><ul><li><p><code>ifeq</code>，判断是否相等</p><div class="language-makefile line-numbers-mode" data-ext="makefile"><pre class="language-makefile"><code><span class="token keyword">ifeq</span> <span class="token punctuation">(</span><span class="token variable">$</span><span class="token punctuation">(</span>a<span class="token punctuation">)</span>, <span class="token variable">$</span><span class="token punctuation">(</span>b<span class="token punctuation">)</span><span class="token punctuation">)</span>
	...
<span class="token keyword">else</span>
	...
end if
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p><code>ifneq</code>，判断不相等</p><div class="language-makefile line-numbers-mode" data-ext="makefile"><pre class="language-makefile"><code><span class="token keyword">ifneq</span> <span class="token punctuation">(</span><span class="token variable">$</span><span class="token punctuation">(</span>a<span class="token punctuation">)</span>, <span class="token variable">$</span><span class="token punctuation">(</span>b<span class="token punctuation">)</span><span class="token punctuation">)</span>
	...
<span class="token keyword">else</span>
	...
end if
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p><code>ifdef</code>，判断变量是否定义</p><div class="language-makefile line-numbers-mode" data-ext="makefile"><pre class="language-makefile"><code>abc <span class="token operator">=</span> 
<span class="token keyword">ifdef</span> abc
	...
<span class="token keyword">else</span>
	...
end if
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p><code>ifndef</code>，判断变量是否未定义</p><div class="language-makefile line-numbers-mode" data-ext="makefile"><pre class="language-makefile"><code>abc <span class="token operator">=</span> 
<span class="token keyword">ifndef</span> abc
	...
<span class="token keyword">else</span>
	...
end if
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><h3 id="循环" tabindex="-1"><a class="header-anchor" href="#循环" aria-hidden="true">#</a> 循环</h3><p>makefile中的循环实际上是一个函数，格式如下</p><div class="language-makefile line-numbers-mode" data-ext="makefile"><pre class="language-makefile"><code><span class="token variable">$</span><span class="token punctuation">(</span><span class="token function">foreach</span> item, list, action<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>它最终会将处理后的元素返回成一个新数组，如果你只是用作循环也可以完全不管这个返回值。在makefile中，由空格作为分隔符的字符串可以看作是数组，如下</p><div class="language-makefile line-numbers-mode" data-ext="makefile"><pre class="language-makefile"><code>list <span class="token operator">:=</span> jack lili mike
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>迭代这个数组，然后将名字拼接成新字符串，然后返回一个新数组</p><div class="language-makefile line-numbers-mode" data-ext="makefile"><pre class="language-makefile"><code>list <span class="token operator">:=</span> jack lili mike
list2 <span class="token operator">:=</span> <span class="token variable">$</span><span class="token punctuation">(</span><span class="token function">foreach</span> name, <span class="token variable">$</span><span class="token punctuation">(</span>list<span class="token punctuation">)</span>, <span class="token string">&quot;hello $(name)!&quot;</span><span class="token punctuation">)</span>

<span class="token builtin-target builtin">.PHONY</span><span class="token punctuation">:</span> hello
<span class="token target symbol">hello</span><span class="token punctuation">:</span>
	echo <span class="token variable">$</span><span class="token punctuation">(</span>list2<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>最终输出</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">make</span> hello
<span class="token builtin class-name">echo</span>  <span class="token string">&quot;hello jack!&quot;</span>  <span class="token string">&quot;hello lili!&quot;</span>  <span class="token string">&quot;hello mike!&quot;</span>
hello jack<span class="token operator">!</span> hello lili<span class="token operator">!</span> hello mike<span class="token operator">!</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>也可以是多重循环</p><div class="language-makefile line-numbers-mode" data-ext="makefile"><pre class="language-makefile"><code>first_names <span class="token operator">:=</span> jack lili
second_names <span class="token operator">:=</span> david john

names <span class="token operator">:=</span> <span class="token variable">$</span><span class="token punctuation">(</span><span class="token function">foreach</span> fname, <span class="token variable">$</span><span class="token punctuation">(</span>first_names<span class="token punctuation">)</span>, \\
         		<span class="token variable">$</span><span class="token punctuation">(</span><span class="token function">foreach</span> sname, <span class="token variable">$</span><span class="token punctuation">(</span>second_names<span class="token punctuation">)</span>, <span class="token variable">$</span><span class="token punctuation">(</span>fname<span class="token punctuation">)</span>-<span class="token variable">$</span><span class="token punctuation">(</span>sname<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
<span class="token builtin-target builtin">.PHONY</span><span class="token punctuation">:</span> hello
<span class="token target symbol">hello</span><span class="token punctuation">:</span>
	<span class="token operator">@</span>echo <span class="token variable">$</span><span class="token punctuation">(</span>names<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>输出</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">make</span> hello
jack-david jack-john lili-david lili-john
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="递归" tabindex="-1"><a class="header-anchor" href="#递归" aria-hidden="true">#</a> 递归</h3><p>对于一个目标而言，我们可以在目标中使用<code>$(make)</code>来进行递归，比如下面这一个例子</p><div class="language-makefile line-numbers-mode" data-ext="makefile"><pre class="language-makefile"><code><span class="token builtin-target builtin">.PHONY</span><span class="token punctuation">:</span> hello
<span class="token target symbol">hello</span><span class="token punctuation">:</span>
	echo <span class="token string">&quot;hello&quot;</span>
	<span class="token variable">$</span><span class="token punctuation">(</span>MAKE<span class="token punctuation">)</span> hello
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个例子中会无限递归执行目标<code>hello</code>。你也可以用这种方法执行其他目标</p><div class="language-makefile line-numbers-mode" data-ext="makefile"><pre class="language-makefile"><code><span class="token builtin-target builtin">.PHONY</span><span class="token punctuation">:</span> hello
<span class="token target symbol">hello</span><span class="token punctuation">:</span>
	echo <span class="token string">&quot;hello&quot;</span>
	<span class="token variable">$</span><span class="token punctuation">(</span>MAKE<span class="token punctuation">)</span> bye

<span class="token builtin-target builtin">.PHONY</span><span class="token punctuation">:</span> bye
<span class="token target symbol">bye</span><span class="token punctuation">:</span>
	echo <span class="token string">&quot;bye&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>输出</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">make</span> hello
<span class="token builtin class-name">echo</span> <span class="token string">&quot;hello&quot;</span>
hello
make<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span>: Entering directory <span class="token string">&#39;/learn/makefile&#39;</span>
<span class="token builtin class-name">echo</span> <span class="token string">&quot;bye&quot;</span>
bye
make<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span>: Leaving directory <span class="token string">&#39;/learn/makefile&#39;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>递归的原本目的是为了解析子文件夹下的makefile，所以它会显示<code>Entering directory</code>表示进入某个文件夹，如果你不想看到这些输出加上<code>-s</code>标志执行就行了。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">make</span> hello <span class="token parameter variable">-s</span>
hello
bye
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="替换" tabindex="-1"><a class="header-anchor" href="#替换" aria-hidden="true">#</a> 替换</h3><p>字符串替换使用<code>$(patsubst)</code>来完成，它有下面几个参数</p><div class="language-makefile line-numbers-mode" data-ext="makefile"><pre class="language-makefile"><code><span class="token variable">$</span><span class="token punctuation">(</span><span class="token function">patsubst</span> pattern, replacement, text<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>通常我们会使用它的简写方式，通配符<code>%</code>表示匹配的部分</p><div class="language-makefile line-numbers-mode" data-ext="makefile"><pre class="language-makefile"><code><span class="token target symbol"><span class="token variable">$</span>(text</span><span class="token punctuation">:</span>%pattern<span class="token operator">=</span>%replacement<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>比如</p><div class="language-makefile line-numbers-mode" data-ext="makefile"><pre class="language-makefile"><code>name <span class="token operator">=</span> jack
result <span class="token operator">:=</span> <span class="token variable">$</span><span class="token punctuation">(</span>name<span class="token punctuation">:</span>j%<span class="token operator">=</span>m%<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>那么它最后会是</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>mack
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="注释" tabindex="-1"><a class="header-anchor" href="#注释" aria-hidden="true">#</a> 注释</h3><p>makefile中的注释由<code>#</code>来表示</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 这是一段注释</span>
name <span class="token operator">=</span> <span class="token string">&quot;comment&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>值得一提的是，在执行目标的时候，如果没有设置静默输出的话，注释也会一并打印出来。</p><h2 id="构建" tabindex="-1"><a class="header-anchor" href="#构建" aria-hidden="true">#</a> 构建</h2><p>在简单地解了上面的几种语法后，对于构建Go程序而言已经完全足够使用了，你可以通过编写如下的makefile来编译一个go程序。</p><div class="language-makefile line-numbers-mode" data-ext="makefile"><pre class="language-makefile"><code><span class="token builtin-target builtin">.PHONY</span><span class="token punctuation">:</span> build
<span class="token target symbol">build</span><span class="token punctuation">:</span>
	go build -o main.exe main.go
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>但如果只是这么简单的使用，实在是没有必要使用makefile，集成开发环境就能满足了，所以我们要写点复杂的。</p><p>比如可以在编译前进行代码检查</p><div class="language-makefile line-numbers-mode" data-ext="makefile"><pre class="language-makefile"><code><span class="token builtin-target builtin">.PHONY</span><span class="token punctuation">:</span> build
<span class="token target symbol">build</span><span class="token punctuation">:</span>
	<span class="token comment"># lint</span>
	go vet ./...
	<span class="token comment"># build</span>
	go build -o main.exe main.go
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>或者进行交叉编译时，设置环境变量</p><div class="language-makefile line-numbers-mode" data-ext="makefile"><pre class="language-makefile"><code><span class="token builtin-target builtin">.PHONY</span><span class="token punctuation">:</span> build
<span class="token target symbol">build</span><span class="token punctuation">:</span>
	<span class="token comment"># lint</span>
	go vet ./...

	go env -w GOOS<span class="token operator">=</span>linux
	go env -w GOARCH<span class="token operator">=</span>arm

	<span class="token comment"># build</span>
	go build -o main.exe main.go

	go env -w GOOS<span class="token operator">=</span>windows
	go env -w GOARCH<span class="token operator">=</span>amd64
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>不过这些还是太简单了，其实通过makefile更轻松的给程序注入元信息，进行其他的一些处理，比如下面是我自己经常用的一个makefile模板，做的处理就非常多了。</p><div class="language-makefile line-numbers-mode" data-ext="makefile"><pre class="language-makefile"><code><span class="token comment"># basic info</span>
app <span class="token operator">:=</span> myapp
module <span class="token operator">:=</span> github.com/246859/makefile
<span class="token comment"># meta info</span>
author <span class="token operator">=</span> 246859
build_time <span class="token operator">:=</span> <span class="token variable">$</span><span class="token punctuation">(</span><span class="token function">shell</span> date +<span class="token string">&quot;%Y.%m%d.%H%M%S&quot;</span><span class="token punctuation">)</span>
git_version <span class="token operator">:=</span> <span class="token variable">$</span><span class="token punctuation">(</span><span class="token function">shell</span> git tag --sort<span class="token operator">=</span>-version<span class="token punctuation">:</span>refname <span class="token operator">|</span> sed -n 1p<span class="token punctuation">)</span>

<span class="token comment"># build info</span>
mode <span class="token operator">:=</span> debug
output <span class="token operator">:=</span> <span class="token variable">$</span><span class="token punctuation">(</span><span class="token function">shell</span> pwd<span class="token punctuation">)</span>/bin
host_os <span class="token operator">:=</span> <span class="token variable">$</span><span class="token punctuation">(</span><span class="token function">shell</span> go env GOHOSTOS<span class="token punctuation">)</span>
host_arch <span class="token operator">:=</span> <span class="token variable">$</span><span class="token punctuation">(</span><span class="token function">shell</span> go env GOHOSTARCH<span class="token punctuation">)</span>
os <span class="token operator">:=</span> <span class="token variable">$</span><span class="token punctuation">(</span>host_os<span class="token punctuation">)</span>
arch <span class="token operator">:=</span> <span class="token variable">$</span><span class="token punctuation">(</span>host_arch<span class="token punctuation">)</span>
ldflags <span class="token operator">:=</span> <span class="token variable">$</span><span class="token punctuation">(</span>nullstring<span class="token punctuation">)</span>

<span class="token comment"># reduce binary size at release mode</span>
<span class="token keyword">ifeq</span> <span class="token punctuation">(</span><span class="token variable">$</span><span class="token punctuation">(</span>mode<span class="token punctuation">)</span>, release<span class="token punctuation">)</span>
	ldflags <span class="token operator">+=</span> -s -w
<span class="token keyword">endif</span>

<span class="token comment"># inject meta info</span>
<span class="token keyword">ifneq</span> <span class="token punctuation">(</span><span class="token variable">$</span><span class="token punctuation">(</span>app<span class="token punctuation">)</span>, <span class="token variable">$</span><span class="token punctuation">(</span>nullstring<span class="token punctuation">)</span><span class="token punctuation">)</span>
	ldflags <span class="token operator">+=</span> -X main.AppName<span class="token operator">=</span><span class="token variable">$</span><span class="token punctuation">(</span>app<span class="token punctuation">)</span>
<span class="token keyword">endif</span>
<span class="token keyword">ifneq</span> <span class="token punctuation">(</span><span class="token variable">$</span><span class="token punctuation">(</span>author<span class="token punctuation">)</span>, <span class="token variable">$</span><span class="token punctuation">(</span>nullstring<span class="token punctuation">)</span><span class="token punctuation">)</span>
	ldflags <span class="token operator">+=</span> -X main.Author<span class="token operator">=</span><span class="token variable">$</span><span class="token punctuation">(</span>author<span class="token punctuation">)</span>
<span class="token keyword">endif</span>
<span class="token keyword">ifneq</span> <span class="token punctuation">(</span><span class="token variable">$</span><span class="token punctuation">(</span>build_time<span class="token punctuation">)</span>, <span class="token variable">$</span><span class="token punctuation">(</span>nullstring<span class="token punctuation">)</span><span class="token punctuation">)</span>
	ldflags <span class="token operator">+=</span> -X main.BuildTime<span class="token operator">=</span><span class="token variable">$</span><span class="token punctuation">(</span>build_time<span class="token punctuation">)</span>
<span class="token keyword">endif</span>
<span class="token keyword">ifneq</span> <span class="token punctuation">(</span><span class="token variable">$</span><span class="token punctuation">(</span>git_version<span class="token punctuation">)</span>, <span class="token variable">$</span><span class="token punctuation">(</span>nullstring<span class="token punctuation">)</span><span class="token punctuation">)</span>
	ldflags <span class="token operator">+=</span> -X main.Version<span class="token operator">=</span><span class="token variable">$</span><span class="token punctuation">(</span>git_version<span class="token punctuation">)</span>
<span class="token keyword">endif</span>

<span class="token comment"># binary extension</span>
exe <span class="token operator">=</span> <span class="token variable">$</span><span class="token punctuation">(</span>nullstring<span class="token punctuation">)</span>
<span class="token keyword">ifeq</span> <span class="token punctuation">(</span><span class="token variable">$</span><span class="token punctuation">(</span>os<span class="token punctuation">)</span>, windows<span class="token punctuation">)</span>
	exe <span class="token operator">=</span> .exe
<span class="token keyword">endif</span>

<span class="token builtin-target builtin">.PHONY</span><span class="token punctuation">:</span> build
<span class="token target symbol">build</span><span class="token punctuation">:</span>
	<span class="token comment"># go lint</span>
	go vet ./...

	<span class="token comment"># prepare target environment $(os)/$(arch)</span>
	go env -w GOOS<span class="token operator">=</span><span class="token variable">$</span><span class="token punctuation">(</span>os<span class="token punctuation">)</span>
	go env -w GOARCH<span class="token operator">=</span><span class="token variable">$</span><span class="token punctuation">(</span>arch<span class="token punctuation">)</span>

	<span class="token comment"># build go module</span>
	go build -trimpath \\
		-ldflags<span class="token operator">=</span><span class="token string">&quot;$(ldflags)&quot;</span> \\
		-o <span class="token variable">$</span><span class="token punctuation">(</span>output<span class="token punctuation">)</span>/<span class="token variable">$</span><span class="token punctuation">(</span>app<span class="token punctuation">)</span>-<span class="token variable">$</span><span class="token punctuation">(</span>os<span class="token punctuation">)</span>-<span class="token variable">$</span><span class="token punctuation">(</span>arch<span class="token punctuation">)</span>-<span class="token variable">$</span><span class="token punctuation">(</span>mode<span class="token punctuation">)</span>/<span class="token variable">$</span><span class="token punctuation">(</span>app<span class="token punctuation">)</span><span class="token variable">$</span><span class="token punctuation">(</span>exe<span class="token punctuation">)</span> \\
		<span class="token variable">$</span><span class="token punctuation">(</span>module<span class="token punctuation">)</span>

	<span class="token comment"># resume host environment $(host_os)/$(host_arch)</span>
	go env -w GOOS<span class="token operator">=</span><span class="token variable">$</span><span class="token punctuation">(</span>host_os<span class="token punctuation">)</span>
	go env -w GOARCH<span class="token operator">=</span><span class="token variable">$</span><span class="token punctuation">(</span>host_arch<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个模板基本上满足大部分Go项目的需求了，假如说要多平台编译的话，还可以再加上下面这段</p><div class="language-makefile line-numbers-mode" data-ext="makefile"><pre class="language-makefile"><code><span class="token comment"># support platforms</span>
windows <span class="token operator">:=</span> 386 amd64 arm64 arm
linux <span class="token operator">:=</span> 386 amd64 arm64 arm
darwin <span class="token operator">:=</span> amd64 arm64
platforms <span class="token operator">:=</span> windows linux darwin

<span class="token builtin-target builtin">.PHONY</span><span class="token punctuation">:</span> build_all
<span class="token target symbol">build_all</span><span class="token punctuation">:</span>
	<span class="token operator">@</span><span class="token variable">$</span><span class="token punctuation">(</span><span class="token function">foreach</span> os_i, <span class="token variable">$</span><span class="token punctuation">(</span>platforms<span class="token punctuation">)</span>, \\
		<span class="token variable">$</span><span class="token punctuation">(</span><span class="token function">foreach</span> arch_j, <span class="token variable">$</span><span class="token punctuation">(</span><span class="token function">call</span> <span class="token variable">$</span><span class="token punctuation">(</span>os_i<span class="token punctuation">)</span><span class="token punctuation">)</span>, \\
			<span class="token variable">$</span><span class="token punctuation">(</span><span class="token function">shell</span> <span class="token variable">$</span><span class="token punctuation">(</span>MAKE<span class="token punctuation">)</span> build os<span class="token operator">=</span><span class="token variable">$</span><span class="token punctuation">(</span>os_i<span class="token punctuation">)</span> arch<span class="token operator">=</span><span class="token variable">$</span><span class="token punctuation">(</span>arch_j<span class="token punctuation">)</span> mode<span class="token operator">=</span><span class="token variable">$</span><span class="token punctuation">(</span>mode<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,81),b=n("code",null,"build",-1),g={href:"https://gist.github.com/246859/1a36cc805b96fb3cc164c70a1df9bee6",target:"_blank",rel:"noopener noreferrer"};function h(f,$){const s=c("ExternalLinkIcon");return t(),p("div",null,[u,r,o(" more "),v,n("p",null,[a("本文这里只是简单介绍下makefile中的语法，如果你想进行细致的学习的可以前往"),n("a",k,[a("Document | GNU make"),e(s)]),a("进行了解。")]),m,n("p",null,[a("通过双循环执行目标"),b,a("，这样一来就可以将所有预定平台的二进制文件全部自动编译出来，完整版在这里"),n("a",g,[a("makefile | Github Gist"),e(s)]),a("。")])])}const y=l(d,[["render",h],["__file","makefile.html.vue"]]);export{y as default};
