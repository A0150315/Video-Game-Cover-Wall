## Context

当前项目基于 bulletproof-react (CRA + React 17)，代码腐化严重。重构目标是极简现代化静态站点：一个在 LG G4 待机时展示游戏封面的全屏轮播应用。部署于 GitHub Pages，数据由 GitHub Actions 定时拉取。

约束：
- 纯静态部署（GitHub Pages），无服务端
- LG webOS 浏览器（Chromium 内核）为主要目标平台
- API Key 不可出现在前端代码中
- 最终构建产物需极小（单页面，无路由）

## Goals / Non-Goals

**Goals:**
- 从零重写，使用 pnpm + Vite + React 19 + TypeScript + Tailwind v4 + Framer Motion
- GitHub Actions cron 每日从 IGDB + SteamGridDB 拉取游戏数据，写入 `public/data/games.json`
- 三种展示模式（Cinematic / Gallery / Spotlight）按 60%/25%/15% 时间比例自动轮换
- Ken Burns 缩放、交叉淡入淡出、交错入场、胶片颗粒等动画效果
- 支持 LG 遥控器方向键手动切换游戏
- API Key 存 GitHub Secrets，Actions 中使用

**Non-Goals:**
- 无后端、无数据库、无用户认证
- 不保留任何旧代码（完全重写）
- 不支持 IE 或老旧浏览器
- 不做 E2E 测试（Cypress），仅保留 Vitest 单元测试
- 不集成 Home Assistant / MQTT

## Decisions

### 1. 技术栈：Vite + React 19 vs Astro vs Next.js

| 方案 | 优点 | 缺点 |
|------|------|------|
| Vite + React 19 | 用户熟悉 React，生态成熟，Framer Motion 完美支持 | 比 Astro 稍重 |
| Astro | 零 JS 默认，构建产物极小 | 动画需 Island 架构，Framer Motion 集成不自然 |
| Next.js | 全栈能力 | GitHub Pages 只能静态导出，SSR 浪费 |

**选择 Vite + React 19**：用户有 React 经验，Framer Motion 动画生态最强，Vite 构建速度极快。

### 2. 动画方案：Framer Motion + CSS Animations 分工

- **Framer Motion**: 交错入场（stagger）、3D 翻转、页面切换、布局动画
- **CSS Animations**: Ken Burns 缩放（`@keyframes`）、胶片颗粒叠加（`::after` 伪元素）、羽化边缘（`radial-gradient`）

理由：Framer Motion 的 `AnimatePresence` 处理模式切换和组件进出场非常自然，但持续循环的 Ken Burns 效果用 CSS 性能更好（GPU 加速，不触发 React re-render）。

### 3. 数据源：IGDB + SteamGridDB 双源

- **IGDB**（Twitch API）：获取游戏列表、评分、发布日期、分类。免费额度极高。
- **SteamGridDB**：获取 2K/4K 海报图、Logo、Hero 图。免费注册即可。

数据策略：IGDB 拉经典（`rating > 85, total_rating_count > 200`）+ 近期热门（`release_date > 2020, rating > 80`），去重后对每个游戏从 SteamGridDB 查找最佳海报 URL，合并写入 `games.json`。

### 4. 数据流架构

```
GitHub Actions (update-data.yml, cron: 0 3 * * *)
  │
  ├── scripts/fetch-games.ts
  │     ├── IGDB API → 游戏列表 (150 个经典 + 50 个热门)
  │     ├── SteamGridDB API → 每游戏的海报 URL
  │     └── 混洗 → 去重 → public/data/games.json
  │
  └── git add + commit + push → 触发 deploy.yml
                                    │
                                    └── pnpm build → deploy to GitHub Pages
```

前端只需 `fetch('/data/games.json')` 加载数据，零 API 调用。

### 5. 项目结构

```
src/
├── components/
│   ├── CinematicMode.tsx    # 全屏 + Ken Burns
│   ├── GalleryMode.tsx      # 网格 + stagger
│   ├── SpotlightMode.tsx    # Hero + 侧栏
│   └── ModeRenderer.tsx     # 模式调度器
├── hooks/
│   ├── useGameRotation.ts   # 游戏切换定时器
│   └── useModeSchedule.ts   # 模式切换调度
├── types/
│   └── game.ts              # GameData 类型定义
├── App.tsx
└── main.tsx
```

简洁至上，预计总代码行数 ~400 行以内。

### 6. GitHub Actions 分离

- `update-data.yml`: 每天 UTC 3:00 跑，只拉数据 + push
- `deploy.yml`: push to main 时跑，只 build + deploy

分离原因：数据更新不触发完整的 lint/test/build 链；代码 push 不需要重新拉数据。

### 7. 依赖安装策略

`scripts/fetch-games.ts` 需要 `node-fetch` 或 Node 18+ 内置 `fetch`。由于 Actions 使用 Node 22，直接使用内置 `fetch`，脚本零外部依赖。

## Risks / Trade-offs

- **IGDB API 限流** → 每天仅请求一次（~200 个游戏分 2-3 页），远低于限流阈值。失败时保留旧数据，不覆盖。
- **SteamGridDB 覆盖不全** → 部分游戏可能无海报，fallback 到 IGDB 自带的 cover URL
- **GitHub Pages 构建产物大小** → 不打包图片，仅存 URL，构建产物 < 500KB
- **LG 浏览器兼容性** → webOS Chromium 内核支持 CSS Grid/Flexbox/transform/transition，Framer Motion 在低性能设备可能掉帧 → 使用 `will-change` + `transform3d` GPU 加速
- **Actions 免费额度** → 公开 repo 无限免费 Actions 分钟，无需担心

## Open Questions

- 是否需要 Steam 个人游戏库集成？（当前方案：热门游戏，后续可扩展）
- 是否需要背景音乐？（当前方案：无声，后续可选）
