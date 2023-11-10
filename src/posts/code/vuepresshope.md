---
date: 2022-07-12
article: true
category:
  - 技术日志
tag:
  - vuepress
  - theme-hope
---

# VuePress博客教程

![](https://vuepress.vuejs.org/hero.png)

VuePress是一个vue驱动的静态网站生成器，非常适合来写静态文档，当然也可以拿来编写个人博客，配合第三方开发的主题可以做出非常精美的静态网站。

---

<!-- more -->

<br>

本文主要介绍的是如何使用VuePress编写个人博客，由于默认主题比较的简洁，可以考虑采用第三方主题，这里推荐使用[vuepress-theme-hope](https://theme-hope.vuejs.press/zh/)，它有以下优点：

- 开箱即用
- 完整的博客功能
- markdown增强
- 文章信息统计
- 众多插件支持
- 图片预览
- Vue3+TypeScript
- 以及众多的其他优点

该主题提供非常多的功能，可以让省去很多麻烦的配置，专注于文档编写，并且该主题作者也是VuePress项目成员之一。

<br>

## 安装

创建vuepress-theme-hope 项目，选择你自己的包管理器：

::: code-tabs#shell

@tab pnpm

```bash
pnpm create vuepress-theme-hope [dir]
```

@tab yarn

```bash
yarn create vuepress-theme-hope [dir]
```

@tab:active npm

```bash
npm init vuepress-theme-hope [dir]
```

:::

过程中会要求配置一些东西，过程中会有一个选项选择项目类型，`blog`博客或者`docs`文档，根据自己的需求选择就好，然后等待一会儿就可以完成项目的创建。

<br>

## 配置

```typescript
// .vuepress/config.ts
import { defineUserConfig } from "vuepress";
import { hopeTheme } from "vuepress-theme-hope";

export default defineUserConfig({
  // 站点选项
  // ...

  theme: hopeTheme({
    // 主题选项
    // ...
  }),
});
```

完成项目创建后，`.vuepress`是项目的配置文件夹，下面是一些文件夹的作用：

- `.cahce` ：用于缓存文件的文件夹
- `.temp`：存放临时文件的文件夹
- `dist`：存放打包文件的文件夹
- `public`：存放公共静态资源的文件夹
- `navbar`：存放导航栏配置的文件夹
- `sidebar`：存放侧边栏配置的文件夹
- `styles`：存放项目的样式文件
- `config.ts`：主要配置文件
- `theme.ts`：项目主题配置文件

对于博客而言，首先需要确保`theme.ts`文件内的插件配置`blog`项为`true`

```typescript
import {hopeTheme} from "vuepress-theme-hope";
import {zhNavbar} from "./navbar";
import {zhSidebar} from "./sidebar";

export default hopeTheme({
    blog:true
});
```

### 主页

`REAMDE.md`也要根据博客来进行相应的修改

```markdown
---
home: true
layout: BlogHome
icon: home
title: Blog Home
heroImage: /logo.svg
bgImage: /bkg.png
heroText: The name of your blog
tagline: You can put your slogan here
heroFullScreen: true
projects:
  - icon: project
    name: project name
    desc: project detailed description
    link: https://your.project.link

  - icon: link
    name: link name
    desc: link detailed description
    link: https://link.address

  - icon: book
    name: book name
    desc: Detailed description of the book
    link: https://link.to.your.book

  - icon: article
    name: article name
    desc: Detailed description of the article
    link: https://link.to.your.article

  - icon: friend
    name: friend name
    desc: Detailed description of friend
    link: https://link.to.your.friend

  - icon: /logo.svg
    name: custom item
    desc: Detailed description of this custom item
    link: https://link.to.your.friend

footer: customize your footer text
---
```

关于博客主页的详细的`Frontmatter`配置可以前往[博客主页 Frontmatter 配置 | vuepress-theme-hope (vuejs.press)](https://theme-hope.vuejs.press/zh/config/frontmatter/blog-home.html)。

<br>

## 图片

vuepress-theme-hope主题对于图片有很好的支持，且支持：

- 左右滑动按顺序浏览页面内其他的图片
- 查看图片的描述
- 对图片进行缩放
- 全屏浏览图片
- 下载图片
- 分享图片

在编写md文件时，只需要将文件放入`public`文件夹内，然后通过`/`开头的路径访问即可，例如`test`图片位于`/public/test/test.png`，那么对于的markdown如下

```markdown
![test.png](/test/test.png)
```

当在主题选项中设置 `plugin.mdEnhance.imgSize: true` 时，可以使用 `=widthxheight` 指定图像大小。

```markdown
![Alt](/example.png =200x300)

![Alt](/example.jpg "图片标题" =200x)
![Alt](/example.bmp =x300)
```

更多图片用法可以前往[图片 | vuepress-theme-hope (vuejs.press)](https://theme-hope.vuejs.press/zh/guide/markdown/image.html)。

::: tip

这里需要注意的是，该主题摘要部分的图片渲染有点问题，所以建议使用Gitee作为图床，Github搭建站点。

:::

<br>

## 博客页面路径

博客提供的默认路径如下，如果它们与你的已有路径发生冲突，并且你不想调整自己的路径，你可以对它们进行修改。

| 配置项         | 描述         | 默认路径           |
| -------------- | ------------ | ------------------ |
| `article`      | 文章列表     | `/article/`        |
| `category`     | 分类地图页   | `/category/`       |
| `categoryItem` | 特定分类列表 | `/category/:name/` |
| `tag`          | 标签地图页   | `/tag/`            |
| `tagItem`      | 特定标签列表 | `/tag/:name/`      |
| `star`         | 星标文章列表 | `/star/`           |
| `timeline`     | 时间线列表   | `/timeline/`       |

## Markdown增强

这块功能特别强大，东西非常多，建议去官网自己看。[启用 Markdown 增强 | vuepress-theme-hope (vuejs.press)](https://theme-hope.vuejs.press/zh/guide/markdown/intro.html)

<br>

## 文章信息

使用`frontmatter`可以控制文章的一些基本属性，下面是一个例子。

```markdown
---
date: 2022-07-12
article: true
star: true
sticky: true
category:
  - 技术日志
tag:
  - vuepress
  - theme-hope
---
```

`date`：日期

`article`：是否添加进文章列表

`start`：是否收藏，也可以是数字，数字越大排序权重越高

`sticky`：是否置顶，也可以是数字，数字越大排序权重越高

`category`：分类，YAML列表格式

`tag`：标签，YAML列表格式

更多配置项可以前往[信息 Frontmatter 配置 | vuepress-theme-hope (vuejs.press)](https://theme-hope.vuejs.press/zh/config/frontmatter/info.html)。

## 功能

### 阅读时间

配置`theme.tx`下的`plugins.readingTime.wordPerMinute`，如下

```typescript
import {hopeTheme} from "vuepress-theme-hope";
import {zhNavbar} from "./navbar";
import {zhSidebar} from "./sidebar";

export default hopeTheme({
    plugins: {
        readingTime: {
            wordPerMinute: 150 // 即每分钟阅读150个字
        },  
    }
});

```

<br>

### 评论

主题支持Gisus，Waline，Twikoo，Artalk，四种评论插件，这里为了方便我们就采用Giscus，利用GitHub dicussion制作的评论，其他三种都需要额外去对应官方申请应用，Giscus是完全开源免费的，对于我们个人博客而言已经完全足够使用了。

- [giscus主页](https://giscus.app/zh-CN)
- [Giscus 选项 | 评论插件 (vuejs.press)](https://plugin-comment2.vuejs.press/zh/config/giscus.html)

前提是你需要先安装 [Giscus App](https://github.com/apps/giscus)，使其有权限访问对应仓库，然后需要创建一个公开的GitHub仓库，并且开启Discussion功能，在仓库中的settings中开启即可。然后在Giscus官网中填写仓库名称，和分类，还有一些配置项，根据自己的喜好来即可，最后giscus会生成一个`<script>`标签，不过我们并不需要该标签，只需要获取其中的`data-reop`，`data-repo-id`，`data-category`，`data-category-id` 这四个属性即可。然后填入`theme.ts`中的`plugins`项中，如下：

```typescript
import {hopeTheme} from "vuepress-theme-hope";
import {zhNavbar} from "./navbar";
import {zhSidebar} from "./sidebar";

export default hopeTheme({
    plugins: {
        comment: {
            provider: "Giscus",
            repo: "你的仓库地址",
            repoId: "你的reopid",
            category: "announcements",
            categoryId: "你的分类ID",
            inputPosition: "top",
        },
        
    },
});
```

除此之外还有一些其他的外观配置项，请自行了解，配置完毕后重启应用，访问一篇文章通过Oauth2登录Github即可评论。

<br>

## 插件

vuepress-theme-hope提供了许多可以使用的主题，这些主题都需要额外的安装才能使用，下面是一些常用的主题。

<br>

### 搜索

安装 `vuepress-plugin-search-pro`：

::: code-tabs#shell

@tab pnpm

```bash
pnpm add -D vuepress-plugin-search-pro
```

@tab yarn

```bash
yarn add -D vuepress-plugin-search-pro
```

@tab:active npm

```
npm i -D vuepress-plugin-search-pro
```

:::

从 `vuepress-plugin-search-pro` 导入 `searchProPlugin` 并将其应用至 `config.ts` 下的 `plugins` 选项：

```typescript
import { defineUserConfig } from "vuepress";
import { searchProPlugin } from "vuepress-plugin-search-pro";

export default defineUserConfig({
  plugins: [
    searchProPlugin({
      // 索引全部内容
      indexContent: true,
      // 为分类和标签添加索引
      customFields: [
        {
          getter: (page) => page.frontmatter.category,
          formatter: "分类：$content",
        },
        {
          getter: (page) => page.frontmatter.tag,
          formatter: "标签：$content",
        },
      ],
    }),
  ],
});

```

重启项目，然后就可以在导航栏上看到搜索框了。

<br>

::: tip

经过以上的配置后，已经达到一个基本的博客要求了，但是除去上面这些功能之外，vuepress-theme-hope还有很多有趣的功能和插件，请自行前往官网了解。

:::

## 部署

部署的话对于这种小体量静态网站，没有必要去购买专门的云服务器，可以直接使用Github Page功能，或者国内访问更快的Gitee。这里使用的是Github Workflows自动部署。

```yaml

name: 部署博客

on:
  push:
    branches:
      # 确保这是你正在使用的分支名称
      - main

jobs:
  deploy-gh-pages:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        with:
          fetch-depth: 0
          # 如果你文档需要 Git 子模块，取消注释下一行
          # submodules: true



      - name: 设置 Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: yarn

      - name: 安装依赖
        run: yarn install --frozen-lockfile

      - name: 构建文档
        env:
          NODE_OPTIONS: --max_old_space_size=8192
        run: |-
          yarn run docs:build
          > src/.vuepress/dist/.nojekyll

      - name: 部署文档
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          # 这是文档部署到的分支名称
          branch: gh-pages
          folder: src/.vuepress/dist

```

推送完代码后Github会自动执行Actions，然后将网站打包的内容推送到`gh-pages`分支，然后Github会自动更新静态网站的内容。

::: tip

需要注意的是要开启Github Action允许修改仓库的权限。

:::