import { sidebar } from "vuepress-theme-hope";

export const zhSidebar = sidebar({
  "/NaN": [
    {
      text: "文章",
      icon: "note",
      prefix: "posts/",
      children: "structure",
    },
    "intro",
  ],
});
