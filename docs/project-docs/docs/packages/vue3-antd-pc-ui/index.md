# 总览

:::danger 提示
重要重要重要
- `1.1.x` 版本进行破坏性升级，`vue3.2.x`及`vite3.2.5`用户请使用 `1.0.x`版本
- `1.1.x` 版本, 所有组件前缀由 `Q` 改成 `QAntd`， 为了使`unplugin-vue-components`正确识别组件进行按需引入
- `1.1.x`及以上版本，样式不会自动导入，以下两种方案二选一
1. 需要全局导入样式 `@q-front-npm/vue3-pc-ui/dist/es/style/index.css`
2. 使用 `unplugin-vue-components`， 引入 `@q-front-npm/shared/plugins/vue/auto-import-resolver.ts`, 进行按需引入，具体请看[docs/project-docs/docs/packages/shared/plugins.md](../shared/plugins.md)
:::

## 版本
- 本目录主要是提供公共的antd二次封装组件
- npm包名称 `@q-front-npm/vue3-antd-pc-ui`
- 当前版本: 1.1.0

## 总览