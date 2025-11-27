# @quantum-design/types

## 3.0.0

### Major Changes

- 5a85942: - [x] Vite 升级到 v7，并同步更新 `configs/vite` 的 peer 依赖与适配。
    - [x] 重构 ESLint 配置（`configs/eslint`），统一各工作区规则与插件版本。
        - 新增 prettier 配置
        - 支持 oxlint
    - [x] 支持 tarui
    - [x] 重构 项目偏好设置，支持 css variables 模式，多主题，支持系统主题获取
    - [x] 增加主题切换动画，视觉上降低卡顿效果
    - [x] 样式库重构，替换了 SCSS 变量为 CSS 变量
    - [x] 支持 tailwind

## 3.0.0-beta.0

### Major Changes

-   - [x] Vite 升级到 v7，并同步更新 `configs/vite` 的 peer 依赖与适配。
    - [x] 重构 ESLint 配置（`configs/eslint`），统一各工作区规则与插件版本。
        - 新增 prettier 配置
        - 支持 oxlint
    - [x] 支持 tarui
    - [x] 重构 项目偏好设置，支持 css variables 模式，多主题，支持系统主题获取
    - [x] 增加主题切换动画，视觉上降低卡顿效果
    - [x] 样式库重构，替换了 SCSS 变量为 CSS 变量

## 2.0.3

### Patch Changes

- 371bf90: 修复 utils 缺陷
- 371bf90: 常规更新

## 2.0.3-beta.1

### Patch Changes

- 修复 utils 缺陷

## 2.0.3-beta.0

### Patch Changes

- 常规更新

## 2.0.2

### Patch Changes

- bbbb2e3: 修复缺陷
- 6e01eb6: 更新所有依赖 vite@6

## 2.0.2-beta.0

### Patch Changes

- bbbb2e3: 修复缺陷
- 更新所有依赖 vite@6

## 2.0.0

### Patch Changes

- 适配依赖

## 2.0.0-beta.0

### Major Changes

- 更新适配依赖
    - vite@5.x
    - vue@3.4.x
    - nuxt@3.12.x
    - rollup@4.x ....

## 1.1.0

### Minor Changes

- 代码重构

## 1.0.1

### Patch Changes

-   1. @quantum-design/vue3-antd-pc-ui 增加 q-table 组件
    2. 更改打包方式

## 1.0.0

### Major Changes

- first major version
    1. `@quantum-design-configs/eslint@1.0.0` `eslint`配置
    2. `@quantum-design-configs/rollup@1.0.0` `rollup`公共打包方法
    3. `@quantum-design-configs/tsconfig@1.0.0` `tsconfig`公共配置
    4. `@quantum-design-configs/vite@1.0.0` `vite` 插件以及公共打包方法

    5. `@quantum-design/hooks@1.0.0` 公共 `hooks` 方法
    6. `@quantum-design/http@1.0.0` `http` 通讯 方法封装
    7. `@quantum-design/shared@1.0.0` `样式、插件、enums` 公共
    8. `@quantum-design/types@1.0.0` 公共 `types`
    9. `@quantum-design/utils@1.0.0` 公共 `utils` 方法
    10. `@quantum-design/vue3-antd-pc-ui@1.0.0` 公共 `vue3 antd` 二次封装组件
    11. `@quantum-design/vue3-antd-pc-ui-nuxt@1.0.0` 公共 `vue3 antd` 二次封装组件 `nuxt` 模块
    12. `@quantum-design/vue3-pc-ui@1.0.0` 公共 `vue3` 原生组件
    13. `@quantum-design/vue3-pc-ui-nuxt@1.0.0` 公共 `vue3` 原生组件 `nuxt` 模块
