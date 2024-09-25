import{_ as n,W as s,X as i,a0 as d,Y as e,Z as a,a1 as r}from"./framework-b5ea9e64.js";const l={},u=e("h1",{id:"记一次redis线上数据突然丢失的问题",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#记一次redis线上数据突然丢失的问题","aria-hidden":"true"},"#"),a(" 记一次Redis线上数据突然丢失的问题")],-1),t=r(`<hr><p>之前的项目用到了redis来存放一些游戏的模组信息以及一些非结构化配置，突然有一次甲方告诉我系统出问题了，我一去看发现redis里面的数据全没了，由于redis没有开启日志，一时半会排查不出来是什么问题。就把redis aof备份粒度做的更细了一些，暂时想到的可能是RDB跟AOF覆盖掉了，但是这种情况应该非常小，事后还做好了日志方便下次排查，弄好之后这件事就这么过去了，</p><p>直到两个星期后，又发生了这个问题，查看到系统日志是下午15:26:51发生的问题，对比redis日志，刚开始还是一些正常的备份信息，像下面这样</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>1:M 30 Jul 2023 10:48:10.190 * Background saving terminated with success
1:M 30 Jul 2023 10:53:11.082 * 10 changes in 300 seconds. Saving...
1:M 30 Jul 2023 10:53:11.083 * Background saving started by pid 28
28:C 30 Jul 2023 10:53:11.115 * DB saved on disk
28:C 30 Jul 2023 10:53:11.116 * Fork CoW for RDB: current 0 MB, peak 0 MB, average 0 MB
1:M 30 Jul 2023 10:53:11.183 * Background saving terminated with success
1:M 30 Jul 2023 11:04:58.595 * 10 changes in 300 seconds. Saving...
1:M 30 Jul 2023 11:04:58.595 * Background saving started by pid 29
29:C 30 Jul 2023 11:04:58.612 * DB saved on disk
29:C 30 Jul 2023 11:04:58.613 * Fork CoW for RDB: current 0 MB, peak 0 MB, average 0 MB
1:M 30 Jul 2023 11:04:58.696 * Background saving terminated with success
1:M 30 Jul 2023 11:09:59.052 * 10 changes in 300 seconds. Saving...
1:M 30 Jul 2023 11:09:59.053 * Background saving started by pid 30
30:C 30 Jul 2023 11:09:59.082 * DB saved on disk
30:C 30 Jul 2023 11:09:59.082 * Fork CoW for RDB: current 0 MB, peak 0 MB, average 0 MB
1:M 30 Jul 2023 11:09:59.153 * Background saving terminated with success
1:M 30 Jul 2023 12:18:49.511 * 10 changes in 300 seconds. Saving...
1:M 30 Jul 2023 12:18:49.512 * Background saving started by pid 31
31:C 30 Jul 2023 12:18:49.553 * DB saved on disk
31:C 30 Jul 2023 12:18:49.554 * Fork CoW for RDB: current 0 MB, peak 0 MB, average 0 MB
1:M 30 Jul 2023 12:18:49.612 * Background saving terminated with success
1:M 30 Jul 2023 12:23:50.018 * 10 changes in 300 seconds. Saving...
1:M 30 Jul 2023 12:23:50.018 * Background saving started by pid 32
32:C 30 Jul 2023 12:23:50.045 * DB saved on disk
32:C 30 Jul 2023 12:23:50.046 * Fork CoW for RDB: current 0 MB, peak 0 MB, average 0 MB
1:M 30 Jul 2023 12:23:50.119 * Background saving terminated with success
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>看到出问题的时间点的时候就发现不对劲了，</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>1:S 30 Jul 2023 08:26:51.881 * Connecting to MASTER 35.158.95.21:60107
1:S 30 Jul 2023 08:26:51.884 * MASTER &lt;-&gt; REPLICA sync started
1:S 30 Jul 2023 08:26:51.884 * REPLICAOF 35.158.95.21:60107 enabled (user request from &#39;id=14479 addr=101.201.223.144:51768 laddr=172.17.0.11:6379 fd=10 name= age=55 idle=0 flags=N db=0 sub=0 psub=0 ssub=0 multi=-1 qbuf=28 qbuf-free=20446 argv-mem=24 multi-mem=0 rbs=1024 rbp=609 obl=0 oll=0 omem=0 tot-mem=22320 events=r cmd=slaveof user=default redir=-1 resp=2&#39;)
1:S 30 Jul 2023 08:26:52.100 * Non blocking connect for SYNC fired the event.
1:S 30 Jul 2023 08:26:52.324 * Master replied to PING, replication can continue...
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>尤其是这一段<code>Connecting to MASTER 35.158.95.21:60107</code>，这个IP并不是甲方的IP，并且系统是单机应用，redis都是直接和后端部署在同一个物理机上的，并没有采用redis集群和主从复制。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>MASTER &lt;-&gt; REPLICA sync started
REPLICAOF 35.158.95.21:60107 enabled (user request from &#39;id=14479 addr=101.201.223.144:51768 laddr=172.17.0.11:6379 fd=10 name= age=55 idle=0 flags=N db=0 sub=0 psub=0 ssub=0 multi=-1 qbuf=28 qbuf-free=20446 argv-mem=24 multi-mem=0 rbs=1024 rbp=609 obl=0 oll=0 omem=0 tot-mem=22320 events=r cmd=slaveof user=default redir=-1 resp=2&#39;)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>复制master数据后，我们的数据就没了，然后备份过后redis数据也没了。多半是redis密码太简单导致的问题，于是修改密码后再看后续的情况。</p>`,9);function c(v,o){return s(),i("div",null,[u,d(" more "),t])}const b=n(l,[["render",c],["__file","redisdataloss.html.vue"]]);export{b as default};
