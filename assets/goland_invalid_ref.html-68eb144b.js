import{_ as a,W as i,X as t,a0 as c,Y as e,Z as o,$ as l,a1 as r,C as g}from"./framework-b5ea9e64.js";const d={},s=e("h1",{id:"goland索引失效",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#goland索引失效","aria-hidden":"true"},"#"),o(" goland索引失效")],-1),p=e("p",null,"问题相当的恼火",-1),h=r('<hr><h3 id="问题" tabindex="-1"><a class="header-anchor" href="#问题" aria-hidden="true">#</a> 问题</h3><p>最近在用goland写代码的时候，经常会出现某个包的类型无法解析的情况，但实际上没有任何的错误。比如这一行代码引用了<code>user.PageOption</code>，</p><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202310221542332.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>goland报错提示引用无法正常解析</p><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202310221543827.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>但实际上根本就没有任何的错误</p><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202310221544683.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p><code>go vet</code>也检测不到任何的错误，编译也可以正常通过。出现这种情况的话就没法进行引用快速跳转，智能提示等，这种情况还会发生在函数，接口，结构体，字段上，并且一旦有其它类型引用了这些它们，那么该类型也会变得“无法正常解析”，突出一个离谱，这样很影响效率。</p><h3 id="解决" tabindex="-1"><a class="header-anchor" href="#解决" aria-hidden="true">#</a> 解决</h3><figure><img src="https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202310221556764.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>',11),u={href:"https://youtrack.jetbrains.com/issue/GO-15632/reference-index-invalid-frequently",target:"_blank",rel:"noopener noreferrer"},m=e("img",{src:"https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202310221552165.png",style:{zoom:"50%"}},null,-1),_=e("p",null,"结果发现降下来没有任何的改善，在bug修复之前唯一能做的就只有等待。不过总归要有一个临时的解决办法，既然是索引出了问题，那就把索引清空了重新对项目进行索引。",-1),f=e("figure",null,[e("img",{src:"https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202310221551987.png",alt:"",tabindex:"0",loading:"lazy"}),e("figcaption")],-1),b=e("p",null,"但如果每次发生这种情况都要重启一次的话，那就太浪费时间了，goland重启+构建索引的时间基本上有几分钟了，但凡gomod的依赖多一点，花的时间就更久，不过除此之外也没别的办法了。",-1);function y(x,q){const n=g("ExternalLinkIcon");return i(),t("div",null,[s,p,c(" more "),h,e("p",null,[o("解决不了，摆烂！这个问题我已经在youtrack反映过了，问题链接："),e("a",u,[o("youtrack"),l(n)]),o("。工作人员让我升级到2023.2.3，但实际上我就是在2.3版本发现问题才降到2.2的。")]),m,_,f,b])}const v=a(d,[["render",y],["__file","goland_invalid_ref.html.vue"]]);export{v as default};