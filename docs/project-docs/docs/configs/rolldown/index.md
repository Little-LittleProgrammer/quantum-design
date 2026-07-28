# Rolldown

npm 包名称：`@quantum-design-configs/rolldown`

该包提供 Quantum Design 统一的 Rolldown 库构建配置，支持多入口、ESM/CJS/IIFE、声明生成、依赖外置和稳定的产物命名。

```js
// rolldown.config.mjs
import { defineRolldownLibraryConfig } from '@quantum-design-configs/rolldown';

export default defineRolldownLibraryConfig({
    entries: { name: 'http', input: './index.ts', dtsName: 'index' },
    formats: ['esm', 'cjs'],
    external: ['axios'],
    dts: { tsconfig: './tsconfig.build.json' },
});
```

构建配置使用 ESM，并由 `rolldown -c` 默认加载 `rolldown.config.mjs`。

## API

`defineRolldownLibraryConfig(options)` 返回 Rolldown 配置数组。`entries` 描述运行时与声明入口，`formats` 控制输出格式，其他底层能力可通过 Rolldown 配置字段覆盖。

完整参数请参考 [Rolldown 配置文档](https://rolldown.rs/reference/config-options)。
