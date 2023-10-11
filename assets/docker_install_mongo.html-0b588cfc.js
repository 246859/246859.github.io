import{_ as t,W as l,X as o,Y as d,Z as n,$ as s,a0 as e,a1 as i,C as c}from"./framework-a4c02b8f.js";const p={},r=n("h1",{id:"docker上安装mongodb",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#docker上安装mongodb","aria-hidden":"true"},"#"),s(" Docker上安装MongoDB")],-1),u=n("figure",null,[n("img",{src:"https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202310111838486.png",alt:"",tabindex:"0",loading:"lazy"}),n("figcaption")],-1),m=n("hr",null,null,-1),v={href:"https://www.mongodb.com/zh-cn",target:"_blank",rel:"noopener noreferrer"},b=i(`<p>mongodb是一个高性能的非关系型数据库，或者说文档数据库因为它的基本单位就是文档，在我的一个开源项目中主要拿它来存游戏信息，比较灵活，存在mysql纯纯是找罪受。mongodb说实话第一次看到的时候，SQL写起来真的反人类，弄成了json的样子，如果语句长了点嵌套多了点，可读性骤然下降。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>db.articles.aggregate( [
                        { $match : { score : { $gt : 70, $lte : 90 } } },
                        { $group: { _id: null, count: { $sum: 1 } } }
                       ] );
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>尤其是花括号看的真的眼花，这玩意在命令行里面敲起来是真滴折磨。</p><h3 id="镜像" tabindex="-1"><a class="header-anchor" href="#镜像" aria-hidden="true">#</a> 镜像</h3>`,4),g={href:"https://hub.docker.com/_/mongo",target:"_blank",rel:"noopener noreferrer"},k=i(`<p>这里我就直接用mongo6</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">docker</span> pull mongo:6.0
<span class="token number">6.0</span>: Pulling from library/mongo
707e32e9fc56: Pull complete 
c7ac84d07e95: Pull complete 
ce678af55db4: Pull complete 
e6212b74a0e2: Pull complete 
08077ff6df71: Pull complete 
dd57de346688: Pull complete 
fe042c164d9d: Pull complete 
a5e746310c93: Pull complete 
497b5f19e5e9: Pull complete 
Digest: sha256:fcd6d98809196eef559acb15bd2cdd0c17290c9d398e2b3fc1303a7166399f3b
Status: Downloaded newer image <span class="token keyword">for</span> mongo:6.0
docker.io/library/mongo:6.0
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>镜像拉下来以后看看</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>root@k8s-n1:~# docker images
REPOSITORY   TAG         IMAGE ID       CREATED        SIZE
mongo        6.0         427729062675   8 days ago     681MB
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>681MB说实话挺大了</p><h3 id="配置" tabindex="-1"><a class="header-anchor" href="#配置" aria-hidden="true">#</a> 配置</h3><p>创建要挂载的数据目录</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">mkdir</span> <span class="token parameter variable">-p</span> ~/db/mongo/data
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>创建默认的配置文件</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">touch</span> ~/db/mongo/mongod.conf
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>写入如下配置</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">net</span><span class="token punctuation">:</span>
   <span class="token key atrule">bindIp</span><span class="token punctuation">:</span> 0.0.0.0
   <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">27017</span>
<span class="token key atrule">systemLog</span><span class="token punctuation">:</span>
   <span class="token key atrule">destination</span><span class="token punctuation">:</span> file
   <span class="token key atrule">path</span><span class="token punctuation">:</span> <span class="token string">&quot;/etc/mongo/mongod.log&quot;</span>
   <span class="token key atrule">logAppend</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>创建默认的日志文件</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">touch</span> ~/db/mongo/mongod.log
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="容器" tabindex="-1"><a class="header-anchor" href="#容器" aria-hidden="true">#</a> 容器</h3><p>运行如下命令创建容器</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">docker</span> run <span class="token parameter variable">--restart</span><span class="token operator">=</span>always <span class="token parameter variable">--name</span> mongo6 <span class="token punctuation">\\</span>
	<span class="token parameter variable">-v</span> ~/db/mongo/mongod.conf:/etc/mongo/mongod.conf <span class="token punctuation">\\</span>
	<span class="token parameter variable">-v</span> ~/db/mongo/mongod.log:/etc/mongo/mongod.log <span class="token punctuation">\\</span>
	<span class="token parameter variable">-v</span> ~/db/mongo/data/:/data/db <span class="token punctuation">\\</span>
	<span class="token parameter variable">-p</span> <span class="token number">27017</span>:27017 <span class="token punctuation">\\</span>
	<span class="token parameter variable">-e</span> <span class="token assign-left variable"><span class="token environment constant">LANG</span></span><span class="token operator">=</span>C.UTF-8 <span class="token punctuation">\\</span>
	<span class="token parameter variable">-d</span> mongo:6.0 <span class="token punctuation">\\</span>
	mongod <span class="token parameter variable">-f</span> /etc/mongo/mongod.conf
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其中的参数</p><ul><li>环境变量<code>LANG</code>是为了设置数据库字符编码</li><li><code>-f /etc/mongo/mongod.conf</code>指定具体的配置文件地址</li></ul><p>容器创建完毕后，查看一下是否正常运行。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>root@k8s-n1:~/db/mongo<span class="token comment"># docker ps</span>
CONTAINER ID   IMAGE                COMMAND                   CREATED             STATUS              PORTS                                                  NAMES
b246162e5a3f   mongo:6.0            <span class="token string">&quot;docker-entrypoint.s…&quot;</span>   <span class="token number">4</span> minutes ago       Up About a minute   <span class="token number">0.0</span>.0.0:27017-<span class="token operator">&gt;</span><span class="token number">27017</span>/tcp, :::27017-<span class="token operator">&gt;</span><span class="token number">27017</span>/tcp          mongo6
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后进入数据库命令行操作</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>root@k8s-n1:~/db/mongo<span class="token comment"># docker exec -it mongo6 /bin/bash</span>
root@b246162e5a3f:~<span class="token comment"># mongosh</span>
Current Mongosh Log ID: 6526b2e373d21e9bc1a719e2
Connecting to:          mongodb://127.0.0.1:27017/?directConnection<span class="token operator">=</span>true<span class="token operator">&amp;</span><span class="token assign-left variable">serverSelectionTimeoutMS</span><span class="token operator">=</span><span class="token number">2000</span><span class="token operator">&amp;</span><span class="token assign-left variable">appName</span><span class="token operator">=</span>mongosh+2.0.1
Using MongoDB:          <span class="token number">6.0</span>.10
Using Mongosh:          <span class="token number">2.0</span>.1

For mongosh info see: https://docs.mongodb.com/mongodb-shell/


To <span class="token builtin class-name">help</span> improve our products, anonymous usage data is collected and sent to MongoDB periodically <span class="token punctuation">(</span>https://www.mongodb.com/legal/privacy-policy<span class="token punctuation">)</span>.
You can opt-out by running the disableTelemetry<span class="token punctuation">(</span><span class="token punctuation">)</span> command.

------
   The server generated these startup warnings when booting
   <span class="token number">2023</span>-10-11T14:31:28.184+00:00: Using the XFS filesystem is strongly recommended with the WiredTiger storage engine. See http://dochub.mongodb.org/core/prodnotes-filesystem
   <span class="token number">2023</span>-10-11T14:31:28.351+00:00: Access control is not enabled <span class="token keyword">for</span> the database. Read and <span class="token function">write</span> access to data and configuration is unrestricted
   <span class="token number">2023</span>-10-11T14:31:28.351+00:00: vm.max_map_count is too low
------

test<span class="token operator">&gt;</span> 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>由于初始时是没有默认的用户和密码，所以进来就是test用户，接下来创建一个管理员账号，先写sql</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code>db.createUser(<span class="token punctuation">{</span>
	user<span class="token operator">:</span><span class="token string">&quot;admin&quot;</span><span class="token punctuation">,</span>
	pwd<span class="token operator">:</span><span class="token string">&quot;123456&quot;</span><span class="token punctuation">,</span>
	roles<span class="token operator">:</span><span class="token punctuation">[</span>
		<span class="token punctuation">{</span>
			role<span class="token operator">:</span><span class="token string">&quot;userAdminAnyDatabase&quot;</span><span class="token punctuation">,</span>
			db<span class="token operator">:</span><span class="token string">&quot;admin&quot;</span>
		<span class="token punctuation">}</span>
	<span class="token punctuation">]</span>
<span class="token punctuation">}</span>)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>主要有以下权限可以用</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>Read：允许用户读取指定数据库

readWrite：允许用户读写指定数据库

dbAdmin：允许用户在指定数据库中执行管理函数，如索引创建、删除，查看统计或访问system.profile

userAdmin：允许用户向system.users集合写入，可以找指定数据库里创建、删除和管理用户

clusterAdmin：只在admin数据库中可用，赋予用户所有分片和复制集相关函数的管理权限。

readAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的读权限

readWriteAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的读写权限

userAdminAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的userAdmin权限

dbAdminAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的dbAdmin权限。

root：只在admin数据库中可用。超级账号，超级权限
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>切换倒admin数据库后再创建</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>admin<span class="token operator">&gt;</span> use admin
admin<span class="token operator">&gt;</span> db.createUser<span class="token punctuation">(</span><span class="token punctuation">{</span>
<span class="token punctuation">..</span>.     user:<span class="token string">&quot;admin&quot;</span>,
<span class="token punctuation">..</span>.     pwd:<span class="token string">&quot;123456&quot;</span>,
<span class="token punctuation">..</span>.     roles:<span class="token punctuation">[</span>
<span class="token punctuation">..</span>.             <span class="token punctuation">{</span>
<span class="token punctuation">..</span>.                     role:<span class="token string">&quot;userAdminAnyDatabase&quot;</span>,
<span class="token punctuation">..</span>.                     db:<span class="token string">&quot;admin&quot;</span>
<span class="token punctuation">..</span>.             <span class="token punctuation">}</span>
<span class="token punctuation">..</span>.     <span class="token punctuation">]</span>
<span class="token punctuation">..</span>. <span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token punctuation">{</span> ok: <span class="token number">1</span> <span class="token punctuation">}</span>
admin<span class="token operator">&gt;</span> db.auth<span class="token punctuation">(</span><span class="token string">&#39;admin&#39;</span>,<span class="token string">&#39;123456&#39;</span><span class="token punctuation">)</span>
<span class="token punctuation">{</span> ok: <span class="token number">1</span> <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>查看用户列表</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>admin<span class="token operator">&gt;</span> db.system.users.find<span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token punctuation">[</span>
  <span class="token punctuation">{</span>
    _id: <span class="token string">&#39;admin.admin&#39;</span>,
    userId: new UUID<span class="token punctuation">(</span><span class="token string">&quot;ce1b5964-baf0-440e-80af-3223b816a2bf&quot;</span><span class="token punctuation">)</span>,
    user: <span class="token string">&#39;admin&#39;</span>,
    db: <span class="token string">&#39;admin&#39;</span>,
    credentials: <span class="token punctuation">{</span>
      <span class="token string">&#39;SCRAM-SHA-1&#39;</span><span class="token builtin class-name">:</span> <span class="token punctuation">{</span>
        iterationCount: <span class="token number">10000</span>,
        salt: <span class="token string">&#39;5nwa5T/qWrzRGDUWHFkeEg==&#39;</span>,
        storedKey: <span class="token string">&#39;X47HeMtquXIoEii9gjlUwYK/mMY=&#39;</span>,
        serverKey: <span class="token string">&#39;O8WilvO70SfzvEszOhByYwjkO60=&#39;</span>
      <span class="token punctuation">}</span>,
      <span class="token string">&#39;SCRAM-SHA-256&#39;</span><span class="token builtin class-name">:</span> <span class="token punctuation">{</span>
        iterationCount: <span class="token number">15000</span>,
        salt: <span class="token string">&#39;O1lbsKr1LOIAcnjbXLZovtzBbFY0rIg1myaGEg==&#39;</span>,
        storedKey: <span class="token string">&#39;F5rTnCPW6/Qar6bOyIIS5E4QBMRLVQhGsiFjlv3StDM=&#39;</span>,
        serverKey: <span class="token string">&#39;l0Dk06m3laPqxjcybH9nXtDGtqInnfIEdr/eTB+rYFw=&#39;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>,
    roles: <span class="token punctuation">[</span> <span class="token punctuation">{</span> role: <span class="token string">&#39;userAdminAnyDatabase&#39;</span>, db: <span class="token string">&#39;admin&#39;</span> <span class="token punctuation">}</span> <span class="token punctuation">]</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>完成后，退出然后修改mongo的配置文件添加</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">security</span><span class="token punctuation">:</span>
    <span class="token key atrule">authorization</span><span class="token punctuation">:</span> enabled
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>重启容器之后再重新登录</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>root@k8s-n1:~/db/mongo<span class="token comment"># docker exec -it mongo6 mongosh -u admin -p</span>
Enter password: ******
Current Mongosh Log ID: 6526bbacf7edfe2170bd2249
Connecting to:          mongodb://<span class="token operator">&lt;</span>credentials<span class="token operator">&gt;</span>@127.0.0.1:27017/?directConnection<span class="token operator">=</span>true<span class="token operator">&amp;</span><span class="token assign-left variable">serverSelectionTimeoutMS</span><span class="token operator">=</span><span class="token number">2000</span><span class="token operator">&amp;</span><span class="token assign-left variable">appName</span><span class="token operator">=</span>mongosh+2.0.1
Using MongoDB:          <span class="token number">6.0</span>.10
Using Mongosh:          <span class="token number">2.0</span>.1

For mongosh info see: https://docs.mongodb.com/mongodb-shell/

test<span class="token operator">&gt;</span> 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="连接" tabindex="-1"><a class="header-anchor" href="#连接" aria-hidden="true">#</a> 连接</h3><p>navicat也支持mongodb数据库，如果上面操作正确的话，连接应该是不会有问题的。</p><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202310112316660.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>`,38);function h(f,y){const a=c("ExternalLinkIcon");return l(),o("div",null,[r,u,d(" more "),m,n("p",null,[s("官网："),n("a",v,[s("MongoDB"),e(a)])]),b,n("p",null,[s("镜像地址："),n("a",g,[s("mongo - Official Image | Docker Hub"),e(a)])]),k])}const _=t(p,[["render",h],["__file","docker_install_mongo.html.vue"]]);export{_ as default};
