# @quantum-design/shared

## 2.1.0-beta.1

### Patch Changes

-   修复构件上的缺陷

## 2.1.0-beta.0

### Minor Changes

-   升级主要依赖 vite@6, rollup@4.29, sass 等等，谨慎升级

## 2.0.1-beta.0

### Patch Changes

-   升级主要依赖 vite@6, rollup@4.29, sass 等等，谨慎升级

## 2.0.0

### Major Changes

-   576d1d7: 升级依赖

### Patch Changes

-   更新所属依赖 vite@5 rollup@4 vue@3.5 等等
-   b3ba108: 更新版本
-   576d1d7: 更新打包导出
-   576d1d7: 修复样式引入缺陷
-   b3ba108: 更改依赖

## 2.0.0-beta.4

### Patch Changes

-   更改依赖

## 2.0.0-beta.3

### Patch Changes

-   更新版本

## 2.0.0-beta.2

### Patch Changes

-   更新打包导出

## 2.0.0-beta.1

### Patch Changes

-   修复样式引入缺陷

## 2.0.0-beta.0

### Major Changes

-   升级依赖

## 1.2.4

### Patch Changes

-   b91e4c6: 增加 qresolve 枚举值

## 1.2.4-beta.0

### Patch Changes

-   增加 qresolve 枚举值

## 1.2.3

### Patch Changes

-   1e77ee6: utils 增加对象解析字符串方法；shared 增加 q-code-editor 枚举; vue3-pc-ui 新增 code-editor 动态引入，当项目不需要使用则不需下载依赖
-   41f5bac: vue3-antd-pc-ui@q-table 组件修复 summary 不生效问题

## 1.2.3-beta.1

### Patch Changes

-   更新版本

## 1.2.3-beta.0

### Patch Changes

-   utils 增加对象解析字符串方法；shared 增加 q-code-editor 枚举; vue3-pc-ui 新增 code-editor 动态引入，当项目不需要使用则不需下载依赖

## 1.2.2

### Patch Changes

-   修复 resolve 匹配缺陷

## 1.2.1

### Patch Changes

-   更新依赖
-   53120c5: 更改依赖，以及打包配置更改

## 1.2.1-beta.1

### Patch Changes

-   更新依赖

## 1.2.1-beta.0

### Patch Changes

-   更改依赖，以及打包配置更改

## 1.2.0

### Minor Changes

-   4117372: 依赖更改，以及打包更改

### Patch Changes

-   4117372: 更改依赖

## 1.2.0-beta.1

### Patch Changes

-   更改依赖

## 1.2.0-beta.0

### Minor Changes

-   依赖更改，以及打包更改

## 1.1.4

### Patch Changes

-   rollup tree shake 优化

## 1.1.3

### Patch Changes

-   65546d4: FEATURE:

    1. @quantum-design/vue3-antd-pc-ui@1.1.2 增加 全场景组件

    FIXED

    1. 修复组件打包时，部分组件的声明文件未生成的缺陷
    2. 更改打包方式，使 unplugin-components 和 nuxt 模块 正确识别样式并引用

## 1.1.3-beta.0

### Patch Changes

-   FEATURE:

    1. @quantum-design/vue3-antd-pc-ui@1.1.2 增加 全场景组件

    FIXED

    1. 修复组件打包时，部分组件的声明文件未生成的缺陷
    2. 更改打包方式，使 unplugin-components 和 nuxt 模块 正确识别样式并引用

## 1.1.2

### Patch Changes

-   修复小缺陷 q-drawer 样式问题, loading 样式问题

## 1.1.2-beta.0

### Patch Changes

-   修复小缺陷 q-drawer 样式问题, loading 样式问题

## 1.1.1

### Patch Changes

-   更改组件内的第三方组件为组件库导入
-   更改组件内的第三方组件为组件库导入

## 1.1.1-beta.0

### Patch Changes

-   更改 组件类型

## 1.1.0

### Minor Changes

-   1. `vue3-pc-ui` and `vue3-antd-pc-ui`默认去除样式导入，为了适配 ssr
    2. 增加`vue3-pc-ui-nuxt` and `vue3-antd-pc-ui-nuxt` 的 nuxt 模块，使自有组件库也支持直接由服务端渲染下发
    3. 由于去除了`vue3-pc-ui` and `vue3-antd-pc-ui`的默认样式导入，因此增加`@quantum-design/shared/vue/auto-import-resolver`插件 用来按需导入组件和样式，具体参考 `element-plus`
    4. 主要依赖全部升级`vite3.2.5` `vue@3.2.47` `rollup@2.79.1` `vitepress@1.0.0-alphe30` 升级到`vite4.4.5` `vue@3.3.4` `rollup@3.28.1` `vitepress@1.0.0-rc.10` 破坏性升级
    5. 由于功能 4，以及为了更加规范化，打包脚本全部重写
-   a29f38f: 增加 unplugin-components 的 resolve auto-import-resolver 以适配组件按需引入

### Patch Changes

-   2fbbfc7: 规范依赖 dependencies devDependencies peerDependencies 限制

## 1.1.0-beta.1

### Minor Changes

-   增加 unplugin-components 的 resolve auto-import-resolver 以适配组件按需引入

## 1.0.4-beta.0

### Patch Changes

-   规范依赖 dependencies devDependencies peerDependencies 限制

## 1.0.4

### Patch Changes

-   增加全局类名 g-前缀

## 1.0.3

### Patch Changes

-   da4f8ad: 邮箱正则校验修复
-   d2b1dc5: 邮箱正则兼容 safari

## 1.0.3-beta.1

### Patch Changes

-   邮箱正则校验修复

## 1.0.3-beta.0

### Patch Changes

-   邮箱正则兼容 safari

## 1.0.2

### Patch Changes

-   修复缺陷

## 1.0.1

### Patch Changes

-   修复部分缺陷

## 1.0.0

### Major Changes

-   b768af8: 正式版发布

## 1.0.0-rc.0

### Major Changes

-   正式版发布， 进入 rc 测试

## 0.1.0

### Minor Changes

-   初始化 shared 公共 style enums sentry

## 0.1.0-beta.0

### Minor Changes

-   初始化 shared 公共 style enums sentry
