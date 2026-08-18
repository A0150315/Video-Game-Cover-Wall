## Why

现有三模式 2D 展示视觉冲击不足；且 `useGameRotation` 初始随机索引在数据为空时计算恒为 0，导致每次启动首屏固定为评分第一的游戏（合金装备 Snake），随机性名存实亡。参考 PS5 游戏库的 3D 封面墙效果，改为 WebGL 无限轮播封面墙，同时回归纯屏保定位。

## What Changes

- **BREAKING**: 删除 Cinematic / Gallery / Spotlight 三种展示模式及模式调度器、游戏轮换 Hook、键盘遥控交互
- **BREAKING**: 移除 motion (Framer Motion) 依赖，引入 three (Three.js)
- 新增 Three.js 3D 封面墙：双排竖版 poster 沿微弧面排布，匀速水平漂移，取模回绕实现无限循环
- 深黑背景 + 雾效纵深 + CSS 暗角/胶片颗粒叠加，保留影院氛围
- 启动时 Fisher-Yates shuffle 游戏列表，修复首屏固定问题
- 纹理跨域加载（SteamGridDB 直链），DPR 钳制 ≤1.5 保护电视端 GPU，封面加载淡入
- 零交互：纯待机屏保，删除全部键盘监听

## Capabilities

### New Capabilities

- `cover-wall`: Three.js 渲染的无限 3D 封面墙——双排弧面布局、水平漂移、取模无限循环、纹理淡入、DPR/纹理量控制

### Modified Capabilities

（无，以下旧 capabilities 整体移除）

- ~~`cinematic-display`~~、~~`gallery-display`~~、~~`spotlight-display`~~、~~`display-scheduler`~~：随三模式一并删除

## Impact

- `src/components`、`src/hooks` 下旧模式代码全部删除，新增 `src/three/`、`src/utils/shuffle.ts`
- `src/types/game.ts` 仅保留 `GameData`，删除模式常量
- 数据管线（game-data-fetching）与部署（github-pages-deploy）不受影响
- 运行环境要求 WebGL（LG webOS / Apple TV / PS5 浏览器均支持）
