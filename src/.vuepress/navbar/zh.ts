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
                text: "编程语言",
                children: [
                    {
                        text: "Golang",
                        link: "/category/go/"
                    },
                    {
                        text: "Rust",
                        link: "/category/rust/"
                    },
                    {
                        text: "Python",
                        link: "/category/python/"
                    },
                ]
            },
            {
                text: "操作系统",
                children: [
                    {
                        text: "Linux",
                        link: "/category/linux/"
                    },
                    {
                        text: "Windows",
                        link: "/category/windows/"
                    },
                ]
            },
            {
                text: "开发工具",
                children: [
                    {
                        text: "Git",
                        link: "/category/git/"
                    },
                    {
                        text: "Docker",
                        link: "/category/docker/"
                    },
                    {
                        text: "数据库",
                        link: "/category/数据库/"
                    },
                ]
            },
            {
                text: "基础知识",
                children: [
                    {
                        text: "设计模式",
                        link: "/category/设计模式/"
                    },
                    {
                        text: "算法",
                        link: "/category/算法/"
                    },
                ]
            },
            {
                text: "闲话水文",
                children: [
                    {
                        text: "游戏杂谈",
                        link: "/category/游戏杂谈/",
                    },
                ]
            }
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
