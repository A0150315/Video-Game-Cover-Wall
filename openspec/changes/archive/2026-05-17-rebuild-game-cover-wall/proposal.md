## Why

当前的 Video-Game-Cover-Wall 基于 2021 年的 bulletproof-react 模板构建，技术栈严重过时（CRA + React 17 + Node 14），90% 代码为未使用的管理后台样板（auth、teams、discussions、MSW、Cypress），核心游戏封面展示仅 126 行。RAWG API Key 硬编码在前端源码中且已过期，网站打开即报错。需要彻底重写为一个现代化的、可维护的、自动更新的游戏封面展示应用。

## What Changes

- **BREAKING**: 完全废弃旧的 bulletproof-react 代码库，从零重写
- **BREAKING**: 移除所有未使用的管理后台功能（auth、teams、users、discussions、comments）
- **BREAKING**: 移除 CRA/craco 构建链，迁移至 Vite
- 使用 pnpm 替代 yarn 进行包管理
- 升级至 React 19 + TypeScript + Tailwind CSS v4
- 引入 Framer Motion 实现复杂动画
- 三种展示模式自动轮换：电影模式（全屏 Ken Burns）、画廊模式（网格交错入场）、聚光灯模式（Hero + 侧栏）
- 数据源从 RAWG 客户端请求改为 IGDB + SteamGridDB，由 GitHub Actions 定时预取
- API Key 存储在 GitHub Secrets 中，不暴露给前端
- 部署至 GitHub Pages，纯静态站点
- 新增 Vitest 替代 Jest，精简测试

## Capabilities

### New Capabilities

- `game-data-fetching`: GitHub Actions 定时从 IGDB 和 SteamGridDB API 拉取经典+热门游戏封面数据，生成静态 JSON 文件
- `cinematic-display`: 全屏电影模式——单张游戏海报 + Ken Burns 慢速缩放 + 交叉淡入淡出 + 胶片颗粒/羽化叠加
- `gallery-display`: 画廊模式——自适应网格布局 + 卡片交错入场动画 + 随机 Hero 放大效果
- `spotlight-display`: 聚光灯模式——左侧大幅 Hero 海报 + 右侧缩略图轮播列
- `display-scheduler`: 三种模式按 60%/25%/15% 时间比例自动循环切换，支持遥控器方向键手动切换
- `github-pages-deploy`: Vite 构建纯静态产物，通过 GitHub Actions 部署到 GitHub Pages

### Modified Capabilities

（无现有 specs，此为全新项目）

## Impact

- 影响范围：`/Users/tanjianqing/Codes/Video-Game-Cover-Wall/` 下几乎所有文件将替换
- 旧代码将在新版本完成后归档或删除
- 依赖：IGDB API（需要 Twitch 开发者账号）、SteamGridDB API（需要免费注册）、GitHub Secrets 配置
- 运行环境：任何支持 Chromium 的现代浏览器（含 LG webOS、Apple TV、PS5 浏览器）
