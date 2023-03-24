import {hopeTheme} from "vuepress-theme-hope";
import {zhNavbar} from "./navbar";
import {zhSidebar} from "./sidebar";

export default hopeTheme({
    hostname: "https://246859.github.io/my-blog-giscus/",

    author: {
        name: "寒江蓑笠翁",
        url: "https://mrhope.site",
    },

    iconAssets: "iconfont",

    logo: "/logo.png",

    docsDir: "docs",
    editLink: false,
    blog: {
        medias: {
            GitHub: "https://github.com/246859",
            QQ: "tencent://AddContact/?fromId=45&fromSubId=1&subcmd=all&uin=2633565580&website=www.oicqzone.com",
            wechat: "https://public-1308755698.cos.ap-chongqing.myqcloud.com//img/wechat.png",
            Steam: "https://steamcommunity.com/profiles/76561199091820373/",
            Email: "mailto:2633565580@qq.com",
        },
    },

    locales: {
        "/": {
            navbar: zhNavbar,

            sidebar: zhSidebar,

            blog: {
                description: "一个简单的码农，游戏玩家，山地骑行爱好者",
                intro: "/intro.html",
            },
        },
    },

    plugins: {
        comment: {
            provider: "Giscus",
            repo: "246859/my-blog-giscus",
            repoId: "R_kgDOJNmiaA",
            category: "announcements",
            categoryId: "DIC_kwDOJNmiaM4CVG2r",
            inputPosition: "top",
        },
        readingTime: {
            wordPerMinute: 150
        },
        feed: {
            rss: true,
        },
        blog: true,
        // all features are enabled for demo, only preserve features you need here
        mdEnhance: {
            align: true,
            attrs: true,
            chart: true,
            codetabs: true,
            demo: true,
            echarts: true,
            figure: true,
            flowchart: true,
            gfm: true,
            imgLazyload: true,
            imgSize: true,
            include: true,
            katex: true,
            mark: true,
            mermaid: true,
            presentation: {
                plugins: ["highlight", "math", "search", "notes", "zoom"],
            },
            stylize: [
                {
                    matcher: "Recommended",
                    replacer: ({tag}) => {
                        if (tag === "em")
                            return {
                                tag: "Badge",
                                attrs: {type: "tip"},
                                content: "Recommended",
                            };
                    },
                },
            ],
            sub: true,
            sup: true,
            tabs: true,
            vPre: true,
            vuePlayground: true,
        },
    },
});
