import{_ as r,W as d,X as l,a0 as o,Y as e,Z as s,$ as a,a1 as i,C as t}from"./framework-b5ea9e64.js";const c={},p=e("h1",{id:"docker上安装redis",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#docker上安装redis","aria-hidden":"true"},"#"),s(" Docker上安装Redis")],-1),u=e("figure",null,[e("img",{src:"https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202310111832973.png",alt:"",tabindex:"0",loading:"lazy"}),e("figcaption")],-1),m=e("hr",null,null,-1),b={href:"https://redis.io/",target:"_blank",rel:"noopener noreferrer"},v=e("p",null,"Redis是我接触的第一个NoSQL数据库，一般是拿来做缓存用，不支持windows。刚开始用的windows版，一看版本redis2，几年没维护了，后面只能在虚拟机上捣鼓了，算是我接触虚拟机和Linux系统的一个契机。",-1),h=e("h3",{id:"镜像",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#镜像","aria-hidden":"true"},"#"),s(" 镜像")],-1),g={href:"https://hub.docker.com/_/redis",target:"_blank",rel:"noopener noreferrer"},k=i(`<p>redis现在的维护版本有6和7，两个的区别就是RESP协议的区别，一个是RESP2，一个是RESP3，理论上来说RESP3应该是兼容RESP2的，不过Redis社区声称以后不会兼容RESP2。这里用的是版本7。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>root@k8s-n1:~/db<span class="token comment"># docker pull redis:7.0</span>
<span class="token number">7.0</span>: Pulling from library/redis
a803e7c4b030: Pull complete 
41184dfc6b2d: Pull complete 
5e1a2c60601a: Pull complete 
cb708665a094: Pull complete 
474f3ac19790: Pull complete 
4f4fb700ef54: Pull complete 
9e2123517e06: Pull complete 
Digest: sha256:7d11c3a67e89510af2b8554e0564f99e292a47f270adac024b4a3226a7fdb275
Status: Downloaded newer image <span class="token keyword">for</span> redis:7.0
docker.io/library/redis:7.0
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>查看下镜像</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>root@k8s-n1:~/db<span class="token comment"># docker images</span>
REPOSITORY   TAG         IMAGE ID       CREATED        SIZE
redis        <span class="token number">7.0</span>         4d015f1fd3b1   <span class="token number">4</span> weeks ago    145MB
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="配置" tabindex="-1"><a class="header-anchor" href="#配置" aria-hidden="true">#</a> 配置</h3>`,5),_={href:"https://redis.io/docs/management/config/",target:"_blank",rel:"noopener noreferrer"},f=i(`<p>redis默认是不允许远程连接，而且没有密码，这些需要在配置文件中指定，对应指定版本的redis需要去官网下载配置文件。</p><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202310112029549.png" style="zoom:67%;"><p>这里选择的是7.0版本的配置文件，首先创建容器的数据挂载文件夹</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">mkdir</span> <span class="token parameter variable">-p</span> ~/db/redis/data
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>然后下载配置文件，因为是外网可能不太好下载</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">wget</span> https://raw.githubusercontent.com/redis/redis/7.0/redis.conf
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>然后将里面的如下四个配置修改如下值，然后保存退出。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code># 任意地址
bind * -::*
# 关闭保护模式
protect-mode no
# 设置密码
requirepass 123456
# 开启appendonly持久化
appendonly yes
# 日志文件
logfile &quot;/etc/redis/redis.log&quot;
# 日志级别
loglevel notice
# 内存达到上限时，key的删除策略 noeviction就是谁也不删，直接在写入时返回错误
maxmemory-policy noeviction
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>配置文件的路径位于<code>~/db/redis/redis.conf</code>，然后还要记得把日志文件自己创建下。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">touch</span> ~/db/redis/redis.log
chamod a+wr ~/db/redis/redis.log
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="容器" tabindex="-1"><a class="header-anchor" href="#容器" aria-hidden="true">#</a> 容器</h3><p>运行如下命令</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">docker</span> run <span class="token parameter variable">-p</span> <span class="token number">6379</span>:6379 <span class="token parameter variable">--name</span><span class="token operator">=</span>redis7 <span class="token punctuation">\\</span>
    <span class="token parameter variable">--restart</span><span class="token operator">=</span>always <span class="token punctuation">\\</span>
    <span class="token parameter variable">--privileged</span><span class="token operator">=</span>true <span class="token punctuation">\\</span>
    <span class="token parameter variable">-v</span> ~/db/redis/data:/data <span class="token punctuation">\\</span>
    <span class="token parameter variable">-v</span> ~/db/redis/:/etc/redis/ <span class="token punctuation">\\</span>
    <span class="token parameter variable">-d</span> redis:7.0 <span class="token punctuation">\\</span>
    redis-server /etc/redis/redis.conf
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>创建后查看下有没有正常运行</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>root@k8s-n1:~/db/redis/conf<span class="token comment"># docker ps</span>
CONTAINER ID   IMAGE                COMMAND                   CREATED         STATUS         PORTS                                                  NAMES
6322049a489b   redis:7.0            <span class="token string">&quot;docker-entrypoint.s…&quot;</span>   <span class="token number">5</span> minutes ago   Up <span class="token number">5</span> seconds   <span class="token number">0.0</span>.0.0:6379-<span class="token operator">&gt;</span><span class="token number">6379</span>/tcp, :::6379-<span class="token operator">&gt;</span><span class="token number">6379</span>/tcp              redis7
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>进入容器测试下命令行</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>root@k8s-n1:~/db/redis<span class="token comment"># docker exec -it redis7 /bin/bash</span>
root@6322049a489b:/data<span class="token comment"># redis-cli   </span>
<span class="token number">127.0</span>.0.1:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> auth <span class="token number">123456</span>
OK
<span class="token number">127.0</span>.0.1:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> <span class="token builtin class-name">set</span> <span class="token number">1</span> <span class="token number">2</span>
OK
<span class="token number">127.0</span>.0.1:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> get <span class="token number">1</span>
<span class="token string">&quot;2&quot;</span>
<span class="token number">127.0</span>.0.1:637<span class="token operator"><span class="token file-descriptor important">9</span>&gt;</span> 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="连接" tabindex="-1"><a class="header-anchor" href="#连接" aria-hidden="true">#</a> 连接</h3><p>redis客户端软件的话推荐两个，虽然navicat也支持redis连接，但还是那种行列方式看起来相当膈应。</p>`,19),x={href:"https://github.com/RedisInsight/RedisDesktopManager",target:"_blank",rel:"noopener noreferrer"},R={href:"https://github.com/qishibo/AnotherRedisDesktopManager",target:"_blank",rel:"noopener noreferrer"},y=e("p",null,"上面两个都是开源的，且都支持中文，我都有在用，前者毕竟c++写的项目，nodejs性能跟它没法比，但后者界面更加人性化，功能要多很多。",-1),E=e("img",{src:"https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202310112123845.png",style:{zoom:"67%"}},null,-1),q=e("p",null,"如果前面的配置正常来搞的话这里连接是不会出问题的。",-1),P=e("figure",null,[e("img",{src:"https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202310112125867.png",alt:"",tabindex:"0",loading:"lazy"}),e("figcaption")],-1),S=e("p",null,"可以看到关于redis的很多统计信息。",-1);function w(A,D){const n=t("ExternalLinkIcon");return d(),l("div",null,[p,u,o(" more "),m,e("p",null,[s("官网："),e("a",b,[s("Redis"),a(n)])]),v,h,e("p",null,[s("镜像地址："),e("a",g,[s("redis - Official Image | Docker Hub"),a(n)])]),k,e("p",null,[s("配置文件地址："),e("a",_,[s("https://redis.io/docs/management/config/"),a(n)])]),f,e("ul",null,[e("li",null,[e("a",x,[s("Redis Manager"),a(n)]),s("，开源，c++项目，性能应该要好很多")]),e("li",null,[e("a",R,[s("Another Redis Manager"),a(n)]),s("，开源，nodejs项目，目测应该是electron之类构建的，性能没测试过。")])]),y,E,q,P,S])}const M=r(c,[["render",w],["__file","docker_install_redis.html.vue"]]);export{M as default};
