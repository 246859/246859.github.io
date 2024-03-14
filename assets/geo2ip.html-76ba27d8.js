import{_ as i,W as o,X as p,Y as c,Z as n,$ as s,a0 as t,a1 as e,C as l}from"./framework-a4c02b8f.js";const u={},d=n("h1",{id:"使用geo2ip将ip地址转换为地理信息",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#使用geo2ip将ip地址转换为地理信息","aria-hidden":"true"},"#"),s(" 使用geo2ip将IP地址转换为地理信息")],-1),r=n("figure",null,[n("img",{src:"https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/202403141721383.png",alt:"",tabindex:"0",loading:"lazy"}),n("figcaption")],-1),k=e('<hr><p>之前推荐了一个ip地理信息库<code>ip2location</code>，其免费版只能查询国家代码，并且离线数据库不支持全量加载到内存中，由于这些缺点，我找了一个新的替代品<code>geoip2</code>，该离线数据库仍然是由一个商业公司在运营，但是相比前者要良心非常多，免费版支持定位到城市，且支持多语言，同时支持<code>csv</code>，<code>mmdb</code>两种格式。</p><h2 id="下载" tabindex="-1"><a class="header-anchor" href="#下载" aria-hidden="true">#</a> 下载</h2><p>首先需要在网站注册一个账号，然后才能下载免费版</p>',4),v={href:"https://www.maxmind.com/en/home",target:"_blank",rel:"noopener noreferrer"},m={href:"https://www.maxmind.com/en/accounts/986554/geoip/downloads",target:"_blank",rel:"noopener noreferrer"},b=e(`<p>然后安装他们提供的go SDK库</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ go get github.com/oschwald/geoip2-golang@latest
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="使用" tabindex="-1"><a class="header-anchor" href="#使用" aria-hidden="true">#</a> 使用</h2><p>使用起来有两种，一种是从文件读</p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code>db<span class="token punctuation">,</span> err <span class="token operator">:=</span> geoip2<span class="token punctuation">.</span><span class="token function">Open</span><span class="token punctuation">(</span><span class="token string">&quot;GeoLite2-City.mmdb&quot;</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>另一种是把数据库全量加载到内存中，总共也才30MB不到，这样做可以省去文件IO</p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code>bytes<span class="token punctuation">,</span> err <span class="token operator">:=</span> os<span class="token punctuation">.</span><span class="token function">ReadFile</span><span class="token punctuation">(</span><span class="token string">&quot;GeoLite2-City.mmdb&quot;</span><span class="token punctuation">)</span>
<span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span><span class="token punctuation">{</span>
    <span class="token function">panic</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span>
<span class="token punctuation">}</span>
db<span class="token punctuation">,</span> err <span class="token operator">=</span> geoip2<span class="token punctuation">.</span><span class="token function">FromBytes</span><span class="token punctuation">(</span>bytes<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="案例" tabindex="-1"><a class="header-anchor" href="#案例" aria-hidden="true">#</a> 案例</h2><p>通过IP地址查询地区信息</p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code><span class="token keyword">import</span> <span class="token punctuation">(</span>
	<span class="token string">&quot;github.com/cloudwego/hertz/pkg/common/test/assert&quot;</span>
	<span class="token string">&quot;github.com/oschwald/geoip2-golang&quot;</span>
	<span class="token string">&quot;net&quot;</span>
	<span class="token string">&quot;testing&quot;</span>
<span class="token punctuation">)</span>

<span class="token keyword">func</span> <span class="token function">TestGeoip2</span><span class="token punctuation">(</span>t <span class="token operator">*</span>testing<span class="token punctuation">.</span>T<span class="token punctuation">)</span> <span class="token punctuation">{</span>
	bytes<span class="token punctuation">,</span> err <span class="token operator">:=</span> FS<span class="token punctuation">.</span><span class="token function">ReadFile</span><span class="token punctuation">(</span><span class="token string">&quot;geoip2/GeoLite2-City.mmdb&quot;</span><span class="token punctuation">)</span>
	assert<span class="token punctuation">.</span><span class="token function">Nil</span><span class="token punctuation">(</span>t<span class="token punctuation">,</span> err<span class="token punctuation">)</span>

	db<span class="token punctuation">,</span> err <span class="token operator">:=</span> geoip2<span class="token punctuation">.</span><span class="token function">FromBytes</span><span class="token punctuation">(</span>bytes<span class="token punctuation">)</span>
	assert<span class="token punctuation">.</span><span class="token function">Nil</span><span class="token punctuation">(</span>t<span class="token punctuation">,</span> err<span class="token punctuation">)</span>

	country<span class="token punctuation">,</span> err <span class="token operator">:=</span> db<span class="token punctuation">.</span><span class="token function">Country</span><span class="token punctuation">(</span>net<span class="token punctuation">.</span><span class="token function">ParseIP</span><span class="token punctuation">(</span><span class="token string">&quot;125.227.86.48&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
	assert<span class="token punctuation">.</span><span class="token function">Nil</span><span class="token punctuation">(</span>t<span class="token punctuation">,</span> err<span class="token punctuation">)</span>
	t<span class="token punctuation">.</span><span class="token function">Log</span><span class="token punctuation">(</span>country<span class="token punctuation">.</span>Country<span class="token punctuation">.</span>Names<span class="token punctuation">)</span>
	t<span class="token punctuation">.</span><span class="token function">Log</span><span class="token punctuation">(</span>country<span class="token punctuation">.</span>Country<span class="token punctuation">.</span>IsoCode<span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>输出</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>map[de:Taiwan en:Taiwan es:Taiwán fr:Taïwan ja:台湾 pt-BR:Taiwan ru:Тайвань zh-CN:台湾]
TW
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>通过IP地址查询城市信息</p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code><span class="token keyword">import</span> <span class="token punctuation">(</span>
	<span class="token string">&quot;github.com/cloudwego/hertz/pkg/common/test/assert&quot;</span>
	<span class="token string">&quot;github.com/oschwald/geoip2-golang&quot;</span>
	<span class="token string">&quot;net&quot;</span>
	<span class="token string">&quot;testing&quot;</span>
<span class="token punctuation">)</span>

<span class="token keyword">func</span> <span class="token function">TestGeoip2</span><span class="token punctuation">(</span>t <span class="token operator">*</span>testing<span class="token punctuation">.</span>T<span class="token punctuation">)</span> <span class="token punctuation">{</span>
	bytes<span class="token punctuation">,</span> err <span class="token operator">:=</span> FS<span class="token punctuation">.</span><span class="token function">ReadFile</span><span class="token punctuation">(</span><span class="token string">&quot;geoip2/GeoLite2-City.mmdb&quot;</span><span class="token punctuation">)</span>
	assert<span class="token punctuation">.</span><span class="token function">Nil</span><span class="token punctuation">(</span>t<span class="token punctuation">,</span> err<span class="token punctuation">)</span>

	db<span class="token punctuation">,</span> err <span class="token operator">:=</span> geoip2<span class="token punctuation">.</span><span class="token function">FromBytes</span><span class="token punctuation">(</span>bytes<span class="token punctuation">)</span>
	assert<span class="token punctuation">.</span><span class="token function">Nil</span><span class="token punctuation">(</span>t<span class="token punctuation">,</span> err<span class="token punctuation">)</span>

	city<span class="token punctuation">,</span> err <span class="token operator">:=</span> db<span class="token punctuation">.</span><span class="token function">City</span><span class="token punctuation">(</span>net<span class="token punctuation">.</span><span class="token function">ParseIP</span><span class="token punctuation">(</span><span class="token string">&quot;125.227.86.48&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
	assert<span class="token punctuation">.</span><span class="token function">Nil</span><span class="token punctuation">(</span>t<span class="token punctuation">,</span> err<span class="token punctuation">)</span>
	t<span class="token punctuation">.</span><span class="token function">Log</span><span class="token punctuation">(</span>city<span class="token punctuation">.</span>Country<span class="token punctuation">.</span>IsoCode<span class="token punctuation">)</span>
	t<span class="token punctuation">.</span><span class="token function">Log</span><span class="token punctuation">(</span>city<span class="token punctuation">.</span>City<span class="token punctuation">.</span>Names<span class="token punctuation">)</span>
	t<span class="token punctuation">.</span><span class="token function">Log</span><span class="token punctuation">(</span>city<span class="token punctuation">.</span>Location<span class="token punctuation">.</span>TimeZone<span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>输出</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>TW
map[en:Taichung ja:台中市 ru:Тайчжун]
Asia/Taipei
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>通过上面的两个输出可以看到，它支持多种语言，时区等等信息，除此之外它还支持经纬度定位等其它功能，不过不是很准确。</p><h2 id="性能" tabindex="-1"><a class="header-anchor" href="#性能" aria-hidden="true">#</a> 性能</h2><p>写一个简单的基准测试</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>func BenchmarkGeoip2(b *testing.B) {
    b.ReportAllocs()

    bytes, err := FS.ReadFile(&quot;geoip2/GeoLite2-City.mmdb&quot;)
    assert.Nil(b, err)

    db, err := geoip2.FromBytes(bytes)
    assert.Nil(b, err)

    for i := 0; i &lt; b.N; i++ {
        db.City(net.ParseIP(&quot;125.227.86.48&quot;))
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>goos: windows
goarch: amd64
pkg: github.com/dstgo/tracker/assets
cpu: 11th Gen Intel(R) Core(TM) i7-11800H @ 2.30GHz
BenchmarkGeoip2
BenchmarkGeoip2-16        218502              5259 ns/op            2800 B/op              84 allocs/op
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>平均耗时在5微秒左右</p>`,22);function g(h,f){const a=l("ExternalLinkIcon");return o(),p("div",null,[d,r,c(" more "),k,n("p",null,[s("官网："),n("a",v,[s("Industry leading IP Geolocation and Online Fraud Prevention | MaxMind"),t(a)])]),n("p",null,[s("下载地址："),n("a",m,[s("Download GeoIP Databases | MaxMind"),t(a)])]),b])}const x=i(u,[["render",g],["__file","geo2ip.html.vue"]]);export{x as default};
