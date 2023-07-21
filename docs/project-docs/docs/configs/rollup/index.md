# rollup

## 简介
npm包名称: `@wuefront/rollup`

当前版本: 1.0.0


提供了公共的rollup配置, 包括
1. `rollup-lib.config.js`, 对应基础rollup配置

## 使用

```js
// rollup.config.mjs
import { rollup_commpn_lib_config } from '@wuefrontnfigs/rollup';

const result = rollup_commpn_lib_config('http', {
    external: ['@wuefrontoks', '@wu@wuefront/vue', '@wuefr@wuefront '@wuefront@wuefronts', '@wuefront/ut@wuefront', 'lodash-es', 'qs']
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