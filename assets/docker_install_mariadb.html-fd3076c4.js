import{_ as i,W as l,X as t,Y as c,Z as a,$ as n,a0 as e,a1 as r,C as o}from"./framework-a4c02b8f.js";const p={},d=a("h1",{id:"docker上安装mariadb",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#docker上安装mariadb","aria-hidden":"true"},"#"),n(" Docker上安装MariaDB")],-1),u=a("figure",null,[a("img",{src:"https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202310111859077.png",alt:"",tabindex:"0",loading:"lazy"}),a("figcaption")],-1),m=a("hr",null,null,-1),b={href:"https://mariadb.org/",target:"_blank",rel:"noopener noreferrer"},v={href:"https://github.com/MariaDB/server",target:"_blank",rel:"noopener noreferrer"},k=a("p",null,"在Mysql被Oracle收购以后，MySql之父觉得此时的Mysql不再是一个纯粹的开源数据库了。于是没多久便出走了，随后他便从Mysql社区fork出来一个新的分支：MariaDB，到目前为止已经是一的独立的项目了。该数据库以作者女儿的名字来命名的，相比于Mysql而言它是一个完全开源的数据库，在协议和表定义方面也兼容，相比于mysql社区版支持更多的存储引擎和功能。",-1),h=a("h3",{id:"镜像",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#镜像","aria-hidden":"true"},"#"),n(" 镜像")],-1),g={href:"https://hub.docker.com/_/mariadb",target:"_blank",rel:"noopener noreferrer"},f=r(`<figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202310121029029.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>目前的维护版本有11和10，因为是开源社区维护的，所以版本迭代要比mysql快很多，这里选择相对稳定的10</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>root@k8s-n1:~<span class="token comment"># docker pull mariadb:10</span>
<span class="token number">10</span>: Pulling from library/mariadb
707e32e9fc56: Already exists 
4e342cc0fc32: Pull complete 
8c036f60ad2b: Pull complete 
bb0246c52237: Pull complete 
3352be57b4c5: Pull complete 
c9fc61d5a68c: Pull complete 
4c23450a7a9d: Pull complete 
3a747ebfb0b2: Pull complete 
Digest: sha256:16b181cf0cbca0bc8e5f8ef3695a82c7bd9ba36cc4fc587f4b357c558faeeccd
Status: Downloaded newer image <span class="token keyword">for</span> mariadb:10
docker.io/library/mariadb:10
root@k8s-n1:~<span class="token comment"># docker images</span>
REPOSITORY   TAG         IMAGE ID       CREATED        SIZE
mariadb      <span class="token number">10</span>          32c5888d2fa9   <span class="token number">8</span> days ago     403MB
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="准备" tabindex="-1"><a class="header-anchor" href="#准备" aria-hidden="true">#</a> 准备</h3><p>准备好要挂载数据的文件夹</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">mkdir</span> <span class="token parameter variable">-p</span> ~/db/mariadb/<span class="token punctuation">{</span>data,log,conf<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>maridadb在这些方面都与mysql兼容，所以基本类似，创建配置文件<code>~/db/mariadb/conf/my.cnf</code></p><div class="language-ini line-numbers-mode" data-ext="ini"><pre class="language-ini"><code><span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">client</span><span class="token punctuation">]</span></span>
<span class="token key attr-name">default_character_set</span><span class="token punctuation">=</span><span class="token value attr-value">utf8mb4</span>

<span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">mysqld</span><span class="token punctuation">]</span></span>
<span class="token comment"># 字符集</span>
<span class="token key attr-name">character_set_server</span> <span class="token punctuation">=</span> <span class="token value attr-value">utf8mb4</span>
<span class="token key attr-name">collation-server</span> <span class="token punctuation">=</span> <span class="token value attr-value">utf8mb4_general_ci</span>
<span class="token comment"># 设置默认时区东八区</span>
<span class="token key attr-name">default-time_zone</span> <span class="token punctuation">=</span> <span class="token value attr-value">&#39;<span class="token inner-value">+8:00</span>&#39;</span>
<span class="token comment"># 错误日志</span>
<span class="token key attr-name">log-error</span><span class="token punctuation">=</span><span class="token value attr-value">/etc/mysql/log/error.log</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="容器" tabindex="-1"><a class="header-anchor" href="#容器" aria-hidden="true">#</a> 容器</h3><p>运行如下命令创建容器，mariadb使用的配置目录跟mysql完全一致</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">docker</span> run <span class="token parameter variable">-p</span> <span class="token number">3307</span>:3306 <span class="token parameter variable">--name</span> maria10 <span class="token punctuation">\\</span>
    <span class="token parameter variable">--restart</span><span class="token operator">=</span>always <span class="token punctuation">\\</span>
    <span class="token parameter variable">-v</span> ~/db/mariadb/conf/:/etc/mysql/conf.d <span class="token punctuation">\\</span>
    <span class="token parameter variable">-v</span> ~/db/mariadb/data/:/var/lib/mysql <span class="token punctuation">\\</span>
    <span class="token parameter variable">-v</span> ~/db/mariadb/log/:/etc/mysql/log <span class="token punctuation">\\</span>
    <span class="token parameter variable">-e</span> <span class="token assign-left variable">MYSQL_ROOT_PASSWORD</span><span class="token operator">=</span><span class="token number">123456</span> <span class="token punctuation">\\</span>
    <span class="token parameter variable">-e</span> <span class="token assign-left variable">MYSQL_DATABASE</span><span class="token operator">=</span>hello <span class="token punctuation">\\</span>
    <span class="token parameter variable">-d</span> mariadb:10
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>创建起容器后看看是否正常运行</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>root@k8s-n1:~<span class="token comment"># docker ps</span>
CONTAINER ID   IMAGE                COMMAND                   CREATED         STATUS         PORTS                                                  NAMES
e4156637905e   mariadb:10           <span class="token string">&quot;docker-entrypoint.s…&quot;</span>   <span class="token number">2</span> seconds ago   Up <span class="token number">1</span> second    <span class="token number">0.0</span>.0.0:3307-<span class="token operator">&gt;</span><span class="token number">3306</span>/tcp, :::3307-<span class="token operator">&gt;</span><span class="token number">3306</span>/tcp              maria10
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>进入容器里面看看数据库命令行，这里使用<code>mysql</code>命令也可以登录。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>root@k8s-n1:~<span class="token comment"># docker exec -it maria10 /bin/bash</span>
root@e4156637905e:/<span class="token comment"># mariadb -u root -p</span>
Enter password: 
Welcome to the MariaDB monitor.  Commands end with <span class="token punctuation">;</span> or <span class="token punctuation">\\</span>g.
Your MariaDB connection <span class="token function">id</span> is <span class="token number">3</span>
Server version: <span class="token number">10.11</span>.5-MariaDB-1:10.11.5+maria~ubu2204 mariadb.org binary distribution

Copyright <span class="token punctuation">(</span>c<span class="token punctuation">)</span> <span class="token number">2000</span>, <span class="token number">2018</span>, Oracle, MariaDB Corporation Ab and others.

Type <span class="token string">&#39;help;&#39;</span> or <span class="token string">&#39;\\h&#39;</span> <span class="token keyword">for</span> help. Type <span class="token string">&#39;\\c&#39;</span> to <span class="token function">clear</span> the current input statement.

MariaDB <span class="token punctuation">[</span><span class="token punctuation">(</span>none<span class="token punctuation">)</span><span class="token punctuation">]</span><span class="token operator">&gt;</span> 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>看看数据库，可以看到默认的hello数据库成功创建</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>MariaDB <span class="token punctuation">[</span><span class="token punctuation">(</span>none<span class="token punctuation">)</span><span class="token punctuation">]</span><span class="token operator">&gt;</span> show databases<span class="token punctuation">;</span>
+--------------------+
<span class="token operator">|</span> Database           <span class="token operator">|</span>
+--------------------+
<span class="token operator">|</span> hello              <span class="token operator">|</span>
<span class="token operator">|</span> information_schema <span class="token operator">|</span>
<span class="token operator">|</span> mysql              <span class="token operator">|</span>
<span class="token operator">|</span> performance_schema <span class="token operator">|</span>
<span class="token operator">|</span> sys                <span class="token operator">|</span>
+--------------------+
<span class="token number">5</span> rows <span class="token keyword">in</span> <span class="token builtin class-name">set</span> <span class="token punctuation">(</span><span class="token number">0.001</span> sec<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="连接" tabindex="-1"><a class="header-anchor" href="#连接" aria-hidden="true">#</a> 连接</h3><p>我用的navicat15，已经支持mariadb，正常来说它的协议应该跟mysql完全兼容。</p><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202310121055491.png" style="zoom:80%;"><p>就目前而言感受不到太大的区别，以后用的深了一点再来评价吧。</p>`,21);function _(y,q){const s=o("ExternalLinkIcon");return l(),t("div",null,[d,u,c(" more "),m,a("p",null,[n("官网："),a("a",b,[n("MariaDB"),e(s)])]),a("p",null,[n("开源地址："),a("a",v,[n("https://github.com/MariaDB/server"),e(s)])]),k,h,a("p",null,[n("镜像地址："),a("a",g,[n("mariadb - Official Image | Docker Hub"),e(s)])]),f])}const D=i(p,[["render",_],["__file","docker_install_mariadb.html.vue"]]);export{D as default};
