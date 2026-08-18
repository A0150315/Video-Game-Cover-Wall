# Video Game Cover Wall

全屏 3D 游戏封面展示墙，适用于 LG G4 电视待机场景。Three.js 渲染的无限轮播封面墙 + 水墨晕染动态背景，纯屏保零交互。

## 技术栈

**pnpm + Vite + React 19 + TypeScript + Tailwind CSS v4 + Three.js**

## 展示效果

- 全部封面贴于球面（赤道 2 行环绕 360°），球体匀速自转，前半球即滑动窗口，无限循环
- 深黑水墨晕染 shader 背景，每次载入随机配色，相机微幅摆动
- 启动时随机洗牌，同图去重，404 封面自动剔除
- 封面本地化存储（512px JPEG），同源加载，无 CORS/限流问题

## 本地开发

```bash
pnpm install
pnpm dev
```

## 构建

```bash
pnpm build        # 产物在 dist/
pnpm preview      # 预览构建产物
pnpm test         # 运行测试
```

## 数据更新

游戏数据由 GitHub Actions 每日自动从 IGDB + SteamGridDB 拉取。

### 手动拉取数据

1. 申请 API Key：[Twitch Developers](https://dev.twitch.tv/) + [SteamGridDB](https://www.steamgriddb.com/profile/preferences)
2. 创建 `.env` 文件（参考 `.env.example`）
3. 运行：
```bash
pnpm fetch-games
```

`fetch-games` 会自动把封面下载、重编码到 `public/data/covers/`，并去重/剔除失败项。
已有 `games.json` 但缺本地封面时，可单独运行：

```bash
pnpm download-covers
```

## 部署

1. Fork 此仓库
2. 在 Settings → Secrets and variables → Actions 中添加：
   - `IGDB_CLIENT_ID`
   - `IGDB_CLIENT_SECRET`
   - `STEAMGRIDDB_API_KEY`
3. Settings → Pages → Source: GitHub Actions
4. Push 到 main 分支，自动部署

## 兼容性

需要支持 WebGL 的浏览器：

- LG webOS 浏览器（主要目标平台）
- Apple TV 浏览器
- PS5 浏览器
- 任何 Chromium 内核的现代浏览器
