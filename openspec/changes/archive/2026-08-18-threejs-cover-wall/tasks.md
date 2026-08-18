# Tasks

- [x] 卸载 motion，安装 three + @types/three
- [x] 新增 `src/three/CoverWall.ts`：场景/相机/弧面双排布局/漂移循环/纹理加载淡入/DPR 钳制
- [x] 新增 `src/three/math.ts`（wrap、splitRows）与 `src/utils/shuffle.ts`，附单测
- [x] 新增 `src/components/CoverWallCanvas.tsx` React 胶合层（创建/销毁墙）
- [x] 重写 `src/App.tsx`：fetch + shuffle + 挂载，删除键盘监听
- [x] 删除旧模式组件、调度/轮换 Hook 及其测试，清理 `types/game.ts` 与 `globals.css` 孤儿代码
- [x] `pnpm test` 与 `pnpm build` 全绿
- [x] 归档旧 specs，写入新 `cover-wall` spec
