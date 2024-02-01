import{_ as s,W as a,X as t,Y as p,Z as n,$ as e,a1 as o}from"./framework-a4c02b8f.js";const c={},l=n("h1",{id:"二叉树的遍历",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#二叉树的遍历","aria-hidden":"true"},"#"),e(" 二叉树的遍历")],-1),i=n("figure",null,[n("img",{src:"https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202402011303985.png",alt:"",tabindex:"0",loading:"lazy"}),n("figcaption")],-1),u=o(`<hr><p>二叉树的遍历分三种</p><ul><li>前序遍历，中-左-右</li><li>中序遍历，左-中-右</li><li>后序遍历，左-右-中</li></ul><p>遍历又分递归和迭代版，对于迭代而言就是手动创建栈来模拟递归的调用栈，整体来说都比较简单，只有迭代版的后序遍历需要稍微注意下。</p><h2 id="前序遍历" tabindex="-1"><a class="header-anchor" href="#前序遍历" aria-hidden="true">#</a> 前序遍历</h2><p>递归版本</p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code><span class="token keyword">func</span> <span class="token function">preorderTraversal</span><span class="token punctuation">(</span>root <span class="token operator">*</span>TreeNode<span class="token punctuation">)</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">int</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> root <span class="token operator">==</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">int</span><span class="token punctuation">{</span><span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    ans <span class="token operator">:=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">int</span><span class="token punctuation">{</span>root<span class="token punctuation">.</span>Val<span class="token punctuation">}</span>
    ans <span class="token operator">=</span> <span class="token function">append</span><span class="token punctuation">(</span>ans<span class="token punctuation">,</span> <span class="token function">preorderTraversal</span><span class="token punctuation">(</span>root<span class="token punctuation">.</span>Left<span class="token punctuation">)</span><span class="token operator">...</span><span class="token punctuation">)</span>
    ans <span class="token operator">=</span> <span class="token function">append</span><span class="token punctuation">(</span>ans<span class="token punctuation">,</span> <span class="token function">preorderTraversal</span><span class="token punctuation">(</span>root<span class="token punctuation">.</span>Right<span class="token punctuation">)</span><span class="token operator">...</span><span class="token punctuation">)</span>
    
    <span class="token keyword">return</span> ans
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>迭代版本</p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code><span class="token keyword">func</span> <span class="token function">inorderTraversal</span><span class="token punctuation">(</span>root <span class="token operator">*</span>TreeNode<span class="token punctuation">)</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">int</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> root <span class="token operator">==</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">int</span><span class="token punctuation">{</span><span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">var</span> stk <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token operator">*</span>TreeNode
    <span class="token keyword">var</span> ans <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">int</span>
    cur <span class="token operator">:=</span> root
    <span class="token keyword">for</span> cur <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token operator">||</span> <span class="token function">len</span><span class="token punctuation">(</span>stk<span class="token punctuation">)</span> <span class="token operator">&gt;</span> <span class="token number">0</span> <span class="token punctuation">{</span>
       <span class="token keyword">if</span> cur <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span>
            ans <span class="token operator">=</span> <span class="token function">append</span><span class="token punctuation">(</span>ans<span class="token punctuation">,</span> cur<span class="token punctuation">.</span>Val<span class="token punctuation">)</span>
            stk <span class="token operator">=</span> <span class="token function">append</span><span class="token punctuation">(</span>stk<span class="token punctuation">,</span> cur<span class="token punctuation">)</span>
            cur <span class="token operator">=</span> cur<span class="token punctuation">.</span>Left
        <span class="token punctuation">}</span><span class="token keyword">else</span> <span class="token punctuation">{</span>
            cur <span class="token operator">=</span> stk<span class="token punctuation">[</span><span class="token function">len</span><span class="token punctuation">(</span>stk<span class="token punctuation">)</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">]</span>
            stk <span class="token operator">=</span> stk<span class="token punctuation">[</span><span class="token punctuation">:</span><span class="token function">len</span><span class="token punctuation">(</span>stk<span class="token punctuation">)</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">]</span>
            cur <span class="token operator">=</span> cur<span class="token punctuation">.</span>Right
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> ans
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="中序遍历" tabindex="-1"><a class="header-anchor" href="#中序遍历" aria-hidden="true">#</a> 中序遍历</h2><p>递归版本</p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code><span class="token keyword">func</span> <span class="token function">inorderTraversal</span><span class="token punctuation">(</span>root <span class="token operator">*</span>TreeNode<span class="token punctuation">)</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">int</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> root <span class="token operator">==</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">int</span><span class="token punctuation">{</span><span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    lans <span class="token operator">:=</span> <span class="token function">inorderTraversal</span><span class="token punctuation">(</span>root<span class="token punctuation">.</span>Left<span class="token punctuation">)</span>
    lans <span class="token operator">=</span> <span class="token function">append</span><span class="token punctuation">(</span>lans<span class="token punctuation">,</span> root<span class="token punctuation">.</span>Val<span class="token punctuation">)</span>
    rans <span class="token operator">:=</span> <span class="token function">inorderTraversal</span><span class="token punctuation">(</span>root<span class="token punctuation">.</span>Right<span class="token punctuation">)</span>
    <span class="token keyword">return</span> <span class="token function">append</span><span class="token punctuation">(</span>lans<span class="token punctuation">,</span> rans<span class="token operator">...</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>迭代版本</p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code><span class="token keyword">func</span> <span class="token function">inorderTraversal</span><span class="token punctuation">(</span>root <span class="token operator">*</span>TreeNode<span class="token punctuation">)</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">int</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> root <span class="token operator">==</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">int</span><span class="token punctuation">{</span><span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">var</span> stk <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token operator">*</span>TreeNode
    <span class="token keyword">var</span> ans <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">int</span>
    cur <span class="token operator">:=</span> root
    <span class="token keyword">for</span> cur <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token operator">||</span> <span class="token function">len</span><span class="token punctuation">(</span>stk<span class="token punctuation">)</span> <span class="token operator">&gt;</span> <span class="token number">0</span> <span class="token punctuation">{</span>
       <span class="token keyword">if</span> cur <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span>
            stk <span class="token operator">=</span> <span class="token function">append</span><span class="token punctuation">(</span>stk<span class="token punctuation">,</span> cur<span class="token punctuation">)</span>
            cur <span class="token operator">=</span> cur<span class="token punctuation">.</span>Left
        <span class="token punctuation">}</span><span class="token keyword">else</span> <span class="token punctuation">{</span>
            cur <span class="token operator">=</span> stk<span class="token punctuation">[</span><span class="token function">len</span><span class="token punctuation">(</span>stk<span class="token punctuation">)</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">]</span>
            stk <span class="token operator">=</span> stk<span class="token punctuation">[</span><span class="token punctuation">:</span><span class="token function">len</span><span class="token punctuation">(</span>stk<span class="token punctuation">)</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">]</span>
            ans <span class="token operator">=</span> <span class="token function">append</span><span class="token punctuation">(</span>ans<span class="token punctuation">,</span> cur<span class="token punctuation">.</span>Val<span class="token punctuation">)</span>
            cur <span class="token operator">=</span> cur<span class="token punctuation">.</span>Right
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> ans
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="后序遍历" tabindex="-1"><a class="header-anchor" href="#后序遍历" aria-hidden="true">#</a> 后序遍历</h2><p>递归版本</p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code><span class="token keyword">func</span> <span class="token function">postorderTraversal</span><span class="token punctuation">(</span>root <span class="token operator">*</span>TreeNode<span class="token punctuation">)</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">int</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> root <span class="token operator">==</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">int</span><span class="token punctuation">{</span><span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    ans <span class="token operator">:=</span> <span class="token function">postorderTraversal</span><span class="token punctuation">(</span>root<span class="token punctuation">.</span>Left<span class="token punctuation">)</span>
    ans <span class="token operator">=</span> <span class="token function">append</span><span class="token punctuation">(</span>ans<span class="token punctuation">,</span> <span class="token function">postorderTraversal</span><span class="token punctuation">(</span>root<span class="token punctuation">.</span>Right<span class="token punctuation">)</span><span class="token operator">...</span><span class="token punctuation">)</span>
    <span class="token keyword">return</span> <span class="token function">append</span><span class="token punctuation">(</span>ans<span class="token punctuation">,</span> root<span class="token punctuation">.</span>Val<span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>迭代版本</p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code><span class="token keyword">func</span> <span class="token function">postorderTraversal</span><span class="token punctuation">(</span>root <span class="token operator">*</span>TreeNode<span class="token punctuation">)</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">int</span> <span class="token punctuation">{</span>
	<span class="token keyword">if</span> root <span class="token operator">==</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span>
		<span class="token keyword">return</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">int</span><span class="token punctuation">{</span><span class="token punctuation">}</span>
	<span class="token punctuation">}</span>

	<span class="token keyword">var</span> ans <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">int</span>
	<span class="token keyword">var</span> stk <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token operator">*</span>TreeNode
	<span class="token comment">// 需要一个prev节点来记录上一个出栈的元素</span>
	<span class="token keyword">var</span> prev <span class="token operator">*</span>TreeNode
	cur <span class="token operator">:=</span> root
	<span class="token keyword">for</span> cur <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token operator">||</span> <span class="token function">len</span><span class="token punctuation">(</span>stk<span class="token punctuation">)</span> <span class="token operator">&gt;</span> <span class="token number">0</span> <span class="token punctuation">{</span>
		<span class="token keyword">if</span> cur <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span>
			stk <span class="token operator">=</span> <span class="token function">append</span><span class="token punctuation">(</span>stk<span class="token punctuation">,</span> cur<span class="token punctuation">)</span>
			cur <span class="token operator">=</span> cur<span class="token punctuation">.</span>Left
		<span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
			<span class="token comment">// 访问栈顶</span>
			cur <span class="token operator">=</span> stk<span class="token punctuation">[</span><span class="token function">len</span><span class="token punctuation">(</span>stk<span class="token punctuation">)</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">]</span>
			<span class="token comment">// 遍历的顺序是左右-中，如果prev == cur.Right</span>
			<span class="token comment">// 代表已经当前节点的左右节点访问过了，应该出栈了</span>
			<span class="token keyword">if</span> cur<span class="token punctuation">.</span>Right <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token operator">&amp;&amp;</span> cur<span class="token punctuation">.</span>Right <span class="token operator">!=</span> prev <span class="token punctuation">{</span>
				cur <span class="token operator">=</span> cur<span class="token punctuation">.</span>Right
			<span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
				ans <span class="token operator">=</span> <span class="token function">append</span><span class="token punctuation">(</span>ans<span class="token punctuation">,</span> cur<span class="token punctuation">.</span>Val<span class="token punctuation">)</span>
				stk <span class="token operator">=</span> stk<span class="token punctuation">[</span><span class="token punctuation">:</span><span class="token function">len</span><span class="token punctuation">(</span>stk<span class="token punctuation">)</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">]</span>
				prev <span class="token operator">=</span> cur
				<span class="token comment">// cur置为nil，走到这里说明左右都已经访问过了，下一次访问栈顶元素</span>
				cur <span class="token operator">=</span> <span class="token boolean">nil</span>
			<span class="token punctuation">}</span>
		<span class="token punctuation">}</span>
	<span class="token punctuation">}</span>

	<span class="token keyword">return</span> ans
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,19);function r(k,d){return a(),t("div",null,[l,i,p(" more "),u])}const b=s(c,[["render",r],["__file","binary_tree.html.vue"]]);export{b as default};
