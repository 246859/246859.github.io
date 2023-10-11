import{_ as l,W as i,X as t,Y as o,Z as s,$ as n,a0 as e,a1 as c,C as p}from"./framework-a4c02b8f.js";const r={},d=s("h1",{id:"docker上安装mysql",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#docker上安装mysql","aria-hidden":"true"},"#"),n(" Docker上安装Mysql")],-1),u=s("figure",null,[s("img",{src:"https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202310111830040.png",alt:"",tabindex:"0",loading:"lazy"}),s("figcaption")],-1),m=s("hr",null,null,-1),v={href:"https://dev.mysql.com/doc/",target:"_blank",rel:"noopener noreferrer"},b=s("p",null,"mysql是很经典的一个数据库了，刚接触到这个数据库的时候还是刚刚大一下那会，那会在windows上安装把密码给整忘了捣鼓了老半天才整回来。日后在学习的时候，捣鼓中间件都是在本地的Linux虚拟机上+docker捣鼓，再也不会把这些玩意安装在windows上了。",-1),k=s("h3",{id:"镜像",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#镜像","aria-hidden":"true"},"#"),n(" 镜像")],-1),h={href:"https://hub.docker.com/_/mysql",target:"_blank",rel:"noopener noreferrer"},g=c(`<p>Mysql常用的版本只有8和5，最常用的应该是5.7，不过我在写代码的时候用的都是mysql8。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>root@k8s-n1:~<span class="token comment"># docker pull mysql:8.0</span>
<span class="token number">8.0</span>: Pulling from library/mysql
5262579e8e45: Pull complete 
c6f87bacd0dd: Pull complete 
581ee7db3e65: Pull complete 
6d5c555a4100: Pull complete 
51f4afa7a279: Pull complete 
d9e414f0b7c6: Pull complete 
aab3a444c469: Pull complete 
aab51168fe3a: Pull complete 
2a63757e7c9c: Pull complete 
830e4b0cc0bc: Pull complete 
cc0cd1f61ed7: Pull complete 
Digest: sha256:4753043f21f0297253b35a5809a0ec3f12597e8dbeeb709647307edc943ea7b1
Status: Downloaded newer image <span class="token keyword">for</span> mysql:8.0
docker.io/library/mysql:8.0
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>查看下镜像</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>root@k8s-n1:~<span class="token comment"># docker images</span>
REPOSITORY   TAG         IMAGE ID       CREATED        SIZE
mysql        <span class="token number">8.0</span>         82ebbd05b8a9   <span class="token number">2</span> months ago   577MB
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="准备" tabindex="-1"><a class="header-anchor" href="#准备" aria-hidden="true">#</a> 准备</h3><p>创建本地用于挂载数据的文件夹</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">mkdir</span> <span class="token parameter variable">-p</span> ~/db/mysql/<span class="token punctuation">{</span>data,conf,log<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>创建mysql配置文件<code>~/db/mysql/conf/my.cnf</code></p><div class="language-ini line-numbers-mode" data-ext="ini"><pre class="language-ini"><code><span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">client</span><span class="token punctuation">]</span></span>
<span class="token key attr-name">default_character_set</span><span class="token punctuation">=</span><span class="token value attr-value">utf8mb4</span>

<span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">mysqld</span><span class="token punctuation">]</span></span>
<span class="token comment"># 字符集</span>
<span class="token key attr-name">character_set_server</span> <span class="token punctuation">=</span> <span class="token value attr-value">utf8mb4</span>
<span class="token key attr-name">collation-server</span> <span class="token punctuation">=</span> <span class="token value attr-value">utf8mb4_general_ci</span>
<span class="token comment"># 设置默认时区东八区</span>
<span class="token key attr-name">default-time_zone</span> <span class="token punctuation">=</span> <span class="token value attr-value">&#39;<span class="token inner-value">+8:00</span>&#39;</span>
<span class="token comment"># 错误日志</span>
<span class="token key attr-name">log-error</span><span class="token punctuation">=</span><span class="token value attr-value">/etc/mysql/log/error.log</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="容器" tabindex="-1"><a class="header-anchor" href="#容器" aria-hidden="true">#</a> 容器</h3><p>运行如下命令，创建容器</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">docker</span> run <span class="token parameter variable">-p</span> <span class="token number">3306</span>:3306 <span class="token parameter variable">--name</span> mysql8 <span class="token punctuation">\\</span>
    <span class="token parameter variable">--restart</span><span class="token operator">=</span>always <span class="token punctuation">\\</span>
    <span class="token parameter variable">-v</span> ~/db/mysql/conf/:/etc/mysql/conf.d <span class="token punctuation">\\</span>
    <span class="token parameter variable">-v</span> ~/db/mysql/data/:/var/lib/mysql <span class="token punctuation">\\</span>
    <span class="token parameter variable">-v</span> ~/db/mysql/log/:/etc/mysql/log <span class="token punctuation">\\</span>
    <span class="token parameter variable">-e</span> <span class="token assign-left variable">MYSQL_ROOT_PASSWORD</span><span class="token operator">=</span><span class="token number">123456</span> <span class="token punctuation">\\</span>
    <span class="token parameter variable">-e</span> <span class="token assign-left variable">MYSQL_DATABASE</span><span class="token operator">=</span>hello <span class="token punctuation">\\</span>
    <span class="token parameter variable">-d</span> mysql:8.0
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><code>MYSQL_ROOT_PASSWORD</code>，root用户的默认密码，不指定的话会在输出中显示默认密码</li><li><code>MYSQL_DATABASE</code>，默认创建的数据库名</li></ul><p>看看mysql容器有没有成功运行。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>root@k8s-n1:~/db<span class="token comment"># docker ps</span>
CONTAINER ID   IMAGE                COMMAND                   CREATED          STATUS          PORTS                                                  NAMES
062dc35ac579   mysql:8.0            <span class="token string">&quot;docker-entrypoint.s…&quot;</span>   <span class="token number">22</span> seconds ago   Up <span class="token number">21</span> seconds   <span class="token number">0.0</span>.0.0:3306-<span class="token operator">&gt;</span><span class="token number">3306</span>/tcp, :::3306-<span class="token operator">&gt;</span><span class="token number">3306</span>/tcp, <span class="token number">33060</span>/tcp   mysql8
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>使用mysql命令访问数据库</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>root@k8s-n1:~/db<span class="token comment"># docker exec -it mysql8 /bin/bash</span>
bash-4.4<span class="token comment"># mysql -u root -p</span>
Enter password: 
Welcome to the MySQL monitor.  Commands end with <span class="token punctuation">;</span> or <span class="token punctuation">\\</span>g.
Your MySQL connection <span class="token function">id</span> is <span class="token number">8</span>
Server version: <span class="token number">8.0</span>.34 MySQL Community Server - GPL

Copyright <span class="token punctuation">(</span>c<span class="token punctuation">)</span> <span class="token number">2000</span>, <span class="token number">2023</span>, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type <span class="token string">&#39;help;&#39;</span> or <span class="token string">&#39;\\h&#39;</span> <span class="token keyword">for</span> help. Type <span class="token string">&#39;\\c&#39;</span> to <span class="token function">clear</span> the current input statement.

mysql<span class="token operator">&gt;</span> 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>查看有哪些数据库，可以看到hello数据库被成功创建了</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>mysql<span class="token operator">&gt;</span> show databases<span class="token punctuation">;</span>
+--------------------+
<span class="token operator">|</span> Database           <span class="token operator">|</span>
+--------------------+
<span class="token operator">|</span> hello              <span class="token operator">|</span>
<span class="token operator">|</span> information_schema <span class="token operator">|</span>
<span class="token operator">|</span> mysql              <span class="token operator">|</span>
<span class="token operator">|</span> performance_schema <span class="token operator">|</span>
<span class="token operator">|</span> sys                <span class="token operator">|</span>
+--------------------+
<span class="token number">5</span> rows <span class="token keyword">in</span> <span class="token builtin class-name">set</span> <span class="token punctuation">(</span><span class="token number">0.01</span> sec<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>查看hello数据库中的表，可以看到空空如也</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>mysql<span class="token operator">&gt;</span> use hello<span class="token punctuation">;</span>
Database changed
mysql<span class="token operator">&gt;</span> show tables<span class="token punctuation">;</span>
Empty <span class="token builtin class-name">set</span> <span class="token punctuation">(</span><span class="token number">0.00</span> sec<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="连接" tabindex="-1"><a class="header-anchor" href="#连接" aria-hidden="true">#</a> 连接</h3><p>切换到<code>mysql</code>数据库，然后查看<code>user</code>表</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>mysql<span class="token operator">&gt;</span> use mysql
Reading table information <span class="token keyword">for</span> completion of table and <span class="token function">column</span> names
You can turn off this feature to get a quicker startup with <span class="token parameter variable">-A</span>

Database changed
mysql<span class="token operator">&gt;</span> <span class="token keyword">select</span> user, <span class="token function">host</span> from user<span class="token punctuation">;</span>
+------------------+-----------+
<span class="token operator">|</span> user             <span class="token operator">|</span> <span class="token function">host</span>      <span class="token operator">|</span>
+------------------+-----------+
<span class="token operator">|</span> root             <span class="token operator">|</span> %         <span class="token operator">|</span>
<span class="token operator">|</span> mysql.infoschema <span class="token operator">|</span> localhost <span class="token operator">|</span>
<span class="token operator">|</span> mysql.session    <span class="token operator">|</span> localhost <span class="token operator">|</span>
<span class="token operator">|</span> mysql.sys        <span class="token operator">|</span> localhost <span class="token operator">|</span>
<span class="token operator">|</span> root             <span class="token operator">|</span> localhost <span class="token operator">|</span>
+------------------+-----------+
<span class="token number">5</span> rows <span class="token keyword">in</span> <span class="token builtin class-name">set</span> <span class="token punctuation">(</span><span class="token number">0.00</span> sec<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看到root账户默认是允许远程登录的，一般建议创建一个新的账号来用，然后再禁用root远程登录，如果只是自己学习的话那无所谓了，修改完以后记得刷新下。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>mysql<span class="token operator">&gt;</span> flush privileges<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>然后再用navicat连接</p><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202310111949722.png" style="zoom:50%;">`,28);function y(f,q){const a=p("ExternalLinkIcon");return i(),t("div",null,[d,u,o(" more "),m,s("p",null,[n("官网："),s("a",v,[n("MySQL :: MySQL Documentation"),e(a)])]),b,k,s("p",null,[n("镜像地址："),s("a",h,[n("mysql - Official Image | Docker Hub"),e(a)])]),g])}const x=l(r,[["render",y],["__file","docker_install_mysql.html.vue"]]);export{x as default};
