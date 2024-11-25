import{_ as i,W as a,X as s,a0 as n,Y as e,Z as t,a1 as d}from"./framework-b5ea9e64.js";const c={},l=e("h1",{id:"git多账号配置",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#git多账号配置","aria-hidden":"true"},"#"),t(" Git多账号配置")],-1),r=e("figure",null,[e("img",{src:"https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202411251710938.webp",alt:"",tabindex:"0",loading:"lazy"}),e("figcaption")],-1),o=d(`<hr><p>想象一种情况，当你在为多个不同的组织贡献代码时，出于安全性和保密性的考虑，他们会要求你用专用邮箱创建一个单独的账号来提交代码，而一般的Git托管平台提供两种方式来访问仓库，HTTTP或SSH，HTTP访问需要自行输入密码，但Github在很早之前就已经禁用了密码访问，所以考虑到安全性大多数情况我们都会使用后者。拿最常见的Github平台来举例，你可以为你的账号配置多个密钥对，但是你本地却只能有一个密钥对，在这种情况下，如果涉及到多Git账号开发的话，就需要频繁的更换密钥对，非常的不方便，所以本文就讲述了一个较为方便的解决办法，下面进行演示。</p><h2 id="配置" tabindex="-1"><a class="header-anchor" href="#配置" aria-hidden="true">#</a> 配置</h2><p>生成两个不同的密钥对，分别对应两个不同的Git账号</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ ssh-keygen <span class="token parameter variable">-t</span> rsa <span class="token string">&quot;jack&quot;</span>
$ ssh-keygen <span class="token parameter variable">-t</span> rsa &quot;mike
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>它默认会生成在用户目录下的<code>.ssh</code>文件夹中，密钥对默认为<code>id_rsa</code>，<code>id_rsa.pub</code>，一个公钥一个私钥。Git在默认会去读取<code>.ssh</code>路径下的密钥对，由于我们是多账号，所以就需要去指定Git哪个账号该读哪一个密钥，这就需要我们在<code>.git</code>目录下创建<code>config</code>文件，文件位于<code>$HOME/.git/config</code>，内容如下</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>Host jack.github.com
HostName github.com
User jack
PreferredAuthentications publickey
IdentityFile ~/.ssh/jack/id_rsa
AddKeysToAgent yes

Host mike.github.com
HostName github.com
User mike
PreferredAuthentications publickey
IdentityFile ~/.ssh/mike/id_rsa
AddKeysToAgent yes
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其中比较重要的字段的释义如下</p><ul><li>Host：HostName的别名，Git会根据该值来判断使用哪个密钥</li><li>HostName：Git托管平台的域名</li><li>User：对应平台上的用户名</li><li>IdentityFile：凭证文件，指定密钥的存放路径</li></ul><p>然后在Github上分别给两个账号配置好公钥</p><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//upload/202411252012346.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>然后就完成了，完事后测试下是否成功，Git自己会根据名称去找到需要的密钥，如果成功了你会看到下面的结果</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">ssh</span> <span class="token parameter variable">-T</span> git@jack.github.com
Hi jack<span class="token operator">!</span> You<span class="token string">&#39;ve successfully authenticated, but GitHub does not provide shell access.

$ ssh -T git@mike.github.com
Hi mike! You&#39;</span>ve successfully authenticated, but GitHub does not provide shell access.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>同样的，如果你想添加其它托管平台比如gitlab，bitbucket也是一样的操作步骤。</p><h2 id="使用" tabindex="-1"><a class="header-anchor" href="#使用" aria-hidden="true">#</a> 使用</h2><p>配置成功后，后续再使用Git时就要稍微变一下，比如原来的Git地址是</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>git@github.com:fatedier/frp.git
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>那么后续的话就需要加上自己的用户名，比如</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>git@jack.github.com:fatedier/frp.git
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>你可以通过Git命令来将本地仓库的Remote URL替换下，一个例子如下所示。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> remote set-url origin git@jack.github.com:fatedier/frp.git
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,21);function u(m,p){return a(),s("div",null,[l,r,n(" more "),o])}const b=i(c,[["render",u],["__file","5.multiple_account.html.vue"]]);export{b as default};
