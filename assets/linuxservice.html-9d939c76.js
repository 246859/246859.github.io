import{_ as i,W as n,X as l,a0 as s,Y as e,Z as d,a1 as c}from"./framework-b5ea9e64.js";const a={},r=e("h1",{id:"ubuntu自定义系统服务",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#ubuntu自定义系统服务","aria-hidden":"true"},"#"),d(" ubuntu自定义系统服务")],-1),t=e("img",{src:"https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202310111508436.png",style:{zoom:"150%"}},null,-1),o=c(`<hr><p>在开发项目时，对于一些后台应用，可以自定义成linux的service，这样能够更加方便的管理。</p><p>首先在<code>/etc/systemd/system</code>下，创建一个<code>xxx.service</code>的文件，<code>xxx</code>是服务名。</p><p>service文件有特殊的配置格式，下面是一个简单的例子</p><div class="language-txt line-numbers-mode" data-ext="txt"><pre class="language-txt"><code>[Unit]
Description=dstm daemon
# 依赖docker服务
Requires=docker.service
# 必须在docker服务成功启动后再启动
After=docker.service

[Service]
Type=forking
# 总是重启，开机自启
Restart=always

# 重启等待时间
RestartSec=2s
# 启动超时时间
TimeoutStartSec=10s
# 停止超时时间
TimeoutStopSec=10s
# 停止方式，仅杀死服务应用程序
KillMode=process

# 提示消息
ExecStartPre=/bin/echo &quot;starting dstm daemon&quot;
ExecStartPost=/bin/echo &quot;dstm daemon started done&quot;
ExecStopPost=/bin/echo &quot;stop dstm daemon done&quot;

# 服务启动命令，这里填写具体部署时应用执行文件的绝对路径
ExecStart=/root/hello
# 服务关闭命令
ExecStop=/bin/kill -SIGINT $MAINPID
# 服务重启命令
ExecReload=/bin/bash -c &quot;/bin/kill -SIGINT $MAINPID &amp;&amp; /root/hello&quot;

[Install]
# 多用户情况下
WantedBy=multi-user.target
# 别名
Alias=hello.service
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其中<code>type</code>有以下几种取值</p><ul><li><p>Type=simple：默认值，执行ExecStart指定的命令，启动主进程</p></li><li><p>Type=forking：以 fork 方式从父进程创建子进程，创建后父进程会立即退出</p></li><li><p>Type=oneshot：一次性进程，Systemd 会等当前服务退出，再继续往下执行</p></li><li><p>Type=dbus：当前服务通过D-Bus启动</p></li><li><p>Type=notify：当前服务启动完毕，会通知Systemd，再继续往下执行</p></li><li><p>Type=idle：若有其他任务执行完毕，当前服务才会运行，即后台运行</p></li></ul><p>Restart：定义了退出后，Systemd 的重启方式。可以设置的值如下：</p><ul><li><p>no（默认值）：退出后不会重启；</p></li><li><p>on-success：当进程正常退出时（退出状态码为0），才会重启；</p></li><li><p>on-failure：当进程非正常退出时(退出状态码非0)，包括被信号终止和超时，才会重启；</p></li><li><p>on-abnormal：当被信号终止和超时，才会重启；</p></li><li><p>on-abort：当收到没有捕捉到的信号终止时，才会重启；</p></li><li><p>on-watchdog：看门狗超时退出，才会重启；</p></li><li><p>always：总是重启。</p></li></ul><p>KillMode：定义 Systemd 如何停止服务，可以设置的值如下：</p><ul><li><p>control-group（默认值）：当前控制组里面的所有子进程，都会被杀掉；</p></li><li><p>process：只杀主进程；</p></li><li><p>mixed：主进程将收到 SIGTERM 信号，子进程收到 SIGKILL 信号；</p></li><li><p>none：没有进程会被杀掉。</p></li></ul><p>创建完成后，执行命令重新加载服务文件</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>systemctl daemon-reload
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>随后使用<code>service hello service </code> 即可开启</p>`,14);function v(u,m){return n(),l("div",null,[r,t,s(" more "),o])}const b=i(a,[["render",v],["__file","linuxservice.html.vue"]]);export{b as default};
