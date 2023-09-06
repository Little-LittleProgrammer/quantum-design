# rollup

## 简介
npm包名称: `@q-front-npm/rollup`

当前版本: 1.1.0

:::danger 提示
重要重要重要
- `1.1.0` 版本进行破坏性升级，`vue3.2.x`｜`vite3.2.5`｜`rollup2`用户请使用 `1.0.x`版本
:::

提供了公共的rollup配置, 包括
1. `rollup-lib.config.js`, 对应基础rollup配置

## 使用

```js
// rollup.config.mjs
import { rollup_commpn_lib_config } from '@q-front-npm-configs/rollup';

const result = rollup_commpn_lib_config('http', {
    external: ['@q-front-npm/hooks', '@q-front-npm/hooks/vue', '@q-front-npm/shared', '@q-front-npm/shared/enums', '@q-front-npm/utils', 'axios', 'lodash-es', 'qs']
});

export default [...Object.values(result)];

```

::: danger 注意

因为这个包为esm 规范, 所以项目引用时, rollup必须命名成`rollup.config.mjs`
:::

## API

```ts
rollup_commpn_lib_config(name: string, rollupOptions:RollupOptions, version?: string) => {esmPackageMin, cjsPackageMin}
```
RollupOptions 具体参数请查看[rollup配置](https://cn.rollupjs.org/configuration-options/)