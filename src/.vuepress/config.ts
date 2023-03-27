import {defineUserConfig} from "vuepress";
import theme from "./theme.js";
import {searchProPlugin} from "vuepress-plugin-search-pro";

// @ts-ignore
// @ts-ignore
// @ts-ignore
export default defineUserConfig({
    base: "/",
    head: [
        [
            "link",
            {rel: "icon", href: "/favicon.ico"},
        ]
    ],
    locales: {
        "/": {
            lang: "zh-CN",
            title: "寒江蓑笠翁",
            description: "寒江蓑笠翁的个人博客",
        },
    },

    theme,
    plugins: [
        searchProPlugin({
            // 索引全部内容
            indexContent: true,
            // 为分类和标签添加索引
            customFields: [
                {
                    //@ts-ignore
                    getter: (page) => page.frontmatter.category,
                    formatter: "分类：$content",
                },
                {
                    //@ts-ignore
                    getter: (page) => page.frontmatter.tag,
                    formatter: "标签：$content",
                },
            ],
        }),
    ]

    // Enable it with pwa
    // shouldPrefetch: false,
});
