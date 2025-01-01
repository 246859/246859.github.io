import{_ as o,W as c,X as t,a0 as a,Y as e,Z as d,a1 as s}from"./framework-b5ea9e64.js";const r={},p=e("h1",{id:"go后端日期时区的问题记录",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#go后端日期时区的问题记录","aria-hidden":"true"},"#"),d(" go后端日期时区的问题记录")],-1),n=e("p",null,"记录一次go后端日期时区问题的记录",-1),_=s("<hr><p>在通常的前后端交互中，日期是一个经常很令人头痛的问题，需要统一格式，统一时区等等。</p><p>在最近的一个项目中，前端根据<code>YYYY/MM/DD hh:mm:ss</code>格式传给后端，后端解析成<code>time.Time</code>类型，但是这犯了一个很严重的错误。</p><p>在解析日期字符串时，如果没有按照格式传递时区偏移，例如<code>+0800 CST</code> 等格式，go将会默认解析为<code>+0000 UST</code>的时区，由于数据库设置为了同步设置了东八区，一看传过来的数据是UST时区的，就误认为需要修正时区，结果就是存储到数据库的数据会比实际时间多出八小时。</p><p>解决办法1：</p><p>前端在传递给后端日期时，前端自己带上时区信息，<code>+0800 CST</code>类似这种</p><p>解决办法2：</p><p>后端根据客户端请求头中的时区信息， 将传递过来的日期加上时区信息</p><p>当添加上正确的时区信息过后，时间的读写才会是正常的。</p>",9);function i(m,h){return c(),t("div",null,[p,n,a(" more "),_])}const f=o(r,[["render",i],["__file","gotime.html.vue"]]);export{f as default};