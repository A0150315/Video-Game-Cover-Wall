# Video Game Cover Wall

全屏游戏封面展示墙，适用于 LG G4 电视待机场景。三种展示模式自动轮换，数据由 GitHub Actions 每日自动更新。

## 技术栈

**pnpm + Vite + React 19 + TypeScript + Tailwind CSS v4 + Motion (Framer Motion)**

## 三种展示模式

| 模式 | 占比 | 效果 |
|------|------|------|
| Cinematic 电影模式 | 60% | 全屏 Ken Burns 缩放 + 羽化 + 胶片颗粒 |
| Gallery 画廊模式 | 25% | 5×3 网格 + 交错入场 + 随机 Hero 放大 |
| Spotlight 聚光灯 | 15% | 65%/35% Hero+侧栏 + 轮播动画 |

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

## 部署

1. Fork 此仓库
2. 在 Settings → Secrets and variables → Actions 中添加：
   - `IGDB_CLIENT_ID`
   - `IGDB_CLIENT_SECRET`
   - `STEAMGRIDDB_API_KEY`
3. Settings → Pages → Source: GitHub Actions
4. Push 到 main 分支，自动部署

## 遥控器操作

| 按键 | 功能 |
|------|------|
| 左/右 | 上一款/下一款游戏 |
| 上/下 | 切换展示模式 |

## 兼容性

- LG webOS 浏览器（主要目标平台）
- Apple TV 浏览器
- PS5 浏览器
- 任何 Chromium 内核的现代浏览器
