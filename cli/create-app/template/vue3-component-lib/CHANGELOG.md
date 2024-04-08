# @quantum-design/vue3-pc-ui

## 1.1.4

### Patch Changes

- rollup tree shake 优化
- Updated dependencies
  - @quantum-design/shared@1.1.4
  - @quantum-design/utils@1.1.4

## 1.1.3

### Patch Changes

- 65546d4: FEATURE:

  1. @quantum-design/vue3-antd-pc-ui@1.1.2 增加 全场景组件

  FIXED

  1. 修复组件打包时，部分组件的声明文件未生成的缺陷
  2. 更改打包方式，使 unplugin-components 和 nuxt 模块 正确识别样式并引用

- Updated dependencies
- Updated dependencies [5633fbe]
- Updated dependencies [65546d4]
- Updated dependencies
  - @quantum-design/utils@1.1.3
  - @quantum-design/shared@1.1.3

## 1.1.3-beta.2

### Patch Changes

- Updated dependencies
  - @quantum-design/utils@1.1.3-beta.2

## 1.1.3-beta.1

### Patch Changes

- Updated dependencies [5633fbe]
  - @quantum-design/utils@1.1.3-beta.1

## 1.1.3-beta.0

### Patch Changes

- FEATURE:

  1. @quantum-design/vue3-antd-pc-ui@1.1.2 增加 全场景组件

  FIXED

  1. 修复组件打包时，部分组件的声明文件未生成的缺陷
  2. 更改打包方式，使 unplugin-components 和 nuxt 模块 正确识别样式并引用

- Updated dependencies
  - @quantum-design/shared@1.1.3-beta.0
  - @quantum-design/utils@1.1.3-beta.0

## 1.1.2

### Patch Changes

- 修复小缺陷 q-drawer 样式问题, loading 样式问题
- Updated dependencies
  - @quantum-design/shared@1.1.2
  - @quantum-design/utils@1.1.2

## 1.1.2-beta.0

### Patch Changes

- 修复小缺陷 q-drawer 样式问题, loading 样式问题
- Updated dependencies
  - @quantum-design/shared@1.1.2-beta.0
  - @quantum-design/utils@1.1.2-beta.0

## 1.1.1

### Patch Changes

- 更改组件内的第三方组件为组件库导入
- 更改组件内的第三方组件为组件库导入
- Updated dependencies
- Updated dependencies
  - @quantum-design/shared@1.1.1
  - @quantum-design/utils@1.1.1

## 1.1.1-beta.0

### Patch Changes

- 更改组件内的第三方组件为组件库导入
- Updated dependencies
  - @quantum-design/shared@1.1.1-beta.0
  - @quantum-design/utils@1.1.1-beta.0

## 1.1.0

### Minor Changes

- a29f38f: 破坏性升级
  1. vite 升级至 4.x 版本
  2. vue 升级至 3.3.x 版本
  3. `@quantum-design/VUE-antd-pc-ui` 更改前缀为 `QAntd`
  4. 取消样式自动注入功能(为了适配 nuxt3)
  5. 按需导入请看 packages/shared/plugins/vue/auto-import-resolver.ts
- 1. `vue3-pc-ui` and `vue3-antd-pc-ui`默认去除样式导入，为了适配 ssr
  2. 增加`vue3-pc-ui-nuxt` and `vue3-antd-pc-ui-nuxt` 的 nuxt 模块，使自有组件库也支持直接由服务端渲染下发
  3. 由于去除了`vue3-pc-ui` and `vue3-antd-pc-ui`的默认样式导入，因此增加`@quantum-design/shared/vue/auto-import-resolver`插件 用来按需导入组件和样式，具体参考 `element-plus`
  4. 主要依赖全部升级`vite3.2.5` `vue@3.2.47` `rollup@2.79.1` `vitepress@1.0.0-alphe30` 升级到`vite4.4.5` `vue@3.3.4` `rollup@3.28.1` `vitepress@1.0.0-rc.10` 破坏性升级
  5. 由于功能 4，以及为了更加规范化，打包脚本全部重写

### Patch Changes

- 2fbbfc7: 规范依赖 dependencies devDependencies peerDependencies 限制
- de042b9: 更改打包结构, 适配 nuxt
- Updated dependencies [a29f38f]
- Updated dependencies
- Updated dependencies [a29f38f]
- Updated dependencies [2fbbfc7]
  - @quantum-design/utils@1.1.0
  - @quantum-design/shared@1.1.0

## 1.1.0-beta.3

### Patch Changes

- 更改打包结构, 适配 nuxt

## 1.1.0-beta.2

### Patch Changes

- Updated dependencies
  - @quantum-design/utils@1.1.0-beta.2

## 1.1.0-beta.1

### Minor Changes

- 破坏性升级
  1. vite 升级至 4.x 版本
  2. vue 升级至 3.3.x 版本
  3. `@quantum-design/VUE-antd-pc-ui` 更改前缀为 `QAntd`
  4. 取消样式自动注入功能(为了适配 nuxt3)
  5. 按需导入请看 packages/shared/plugins/vue/auto-import-resolver.ts

### Patch Changes

- Updated dependencies
  - @quantum-design/shared@1.1.0-beta.1
  - @quantum-design/utils@1.0.10-beta.1

## 1.0.13-beta.0

### Patch Changes

- 规范依赖 dependencies devDependencies peerDependencies 限制
- Updated dependencies
  - @quantum-design/shared@1.0.4-beta.0
  - @quantum-design/utils@1.0.10-beta.0

## 1.0.12

### Patch Changes

- Updated dependencies
  - @quantum-design/utils@1.0.7

## 1.0.11

### Patch Changes

- Updated dependencies [da4f8ad]
- Updated dependencies [2437ce5]
- Updated dependencies [b5b11c7]
- Updated dependencies [d2b1dc5]
  - @quantum-design/shared@1.0.3
  - @quantum-design/utils@1.0.5

## 1.0.10

### Patch Changes

- 增加前置依赖
- Updated dependencies
  - @quantum-design/utils@1.0.4

## 1.0.9

### Patch Changes

- Updated dependencies
  - @quantum-design-configs/vite@1.0.8

## 1.0.8

### Patch Changes

- 修复缺陷
- Updated dependencies
  - @quantum-design/shared@1.0.2
  - @quantum-design/utils@1.0.3
  - @quantum-design-configs/vite@1.0.7

## 1.0.7

### Patch Changes

- Updated dependencies
  - @quantum-design-configs/vite@1.0.6

## 1.0.6

### Patch Changes

- Updated dependencies
  - @quantum-design-configs/vite@1.0.5

## 1.0.5

### Patch Changes

- Updated dependencies
  - @quantum-design-configs/vite@1.0.4

## 1.0.4

### Patch Changes

- Updated dependencies
- Updated dependencies
  - @quantum-design/utils@1.0.2
  - @quantum-design-configs/vite@1.0.3

## 1.0.3

### Patch Changes

- Updated dependencies
  - @quantum-design/shared@1.0.1
  - @quantum-design/utils@1.0.1

## 1.0.2

### Patch Changes

- Updated dependencies
  - @quantum-design-configs/vite@1.0.2

## 1.0.1

### Patch Changes

- Updated dependencies
  - @quantum-design-configs/vite@1.0.1

## 1.0.0

### Major Changes

- b768af8: 正式版发布

### Patch Changes

- Updated dependencies [b768af8]
  - @quantum-design/utils@1.0.0
  - @quantum-design-configs/vite@1.0.0
  - @quantum-design/shared@1.0.0

## 1.0.0-rc.0

### Major Changes

- 正式版发布， 进入 rc 测试

### Patch Changes

- Updated dependencies
  - @quantum-design/utils@1.0.0-rc.0
  - @quantum-design-configs/vite@1.0.0-rc.0
  - @quantum-design/shared@1.0.0-rc.0

## 0.1.0

### Minor Changes

- 初始化 vue3 pc 端公共组件库

### Patch Changes

- Updated dependencies
- Updated dependencies
- Updated dependencies
  - @quantum-design/shared@0.1.0
  - @quantum-design-configs/vite@0.1.0
  - @quantum-design/utils@0.1.0

## 0.1.0-beta.0

### Minor Changes

- 初始化 vue3 pc 端公共组件库

### Patch Changes

- Updated dependencies
- Updated dependencies
- Updated dependencies
  - @quantum-design/shared@0.1.0-beta.0
  - @quantum-design-configs/vite@0.1.0-beta.0
  - @quantum-design/utils@0.1.0-beta.0
