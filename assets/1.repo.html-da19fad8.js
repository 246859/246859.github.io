import{_ as i,W as l,X as c,Z as s,$ as n,a0 as t,a1 as a,C as d}from"./framework-a4c02b8f.js";const o={},p=a(`<h1 id="仓库" tabindex="-1"><a class="header-anchor" href="#仓库" aria-hidden="true">#</a> 仓库</h1><p>本文将讲解git一些基础操作，所有内容都是围绕着本地仓库进行讲解的，比如提交修改，撤销修改，查看仓库状态，查看历史提交等基本操作，学习完这些操作，基本上就可以上手使用git了。</p><h2 id="创建仓库" tabindex="-1"><a class="header-anchor" href="#创建仓库" aria-hidden="true">#</a> 创建仓库</h2><p>git的所有操作都是围绕着git仓库进行的，一个仓库就是一个文件夹，它可以包含一个项目代码，也可以包含很多个项目代码，或者其他奇奇怪怪的东西，到底要如何使用取决于你自己。创建仓库首先要创建一个文件夹，执行命令创建一个<code>example</code>文件夹。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">mkdir</span> example
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>进入该文件夹，执行git初始化命令<code>git init</code>，就可以为当前文件夹创建一个git仓库</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token builtin class-name">cd</span> example
$ <span class="token function">git</span> init
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>命令初始化完毕后，当前文件夹下就会多出一个名为<code>.git</code>的文件夹，里面存放着当前仓库所有的信息。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">ls</span> <span class="token parameter variable">-a</span>
./  <span class="token punctuation">..</span>/  .git/
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>到此就创建好了一个基本的git仓库。</p><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202309022007232.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>介绍一些基本的概念，首先要明白的是，在已创建的<code>example</code>目录内，除了<code>.git</code>文件夹，其他的所有文件或文件夹都属于工作区（图中黄色部分），日后所有对文件的修改，新增，删除的操作都是在工作区进行。操作过后，我们必须要手动指定git追踪哪些文件，这样git才能将指定文件纳入版本控制当中，这一步就是追踪文件，将其添加到暂存区（图中蓝色部分），然后就将这些修改提交到仓库（图中的紫色部分）后，才算是真正的由git仓库记录了这一次修改。除此之外，还有一个将本地仓库的修改推送到远程仓库的步骤，不过这是可选的。</p><h2 id="暂存修改" tabindex="-1"><a class="header-anchor" href="#暂存修改" aria-hidden="true">#</a> 暂存修改</h2><p>当前仓库什么都没有，所以接下来要创建几个文件来进行管理。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token variable">$echo</span> <span class="token string">&quot;hello git, this is my 1st repo!&quot;</span> <span class="token operator">&gt;</span> hello.txt
$ <span class="token builtin class-name">echo</span> <span class="token string">&quot;#Hi there&quot;</span> <span class="token operator">&gt;</span> README.md
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>在上面的命令中，创建了一个<code>hello.txt</code>文本文件，还有一个名为<code>README.md</code>的markdown文件。名为<code>README</code>的文件往往具有特殊意义，它的名字就是read me，即阅读我，该文件通常作为一个项目的介绍文件，里面包含了一个项目的基本信息和作者想要展示给其他人看的介绍信息。通常来说，它并不限制格式，示例中使用的是<code>md</code>格式，只是因为方便书写，它也可以是<code>README.txt</code>，<code>README.pdf</code>，<code>README.doc</code>，它可以是任何一切人类可以阅读的文本格式，这只是一种约定俗成的规范，而非强制要求，如果你乐意，也可以不创建<code>README</code>文件。</p><p>这时候再执行<code>git status</code>命令查看仓库目前的状态，git会告诉你，这两个文件没有被追踪（untracked），如果你想要管理这两个文件，就需要显式的使用命令来进行追踪。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> status
On branch master

No commits yet

Untracked files:
  <span class="token punctuation">(</span>use <span class="token string">&quot;git add &lt;file&gt;...&quot;</span> to include <span class="token keyword">in</span> what will be committed<span class="token punctuation">)</span>
        README.md
        hello.txt

nothing added to commit but untracked files present <span class="token punctuation">(</span>use <span class="token string">&quot;git add&quot;</span> to track<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>提示中也告诉了你应该使用 <code>git add</code>命令来追踪这些文件，如下</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> <span class="token function">add</span> hello.txt README.md
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>追踪文件后，再次执行<code>git status</code>命令，git就会告诉你这两个文件处于暂存状态（staged），即被添加到了暂存区</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> status
On branch master

No commits yet

Changes to be committed:
  <span class="token punctuation">(</span>use <span class="token string">&quot;git rm --cached &lt;file&gt;...&quot;</span> to unstage<span class="token punctuation">)</span>
        new file:   README.md
        new file:   hello.txt
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在git仓库中，只有被追踪的文件才会纳入版本控制。在追踪了两个文件后，接下来修改<code>hello.txt</code>的文件内容</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token builtin class-name">echo</span> <span class="token string">&quot;tracked two file in repo&quot;</span> <span class="token operator">&gt;&gt;</span> hello.txt
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>然后再次执行<code>git status</code>命令，查看仓库状态，git会告诉你，发现之前追踪的<code>hello.txt</code>文件已经被修改了，且新的修改没有暂存。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> status
On branch master

No commits yet

Changes to be committed:
  <span class="token punctuation">(</span>use <span class="token string">&quot;git rm --cached &lt;file&gt;...&quot;</span> to unstage<span class="token punctuation">)</span>
        new file:   README.md
        new file:   hello.txt

Changes not staged <span class="token keyword">for</span> commit:
  <span class="token punctuation">(</span>use <span class="token string">&quot;git add &lt;file&gt;...&quot;</span> to update what will be committed<span class="token punctuation">)</span>
  <span class="token punctuation">(</span>use <span class="token string">&quot;git restore &lt;file&gt;...&quot;</span> to discard changes <span class="token keyword">in</span> working directory<span class="token punctuation">)</span>
        modified:   hello.txt
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>此时，暂存区的状态还停留在上一次<code>add</code>操作时，而工作区已经有了新的修改，所以要再次执行<code>git add</code>来更新暂存区。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> <span class="token function">add</span> hello.txt
$ <span class="token function">git</span> status
On branch master

No commits yet

Changes to be committed:
  <span class="token punctuation">(</span>use <span class="token string">&quot;git rm --cached &lt;file&gt;...&quot;</span> to unstage<span class="token punctuation">)</span>
        new file:   README.md
        new file:   hello.txt
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="查看修改" tabindex="-1"><a class="header-anchor" href="#查看修改" aria-hidden="true">#</a> 查看修改</h2><p>在对工作区文件做出修改过后，<code>git status</code>只能知晓文件的状态变化，而无法得知具体的变化细节。使用<code>git diff</code>命令可以解决此问题，不带任何参数执行该命令的话，它会展示工作区文件与暂存区文件的区别。比如先修改<code>hello.txt</code>，再执行<code>git diff</code>，输出如下</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token builtin class-name">echo</span> <span class="token string">&quot;update something&quot;</span> <span class="token operator">&gt;&gt;</span> hello.txt
$ <span class="token function">git</span> <span class="token function">diff</span>
<span class="token function">diff</span> <span class="token parameter variable">--git</span> a/hello.txt b/hello.txt
index ea1ee84<span class="token punctuation">..</span>5136d34 <span class="token number">100644</span>
--- a/hello.txt
+++ b/hello.txt
@@ -4,3 +4,4 @@ track two <span class="token function">file</span> <span class="token keyword">in</span> repo
 <span class="token number">12</span>
 <span class="token number">123</span>
 <span class="token number">123</span>
+update something
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其中<code>a</code>，<code>b</code>，分别指工作区和暂存区，<code>@@ -4,3 +4,4 @@</code>指的是变化位置，最后一行带有<code>+</code>号，表示这是新增的。加上<code>--staged</code>参数就会比较暂存区与上一次提交时的变化。接下来先添加到暂存区，然后再查看差异</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> <span class="token function">add</span> hello.txt
$ <span class="token function">git</span> <span class="token function">diff</span> <span class="token parameter variable">--staged</span>
<span class="token function">diff</span> <span class="token parameter variable">--git</span> a/hello.txt b/hello.txt
index 5136d34<span class="token punctuation">..</span>24fc984 <span class="token number">100644</span>
--- a/hello.txt
+++ b/hello.txt
@@ -5,3 +5,4 @@ track two <span class="token function">file</span> <span class="token keyword">in</span> repo
 <span class="token number">123</span>
 <span class="token number">123</span>
+update hello.txt
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这一次输出的就是最后一次提交的文件和暂存区的文件的差异。</p><h2 id="忽略文件" tabindex="-1"><a class="header-anchor" href="#忽略文件" aria-hidden="true">#</a> 忽略文件</h2><p>对于一些文件，我们并不希望将其纳入git版本控制当中，也不需要git去追踪它们的变化，比如编译好的二进制文件，程序生成的错误日志等，为此git提供了一个配置文件<code>.gitignore</code>，来告诉git要忽略哪些文件。下面看一个例子，这是文档站仓库的<code>.gitignore</code>文件：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code># idea project file
.idea/
node_modules/
src/.vuepress/.cache/
src/.vuepress/.temp/
src/.vuepress/dist/
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其中<code>.idea/</code>是忽略IntellJ IDE自动生成的项目配置文件，<code>node_modules/</code>是忽略掉一系列本地依赖文件，其他的要么就是忽略缓存，要么就算忽略打包文件。可以使用<code>#</code>来进行注释，描述忽略文件的具体信息。</p><p>文件 <code>.gitignore</code> 的格式规范如下：</p><ul><li>所有空行或者以 <code>#</code> 开头的行都会被 Git 忽略。</li><li>可以使用标准的 glob 模式匹配，它会递归地应用在整个工作区中。</li><li>匹配模式可以以（<code>/</code>）开头防止递归。</li><li>匹配模式可以以（<code>/</code>）结尾指定目录。</li><li>要忽略指定模式以外的文件或目录，可以在模式前加上叹号（<code>!</code>）取反。</li></ul><p>glob模式指的是简化过后的正则表达式，熟悉正则表达式看这个应该相当容易，下面看一些例子</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code># 忽略所有的go源文件
*.go

# 但不忽略main.go文件
!main.go

# 仅忽略当前目录下的go文件
/*.go

# 忽略任意目录下的src目录
src/

# 忽略当前目录下的src目录
/src/

# 忽略任意src目录下的main.go文件
src/main.go

# 忽略任意src目录下其子目录下的所有main.go文件
src/**/main.go

# 忽略当前src目录下及其子目录下所有的main.go文件
/src/**/main.go
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>基本上每一个语言都会有一套属于自己的<code>.gitignore</code>模板，比如说<code>c++</code>模板</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code># Prerequisites
*.d

# Compiled Object files
*.slo
*.lo
*.o
*.obj

# Precompiled Headers
*.gch
*.pch

# Compiled Dynamic libraries
*.so
*.dylib
*.dll

# Fortran module files
*.mod
*.smod

# Compiled Static libraries
*.lai
*.la
*.a
*.lib

# Executables
*.exe
*.out
*.app
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,44),r={href:"https://github.com/github/gitignore",target:"_blank",rel:"noopener noreferrer"},u=a(`<h2 id="提交修改" tabindex="-1"><a class="header-anchor" href="#提交修改" aria-hidden="true">#</a> 提交修改</h2><p>在将所有修改到添加到暂存区过后，就可以将暂存的文件提交到当前分支，使用<code>git commit</code>命令进行提交操作</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> commit <span class="token parameter variable">-m</span> <span class="token string">&quot;initial commit&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>git要求你在进行提交时，必须附带提交信息，使用<code>-m</code>参数来指定提交信息，如果参数为空字符串的话会中断操作，倘若不携带<code>-m</code>参数，会自动进入<code>vim</code>界面要求你必须输入提交信息，否则就无法提交到当前分支。提交成功后，git输出如下信息</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>[master b4c2d7f] initial commit
 2 insertion(+)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>其中<code>master</code>，就是提交到的分支，<code>b3c2d7f</code>是git为本次提交生成的40位sha1校验和的一部分。</p><p>每当完成了一个阶段的小目标后，将变动的文件提交到仓库，git就会记录下这一次更新。只要提交到仓库里，日后就可以通过各种手段恢复，不用担心数据丢失的可能。</p><h3 id="跳过暂存" tabindex="-1"><a class="header-anchor" href="#跳过暂存" aria-hidden="true">#</a> 跳过暂存</h3><p>git提供了一个可以跳过暂存的方式，即在<code>git commit</code>命令后加上<code>-a</code>参数就可以将所有修改过的文件暂存并提交到当前分支。比如先修改了<code>hello.txt</code>文件</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token builtin class-name">echo</span> <span class="token string">&quot;123&quot;</span> <span class="token operator">&gt;&gt;</span> hello.txt
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>然后再创建一个新文件<code>bye.txt</code></p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token builtin class-name">echo</span> <span class="token string">&quot;bye&quot;</span> <span class="token operator">&gt;</span> bye.txt
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>此时执行<code>git status</code>，查看仓库状态</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> status
On branch master
Changes not staged <span class="token keyword">for</span> commit:
  <span class="token punctuation">(</span>use <span class="token string">&quot;git add &lt;file&gt;...&quot;</span> to update what will be committed<span class="token punctuation">)</span>
  <span class="token punctuation">(</span>use <span class="token string">&quot;git restore &lt;file&gt;...&quot;</span> to discard changes <span class="token keyword">in</span> working directory<span class="token punctuation">)</span>
        modified:   hello.txt

Untracked files:
  <span class="token punctuation">(</span>use <span class="token string">&quot;git add &lt;file&gt;...&quot;</span> to include <span class="token keyword">in</span> what will be committed<span class="token punctuation">)</span>
        bye.txt

no changes added to commit <span class="token punctuation">(</span>use <span class="token string">&quot;git add&quot;</span> and/or <span class="token string">&quot;git commit -a&quot;</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>使用<code>git commit -a</code>跳过暂存</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> commit <span class="token parameter variable">-a</span> <span class="token parameter variable">-m</span> <span class="token string">&quot;skip stage&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>再次执行<code>git status</code>会发现，<code>bye.txt</code>并没有被提交，也没有被暂存，所以跳过暂存的前提是文件首先需要被追踪，这样git才能感知到它的变化。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> status
On branch master
Untracked files:
  <span class="token punctuation">(</span>use <span class="token string">&quot;git add &lt;file&gt;...&quot;</span> to include <span class="token keyword">in</span> what will be committed<span class="token punctuation">)</span>
        bye.txt

nothing added to commit but untracked files present <span class="token punctuation">(</span>use <span class="token string">&quot;git add&quot;</span> to track<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="历史提交" tabindex="-1"><a class="header-anchor" href="#历史提交" aria-hidden="true">#</a> 历史提交</h3><p>在进行一段时间的工作后，你可能会想看看以前干了些什么，可以使用<code>git log</code>命令查看当前仓库的提交历史。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> log
commit 7514cce18c477694193e61849162ad8750f873cb <span class="token punctuation">(</span>HEAD -<span class="token operator">&gt;</span> master<span class="token punctuation">)</span>
Author: <span class="token number">246859</span> <span class="token operator">&lt;</span><span class="token number">2633565580</span>@qq.com<span class="token operator">&gt;</span>
Date:   Sun Sep <span class="token number">3</span> <span class="token number">15</span>:11:19 <span class="token number">2023</span> +0800

    update hello.txt

commit e538986402fb6b787a1a5778439d8bd01f316be0
Author: <span class="token number">246859</span> <span class="token operator">&lt;</span><span class="token number">2633565580</span>@qq.com<span class="token operator">&gt;</span>
Date:   Sat Sep <span class="token number">2</span> <span class="token number">20</span>:51:00 <span class="token number">2023</span> +0800

    skip stage

commit b4c2d7faf91cc2286813e7635bdad025166e08ed
Author: <span class="token number">246859</span> <span class="token operator">&lt;</span><span class="token number">2633565580</span>@qq.com<span class="token operator">&gt;</span>
Date:   Sat Sep <span class="token number">2</span> <span class="token number">20</span>:35:14 <span class="token number">2023</span> +0800

    3rd commit

commit 5ca7961d8757700652e66dec94faf9938192eccf
Author: <span class="token number">246859</span> <span class="token operator">&lt;</span><span class="token number">2633565580</span>@qq.com<span class="token operator">&gt;</span>
Date:   Sat Sep <span class="token number">2</span> <span class="token number">16</span>:54:09 <span class="token number">2023</span> +0800

    hello

commit eff484ad548c2fb78a821793898dbafa0ef8ddc9
Author: <span class="token number">246859</span> <span class="token operator">&lt;</span><span class="token number">2633565580</span>@qq.com<span class="token operator">&gt;</span>
Date:   Sat Sep <span class="token number">2</span> <span class="token number">16</span>:45:37 <span class="token number">2023</span> +0800

    initial commit
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>通过输出，我们可以很轻易的得知每一个提交的日期时间，作者，提交描述信息，以及sha1校验和。通过添加<code>-p</code>参数可以得知每一次提交的修改</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> log <span class="token parameter variable">-p</span>
commit 7514cce18c477694193e61849162ad8750f873cb <span class="token punctuation">(</span>HEAD -<span class="token operator">&gt;</span> master<span class="token punctuation">)</span>
Author: <span class="token number">246859</span> <span class="token operator">&lt;</span><span class="token number">2633565580</span>@qq.com<span class="token operator">&gt;</span>
Date:   Sun Sep <span class="token number">3</span> <span class="token number">15</span>:11:19 <span class="token number">2023</span> +0800

    update hello.txt

<span class="token function">diff</span> <span class="token parameter variable">--git</span> a/hello.txt b/hello.txt
index ea1ee84<span class="token punctuation">..</span>5136d34 <span class="token number">100644</span>
--- a/hello.txt
+++ b/hello.txt
@@ -4,3 +4,4 @@ track two <span class="token function">file</span> <span class="token keyword">in</span> repo
 <span class="token number">12</span>
 <span class="token number">123</span>
 <span class="token number">123</span>
+update something

commit e538986402fb6b787a1a5778439d8bd01f316be0
Author: <span class="token number">246859</span> <span class="token operator">&lt;</span><span class="token number">2633565580</span>@qq.com<span class="token operator">&gt;</span>
Date:   Sat Sep <span class="token number">2</span> <span class="token number">20</span>:51:00 <span class="token number">2023</span> +0800

    skip stage

<span class="token function">diff</span> <span class="token parameter variable">--git</span> a/hello.txt b/hello.txt
index 5b1f3e2<span class="token punctuation">..</span>ea1ee84 <span class="token number">100644</span>
--- a/hello.txt
+++ b/hello.txt
@@ -3,3 +3,4 @@ track two <span class="token function">file</span> <span class="token keyword">in</span> repo
 <span class="token number">123</span>
 <span class="token number">12</span>
 <span class="token number">123</span>
+123

<span class="token punctuation">..</span>.
<span class="token punctuation">..</span>.
<span class="token punctuation">..</span>.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当历史过多时可以指定显示多少条，来获得更好的查看效果</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> log <span class="token parameter variable">-p</span> <span class="token parameter variable">-1</span>
commit 7514cce18c477694193e61849162ad8750f873cb <span class="token punctuation">(</span>HEAD -<span class="token operator">&gt;</span> master<span class="token punctuation">)</span>
Author: <span class="token number">246859</span> <span class="token operator">&lt;</span><span class="token number">2633565580</span>@qq.com<span class="token operator">&gt;</span>
Date:   Sun Sep <span class="token number">3</span> <span class="token number">15</span>:11:19 <span class="token number">2023</span> +0800

    update hello.txt

<span class="token function">diff</span> <span class="token parameter variable">--git</span> a/hello.txt b/hello.txt
index ea1ee84<span class="token punctuation">..</span>5136d34 <span class="token number">100644</span>
--- a/hello.txt
+++ b/hello.txt
@@ -4,3 +4,4 @@ track two <span class="token function">file</span> <span class="token keyword">in</span> repo
 <span class="token number">12</span>
 <span class="token number">123</span>
 <span class="token number">123</span>
+update something
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>或者以图表的形式来展示提交历史，为了更有效果，拿文档站的提交历史作例子，可以看到多了一条线，这其实是其它分支合并的结果。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> log <span class="token parameter variable">--graph</span> <span class="token parameter variable">-5</span>
*   commit 0b148b2dc402515a2c572e3464a5ec2fafcb8693 <span class="token punctuation">(</span>HEAD -<span class="token operator">&gt;</span> main, origin/main<span class="token punctuation">)</span>
<span class="token operator">|</span><span class="token punctuation">\\</span>  Merge: d8cc259 4f5d32c
<span class="token operator">|</span> <span class="token operator">|</span> Author: hanjiang <span class="token operator">&lt;</span><span class="token number">42080442</span>+246859@users.noreply.github.com<span class="token operator">&gt;</span>
<span class="token operator">|</span> <span class="token operator">|</span> Date:   Sun Sep <span class="token number">3</span> <span class="token number">10</span>:41:51 <span class="token number">2023</span> +0800
<span class="token operator">|</span> <span class="token operator">|</span>
<span class="token operator">|</span> <span class="token operator">|</span>     Merge pull request <span class="token comment">#9 from Axchgit/patch-1</span>
<span class="token operator">|</span> <span class="token operator">|</span>
<span class="token operator">|</span> <span class="token operator">|</span>     Update <span class="token number">60</span>.slice.md
<span class="token operator">|</span> <span class="token operator">|</span>
<span class="token operator">|</span> * commit 4f5d32c1a04884712d9edcbae1729c3542d63aaa
<span class="token operator">|</span>/  Author: Axchgit <span class="token operator">&lt;</span><span class="token number">48643885</span>+Axchgit@users.noreply.github.com<span class="token operator">&gt;</span>
<span class="token operator">|</span>   Date:   Sat Sep <span class="token number">2</span> <span class="token number">17</span>:08:59 <span class="token number">2023</span> +0800
<span class="token operator">|</span>
<span class="token operator">|</span>       Update <span class="token number">60</span>.slice.md
<span class="token operator">|</span>
* commit d8cc259bccefae542af581ad329b963ec553238d
<span class="token operator">|</span> Author: <span class="token number">246859</span> <span class="token operator">&lt;</span><span class="token number">2633565580</span>@qq.com<span class="token operator">&gt;</span>
<span class="token operator">|</span> Date:   Tue Aug <span class="token number">29</span> <span class="token number">21</span>:58:21 <span class="token number">2023</span> +0800
<span class="token operator">|</span>
<span class="token operator">|</span>     feat<span class="token punctuation">(</span>basic<span class="token punctuation">)</span>: 更新go1.21的一些内置函数
<span class="token operator">|</span>
* commit 17500e16a4d1fa784ae9715e8a8c43973c494580
<span class="token operator">|</span> Author: <span class="token number">246859</span> <span class="token operator">&lt;</span><span class="token number">2633565580</span>@qq.com<span class="token operator">&gt;</span>
<span class="token operator">|</span> Date:   Tue Aug <span class="token number">29</span> <span class="token number">21</span>:29:32 <span class="token number">2023</span> +0800
<span class="token operator">|</span>
<span class="token operator">|</span>     feat<span class="token punctuation">(</span>microservice<span class="token punctuation">)</span>: 更新微服务相关文章
<span class="token operator">|</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>除此之外，通过添加<code>--pretty</code>参数还可以美化<code>git log</code>的输出，比如每一个提交只显示一行</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> log <span class="token parameter variable">--pretty</span><span class="token operator">=</span>oneline <span class="token parameter variable">-5</span>
7514cce18c477694193e61849162ad8750f873cb <span class="token punctuation">(</span>HEAD -<span class="token operator">&gt;</span> master<span class="token punctuation">)</span> update hello.txt
e538986402fb6b787a1a5778439d8bd01f316be0 skip stage
b4c2d7faf91cc2286813e7635bdad025166e08ed 3rd commit
5ca7961d8757700652e66dec94faf9938192eccf hello
eff484ad548c2fb78a821793898dbafa0ef8ddc9 initial commit
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>甚至支持自定义格式化，比如</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> log <span class="token parameter variable">--pretty</span><span class="token operator">=</span>format:<span class="token string">&quot;%h %an &lt;%ae&gt; %ad %s&quot;</span>
7514cce <span class="token number">246859</span> <span class="token operator">&lt;</span><span class="token number">2633565580</span>@qq.com<span class="token operator">&gt;</span> Sun Sep <span class="token number">3</span> <span class="token number">15</span>:11:19 <span class="token number">2023</span> +0800 update hello.txt
e538986 <span class="token number">246859</span> <span class="token operator">&lt;</span><span class="token number">2633565580</span>@qq.com<span class="token operator">&gt;</span> Sat Sep <span class="token number">2</span> <span class="token number">20</span>:51:00 <span class="token number">2023</span> +0800 skip stage
b4c2d7f <span class="token number">246859</span> <span class="token operator">&lt;</span><span class="token number">2633565580</span>@qq.com<span class="token operator">&gt;</span> Sat Sep <span class="token number">2</span> <span class="token number">20</span>:35:14 <span class="token number">2023</span> +0800 3rd commit
5ca7961 <span class="token number">246859</span> <span class="token operator">&lt;</span><span class="token number">2633565580</span>@qq.com<span class="token operator">&gt;</span> Sat Sep <span class="token number">2</span> <span class="token number">16</span>:54:09 <span class="token number">2023</span> +0800 hello
eff484a <span class="token number">246859</span> <span class="token operator">&lt;</span><span class="token number">2633565580</span>@qq.com<span class="token operator">&gt;</span> Sat Sep <span class="token number">2</span> <span class="token number">16</span>:45:37 <span class="token number">2023</span> +0800 initial commit
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>下面是一些常用的格式化选项。</p><table><thead><tr><th style="text-align:left;">选项</th><th style="text-align:left;">说明</th></tr></thead><tbody><tr><td style="text-align:left;"><code>%H</code></td><td style="text-align:left;">提交的完整哈希值</td></tr><tr><td style="text-align:left;"><code>%h</code></td><td style="text-align:left;">提交的简写哈希值</td></tr><tr><td style="text-align:left;"><code>%T</code></td><td style="text-align:left;">树的完整哈希值</td></tr><tr><td style="text-align:left;"><code>%t</code></td><td style="text-align:left;">树的简写哈希值</td></tr><tr><td style="text-align:left;"><code>%P</code></td><td style="text-align:left;">父提交的完整哈希值</td></tr><tr><td style="text-align:left;"><code>%p</code></td><td style="text-align:left;">父提交的简写哈希值</td></tr><tr><td style="text-align:left;"><code>%an</code></td><td style="text-align:left;">作者名字</td></tr><tr><td style="text-align:left;"><code>%ae</code></td><td style="text-align:left;">作者的电子邮件地址</td></tr><tr><td style="text-align:left;"><code>%ad</code></td><td style="text-align:left;">作者修订日期（可以用 --date=选项 来定制格式）</td></tr><tr><td style="text-align:left;"><code>%ar</code></td><td style="text-align:left;">作者修订日期，按多久以前的方式显示</td></tr><tr><td style="text-align:left;"><code>%cn</code></td><td style="text-align:left;">提交者的名字</td></tr><tr><td style="text-align:left;"><code>%ce</code></td><td style="text-align:left;">提交者的电子邮件地址</td></tr><tr><td style="text-align:left;"><code>%cd</code></td><td style="text-align:left;">提交日期</td></tr><tr><td style="text-align:left;"><code>%cr</code></td><td style="text-align:left;">提交日期（距今多长时间）</td></tr><tr><td style="text-align:left;"><code>%s</code></td><td style="text-align:left;">提交说明</td></tr></tbody></table><p>还可以查看指定时间段的提交历史</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> log <span class="token parameter variable">--since</span><span class="token operator">=</span><span class="token string">&quot;2023-09-01&quot;</span> <span class="token parameter variable">--before</span><span class="token operator">=</span><span class="token string">&quot;2023-10-01&quot;</span> <span class="token parameter variable">-2</span>
commit 7514cce18c477694193e61849162ad8750f873cb <span class="token punctuation">(</span>HEAD -<span class="token operator">&gt;</span> master<span class="token punctuation">)</span>
Author: <span class="token number">246859</span> <span class="token operator">&lt;</span><span class="token number">2633565580</span>@qq.com<span class="token operator">&gt;</span>
Date:   Sun Sep <span class="token number">3</span> <span class="token number">15</span>:11:19 <span class="token number">2023</span> +0800

    update hello.txt

commit e538986402fb6b787a1a5778439d8bd01f316be0
Author: <span class="token number">246859</span> <span class="token operator">&lt;</span><span class="token number">2633565580</span>@qq.com<span class="token operator">&gt;</span>
Date:   Sat Sep <span class="token number">2</span> <span class="token number">20</span>:51:00 <span class="token number">2023</span> +0800

    skip stage

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>下面是一些常用的输出限制参数</p><table><thead><tr><th style="text-align:left;">选项</th><th style="text-align:left;">说明</th></tr></thead><tbody><tr><td style="text-align:left;"><code>-&lt;n&gt;</code></td><td style="text-align:left;">仅显示最近的 n 条提交。</td></tr><tr><td style="text-align:left;"><code>-glob=&lt;pattern&gt;</code></td><td style="text-align:left;">显示模式匹配的提交</td></tr><tr><td style="text-align:left;"><code>-tags[=&lt;pattern&gt;]</code></td><td style="text-align:left;">显示匹配tag的提交</td></tr><tr><td style="text-align:left;"><code>-skip=&lt;n&gt;</code></td><td style="text-align:left;">跳过n次提交</td></tr><tr><td style="text-align:left;"><code>-merges</code></td><td style="text-align:left;">仅显示合并提交</td></tr><tr><td style="text-align:left;"><code>-no-merges</code></td><td style="text-align:left;">不显示合并提交</td></tr><tr><td style="text-align:left;"><code>--since</code>, <code>--after</code></td><td style="text-align:left;">仅显示指定时间之后的提交。</td></tr><tr><td style="text-align:left;"><code>--until</code>, <code>--before</code></td><td style="text-align:left;">仅显示指定时间之前的提交。</td></tr><tr><td style="text-align:left;"><code>--author</code></td><td style="text-align:left;">仅显示作者匹配指定字符串的提交。</td></tr><tr><td style="text-align:left;"><code>--committer</code></td><td style="text-align:left;">仅显示提交者匹配指定字符串的提交。</td></tr><tr><td style="text-align:left;"><code>--grep</code></td><td style="text-align:left;">仅显示提交说明中包含指定字符串的提交。</td></tr><tr><td style="text-align:left;"><code>-S</code></td><td style="text-align:left;">仅显示添加或删除内容匹配指定字符串的提交。</td></tr></tbody></table><p>如果想要了解更多，可以使用<code>git help log</code>命令查看更多的细节。</p><h3 id="检出提交" tabindex="-1"><a class="header-anchor" href="#检出提交" aria-hidden="true">#</a> 检出提交</h3><p>在查看完历史提交后，你可以获取一个具体的提交的sha1校验和，通过它配合<code>git checkout</code>命令，可以将当前工作区的状态变为指定提交的状态。例如</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> log <span class="token parameter variable">-2</span>
commit f5602b9057b6219ee65cac7e9af815f9c13339df <span class="token punctuation">(</span>HEAD -<span class="token operator">&gt;</span> master, tag: v1.0.3, tag: v1.0.1, tag: v1.0.0<span class="token punctuation">)</span>
Author: <span class="token number">246859</span> <span class="token operator">&lt;</span><span class="token number">2633565580</span>@qq.com<span class="token operator">&gt;</span>
Date:   Mon Sep <span class="token number">4</span> <span class="token number">11</span>:13:11 <span class="token number">2023</span> +0800

    Revert <span class="token string">&quot;revert example&quot;</span>

    This reverts commit 9d3a0a371740bc2e53fb2ca8bb26c813016ab870.

    revert example

commit 9d3a0a371740bc2e53fb2ca8bb26c813016ab870
Author: <span class="token number">246859</span> <span class="token operator">&lt;</span><span class="token number">2633565580</span>@qq.com<span class="token operator">&gt;</span>
Date:   Mon Sep <span class="token number">4</span> <span class="token number">11</span>:12:18 <span class="token number">2023</span> +0800

    revert example
   
$ <span class="token function">git</span> checkout 9d3a0a371740bc2e53fb2ca8bb26c813016ab870
Note: switching to <span class="token string">&#39;9d3a0a371740bc2e53fb2ca8bb26c813016ab870&#39;</span><span class="token builtin class-name">.</span>

You are <span class="token keyword">in</span> <span class="token string">&#39;detached HEAD&#39;</span> state. You can <span class="token function">look</span> around, <span class="token function">make</span> experimental
changes and commit them, and you can discard any commits you <span class="token function">make</span> <span class="token keyword">in</span> this
state without impacting any branches by switching back to a branch.

If you want to create a new branch to retain commits you create, you may
<span class="token keyword">do</span> so <span class="token punctuation">(</span>now or later<span class="token punctuation">)</span> by using <span class="token parameter variable">-c</span> with the switch command. Example:

  <span class="token function">git</span> switch <span class="token parameter variable">-c</span> <span class="token operator">&lt;</span>new-branch-name<span class="token operator">&gt;</span>

Or undo this operation with:

  <span class="token function">git</span> switch -

Turn off this advice by setting config variable advice.detachedHead to <span class="token boolean">false</span>

HEAD is now at 9d3a0a3 revert example
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>此时工作区的文件内容已经变成了特定提交<code>9d3a0a371740bc2e53fb2ca8bb26c813016ab870</code>的状态，在与HEAD指针分离的情况下，所作的任何修改和提交都不会保存，除非新建一个分支。在已检出的情况下，使用如下命令来新建分支</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> switch <span class="token parameter variable">-c</span> <span class="token operator">&lt;</span>branch-name<span class="token operator">&gt;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>也可以在一开始就新建分支</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> checkout <span class="token parameter variable">-b</span> <span class="token operator">&lt;</span>branch-name<span class="token operator">&gt;</span> <span class="token operator">&lt;</span>sha<span class="token operator"><span class="token file-descriptor important">1</span>&gt;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>如果想要回到HEAD指针，使命如下命令即可</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> switch -
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="删除文件" tabindex="-1"><a class="header-anchor" href="#删除文件" aria-hidden="true">#</a> 删除文件</h2><p>如果想要删除仓库中的一个文件，仅仅只是删除工作区的文件是不够的，比如新建一个<code>bye.txt</code>，将其添加到工作区后，再将其从工作区删除，此时执行<code>git status</code>会有如下输出</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> status
On branch master
Changes to be committed:
  <span class="token punctuation">(</span>use <span class="token string">&quot;git restore --staged &lt;file&gt;...&quot;</span> to unstage<span class="token punctuation">)</span>
        new file:   bye.txt

Changes not staged <span class="token keyword">for</span> commit:
  <span class="token punctuation">(</span>use <span class="token string">&quot;git add/rm &lt;file&gt;...&quot;</span> to update what will be committed<span class="token punctuation">)</span>
  <span class="token punctuation">(</span>use <span class="token string">&quot;git restore &lt;file&gt;...&quot;</span> to discard changes <span class="token keyword">in</span> working directory<span class="token punctuation">)</span>
        deleted:    bye.txt
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>git知晓此变化，但是删除文件这一修改并没有添加到暂存区，下一次提交时，该文件依旧会被提交到仓库中。所以应该同时将其暂存区的文件删除，为此git提供了<code>git rm</code>命令来删除暂存区的文件。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> <span class="token function">rm</span> bye.txt
<span class="token function">rm</span> <span class="token string">&#39;bye.txt&#39;</span>
$ <span class="token function">git</span> status
On branch master
nothing to commit, working tree clean
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>此时会发现git不再追踪此文件。需要注意的是<code>git rm</code> 在执行时也会删除工作区的文件，倘若仅仅只是想删除暂存区或者仓库中的文件，可以使用如下命令</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> <span class="token function">rm</span> <span class="token parameter variable">--cached</span> bye.txt
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>如此一来，就不会对工作区的文件造成任何影响，将修改提交后，暂存区和仓库中的文件就会被删除，而工作区没有变化。</p><h2 id="移动文件" tabindex="-1"><a class="header-anchor" href="#移动文件" aria-hidden="true">#</a> 移动文件</h2><p>当想要移动文件或重命名文件时，可以使用<code>git mv</code>命令来进行操作。例如将<code>hello.txt</code>，改为<code>hello.md</code></p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> <span class="token function">mv</span> hello.txt hello.md
$ <span class="token function">git</span> status
On branch master
Changes to be committed:
  <span class="token punctuation">(</span>use <span class="token string">&quot;git restore --staged &lt;file&gt;...&quot;</span> to unstage<span class="token punctuation">)</span>
        renamed:    hello.txt -<span class="token operator">&gt;</span> hello.md

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>git会感知到此变化，其实该操作等于执行了以下三个命令</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">mv</span> hello.txt hello.md
$ <span class="token function">git</span> <span class="token function">rm</span> hello.txt
$ <span class="token function">git</span> <span class="token function">add</span> hello.md
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>就算逐条执行这三条命令，git依旧会感知到这是一次renamed操作，更多时候还是使用<code>git mv</code>会方便些。</p><h2 id="简短输出" tabindex="-1"><a class="header-anchor" href="#简短输出" aria-hidden="true">#</a> 简短输出</h2><p>我们经常使用<code>git status</code>来查看本地仓库的状态，可以添加参数<code>-s</code>来获得更加简短的输出，git会以一种表格的方式来描述文件状态，例如</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> status <span class="token parameter variable">-s</span>
A  README.md
A  hello.txt
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上述简短输出中，左边的状态表述栏有两列，第一列表示暂存区的状态，第二列表示工作区的状态，右边则是对应的文件。A表示新追踪的文件被添加到暂存区，M表示文件被修改，D表示文件被删除，R表示文件被重命名，??表示文件未追踪，下面看一些例子。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>A  hello.txt // 这是一个新追踪的文件，已经被添加到暂存区，且工作区没有任何新的变动
AM hello.txt // 这是一个新追踪的文件且已被添加到暂存区，但是现在工作区有新的修改。
 M hello.txt // 这是一个已被追踪的文件，工作区文件现在有了新的修改，但新修改没有被提交到暂存区
M  hello.txt // 这是一个已被追踪的文件，工作区文件之前的修改已经被添加到暂存区，目前没有任何新的变动
MM hello.txt // 这是一个已被追踪的文件，工作区文件之前的修改已经被添加到暂存区后，又有了新的修改
 D hello.txt // 该文件在工作区中已被删除
D  hello.txt // 该文件在暂存区中已被删除
R  hello.txt // 该文件已被重命名，且修改被添加到暂存区
?? hello.txt // 这是一个未被追踪的文件
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当然除此之外可能还会有其他的组合，只需要知晓其意思即可。</p><h2 id="撤销操作" tabindex="-1"><a class="header-anchor" href="#撤销操作" aria-hidden="true">#</a> 撤销操作</h2><p>在使用git的过程中，经常可能会出现一些操作失误，想要反悔的情况，git当然也给了我们反悔的机会，从不至于将仓库弄的一团糟，下面会介绍几个情况。不过需要注意的是，有些撤销操作是不可逆的。</p><h3 id="修正提交" tabindex="-1"><a class="header-anchor" href="#修正提交" aria-hidden="true">#</a> 修正提交</h3><p>当你写完自己的代码后，信心满满的提交后，发现自己遗漏了几个文件，又或是提交信息中有错别字。发生这种情况时，只能是再提交一次，然后描述信息为：“遗漏了几个文件”或者是“修复了提交信息的错别字”，这样看着太别扭了，试想一下你的提交历史中都是这种东西，将会相当的丑陋。为此<code>git commit</code>命令提供了<code>--amend</code>参数，来允许你修正上一次提交。看下面的一个例子</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 第一次提交，发现搞忘了一个文件</span>
$ <span class="token function">git</span> commit <span class="token parameter variable">-m</span> <span class="token string">&quot;add new file&quot;</span>
<span class="token comment"># 将其添加到暂存区</span>
$ <span class="token function">git</span> <span class="token function">add</span> newfile.txt
<span class="token comment"># 然后修正上一次提交</span>
$ <span class="token function">git</span> commit <span class="token parameter variable">--amend</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第二个例子</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 把main.go错写成了mian.go</span>
$ <span class="token function">git</span> commit <span class="token parameter variable">-m</span> <span class="token string">&quot;update mian.go&quot;</span> 
<span class="token comment"># 修正描述信息</span>
$ <span class="token function">git</span> commit <span class="token parameter variable">--amend</span> <span class="token parameter variable">-m</span> <span class="token string">&quot;update main.go&quot;</span> 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>携带该参数后，git会将暂存区内的文件提交，如果说没有任何文件修改，git仅仅只会更新提交信息，修正后，提交历史中只会留下被修正的那个。</p><h3 id="撤销提交" tabindex="-1"><a class="header-anchor" href="#撤销提交" aria-hidden="true">#</a> 撤销提交</h3><p>当你发现提交错文件了，想要撤销提交，可以使用<code>git reset</code>，需要注意的是<code>git reset</code>命令使用不当是相当危险的，因为它会丢弃指定提交后的所有修改。对于撤销级别，有三个参数可以使用</p><ul><li><code>--soft</code>：仅撤销仓库中的内容，不影响暂存区和工作区，指定撤销节点的所有修改都会回到暂存区中。</li><li><code>--mixed</code>：默认，撤销仓库和暂存区中的修改，但是不影响工作区。</li><li><code>--hard</code>：使用该参数相当的危险，因为它同时会撤销工作区的代码，携带该参数执行后，会清空暂存区，并将工作区都恢复成指定撤销提交之前的状态。</li></ul><p>如果想要撤销多次提交，可以使用<code>git reset HEAD^n</code>，HEAD是一个指针，它永远指向当前分支的最新提交，<code>HEAD^n</code>即表示前n个提交。倘若想要撤销一个指定的提交，可以将该提交的sha1检验和作为参数使用来指定。比如下面这个命令：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> reset 10e5e5e7d6c7fbfa049ee6ecd0a1ee443ca1d70c
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>使用<code>git reset --hard</code>可以达到将代码回退到某一个版本的效果，不过此前工作区中的所有改动都会消失。下面会将用几个例子做演示，首先对仓库进行一次新的提交</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token builtin class-name">echo</span> <span class="token string">&quot;reset example&quot;</span> <span class="token operator">&gt;&gt;</span> hello.txt
$ <span class="token function">git</span> commit <span class="token parameter variable">-a</span> <span class="token parameter variable">-m</span> <span class="token string">&quot;reset example&quot;</span>
<span class="token punctuation">[</span>master c231e1f<span class="token punctuation">]</span> reset example
 <span class="token number">1</span> <span class="token function">file</span> changed, <span class="token number">1</span> insertion<span class="token punctuation">(</span>+<span class="token punctuation">)</span>
$ <span class="token function">git</span> log <span class="token parameter variable">-1</span>
commit c231e1f147b07b8ed0d3c3fe58eddba736a5eab5 <span class="token punctuation">(</span>HEAD -<span class="token operator">&gt;</span> master<span class="token punctuation">)</span>
Author: <span class="token number">246859</span> <span class="token operator">&lt;</span><span class="token number">2633565580</span>@qq.com<span class="token operator">&gt;</span>
Date:   Mon Sep <span class="token number">4</span> <span class="token number">10</span>:06:18 <span class="token number">2023</span> +0800

    reset example
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>下面演示三个参数分别会造成什么影响，首先使用默认不带参数，可以看到此时回到了修改未暂存的状态。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> reset HEAD^
$ <span class="token function">git</span> status
On branch master
Changes not staged <span class="token keyword">for</span> commit:
  <span class="token punctuation">(</span>use <span class="token string">&quot;git add &lt;file&gt;...&quot;</span> to update what will be committed<span class="token punctuation">)</span>
  <span class="token punctuation">(</span>use <span class="token string">&quot;git restore &lt;file&gt;...&quot;</span> to discard changes <span class="token keyword">in</span> working directory<span class="token punctuation">)</span>
        modified:   hello.txt

no changes added to commit <span class="token punctuation">(</span>use <span class="token string">&quot;git add&quot;</span> and/or <span class="token string">&quot;git commit -a&quot;</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后使用<code>--soft</code>参数，再次查看仓库状态，可以看到回到了暂存区修改未提交的状态</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> reset <span class="token parameter variable">--soft</span> HEAD^
$ <span class="token function">git</span> status
On branch master
Changes to be committed:
  <span class="token punctuation">(</span>use <span class="token string">&quot;git restore --staged &lt;file&gt;...&quot;</span> to unstage<span class="token punctuation">)</span>
        modified:   hello.txt
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>最后使用<code>--hard</code>参数，此时查看仓库状态会发现什么都不会提示，因为该操作直接将工作区重置到了该次提交时的状态。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> reset <span class="token parameter variable">--hard</span> HEAD^
HEAD is now at 25cdeea a
$ <span class="token function">git</span> status
On branch master
nothing to commit, working tree clean
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在上面的操作中，可以看到有些操作是无法恢复且相当危险的，使用<code>git reset</code>撤销的提交，在提交历史中会消失，如果想要找回可以使用命令<code>git reflog</code>，不过这是有时效性的，时间久了git会删除。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> reflog show
25cdeea <span class="token punctuation">(</span>HEAD -<span class="token operator">&gt;</span> master<span class="token punctuation">)</span> HEAD@<span class="token punctuation">{</span><span class="token number">0</span><span class="token punctuation">}</span>: reset: moving to HEAD^
7a7d12b HEAD@<span class="token punctuation">{</span><span class="token number">1</span><span class="token punctuation">}</span>: commit: reset example
25cdeea <span class="token punctuation">(</span>HEAD -<span class="token operator">&gt;</span> master<span class="token punctuation">)</span> HEAD@<span class="token punctuation">{</span><span class="token number">2</span><span class="token punctuation">}</span>: reset: moving to HEAD^
4f8190f HEAD@<span class="token punctuation">{</span><span class="token number">3</span><span class="token punctuation">}</span>: commit: reset example
25cdeea <span class="token punctuation">(</span>HEAD -<span class="token operator">&gt;</span> master<span class="token punctuation">)</span> HEAD@<span class="token punctuation">{</span><span class="token number">4</span><span class="token punctuation">}</span>: reset: moving to HEAD^
c231e1f HEAD@<span class="token punctuation">{</span><span class="token number">5</span><span class="token punctuation">}</span>: commit: reset example
25cdeea <span class="token punctuation">(</span>HEAD -<span class="token operator">&gt;</span> master<span class="token punctuation">)</span> HEAD@<span class="token punctuation">{</span><span class="token number">6</span><span class="token punctuation">}</span>: commit: a
10e5e5e HEAD@<span class="token punctuation">{</span><span class="token number">7</span><span class="token punctuation">}</span>: reset: moving to HEAD^
b34d4da HEAD@<span class="token punctuation">{</span><span class="token number">8</span><span class="token punctuation">}</span>: commit: commit1
10e5e5e HEAD@<span class="token punctuation">{</span><span class="token number">9</span><span class="token punctuation">}</span>: commit: commit
c7bdcd8 HEAD@<span class="token punctuation">{</span><span class="token number">10</span><span class="token punctuation">}</span>: commit <span class="token punctuation">(</span>amend<span class="token punctuation">)</span>: update aaa.txt
7514cce HEAD@<span class="token punctuation">{</span><span class="token number">11</span><span class="token punctuation">}</span>: commit: update hello.txt
e538986 HEAD@<span class="token punctuation">{</span><span class="token number">12</span><span class="token punctuation">}</span>: commit: skip stage
b4c2d7f HEAD@<span class="token punctuation">{</span><span class="token number">13</span><span class="token punctuation">}</span>: commit: 3rd commit
5ca7961 HEAD@<span class="token punctuation">{</span><span class="token number">14</span><span class="token punctuation">}</span>: commit: hello
eff484a HEAD@<span class="token punctuation">{</span><span class="token number">15</span><span class="token punctuation">}</span>: commit <span class="token punctuation">(</span>initial<span class="token punctuation">)</span>: initial commit
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在这里我们可以看到被撤销的提交，以及其他被reflog记录的操作，想要恢复这些提交使用<code>git reset commit-id</code>即可。</p><p>使用<code>git reset</code>是比较危险的，为此，git提供了一种更加安全的撤销方式<code>git revert</code>。它会抵消掉上一次提交导致的所有变化，且不会改变提交历史，而且会产生一个新的提交。同样的，先做一个新提交，在使用<code>revert</code>。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token builtin class-name">echo</span> <span class="token string">&quot;revert example&quot;</span> <span class="token operator">&gt;&gt;</span> hello.txt
$ <span class="token function">git</span> commit <span class="token parameter variable">-a</span> <span class="token parameter variable">-m</span> <span class="token string">&quot;revert example&quot;</span>
<span class="token punctuation">[</span>master 9d3a0a3<span class="token punctuation">]</span> revert example
 <span class="token number">1</span> <span class="token function">file</span> changed, <span class="token number">1</span> insertion<span class="token punctuation">(</span>+<span class="token punctuation">)</span>
 $ <span class="token function">git</span> revert HEAD
<span class="token punctuation">[</span>master f5602b9<span class="token punctuation">]</span> Revert <span class="token string">&quot;revert example&quot;</span>
 <span class="token number">1</span> <span class="token function">file</span> changed, <span class="token number">1</span> deletion<span class="token punctuation">(</span>-<span class="token punctuation">)</span>

$ <span class="token function">cat</span> hello.txt
hello world
track two <span class="token function">file</span> <span class="token keyword">in</span> repo
<span class="token number">123</span>
<span class="token number">12</span>
<span class="token number">123</span>
<span class="token number">123</span>
update something
update hello.txt
<span class="token number">123</span>
<span class="token number">123</span>
$ <span class="token function">git</span> log <span class="token parameter variable">-2</span>
commit f5602b9057b6219ee65cac7e9af815f9c13339df <span class="token punctuation">(</span>HEAD -<span class="token operator">&gt;</span> master<span class="token punctuation">)</span>
Author: <span class="token number">246859</span> <span class="token operator">&lt;</span><span class="token number">2633565580</span>@qq.com<span class="token operator">&gt;</span>
Date:   Mon Sep <span class="token number">4</span> <span class="token number">11</span>:13:11 <span class="token number">2023</span> +0800

    Revert <span class="token string">&quot;revert example&quot;</span>

    This reverts commit 9d3a0a371740bc2e53fb2ca8bb26c813016ab870.

    revert example

commit 9d3a0a371740bc2e53fb2ca8bb26c813016ab870
Author: <span class="token number">246859</span> <span class="token operator">&lt;</span><span class="token number">2633565580</span>@qq.com<span class="token operator">&gt;</span>
Date:   Mon Sep <span class="token number">4</span> <span class="token number">11</span>:12:18 <span class="token number">2023</span> +0800

    revert example
$ <span class="token function">git</span> status
On branch master
nothing to commit, working tree clean
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看到，在<code>revert</code>后，原本提交修改的内容消失了，提交历史中之前的提交仍然存在，并且还多了一个新提交。实际上git是将工作区和暂存区的内容恢复到了指定提交之前，并且自动add和commit，如果不想自动提交可以加上<code>-n</code>参数，此时查看仓库状态就会有提示</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> status
On branch master
You are currently reverting commit f5602b9.
  <span class="token punctuation">(</span>all conflicts fixed: run <span class="token string">&quot;git revert --continue&quot;</span><span class="token punctuation">)</span>
  <span class="token punctuation">(</span>use <span class="token string">&quot;git revert --skip&quot;</span> to skip this patch<span class="token punctuation">)</span>
  <span class="token punctuation">(</span>use <span class="token string">&quot;git revert --abort&quot;</span> to cancel the revert operation<span class="token punctuation">)</span>

Changes to be committed:
  <span class="token punctuation">(</span>use <span class="token string">&quot;git restore --staged &lt;file&gt;...&quot;</span> to unstage<span class="token punctuation">)</span>
        modified:   hello.txt
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>git已经提示了你使用<code>git revert --abort</code>来删除此次<code>revert</code>操作，或者<code>git revert --skip</code> 来忽略修改。如果想要<code>revert</code>多个提交，则必须依次指定。例如</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> revert <span class="token punctuation">[</span>last one<span class="token punctuation">]</span> <span class="token punctuation">[</span>second to last<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="撤销暂存" tabindex="-1"><a class="header-anchor" href="#撤销暂存" aria-hidden="true">#</a> 撤销暂存</h3><p>取消暂存有两种情况，一种是将新文件移出暂存区，一种是撤销添加到暂存区的修改。在先前的例子中，将新文件添加到暂存区后，查看仓库状态时，git会这样输出</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> status
On branch master

No commits yet

Changes to be committed:
  <span class="token punctuation">(</span>use <span class="token string">&quot;git rm --cached &lt;file&gt;...&quot;</span> to unstage<span class="token punctuation">)</span>
        new file:   README.md
        new file:   hello.txt
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其中有这么一句：<code>(use &quot;git rm --cached &lt;file&gt;...&quot; to unstage)</code>，git已经告诉你了如何将这些文件取消暂存，对<code>hello.txt</code>执行</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> <span class="token function">rm</span> <span class="token parameter variable">--cached</span> hello.txt
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>就可以将该文件移出暂存区。还有一种情况就是已经在暂存区的文件，将新的修改添加到暂存区过后，想要从暂存区撤回该修改，如下面的例子。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token builtin class-name">echo</span> <span class="token string">&quot;123&quot;</span> <span class="token operator">&gt;&gt;</span> hello.txt
$ <span class="token function">git</span> status
On branch master
Changes not staged <span class="token keyword">for</span> commit:
  <span class="token punctuation">(</span>use <span class="token string">&quot;git add &lt;file&gt;...&quot;</span> to update what will be committed<span class="token punctuation">)</span>
  <span class="token punctuation">(</span>use <span class="token string">&quot;git restore &lt;file&gt;...&quot;</span> to discard changes <span class="token keyword">in</span> working directory<span class="token punctuation">)</span>
        modified:   hello.txt

no changes added to commit <span class="token punctuation">(</span>use <span class="token string">&quot;git add&quot;</span> and/or <span class="token string">&quot;git commit -a&quot;</span><span class="token punctuation">)</span>
$ <span class="token function">git</span> <span class="token function">add</span> hello.txt
$ <span class="token function">git</span> status
On branch master
Changes to be committed:
  <span class="token punctuation">(</span>use <span class="token string">&quot;git restore --staged &lt;file&gt;...&quot;</span> to unstage<span class="token punctuation">)</span>
        modified:   hello.txt
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>此时git已经提示了我们，使用<code>git restore --staged</code>来撤销暂存区的这一次修改。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> restore <span class="token parameter variable">--staged</span> hello.txt
$ <span class="token function">git</span> status
On branch master
Changes not staged <span class="token keyword">for</span> commit:
  <span class="token punctuation">(</span>use <span class="token string">&quot;git add &lt;file&gt;...&quot;</span> to update what will be committed<span class="token punctuation">)</span>
  <span class="token punctuation">(</span>use <span class="token string">&quot;git restore &lt;file&gt;...&quot;</span> to discard changes <span class="token keyword">in</span> working directory<span class="token punctuation">)</span>
        modified:   hello.txt

no changes added to commit <span class="token punctuation">(</span>use <span class="token string">&quot;git add&quot;</span> and/or <span class="token string">&quot;git commit -a&quot;</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>撤销后，会发现又回到了修改未被暂存的状态了，除了使用<code>git restore</code>之外，还可以使用 <code>git reset HEAD &lt;file&gt;</code>来撤销暂存区的修改，后者将暂存区指定文件的状态恢复成仓库分支中的状态。需要注意的是，这些命令都是对暂存区进行操作，不会影响到仓库和工作区。</p><h3 id="撤销修改" tabindex="-1"><a class="header-anchor" href="#撤销修改" aria-hidden="true">#</a> 撤销修改</h3><p>前面讲的都是对提交和暂存的撤销操作，当想要撤销工作区文件的修改时，将其还原成上一次提交或某一次提交的状态，在上面撤销暂存的例子中，git已经告诉我们了。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> status
On branch master
Changes not staged <span class="token keyword">for</span> commit:
  <span class="token punctuation">(</span>use <span class="token string">&quot;git add &lt;file&gt;...&quot;</span> to update what will be committed<span class="token punctuation">)</span>
  <span class="token punctuation">(</span>use <span class="token string">&quot;git restore &lt;file&gt;...&quot;</span> to discard changes <span class="token keyword">in</span> working directory<span class="token punctuation">)</span>
        modified:   hello.txt

no changes added to commit <span class="token punctuation">(</span>use <span class="token string">&quot;git add&quot;</span> and/or <span class="token string">&quot;git commit -a&quot;</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>有这么一句：<code>(use &quot;git restore &lt;file&gt;...&quot; to discard changes in working directory)</code>，告诉我们，使用<code>git restore &lt;file&gt;</code>来丢弃工作区指定文件的修改。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> restore hello.txt
$ <span class="token function">git</span> status
On branch master
nothing to commit, working tree clean
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>执行后会发现，文件回到了修改之前，git也不再提示文件有未暂存的修改 ，使用命令<code>git checkout -- hello.txt</code>具有同样的效果。需要注意的是，当你对工作区修改撤销后，是无法恢复的，你最好明白你在做什么。</p><div class="hint-container warning"><p class="hint-container-title">注意</p><p>在git中，只要是提交到了仓库中的修改，绝大多数情况都是可以恢复的，甚至被删除的分支和使用<code>--amend</code>覆盖的提交也可以恢复。但是，任何未提交的修改，丢弃以后就可能再也找不到了。</p></div><h2 id="标签操作" tabindex="-1"><a class="header-anchor" href="#标签操作" aria-hidden="true">#</a> 标签操作</h2><p>在git中，你可以为某一个提交标注一个标签，表示这是一个阶段性变化，比如一个新的发行版，等等。通过命令<code>git tag -l</code>来查看一个仓库中的所有tag</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> tag <span class="token parameter variable">-l</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>同时它也支持模式匹配，比如</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> tag <span class="token parameter variable">-l</span> <span class="token string">&quot;v1.*&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>这行命令表示只查看主版本为1的tag。在git中，标签分为两种类型，轻量标签（lightweight）和附注标签（annotated），这两种类型还是有很大差别的，轻量标签只是一个特定提交的引用，而附注标签是存储在git中的一个完整对象，包含了许多有用的信息。</p>`,120),v={class:"hint-container tip"},m=s("p",{class:"hint-container-title"},"提示",-1),b={href:"https://semver.org/lang/zh-CN/",target:"_blank",rel:"noopener noreferrer"},g=a(`<h3 id="轻量标签" tabindex="-1"><a class="header-anchor" href="#轻量标签" aria-hidden="true">#</a> 轻量标签</h3><p>创建轻量标签只需要提供标签名即可，如下</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> tag v1.0.0
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>在创建过后，使用<code>git show &lt;tagname&gt;</code>来查看该tag的信息</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> show v1.0.0
commit f5602b9057b6219ee65cac7e9af815f9c13339df <span class="token punctuation">(</span>HEAD -<span class="token operator">&gt;</span> master, tag: v1.0.0<span class="token punctuation">)</span>
Author: <span class="token number">246859</span> <span class="token operator">&lt;</span><span class="token number">2633565580</span>@qq.com<span class="token operator">&gt;</span>
Date:   Mon Sep <span class="token number">4</span> <span class="token number">11</span>:13:11 <span class="token number">2023</span> +0800

    Revert <span class="token string">&quot;revert example&quot;</span>

    This reverts commit 9d3a0a371740bc2e53fb2ca8bb26c813016ab870.

    revert example

<span class="token function">diff</span> <span class="token parameter variable">--git</span> a/hello.txt b/hello.txt
index 1ab193a<span class="token punctuation">..</span>a28df9c <span class="token number">100644</span>
--- a/hello.txt
+++ b/hello.txt
@@ -8,4 +8,3 @@ update something
 update hello.txt
 <span class="token number">123</span>
 <span class="token number">123</span>
<span class="token parameter variable">-revert</span> example
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看到轻量标签显示的是commit的信息，之所以叫轻量是因为它仅仅是对提交的引用，当你仅仅只是临时需要一个tag，不想要其他的信息就可以使用轻量标签。</p><h3 id="附注标签" tabindex="-1"><a class="header-anchor" href="#附注标签" aria-hidden="true">#</a> 附注标签</h3><p>创建附注标签需要用到两个额外的参数，<code>-a</code>参数表示创建一个annotated tags，它接收一个tag名，<code>-m</code>参数表示对tag的描述信息。如下</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> tag <span class="token parameter variable">-a</span> v1.0.1 <span class="token parameter variable">-m</span> <span class="token string">&quot;this is a annotated tag&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>创建后，对该tag执行<code>git show</code></p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> show v1.0.1
tag v1.0.1
Tagger: <span class="token number">246859</span> <span class="token operator">&lt;</span><span class="token number">2633565580</span>@qq.com<span class="token operator">&gt;</span>
Date:   Thu Sep <span class="token number">7</span> <span class="token number">14</span>:15:28 <span class="token number">2023</span> +0800

this is a annotated tag

commit f5602b9057b6219ee65cac7e9af815f9c13339df <span class="token punctuation">(</span>HEAD -<span class="token operator">&gt;</span> master, tag: v1.0.1, tag: v1.0.0<span class="token punctuation">)</span>
Author: <span class="token number">246859</span> <span class="token operator">&lt;</span><span class="token number">2633565580</span>@qq.com<span class="token operator">&gt;</span>
Date:   Mon Sep <span class="token number">4</span> <span class="token number">11</span>:13:11 <span class="token number">2023</span> +0800

    Revert <span class="token string">&quot;revert example&quot;</span>

    This reverts commit 9d3a0a371740bc2e53fb2ca8bb26c813016ab870.

    revert example

<span class="token function">diff</span> <span class="token parameter variable">--git</span> a/hello.txt b/hello.txt
index 1ab193a<span class="token punctuation">..</span>a28df9c <span class="token number">100644</span>
--- a/hello.txt
+++ b/hello.txt
@@ -8,4 +8,3 @@ update something
 update hello.txt
 <span class="token number">123</span>
 <span class="token number">123</span>
<span class="token parameter variable">-revert</span> example
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>会发现除了展示commit的信息之外，还会展示标记标签的人，日期，信息等。</p><h3 id="指定提交" tabindex="-1"><a class="header-anchor" href="#指定提交" aria-hidden="true">#</a> 指定提交</h3><p><code>git tag</code>命令在创建标签时，默认是为HEAD指针，也就是最新的提交创建tag，当然也可以是一个特定的提交。只需要将该提交的sha1校验和作为参数即可。如下</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> tag <span class="token parameter variable">-a</span> v1.0.2 <span class="token parameter variable">-m</span> <span class="token string">&quot;specified commit tag&quot;</span> eff484ad548c2fb78a821793898dbafa0ef8ddc9
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>创建完后，查看tag信息</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> show v1.0.2
tag v1.0.2
Tagger: <span class="token number">246859</span> <span class="token operator">&lt;</span><span class="token number">2633565580</span>@qq.com<span class="token operator">&gt;</span>
Date:   Thu Sep <span class="token number">7</span> <span class="token number">14</span>:23:57 <span class="token number">2023</span> +0800

specified commit tag

commit eff484ad548c2fb78a821793898dbafa0ef8ddc9 <span class="token punctuation">(</span>tag: v1.0.2<span class="token punctuation">)</span>
Author: <span class="token number">246859</span> <span class="token operator">&lt;</span><span class="token number">2633565580</span>@qq.com<span class="token operator">&gt;</span>
Date:   Sat Sep <span class="token number">2</span> <span class="token number">16</span>:45:37 <span class="token number">2023</span> +0800

    initial commit

<span class="token function">diff</span> <span class="token parameter variable">--git</span> a/README.md b/README.md
new <span class="token function">file</span> mode <span class="token number">100644</span>
index 0000000<span class="token punctuation">..</span>933885d
--- /dev/null
+++ b/README.md
@@ -0,0 +1 @@
+<span class="token comment">#Hi there</span>
<span class="token function">diff</span> <span class="token parameter variable">--git</span> a/hello.txt b/hello.txt
new <span class="token function">file</span> mode <span class="token number">100644</span>
index 0000000<span class="token punctuation">..</span>ddfb619
--- /dev/null
+++ b/hello.txt
@@ -0,0 +1,2 @@
+hello world
+track two <span class="token function">file</span> <span class="token keyword">in</span> repo
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样，就可以为一个指定的提交创建tag了。</p><h3 id="删除标签" tabindex="-1"><a class="header-anchor" href="#删除标签" aria-hidden="true">#</a> 删除标签</h3><p>在本地仓库删除一个tag，可以使用命令<code>git tag -d &lt;tagname&gt;</code>，比如</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> tag <span class="token parameter variable">-d</span> v1.0.2
Deleted tag <span class="token string">&#39;v1.0.2&#39;</span> <span class="token punctuation">(</span>was 13948de<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>删除后，再查看tag就会发现没有了</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> tag <span class="token parameter variable">-l</span>
v1.0.0
v1.0.1
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>不过需要注意的是，这仅仅只是在本地仓库删除标签，如果有远程仓库的话，需要单独删除，可以使用如下命令</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> push origin <span class="token parameter variable">--delete</span> <span class="token operator">&lt;</span>tagname<span class="token operator">&gt;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="推送标签" tabindex="-1"><a class="header-anchor" href="#推送标签" aria-hidden="true">#</a> 推送标签</h3><p>当你的本地仓库关联了一个远程仓库后，如果你本地创建了tag，再将代码推送到远程仓库上，远程仓库是不会创建tag的。如果你想要推送某一个指定的标签可以使用如下命令</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> push <span class="token operator">&lt;</span>remote<span class="token operator">&gt;</span> <span class="token operator">&lt;</span>tagname<span class="token operator">&gt;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>例如</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> push origin v1.0.3
Enumerating objects: <span class="token number">1</span>, done.
Counting objects: <span class="token number">100</span>% <span class="token punctuation">(</span><span class="token number">1</span>/1<span class="token punctuation">)</span>, done.
Writing objects: <span class="token number">100</span>% <span class="token punctuation">(</span><span class="token number">1</span>/1<span class="token punctuation">)</span>, <span class="token number">151</span> bytes <span class="token operator">|</span> <span class="token number">151.00</span> KiB/s, done.
Total <span class="token number">1</span> <span class="token punctuation">(</span>delta <span class="token number">0</span><span class="token punctuation">)</span>, reused <span class="token number">0</span> <span class="token punctuation">(</span>delta <span class="token number">0</span><span class="token punctuation">)</span>, pack-reused <span class="token number">0</span>
To https://github.com/246859/git-example.git
 * <span class="token punctuation">[</span>new tag<span class="token punctuation">]</span>         v1.0.3 -<span class="token operator">&gt;</span> v1.0.3
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果你想要推送所有标签，直接加上<code>--tags</code>参数即可。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> push origin <span class="token parameter variable">--tags</span>
Enumerating objects: <span class="token number">27</span>, done.
Counting objects: <span class="token number">100</span>% <span class="token punctuation">(</span><span class="token number">27</span>/27<span class="token punctuation">)</span>, done.
Delta compression using up to <span class="token number">16</span> threads
Compressing objects: <span class="token number">100</span>% <span class="token punctuation">(</span><span class="token number">23</span>/23<span class="token punctuation">)</span>, done.
Writing objects: <span class="token number">100</span>% <span class="token punctuation">(</span><span class="token number">27</span>/27<span class="token punctuation">)</span>, <span class="token number">2.32</span> KiB <span class="token operator">|</span> <span class="token number">790.00</span> KiB/s, done.
Total <span class="token number">27</span> <span class="token punctuation">(</span>delta <span class="token number">5</span><span class="token punctuation">)</span>, reused <span class="token number">0</span> <span class="token punctuation">(</span>delta <span class="token number">0</span><span class="token punctuation">)</span>, pack-reused <span class="token number">0</span>
remote: Resolving deltas: <span class="token number">100</span>% <span class="token punctuation">(</span><span class="token number">5</span>/5<span class="token punctuation">)</span>, done.
To https://github.com/246859/git-example.git
 * <span class="token punctuation">[</span>new tag<span class="token punctuation">]</span>         v1.0.0 -<span class="token operator">&gt;</span> v1.0.0
 * <span class="token punctuation">[</span>new tag<span class="token punctuation">]</span>         v1.0.1 -<span class="token operator">&gt;</span> v1.0.1
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样一来，远程仓库上的tag就与本地仓库同步了。</p><h3 id="检出标签" tabindex="-1"><a class="header-anchor" href="#检出标签" aria-hidden="true">#</a> 检出标签</h3><p>使用命令<code>git checkout &lt;tagname&gt;</code>，就可以将工作区的内容变为该标签所提交时的状态，如</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> checkout v1.0.3
Note: switching to <span class="token string">&#39;v1.0.3&#39;</span><span class="token builtin class-name">.</span>

You are <span class="token keyword">in</span> <span class="token string">&#39;detached HEAD&#39;</span> state. You can <span class="token function">look</span> around, <span class="token function">make</span> experimental
changes and commit them, and you can discard any commits you <span class="token function">make</span> <span class="token keyword">in</span> this
state without impacting any branches by switching back to a branch.

If you want to create a new branch to retain commits you create, you may
<span class="token keyword">do</span> so <span class="token punctuation">(</span>now or later<span class="token punctuation">)</span> by using <span class="token parameter variable">-c</span> with the switch command. Example:

  <span class="token function">git</span> switch <span class="token parameter variable">-c</span> <span class="token operator">&lt;</span>new-branch-name<span class="token operator">&gt;</span>

Or undo this operation with:

  <span class="token function">git</span> switch -

Turn off this advice by setting config variable advice.detachedHead to <span class="token boolean">false</span>

HEAD is now at f5602b9 Revert <span class="token string">&quot;revert example&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>git提醒你，现在处于与HEAD指针分离的状态，现在你做的任何的修改和提交都不会对仓库造成任何影响。如果你想要保存这些修改，可以创建一个新的分支</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">git</span> switch <span class="token parameter variable">-c</span> <span class="token operator">&lt;</span>branch-name<span class="token operator">&gt;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>或者你也可以在一开始就创建一个新的分支</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> checkout <span class="token parameter variable">-b</span> <span class="token operator">&lt;</span>brancn-name<span class="token operator">&gt;</span> <span class="token operator">&lt;</span>tagname<span class="token operator">&gt;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>而后面如果你想要希望将这些修改同步到仓库中，这就涉及到后面分支这一文要讲的内容了。如果你想要回到头指针，执行如下命令即可。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> switch -
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="命令别名" tabindex="-1"><a class="header-anchor" href="#命令别名" aria-hidden="true">#</a> 命令别名</h2><p>对于你经常使用的命令，如果觉得每次都要输入完整的命令而感到厌烦，命令别名可以帮到你。例子如下</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> config <span class="token parameter variable">--global</span> alias.ci commit
$ <span class="token function">git</span> config <span class="token parameter variable">--global</span> alias.st status
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>上述命令分别为<code>commit</code>和<code>status</code>命令创建了别名，由于添加了<code>--global</code>参数，所以别名可以全局使用。执行别名试试</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> st
On branch master
nothing to commit, working tree clean
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>还有三个参数要提一下，分别是</p><ul><li><code>--add</code>，表示添加别名</li><li><code>--replace-all</code>，表示覆盖别名</li><li><code>--unset</code>，表示删除别名</li></ul><p>除此之外，也可以使用命令来清空所有别名</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> config <span class="token parameter variable">--global</span> --remove-section <span class="token builtin class-name">alias</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>这个命令会直接将配置文件中的alias部分删掉。</p><h3 id="配置文件" tabindex="-1"><a class="header-anchor" href="#配置文件" aria-hidden="true">#</a> 配置文件</h3><p>除了使用命令之外，也可以使用配置文件，也就是<code>.gitconfig</code>文件，windows一般是<code>c:/$user/.gitconfig</code>，linux一般是<code>$HOME/.gitconfig</code>。打开配置文件就可以看到如下内容</p><div class="language-ini line-numbers-mode" data-ext="ini"><pre class="language-ini"><code><span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">alias</span><span class="token punctuation">]</span></span>
	<span class="token key attr-name">st</span> <span class="token punctuation">=</span> <span class="token value attr-value">status</span>
	<span class="token key attr-name">ls</span> <span class="token punctuation">=</span> <span class="token value attr-value">ls</span>
	<span class="token key attr-name">env</span> <span class="token punctuation">=</span> <span class="token value attr-value">echo</span>
	<span class="token key attr-name">env</span> <span class="token punctuation">=</span> <span class="token value attr-value">echo revert</span>
	<span class="token key attr-name">env</span> <span class="token punctuation">=</span> <span class="token value attr-value">!go env</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="外部命令" tabindex="-1"><a class="header-anchor" href="#外部命令" aria-hidden="true">#</a> 外部命令</h3><p>除了给git自身的命令加别名外，也可以是外部命令，在添加外部命令时，需要在命令前加上<code>!</code>来表示这是外部命令。格式为</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> config <span class="token parameter variable">--gloabl</span> alias.<span class="token operator">&lt;</span>aliasname<span class="token operator">&gt;</span> <span class="token operator">&lt;</span><span class="token operator">!</span>externalcmd<span class="token operator">&gt;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>例如下面的命令，需要注意的是别名必须是单引号括起来。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> config <span class="token parameter variable">--global</span> alias.env <span class="token string">&#39;!go env&#39;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>执行别名试试，就可以看到go的环境变量。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> <span class="token function">env</span>
<span class="token builtin class-name">set</span> <span class="token assign-left variable">GO111MODULE</span><span class="token operator">=</span>on
<span class="token builtin class-name">set</span> <span class="token assign-left variable">GOARCH</span><span class="token operator">=</span>amd64
<span class="token punctuation">..</span>.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,62);function k(h,f){const e=d("ExternalLinkIcon");return l(),c("div",null,[p,s("p",null,[n("Github有专门收集这类模板的仓库，前往"),s("a",r,[n("github/gitignore: A collection of useful .gitignore templates"),t(e)]),n("了解更多。")]),u,s("div",v,[m,s("p",null,[n("人们对软件版本号的定义方式各有千秋，一个主流的方式是使用语义化版本号，前往"),s("a",b,[n("语义化版本 2.0.0 | Semantic Versioning (semver.org)"),t(e)]),n("查看。")])]),g])}const q=i(o,[["render",k],["__file","1.repo.html.vue"]]);export{q as default};
