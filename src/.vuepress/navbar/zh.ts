import {navbar} from "vuepress-theme-hope";

export const zhNavbar = navbar([
    {
        text: "技术日志",
        icon: "build",
        link: "/category/技术日志/",
    },
    {
        text: "问题记录",
        icon: "config",
        link: "/category/问题记录/",
    },
    {
        text: "生活随笔",
        icon: "edit",
        link: "/category/生活随笔/",
    },
    {
        text: "其它分类",
        icon: "guide",
        children: [
            {
                text: "Git",
                icon: "git",
                link: "/category/Git/"
            },
            {
                text: "数据库",
                icon: "mysql",
                link: "/category/数据库/"
            },
            {
                text: "Linux",
                icon: "linux",
                link: "/category/Linux/"
            },
            {
                text: "Docker",
                icon: "box",
                link: "/category/Docker/"
            },
            {
                text: "设计模式",
                icon: "mesh",
                link: "/category/设计模式/"
            },
            {
                text: "算法&数据结构",
                icon: "study",
                link: "/category/算法/"
            },
            {
                text: "游戏杂谈",
                icon: "creative",
                link: "/category/游戏杂谈/",
            },

        ]
    },
    {
        text: "工具箱",
        icon: "operate",
        link: "/tool",
    },
    {
        text: "时间轴",
        icon: "time",
        link: "/timeline",
    },
]);
