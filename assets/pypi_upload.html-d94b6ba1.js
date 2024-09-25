import{_ as t,W as p,X as i,a0 as o,Y as n,Z as s,$ as e,a1 as c,C as l}from"./framework-b5ea9e64.js";const u={},r=n("h1",{id:"在pypi上发布自己的项目",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#在pypi上发布自己的项目","aria-hidden":"true"},"#"),s(" 在Pypi上发布自己的项目")],-1),d=n("figure",null,[n("img",{src:"https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202406101805061.png",alt:"",tabindex:"0",loading:"lazy"}),n("figcaption")],-1),k=n("hr",null,null,-1),v=n("p",null,"最近在用到一个python库的时候，发现了一个bug，看了看原仓库上次更新都是2022年了，估计我提了PR也不会被合并，于是我打算自己修复发布成一个新的包，此前没有了解过这些方面的知识，于是顺便写了这篇文章做一个记录。",-1),m={href:"https://packaging.python.org/en/latest/tutorials/packaging-projects/",target:"_blank",rel:"noopener noreferrer"},b=n("h2",{id:"pypi",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#pypi","aria-hidden":"true"},"#"),s(" PyPI")],-1),g={href:"https://pypi.org/",target:"_blank",rel:"noopener noreferrer"},y=c(`<p>第一步是在PyPI上注册一个自己的账号，然后申请一个API Token，这个Token就是专门用来上传软件包的。</p><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202406101815258.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>你可以在<code>username/Account settings/API tokens</code>位置找到有关Token的内容，现在的话申请Token必须要2FA认证，可以用自己喜欢的2FA应用来完成认证，在成功创建后，Token只会显示一次，为了后续方便使用，建议将其保存到本地的文件中，保存位置为<code>user/.pypirc</code>文件中。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>[pypi]
  username = your_name
  password = pypi-token
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>后续在用到的时候就会自动读取，不需要手动认证。</p><h2 id="规范" tabindex="-1"><a class="header-anchor" href="#规范" aria-hidden="true">#</a> 规范</h2><p>对于一个规范的项目而言，应该有如下几样东西</p><ul><li>LICENSE，开源证书</li><li>README，基本的文档</li><li><code>setup.py</code>，打包用的清单文件</li></ul><p>其它都还好，主要来讲讲这个<code>setup.py</code>，由于它稍微有点复杂，可以通过<code>pyproject.toml</code>配置文件来替代，不过其灵活性不如前者，比如下面是一个TOML的例子</p><div class="language-toml line-numbers-mode" data-ext="toml"><pre class="language-toml"><code><span class="token punctuation">[</span><span class="token table class-name">project</span><span class="token punctuation">]</span>
<span class="token key property">name</span> <span class="token punctuation">=</span> <span class="token string">&quot;example_package_YOUR_USERNAME_HERE&quot;</span>
<span class="token key property">version</span> <span class="token punctuation">=</span> <span class="token string">&quot;0.0.1&quot;</span>
<span class="token key property">authors</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>
  <span class="token punctuation">{</span> <span class="token key property">name</span><span class="token punctuation">=</span><span class="token string">&quot;Example Author&quot;</span><span class="token punctuation">,</span> <span class="token key property">email</span><span class="token punctuation">=</span><span class="token string">&quot;author@example.com&quot;</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">]</span>
<span class="token key property">description</span> <span class="token punctuation">=</span> <span class="token string">&quot;A small example package&quot;</span>
<span class="token key property">readme</span> <span class="token punctuation">=</span> <span class="token string">&quot;README.md&quot;</span>
<span class="token key property">requires-python</span> <span class="token punctuation">=</span> <span class="token string">&quot;&gt;=3.8&quot;</span>
<span class="token key property">classifiers</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>
    <span class="token string">&quot;Programming Language :: Python :: 3&quot;</span><span class="token punctuation">,</span>
    <span class="token string">&quot;License :: OSI Approved :: MIT License&quot;</span><span class="token punctuation">,</span>
    <span class="token string">&quot;Operating System :: OS Independent&quot;</span><span class="token punctuation">,</span>
<span class="token punctuation">]</span>

<span class="token punctuation">[</span><span class="token table class-name">project.urls</span><span class="token punctuation">]</span>
<span class="token key property">Homepage</span> <span class="token punctuation">=</span> <span class="token string">&quot;https://github.com/pypa/sampleproject&quot;</span>
<span class="token key property">Issues</span> <span class="token punctuation">=</span> <span class="token string">&quot;https://github.com/pypa/sampleproject/issues&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>通过配置文件可以很直观的了解到这些信息，不过稍微旧一点的项目都是使用<code>setup.py</code>来管理的，下面看一个<code>setup.py</code>的例子，该例子由知名开源作者<code>kennethreitz</code>提供</p><div class="language-python line-numbers-mode" data-ext="py"><pre class="language-python"><code><span class="token comment">#!/usr/bin/env python</span>
<span class="token comment"># -*- coding: utf-8 -*-</span>

<span class="token comment"># Note: To use the &#39;upload&#39; functionality of this file, you must:</span>
<span class="token comment">#   $ pipenv install twine --dev</span>

<span class="token keyword">import</span> io
<span class="token keyword">import</span> os
<span class="token keyword">import</span> sys
<span class="token keyword">from</span> shutil <span class="token keyword">import</span> rmtree

<span class="token keyword">from</span> setuptools <span class="token keyword">import</span> find_packages<span class="token punctuation">,</span> setup<span class="token punctuation">,</span> Command

<span class="token comment"># Package meta-data.</span>
NAME <span class="token operator">=</span> <span class="token string">&#39;mypackage&#39;</span>
DESCRIPTION <span class="token operator">=</span> <span class="token string">&#39;My short description for my project.&#39;</span>
URL <span class="token operator">=</span> <span class="token string">&#39;https://github.com/me/myproject&#39;</span>
EMAIL <span class="token operator">=</span> <span class="token string">&#39;me@example.com&#39;</span>
AUTHOR <span class="token operator">=</span> <span class="token string">&#39;Awesome Soul&#39;</span>
REQUIRES_PYTHON <span class="token operator">=</span> <span class="token string">&#39;&gt;=3.6.0&#39;</span>
VERSION <span class="token operator">=</span> <span class="token string">&#39;0.1.0&#39;</span>

<span class="token comment"># What packages are required for this module to be executed?</span>
REQUIRED <span class="token operator">=</span> <span class="token punctuation">[</span>
    <span class="token comment"># &#39;requests&#39;, &#39;maya&#39;, &#39;records&#39;,</span>
<span class="token punctuation">]</span>

<span class="token comment"># What packages are optional?</span>
EXTRAS <span class="token operator">=</span> <span class="token punctuation">{</span>
    <span class="token comment"># &#39;fancy feature&#39;: [&#39;django&#39;],</span>
<span class="token punctuation">}</span>

<span class="token comment"># The rest you shouldn&#39;t have to touch too much :)</span>
<span class="token comment"># ------------------------------------------------</span>
<span class="token comment"># Except, perhaps the License and Trove Classifiers!</span>
<span class="token comment"># If you do change the License, remember to change the Trove Classifier for that!</span>

here <span class="token operator">=</span> os<span class="token punctuation">.</span>path<span class="token punctuation">.</span>abspath<span class="token punctuation">(</span>os<span class="token punctuation">.</span>path<span class="token punctuation">.</span>dirname<span class="token punctuation">(</span>__file__<span class="token punctuation">)</span><span class="token punctuation">)</span>

<span class="token comment"># Import the README and use it as the long-description.</span>
<span class="token comment"># Note: this will only work if &#39;README.md&#39; is present in your MANIFEST.in file!</span>
<span class="token keyword">try</span><span class="token punctuation">:</span>
    <span class="token keyword">with</span> io<span class="token punctuation">.</span><span class="token builtin">open</span><span class="token punctuation">(</span>os<span class="token punctuation">.</span>path<span class="token punctuation">.</span>join<span class="token punctuation">(</span>here<span class="token punctuation">,</span> <span class="token string">&#39;README.md&#39;</span><span class="token punctuation">)</span><span class="token punctuation">,</span> encoding<span class="token operator">=</span><span class="token string">&#39;utf-8&#39;</span><span class="token punctuation">)</span> <span class="token keyword">as</span> f<span class="token punctuation">:</span>
        long_description <span class="token operator">=</span> <span class="token string">&#39;\\n&#39;</span> <span class="token operator">+</span> f<span class="token punctuation">.</span>read<span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token keyword">except</span> FileNotFoundError<span class="token punctuation">:</span>
    long_description <span class="token operator">=</span> DESCRIPTION

<span class="token comment"># Load the package&#39;s __version__.py module as a dictionary.</span>
about <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
<span class="token keyword">if</span> <span class="token keyword">not</span> VERSION<span class="token punctuation">:</span>
    project_slug <span class="token operator">=</span> NAME<span class="token punctuation">.</span>lower<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span>replace<span class="token punctuation">(</span><span class="token string">&quot;-&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;_&quot;</span><span class="token punctuation">)</span><span class="token punctuation">.</span>replace<span class="token punctuation">(</span><span class="token string">&quot; &quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;_&quot;</span><span class="token punctuation">)</span>
    <span class="token keyword">with</span> <span class="token builtin">open</span><span class="token punctuation">(</span>os<span class="token punctuation">.</span>path<span class="token punctuation">.</span>join<span class="token punctuation">(</span>here<span class="token punctuation">,</span> project_slug<span class="token punctuation">,</span> <span class="token string">&#39;__version__.py&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token keyword">as</span> f<span class="token punctuation">:</span>
        <span class="token keyword">exec</span><span class="token punctuation">(</span>f<span class="token punctuation">.</span>read<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> about<span class="token punctuation">)</span>
<span class="token keyword">else</span><span class="token punctuation">:</span>
    about<span class="token punctuation">[</span><span class="token string">&#39;__version__&#39;</span><span class="token punctuation">]</span> <span class="token operator">=</span> VERSION


<span class="token keyword">class</span> <span class="token class-name">UploadCommand</span><span class="token punctuation">(</span>Command<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token triple-quoted-string string">&quot;&quot;&quot;Support setup.py upload.&quot;&quot;&quot;</span>

    description <span class="token operator">=</span> <span class="token string">&#39;Build and publish the package.&#39;</span>
    user_options <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>

    <span class="token decorator annotation punctuation">@staticmethod</span>
    <span class="token keyword">def</span> <span class="token function">status</span><span class="token punctuation">(</span>s<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token triple-quoted-string string">&quot;&quot;&quot;Prints things in bold.&quot;&quot;&quot;</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">&#39;\\033[1m{0}\\033[0m&#39;</span><span class="token punctuation">.</span><span class="token builtin">format</span><span class="token punctuation">(</span>s<span class="token punctuation">)</span><span class="token punctuation">)</span>

    <span class="token keyword">def</span> <span class="token function">initialize_options</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">pass</span>

    <span class="token keyword">def</span> <span class="token function">finalize_options</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">pass</span>

    <span class="token keyword">def</span> <span class="token function">run</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">try</span><span class="token punctuation">:</span>
            self<span class="token punctuation">.</span>status<span class="token punctuation">(</span><span class="token string">&#39;Removing previous builds…&#39;</span><span class="token punctuation">)</span>
            rmtree<span class="token punctuation">(</span>os<span class="token punctuation">.</span>path<span class="token punctuation">.</span>join<span class="token punctuation">(</span>here<span class="token punctuation">,</span> <span class="token string">&#39;dist&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
        <span class="token keyword">except</span> OSError<span class="token punctuation">:</span>
            <span class="token keyword">pass</span>

        self<span class="token punctuation">.</span>status<span class="token punctuation">(</span><span class="token string">&#39;Building Source and Wheel (universal) distribution…&#39;</span><span class="token punctuation">)</span>
        os<span class="token punctuation">.</span>system<span class="token punctuation">(</span><span class="token string">&#39;{0} setup.py sdist bdist_wheel --universal&#39;</span><span class="token punctuation">.</span><span class="token builtin">format</span><span class="token punctuation">(</span>sys<span class="token punctuation">.</span>executable<span class="token punctuation">)</span><span class="token punctuation">)</span>

        self<span class="token punctuation">.</span>status<span class="token punctuation">(</span><span class="token string">&#39;Uploading the package to PyPI via Twine…&#39;</span><span class="token punctuation">)</span>
        os<span class="token punctuation">.</span>system<span class="token punctuation">(</span><span class="token string">&#39;twine upload dist/*&#39;</span><span class="token punctuation">)</span>

        self<span class="token punctuation">.</span>status<span class="token punctuation">(</span><span class="token string">&#39;Pushing git tags…&#39;</span><span class="token punctuation">)</span>
        os<span class="token punctuation">.</span>system<span class="token punctuation">(</span><span class="token string">&#39;git tag v{0}&#39;</span><span class="token punctuation">.</span><span class="token builtin">format</span><span class="token punctuation">(</span>about<span class="token punctuation">[</span><span class="token string">&#39;__version__&#39;</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
        os<span class="token punctuation">.</span>system<span class="token punctuation">(</span><span class="token string">&#39;git push --tags&#39;</span><span class="token punctuation">)</span>

        sys<span class="token punctuation">.</span>exit<span class="token punctuation">(</span><span class="token punctuation">)</span>


<span class="token comment"># Where the magic happens:</span>
setup<span class="token punctuation">(</span>
    name<span class="token operator">=</span>NAME<span class="token punctuation">,</span>
    version<span class="token operator">=</span>about<span class="token punctuation">[</span><span class="token string">&#39;__version__&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    description<span class="token operator">=</span>DESCRIPTION<span class="token punctuation">,</span>
    long_description<span class="token operator">=</span>long_description<span class="token punctuation">,</span>
    long_description_content_type<span class="token operator">=</span><span class="token string">&#39;text/markdown&#39;</span><span class="token punctuation">,</span>
    author<span class="token operator">=</span>AUTHOR<span class="token punctuation">,</span>
    author_email<span class="token operator">=</span>EMAIL<span class="token punctuation">,</span>
    python_requires<span class="token operator">=</span>REQUIRES_PYTHON<span class="token punctuation">,</span>
    url<span class="token operator">=</span>URL<span class="token punctuation">,</span>
    packages<span class="token operator">=</span>find_packages<span class="token punctuation">(</span>exclude<span class="token operator">=</span><span class="token punctuation">[</span><span class="token string">&quot;tests&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;*.tests&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;*.tests.*&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;tests.*&quot;</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token comment"># If your package is a single module, use this instead of &#39;packages&#39;:</span>
    <span class="token comment"># py_modules=[&#39;mypackage&#39;],</span>

    <span class="token comment"># entry_points={</span>
    <span class="token comment">#     &#39;console_scripts&#39;: [&#39;mycli=mymodule:cli&#39;],</span>
    <span class="token comment"># },</span>
    install_requires<span class="token operator">=</span>REQUIRED<span class="token punctuation">,</span>
    extras_require<span class="token operator">=</span>EXTRAS<span class="token punctuation">,</span>
    include_package_data<span class="token operator">=</span><span class="token boolean">True</span><span class="token punctuation">,</span>
    license<span class="token operator">=</span><span class="token string">&#39;MIT&#39;</span><span class="token punctuation">,</span>
    classifiers<span class="token operator">=</span><span class="token punctuation">[</span>
        <span class="token comment"># Trove classifiers</span>
        <span class="token comment"># Full list: https://pypi.python.org/pypi?%3Aaction=list_classifiers</span>
        <span class="token string">&#39;License :: OSI Approved :: MIT License&#39;</span><span class="token punctuation">,</span>
        <span class="token string">&#39;Programming Language :: Python&#39;</span><span class="token punctuation">,</span>
        <span class="token string">&#39;Programming Language :: Python :: 3&#39;</span><span class="token punctuation">,</span>
        <span class="token string">&#39;Programming Language :: Python :: 3.6&#39;</span><span class="token punctuation">,</span>
        <span class="token string">&#39;Programming Language :: Python :: Implementation :: CPython&#39;</span><span class="token punctuation">,</span>
        <span class="token string">&#39;Programming Language :: Python :: Implementation :: PyPy&#39;</span>
    <span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token comment"># $ setup.py publish support.</span>
    cmdclass<span class="token operator">=</span><span class="token punctuation">{</span>
        <span class="token string">&#39;upload&#39;</span><span class="token punctuation">:</span> UploadCommand<span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>该文件中主要是通过<code>setup</code>函数来进行管理，除了这个函数之外其它都是锦上添花的东西，根据你的需求去填写关键字参数即可。</p><h2 id="打包" tabindex="-1"><a class="header-anchor" href="#打包" aria-hidden="true">#</a> 打包</h2><p>首先安装打包工具</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>python3 <span class="token parameter variable">-m</span> pip <span class="token function">install</span> <span class="token parameter variable">--upgrade</span> build
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>然后在项目根目录下执行，会在dist目录下生成tar.gz压缩文件</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>python setup.py sdist build
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>然后安装上传工具<code>twine</code></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>python3 -m pip install --upgrade twine
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>使用时只需要指定目录和项目名即可</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>python3 -m twine upload --repository testpypi dist/*
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>Uploading distributions to https://test.pypi.org/legacy/
Enter your username: __token__
Uploading example_package_YOUR_USERNAME_HERE-0.0.1-py3-none-any.whl
100% ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 8.2/8.2 kB • 00:01 • ?
Uploading example_package_YOUR_USERNAME_HERE-0.0.1.tar.gz
100% ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 6.8/6.8 kB • 00:00 • ?
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>由于前面在<code>.pypirc</code>文件中配置了token，这里会自动读取，不需要输入。</p><h2 id="测试" tabindex="-1"><a class="header-anchor" href="#测试" aria-hidden="true">#</a> 测试</h2><p>如果要测试的话，最好不要使用pip镜像，因为它们同步不及时，建议指定<code>-i https://pypi.org/simple/</code>官方源。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>pip install -i https://pypi.org/simple/ your_package==version
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,27);function h(_,f){const a=l("ExternalLinkIcon");return p(),i("div",null,[r,d,o(" more "),k,v,n("p",null,[s("官方教程："),n("a",m,[s("Packaging Python Projects - Python Packaging User Guide"),e(a)])]),b,n("p",null,[s("官网："),n("a",g,[s("PyPI · The Python Package Index"),e(a)])]),y])}const x=t(u,[["render",h],["__file","pypi_upload.html.vue"]]);export{x as default};
