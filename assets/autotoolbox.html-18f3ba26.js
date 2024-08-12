import{_ as i,W as l,X as d,Y as r,Z as e,$ as a,a0 as s,a1 as t,C as o}from"./framework-a4c02b8f.js";const c={},p=e("h1",{id:"autotoolbox",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#autotoolbox","aria-hidden":"true"},"#"),a(" AutoToolBox")],-1),u=e("figure",null,[e("img",{src:"https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/toolbox.png",alt:"",tabindex:"0",loading:"lazy"}),e("figcaption")],-1),m=e("p",null,"一个用Go编写的小工具 - Windows下ToolBox菜单自动生成器",-1),v=e("hr",null,null,-1),b=e("h2",{id:"简介",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#简介","aria-hidden":"true"},"#"),a(" 简介")],-1),h=e("p",null,"更新：时隔六年JetBrains终于开始尝试解决上下文菜单的问题，但菜单项是隐藏在打开方式里面的，仅对文件起作用，对于目录和目录背景并不生效，这明明只是一个很简单的功能，却迟迟不支持，所以本项目依旧有存在的必要性。",-1),k={href:"https://youtrack.jetbrains.com/issue/TBX-2540/Associate-file-extenstions-with-correct-Toolbox-app-or-with-the-Toolbox-itself-so-that-files-can-be-launched-from-Windows",target:"_blank",rel:"noopener noreferrer"},g={href:"https://youtrack.jetbrains.com/issue/TBX-2478/Windows-Open-Directory-With-Editor",target:"_blank",rel:"noopener noreferrer"},x=t(`<h2 id="简介-1" tabindex="-1"><a class="header-anchor" href="#简介-1" aria-hidden="true">#</a> 简介</h2><p>这是一个很简单的命令行工具，用于给Toolbox App添加windows右键菜单，它具有以下特性：</p><ul><li>更新或回退版本不会导致菜单失效（同时存在多个版本的IDE时，只会导向最新版）</li><li>可设置通过管理员权限打开IDE</li><li>无需手动维护注册表，</li><li>菜单项的排列顺序与Toolbox中的同步</li><li>能很轻易的删除，不会保留任何注册表项的残留</li></ul><p>下面是效果图</p><img src="https://github.com/246859/AutoToolBox/raw/main/image/preview.png" alt="效果图" style="zoom:67%;"><h2 id="安装" tabindex="-1"><a class="header-anchor" href="#安装" aria-hidden="true">#</a> 安装</h2><p>如果你拥有go环境，并且版本大于go1.16，可以采用<code>go install</code>的方式来安装，如下所示</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ go <span class="token function">install</span> github.com/246859/AutoToolBox/v3/cmd/tbm@latest
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>或者直接在Release里面下载最新版的二进制文件。</p><h2 id="使用" tabindex="-1"><a class="header-anchor" href="#使用" aria-hidden="true">#</a> 使用</h2><p>3.0版本的工具使用起来简单了很多，虽然多了几个命令但大多数情况下都用不上，唯一需要的路径参数就是Toolbox的安装路径，一般情况下Toolbox被默认安装在如下路径。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>$HOME/AppData/Local/Jetbrains/Toolbox/
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>工具在默认情况下使用上述路径，不需要额外指定参数，如果安装路径被修改了则需要用<code>-d</code>来指定（最好不要修改Toolbox的安装路径）。</p><p>请确保设置中的<strong>生成Shell脚本</strong>处于打开状态，否则工具无法正常工具。</p><img alt="shellpath" src="https://github.com/246859/AutoToolBox/raw/main/image/shellpath.png" width="500" height="200/"><h3 id="迁移" tabindex="-1"><a class="header-anchor" href="#迁移" aria-hidden="true">#</a> 迁移</h3><p>如果你是旧版工具的使用者，且想要升级到新版，可以使用旧版生成的<code>toolboxRemove.reg</code>将旧版注册表删除，然后再按照下面的方法使用新版即可。</p><h3 id="开始" tabindex="-1"><a class="header-anchor" href="#开始" aria-hidden="true">#</a> 开始</h3><blockquote><p><strong>工具需要管理员权限才能正常运行</strong></p></blockquote><p>安装好后执行如下命令</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ tbm <span class="token builtin class-name">set</span> <span class="token parameter variable">-a</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>就可以将所有本地安装的IDE添加到右键菜单中，这是最简单的使用方法，大多数情况下只会用到这一个命令。</p><h3 id="命令" tabindex="-1"><a class="header-anchor" href="#命令" aria-hidden="true">#</a> 命令</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>add         Add ToolBox IDE to existing context menu
clear       clear all the context menu of Toolbox
list        List installed ToolBox IDEs
remove      Remove ToolBox IDEs from context menu
set         Register ToolBox IDEs to context menu
version     Print ToolBox version
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>下面简单讲一下每个命令的大概作用</p><h4 id="list" tabindex="-1"><a class="header-anchor" href="#list" aria-hidden="true">#</a> list</h4><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ tbm list <span class="token parameter variable">-h</span>
Examples:
  tbm list <span class="token parameter variable">-c</span>
  tbm list <span class="token parameter variable">--menu</span>
  tbm list <span class="token parameter variable">-c</span> <span class="token parameter variable">--menu</span>

Usage:
  tbm list <span class="token punctuation">[</span>flags<span class="token punctuation">]</span>

Flags:
  -c, <span class="token parameter variable">--count</span>   count the number of installed tools
  -h, <span class="token parameter variable">--help</span>    <span class="token builtin class-name">help</span> <span class="token keyword">for</span> list
      <span class="token parameter variable">--menu</span>    list the tools shown <span class="token keyword">in</span> the context menu
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>list</code>命令用于查看本地所有已安装的IDE，例如</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ tbm list
Android Studio                  Koala <span class="token number">2024.1</span>.1 Patch <span class="token number">1</span>
Aqua                            <span class="token number">2024.1</span>.2
CLion                           <span class="token number">2024.1</span>.4
DataGrip                        <span class="token number">2024.1</span>.4
GoLand                          <span class="token number">2024.1</span>.4
GoLand                          <span class="token number">2023.3</span>.7
IntelliJ IDEA Community Edition <span class="token number">2024.1</span>.4
IntelliJ IDEA Ultimate          <span class="token number">2024.1</span>.4
MPS                             <span class="token number">2023.3</span>.1
PhpStorm                        <span class="token number">2024.1</span>.4
PyCharm Community               <span class="token number">2024.1</span>.4
PyCharm Professional            <span class="token number">2024.1</span>.4
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>查看数量</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ tbm list <span class="token parameter variable">-c</span>
<span class="token number">25</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>查看所有已添加到菜单中的项</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ tbm list <span class="token parameter variable">--menu</span>
Aqua                            <span class="token number">2024.1</span>.2
CLion                           <span class="token number">2024.1</span>.4
DataGrip                        <span class="token number">2024.1</span>.4
DataSpell                       <span class="token number">2024.1</span>.3
Fleet                           <span class="token number">1.37</span>.84 Public Preview
GoLand                          <span class="token number">2024.1</span>.4
IntelliJ IDEA Ultimate          <span class="token number">2024.1</span>.4
MPS                             <span class="token number">2023.3</span>.1
PhpStorm                        <span class="token number">2024.1</span>.4
PyCharm Professional            <span class="token number">2024.1</span>.4
Rider                           <span class="token number">2024.1</span>.4
RubyMine                        <span class="token number">2024.1</span>.4
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>查看已添加到菜单中的项的数量</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ tbm list <span class="token parameter variable">--menu</span> <span class="token parameter variable">-c</span>
<span class="token number">16</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="set" tabindex="-1"><a class="header-anchor" href="#set" aria-hidden="true">#</a> set</h4><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ tbm <span class="token builtin class-name">set</span> <span class="token parameter variable">-h</span>
Usage:
  tbm <span class="token builtin class-name">set</span> <span class="token punctuation">[</span>flags<span class="token punctuation">]</span>

Flags:
      <span class="token parameter variable">--admin</span>     run as admin
  -a, <span class="token parameter variable">--all</span>       <span class="token keyword">select</span> all
  -h, <span class="token parameter variable">--help</span>      <span class="token builtin class-name">help</span> <span class="token keyword">for</span> <span class="token builtin class-name">set</span>
  -s, <span class="token parameter variable">--silence</span>   silence output
      <span class="token parameter variable">--top</span>       place toolbox menu at <span class="token function">top</span> of context menu
  -u, <span class="token parameter variable">--update</span>    only <span class="token keyword">select</span> current menu items
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>set</code>命令表示将哪些IDE设置为菜单项，会直接覆盖现有的菜单，菜单的展示顺序与Toolbox界面中的相同。</p><p>最简单的使用方法就是直接将全部IDE设置为菜单项，如果本地的IDE数量超过了16个，那么只会添加前16个，这是因为windows菜单项的最大限制就是16个。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ tbm <span class="token builtin class-name">set</span> <span class="token parameter variable">-a</span>
Warning: too many tools, only first <span class="token number">16</span> will be added to the context menu
GoLand
IntelliJ IDEA Ultimate
PyCharm Professional
WebStorm
RustRover
Aqua
Writerside
Fleet
DataSpell
CLion
PhpStorm
DataGrip
Rider
RubyMine
Space Desktop
MPS
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>或者单独指定</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ tbm <span class="token builtin class-name">set</span> GoLand WebStorm
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>如果你需要以管理员权限来运行IDE，那么可以加上<code>--admin</code>，就像下面这样，</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ tbm <span class="token builtin class-name">set</span> <span class="token parameter variable">-a</span> <span class="token parameter variable">--admin</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>使用<code>--update</code>时只会更新现有的菜单项，不会添加新的菜单。如果同一个IDE存在多个版本，该命令可以将其导向最新版。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ tbm <span class="token builtin class-name">set</span> <span class="token parameter variable">--update</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>在注册菜单时可以使用<code>--top</code>来让Toolbox菜单位于置顶的位置</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ tbm <span class="token builtin class-name">set</span> <span class="token parameter variable">-a</span> <span class="token parameter variable">--admin</span> <span class="token parameter variable">--top</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><br><p>需要注意的是，有一些产品既没有提供稳定的shell脚本路径，也没有提供<code>exe</code>文件的位置，下面几个就是</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>dotMemory Portable              
dotPeek Portable               
dotTrace Portable
ReSharper Tools
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>虽然现阶段可以将其添加到菜单中，但它们的文件结构并不像其他IDE一样具有条理，<code>list</code>命令会展示出现哪些工具暂不支持，如下</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ tbm list
Android Studio                  Koala <span class="token number">2024.1</span>.1 Patch <span class="token number">1</span>
Aqua                            <span class="token number">2024.1</span>.2
CLion                           <span class="token number">2024.1</span>.4
DataGrip                        <span class="token number">2024.1</span>.4
DataSpell                       <span class="token number">2024.1</span>.3
dotMemory Portable              <span class="token number">2024.1</span>.4                unavailable
dotPeek Portable                <span class="token number">2024.1</span>.4                unavailable
dotTrace Portable               <span class="token number">2024.1</span>.4                unavailable
Fleet                           <span class="token number">1.37</span>.84 Public Preview
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>对于它们而言，暂时不会被添加进菜单中。</p><h4 id="add" tabindex="-1"><a class="header-anchor" href="#add" aria-hidden="true">#</a> add</h4><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ tbm <span class="token function">add</span> <span class="token parameter variable">-h</span>
Usage:
  tbm <span class="token function">add</span> <span class="token punctuation">[</span>flags<span class="token punctuation">]</span>

Flags:
      <span class="token parameter variable">--admin</span>     run as admin
  -h, <span class="token parameter variable">--help</span>      <span class="token builtin class-name">help</span> <span class="token keyword">for</span> <span class="token function">add</span>
  -s, <span class="token parameter variable">--silence</span>   silence output
      <span class="token parameter variable">--top</span>       place toolbox menu at <span class="token function">top</span> of context menu
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>add</code>命令的区别在于它会向已有的菜单中添加新的菜单项，而不是像<code>set</code>一样直接覆盖，用法大体上一致。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ tbm <span class="token function">add</span> GoLand WebStorm
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>不过它并不支持<code>-a</code>，不能一次性添加所有IDE。</p><h4 id="rmove" tabindex="-1"><a class="header-anchor" href="#rmove" aria-hidden="true">#</a> rmove</h4><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ tbm remove <span class="token parameter variable">-h</span>
Command <span class="token string">&quot;remove&quot;</span> will remove the specified IDEs from the context menu, use <span class="token string">&quot;tbm remove -a&quot;</span> to remove all IDEs.

Usage:
  tbm remove <span class="token punctuation">[</span>flags<span class="token punctuation">]</span>

Aliases:
  remove, <span class="token function">rm</span>

Flags:
  -a, <span class="token parameter variable">--all</span>       remove all
  -h, <span class="token parameter variable">--help</span>      <span class="token builtin class-name">help</span> <span class="token keyword">for</span> remove
  -s, <span class="token parameter variable">--silence</span>   silence output
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>remove</code>命令用于删除菜单项</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ tbm <span class="token function">rm</span> GoLand WebStorm
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>使用<code>-a</code>来删除所有</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ tbm <span class="token function">rm</span> <span class="token parameter variable">-a</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="clear" tabindex="-1"><a class="header-anchor" href="#clear" aria-hidden="true">#</a> clear</h4><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ tbm <span class="token function">clear</span>
<span class="token function">clear</span> all the context menu of Toolbox

Usage:
  tbm <span class="token function">clear</span> <span class="token punctuation">[</span>flags<span class="token punctuation">]</span>

Flags:
  -h, <span class="token parameter variable">--help</span>   <span class="token builtin class-name">help</span> <span class="token keyword">for</span> <span class="token function">clear</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>命令<code>clear</code>会直接清空所有与Toolbox有关的菜单项，包括顶级菜单，且不会有任何输出。如果你不想再使用本工具，可以用该命令将所有注册表项清理干净。</p><h2 id="贡献" tabindex="-1"><a class="header-anchor" href="#贡献" aria-hidden="true">#</a> 贡献</h2><ol><li>Fork本仓库到你的账号</li><li>在Fork的仓库中创建一个新的分支</li><li>在新分支中提交代码修改</li><li>然后向本仓库发起Pull Request</li><li>等待Pull Request</li></ol>`,70);function f(_,D){const n=o("ExternalLinkIcon");return l(),d("div",null,[p,u,m,r(" more "),v,b,h,e("p",null,[a("原问题链接："),e("a",k,[a("TBX-2540 (jetbrains.com)"),s(n)]),a(),e("a",g,[a(" TBX-2478 (jetbrains.com)"),s(n)])]),x])}const P=i(c,[["render",f],["__file","autotoolbox.html.vue"]]);export{P as default};
