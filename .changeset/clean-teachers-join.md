---
"@q-front-npm/vue3-antd-pc-ui": minor
"@q-front-npm/vue3-pc-ui": minor
---

破坏性升级
1. vite升级至 4.x 版本
2. vue 升级至 3.3.x 版本
3. `@q-front-npm/VUE-antd-pc-ui` 更改前缀为 `QAntd`
4. 取消样式自动注入功能(为了适配 nuxt3)
5. 按需导入请看 packages/shared/plugins/vue/auto-import-resolver.ts
