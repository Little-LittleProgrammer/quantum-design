# eslint

## 简介

npm 包名称: `@quantum-design-configs/eslint`

当前版本: 2.0.3

基于 ESLint Flat Config 的一体化配置，内置：Vue、TypeScript、JavaScript、JSON/JSONC、Node、JSDoc、Vitest、Regexp、Turbo，并在最后附加 `eslint-plugin-oxlint` 推荐规则，开箱即用。

## 使用

创建 `eslint.config.mjs`：

```js
import { defineEslintConfig } from '@quantum-design-configs/eslint';

export default await defineEslintConfig();
// 或自定义扩展：
// export default await defineEslintConfig([
//   { rules: { 'no-console': 'off' } },
// ]);
```

在 Monorepo 中建议仅在仓库根部维护一个 `eslint.config.mjs`，子包无需额外配置。

## 依赖

请按需安装本包的 peerDependencies（见本包 `package.json` 的 `peerDependencies`）。示例命令：

```sh
pnpm add -D eslint @eslint/js @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-vue vue-eslint-parser eslint-plugin-prettier eslint-plugin-unused-imports eslint-plugin-jsonc jsonc-eslint-parser eslint-plugin-n eslint-plugin-vitest eslint-plugin-no-only-tests eslint-plugin-regexp eslint-plugin-jsdoc eslint-config-turbo globals eslint-plugin-oxlint
```

## 从旧版迁移

- 删除 `.eslintrc.*` 配置文件，改用根目录 `eslint.config.mjs`。
- 原先 `extends: @quantum-design-configs/eslint/eslint-vue` 等写法已废弃。
