import{_ as e,W as l,X as t,a0 as i,Y as s,Z as a,$ as r,a1 as o,C as p}from"./framework-b5ea9e64.js";const c={},d=s("h1",{id:"docker安装mysql和redis",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#docker安装mysql和redis","aria-hidden":"true"},"#"),a(" docker安装mysql和redis")],-1),u=s("figure",null,[s("img",{src:"https://w.wallhaven.cc/full/ex/wallhaven-ex9gwo.png",alt:"",tabindex:"0",loading:"lazy"}),s("figcaption")],-1),v=o(`<hr><h4 id="mysql" tabindex="-1"><a class="header-anchor" href="#mysql" aria-hidden="true">#</a> Mysql</h4><p>首先拉取mysql的镜像，要确保major版本是8，例如8.0.33</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">docker</span> pull mysql
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>这里要创建mysql的挂载文件夹，以防数据丢失，这里放在<code>/root/mysql</code>路径下为例子</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>$ mkdir -p ~/mysql/conf/ ~/mysql/data/ ~/mysql/log
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>随后在<code>/root/mysql/confg/</code>目录下创建<code>my.cnf</code>文件，内容如下</p><div class="language-ini line-numbers-mode" data-ext="ini"><pre class="language-ini"><code><span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">client</span><span class="token punctuation">]</span></span>
<span class="token key attr-name">default_character_set</span><span class="token punctuation">=</span><span class="token value attr-value">utf8mb4</span>
<span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">mysqld</span><span class="token punctuation">]</span></span>
<span class="token comment"># 字符集</span>
<span class="token key attr-name">character_set_server</span> <span class="token punctuation">=</span> <span class="token value attr-value">utf8mb4</span>
<span class="token key attr-name">collation-server</span> <span class="token punctuation">=</span> <span class="token value attr-value">utf8mb4_general_ci</span>
<span class="token key attr-name">init_connect</span><span class="token punctuation">=</span><span class="token value attr-value">&#39;<span class="token inner-value">SET NAMES utf8mb4</span>&#39;</span>
<span class="token comment"># 错误日志</span>
<span class="token key attr-name">log_error</span> <span class="token punctuation">=</span> <span class="token value attr-value">error.log</span>
<span class="token comment"># 慢查询日志</span>
<span class="token key attr-name">slow_query_log</span> <span class="token punctuation">=</span> <span class="token value attr-value">1</span>
<span class="token key attr-name">slow_query_log_file</span> <span class="token punctuation">=</span> <span class="token value attr-value">slow.log</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后运行如下命令启动容器即可，下面分别创建了mysql日志，mysql数据库，mysql配置的挂载数据卷，这里的<code>MYSQL_ROOT_PASSWORD=123456</code>就是数据库的root密码，可以自己改成其他的，环境变量<code>MYSQL_DATABASE=dst</code>会自动创建一个名为dst的数据库，按需修改。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">docker</span> run <span class="token parameter variable">-p</span> <span class="token number">3306</span>:3306/tcp <span class="token parameter variable">--name</span> mysql8 <span class="token punctuation">\\</span>
<span class="token parameter variable">--restart</span><span class="token operator">=</span>always <span class="token punctuation">\\</span>
<span class="token parameter variable">--privileged</span><span class="token operator">=</span>true <span class="token punctuation">\\</span>
<span class="token parameter variable">-v</span> /root/mysql/conf/:/etc/mysql/conf.d <span class="token punctuation">\\</span>
<span class="token parameter variable">-v</span> /root/mysql/data/:/var/lib/mysql <span class="token punctuation">\\</span>
<span class="token parameter variable">-v</span> /root/mysql/log/:/var/log/mysql <span class="token punctuation">\\</span>
<span class="token parameter variable">-e</span> <span class="token assign-left variable">MYSQL_ROOT_PASSWORD</span><span class="token operator">=</span><span class="token number">123456</span> <span class="token punctuation">\\</span>
<span class="token parameter variable">-e</span> <span class="token assign-left variable">MYSQL_DATABASE</span><span class="token operator">=</span>dst <span class="token punctuation">\\</span>
<span class="token parameter variable">-d</span> mysql
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>创建完成后登录mysql看看成功没有</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>root@dtstest:~/mysql/conf<span class="token comment"># docker exec -it mysql8 mysql -u root -p</span>
Enter password: 
Welcome to the MySQL monitor.  Commands end with <span class="token punctuation">;</span> or <span class="token punctuation">\\</span>g.
Your MySQL connection <span class="token function">id</span> is <span class="token number">12</span>
Server version: <span class="token number">8.0</span>.33 MySQL Community Server - GPL

Copyright <span class="token punctuation">(</span>c<span class="token punctuation">)</span> <span class="token number">2000</span>, <span class="token number">2023</span>, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type <span class="token string">&#39;help;&#39;</span> or <span class="token string">&#39;\\h&#39;</span> <span class="token keyword">for</span> help. Type <span class="token string">&#39;\\c&#39;</span> to <span class="token function">clear</span> the current input statement.

mysql<span class="token operator">&gt;</span> show databases<span class="token punctuation">;</span>
+--------------------+
<span class="token operator">|</span> Database           <span class="token operator">|</span>
+--------------------+
<span class="token operator">|</span> dst                <span class="token operator">|</span>
<span class="token operator">|</span> information_schema <span class="token operator">|</span>
<span class="token operator">|</span> mysql              <span class="token operator">|</span>
<span class="token operator">|</span> performance_schema <span class="token operator">|</span>
<span class="token operator">|</span> sys                <span class="token operator">|</span>
+--------------------+
<span class="token number">5</span> rows <span class="token keyword">in</span> <span class="token builtin class-name">set</span> <span class="token punctuation">(</span><span class="token number">0.01</span> sec<span class="token punctuation">)</span>

mysql<span class="token operator">&gt;</span> 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>看到有dst数据库就说明mysql成功安装.</p><p>到此安装成功，然后记录下数据库的密码，后面后端会用到。</p><h4 id="redis" tabindex="-1"><a class="header-anchor" href="#redis" aria-hidden="true">#</a> Redis</h4><p>首先拉取redis镜像，保证redis版本在6以上</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">docker</span> pull redis
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>创建redis的挂载目录</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>$ mkdir -p ~/redis/data
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>进入<code>~/redis/</code>目录，创建配置文件<code>redis.conf</code>，内容如下，密码自己定。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>requirepass 123456
appendonly yes
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>然后运行容器</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">docker</span> run <span class="token parameter variable">-p</span> <span class="token number">6379</span>:6379/tcp <span class="token parameter variable">--name</span><span class="token operator">=</span>redis7 <span class="token punctuation">\\</span>
<span class="token parameter variable">--restart</span><span class="token operator">=</span>always <span class="token parameter variable">--privileged</span><span class="token operator">=</span>true <span class="token punctuation">\\</span>
<span class="token parameter variable">-v</span> /root/redis/data:/data <span class="token punctuation">\\</span>
<span class="token parameter variable">-v</span> /root/redis/redis.conf:/etc/redis/redis.conf <span class="token punctuation">\\</span>
<span class="token parameter variable">-d</span> redis <span class="token punctuation">\\</span>
redis-server /etc/redis/redis.conf
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>redis默认不允许远程访问，所以需要额外配置，修改配置文件如下</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>requirepass 123456
appendonly yes
protected-mode no
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,25),m={href:"https://redis.io/docs/management/config/",target:"_blank",rel:"noopener noreferrer"};function k(b,g){const n=p("ExternalLinkIcon");return l(),t("div",null,[d,u,i(" more "),v,s("p",null,[a("redis各版本配置文件："),s("a",m,[a("Redis configuration | Redis"),r(n)])])])}const y=e(c,[["render",k],["__file","docker_mysql.html.vue"]]);export{y as default};
