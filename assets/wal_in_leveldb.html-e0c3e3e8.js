import{_ as n,W as a,X as o,a0 as t,Y as e,Z as l}from"./framework-b5ea9e64.js";const c={},i=e("h1",{id:"wal——预写日志",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#wal——预写日志","aria-hidden":"true"},"#"),l(" WAL——预写日志")],-1),s=e("figure",null,[e("img",{src:"https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202311292055936.png",alt:"",tabindex:"0",loading:"lazy"}),e("figcaption")],-1),d=e("hr",null,null,-1),r=e("p",null,[l("WAL全名叫Write Ahead Logging，译为预写日志，常用在数据库系统中，用来保证ACID事务中的原子性和持久性。WAL的写入方式通常是"),e("code",null,"append only"),l("，每一次写入都是在向其中添加数据，而非"),e("code",null,"in place"),l("原地修改，那么这样做的好处非常明显，由于是顺序IO，写入性能会比随机IO好很多。")],-1);function _(h,u){return a(),o("div",null,[i,s,t(" more "),d,r])}const p=n(c,[["render",_],["__file","wal_in_leveldb.html.vue"]]);export{p as default};