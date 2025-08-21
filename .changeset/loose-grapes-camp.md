---
'@quantum-design/vue3-antd-pc-ui': major
'@quantum-design/vue3-pc-ui': major
'@quantum-design-configs/commitlint': major
'@quantum-design-configs/prettier': major
'@quantum-design-configs/tailwind': major
'@quantum-design-configs/tsconfig': major
'@quantum-design/shared': major
'@quantum-design/styles': major
'@quantum-design-configs/eslint': major
'@quantum-design-configs/rollup': major
'@quantum-design/hooks': major
'@quantum-design/utils': major
'@quantum-design/http': major
'@quantum-design-configs/vite': major
'@quantum-design-configs/vite-sentry': major
'@quantum-design/ai-hub': major
'@quantum-design/types': major
---

- [x] Vite 升级到 v7，并同步更新 `configs/vite` 的 peer 依赖与适配。
- [x] 重构 ESLint 配置（`configs/eslint`），统一各工作区规则与插件版本。
    - 新增 prettier 配置
    - 支持 oxlint
- [x] 支持 tarui
- [x] 重构 项目偏好设置，支持 css variables 模式，多主题，支持系统主题获取
- [x] 增加主题切换动画，视觉上降低卡顿效果
- [x] 样式库重构，替换了 SCSS 变量为 CSS 变量
- [x] 支持 tailwind
