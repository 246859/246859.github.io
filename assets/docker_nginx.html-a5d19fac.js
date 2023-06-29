import{_ as s,W as a,X as e,Y as i,Z as n,$ as t,a1 as l}from"./framework-a4c02b8f.js";const r={},c=n("h1",{id:"docker安装nginx",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#docker安装nginx","aria-hidden":"true"},"#"),t(" Docker安装nginx")],-1),o=n("figure",null,[n("img",{src:"https://w.wallhaven.cc/full/zy/wallhaven-zyxvqy.jpg",alt:"",tabindex:"0",loading:"lazy"}),n("figcaption")],-1),p=n("p",null,"docker安装nginx",-1),d=l(`<hr><p>Docker安装nginx时一般都是直接使用命令</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">docker</span> run <span class="token parameter variable">-p</span> <span class="token number">80</span>:80 <span class="token parameter variable">--name</span><span class="token operator">=</span>nginx <span class="token punctuation">\\</span>
<span class="token parameter variable">--restart</span><span class="token operator">=</span>always <span class="token parameter variable">--privileged</span><span class="token operator">=</span>true <span class="token punctuation">\\</span>
<span class="token parameter variable">-v</span> /home/nginx/conf/nginx.conf:/etc/nginx/nginx.conf <span class="token punctuation">\\</span>
<span class="token parameter variable">-v</span> /home/nginx/conf/conf.d:/etc/nginx/conf.d <span class="token punctuation">\\</span>
<span class="token parameter variable">-v</span> /home/nginx/log:/var/log/nginx <span class="token punctuation">\\</span>
<span class="token parameter variable">-v</span> /home/nginx/html:/usr/share/nginx/html <span class="token punctuation">\\</span>
<span class="token parameter variable">-d</span> nginx:latest
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>但后来还是觉得直接把静态文件打包进镜像可能会更加方便些</p><div class="language-docker line-numbers-mode" data-ext="docker"><pre class="language-docker"><code><span class="token instruction"><span class="token keyword">FROM</span> nginx</span>
<span class="token instruction"><span class="token keyword">WORKDIR</span> /root/</span>
<span class="token instruction"><span class="token keyword">USER</span> root</span>

<span class="token instruction"><span class="token keyword">COPY</span> html /usr/share/nginx/html</span>
<span class="token instruction"><span class="token keyword">COPY</span> nginx /etc/nginx/</span>

<span class="token instruction"><span class="token keyword">EXPOSE</span> 80</span>

<span class="token instruction"><span class="token keyword">VOLUME</span> [<span class="token string">&quot;/etc/nginx/&quot;</span>,<span class="token string">&quot;/usr/share/nginx/html&quot;</span>]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>运行命令</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>docker build -f ./DockerFile -t dstm/ui:latest .
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>目录下的html是打包好的静态文件，nginx是nginx配置文件夹。</p>`,8);function u(v,m){return a(),e("div",null,[c,o,p,i(" more "),d])}const g=s(r,[["render",u],["__file","docker_nginx.html.vue"]]);export{g as default};
