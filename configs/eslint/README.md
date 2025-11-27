# @quantum-design-configs/eslint

目的: 统一所有代码的 ESLint 规范（Flat Config）

## 使用

在项目根目录新增 `eslint.config.mjs`：

```js
import { defineEslintConfig } from '@quantum-design-configs/eslint';

export default await defineEslintConfig();
// 或添加自定义规则：
// export default await defineEslintConfig([{ rules: { 'no-console': 'off' } }]);
```

内置规则集包含：Vue、TypeScript、JavaScript、JSON/JSONC、Node、JSDoc、Vitest、Regexp、Turbo，并追加 `eslint-plugin-oxlint` 推荐规则。

请按需安装本包的 `peerDependencies`。
