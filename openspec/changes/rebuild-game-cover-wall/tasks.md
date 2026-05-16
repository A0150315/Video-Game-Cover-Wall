## 1. 项目初始化

- [x] 1.1 归档旧代码，初始化 pnpm + Vite + React 19 + TypeScript 项目
- [x] 1.2 安装依赖：react、react-dom、framer-motion、tailwindcss v4、vite
- [x] 1.3 安装开发依赖：vitest、@testing-library/react、typescript、eslint、prettier
- [x] 1.4 配置 vite.config.ts（路径别名、base 路径）
- [x] 1.5 配置 tailwind v4（通过 @tailwindcss/vite 插件 + CSS @theme，无需 config 文件）
- [x] 1.6 配置 tsconfig.json（strict、路径映射）
- [x] 1.7 创建 `public/data/games.json` 样例数据文件
- [x] 1.8 创建 `.env.example`（不含真实 Key）

## 2. 核心类型与工具

- [x] 2.1 定义 `src/types/game.ts`（GameData、DisplayMode 等核心类型）
- [x] 2.2 实现 `src/hooks/useGameRotation.ts`（游戏索引轮换 Hook）
- [x] 2.3 实现 `src/hooks/useModeSchedule.ts`（模式自动切换 Hook）
- [x] 2.4 实现 `styles/globals.css`（Tailwind 基础 + 暗色主题 + 全屏重置）

## 3. 展示模式组件

- [x] 3.1 实现 `CinematicMode.tsx`（全屏海报 + CSS Ken Burns + 元数据叠加 + 羽化效果）
- [x] 3.2 实现 `GalleryMode.tsx`（网格布局 + Framer Motion staggerChildren + 随机 Hero 放大）
- [x] 3.3 实现 `SpotlightMode.tsx`（Hero 65% + 右侧缩略图 35% + 轮播动画）
- [x] 3.4 实现 `ModeRenderer.tsx`（AnimatePresence 包裹的模式切换器）

## 4. 应用主体

- [x] 4.1 实现 `App.tsx`（加载 games.json、整合模式调度、键盘事件监听）
- [x] 4.2 实现 `main.tsx`（React 19 createRoot 渲染入口）
- [x] 4.3 实现 `index.html`（全屏 meta 标签、viewport 设置、暗色背景）
- [x] 4.4 处理加载状态（数据未加载时的 loading 画面）
- [x] 4.5 处理错误状态（数据加载失败时的 fallback）

## 5. 数据拉取脚本

- [x] 5.1 创建 `scripts/fetch-games.ts`（IGDB API 认证 + 查询经典游戏）
- [x] 5.2 实现 IGDB 查询近期热门游戏逻辑
- [x] 5.3 实现 SteamGridDB API 海报搜索 + fallback 逻辑
- [x] 5.4 实现去重、混洗、写入 `public/data/games.json`

## 6. GitHub Actions

- [x] 6.1 创建 `update-data.yml`（cron 定时触发 → 运行脚本 → commit + push）
- [x] 6.2 创建 `deploy.yml`（push to main → pnpm install → pnpm build → deploy Pages）
- [x] 6.3 配置 GitHub Secrets（IGDB_CLIENT_ID、IGDB_CLIENT_SECRET、STEAMGRIDDB_API_KEY）
- [x] 6.4 配置 GitHub Pages 源为 GitHub Actions

## 7. 收尾与验证

- [x] 7.1 编写 `CinematicMode` 和 `useModeSchedule` 的 Vitest 单元测试
- [x] 7.2 LG 浏览器兼容性验证（CSS Grid、transform、Framer Motion）
- [x] 7.3 清理所有旧 bulletproof-react 代码
- [x] 7.4 更新 README.md（项目说明、技术栈、本地开发指南）
