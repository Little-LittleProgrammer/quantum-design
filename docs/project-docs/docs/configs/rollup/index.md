# rollup

## 简介

npm 包名称: `@quantum-design/rollup`

当前版本: 2.0.3

提供了公共的 rollup 配置, 包括

1. `rollup-lib.config.js`, 对应基础 rollup 配置

## 使用

```js
// rollup.config.mjs
import { rollup_commpn_lib_config } from '@quantum-design-configs/rollup';

const result = rollup_commpn_lib_config('http', {
    external: ['@quantum-design/hooks', '@quantum-design/hooks/vue', '@quantum-design/shared', '@quantum-design/shared/enums', '@quantum-design/utils', 'axios', 'lodash-es', 'qs'],
});

export default [...Object.values(result)];
```

::: danger 注意

因为这个包为 esm 规范, 所以项目引用时, rollup 必须命名成`rollup.config.mjs`
:::

## API

```ts
rollup_commpn_lib_config(name: string, rollupOptions:RollupOptions, version?: string) => {esmPackageMin, cjsPackageMin}
```

RollupOptions 具体参数请查看[rollup 配置](https://cn.rollupjs.org/configuration-options/)
