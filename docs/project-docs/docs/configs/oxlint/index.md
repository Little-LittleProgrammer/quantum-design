# oxlint

## 简介

npm 包名称: `@quantum-design-configs/oxlint`

当前版本: 3.0.0

基于 [oxlint](https://oxc.rs/docs/guide/usage/linter.html) 的一体化配置，内置 `eslint`、`typescript`、`vue`、`node`、`jsdoc`、`vitest` 插件，开箱即用。

自 3.0.0 起本仓库已完全移除 ESLint，`oxlint` 是唯一的 linter，代码格式化统一由 Prettier 负责。

## 使用

创建 `oxlint.config.ts`：

```ts
import { defineOxlintConfig } from '@quantum-design-configs/oxlint';

export default defineOxlintConfig();
// 或自定义扩展：
// export default defineOxlintConfig({
//   rules: { 'no-console': 'off' },
// });
```

`plugins`、`rules`、`overrides`、`ignorePatterns` 会与内置配置合并，其余字段直接覆盖。

在 Monorepo 中建议仅在仓库根部维护一个 `oxlint.config.ts`，子包无需额外配置。

## 依赖

只需安装 `oxlint` 一个 peerDependency：

```sh
pnpm add -D oxlint
```

## 严重级别说明

规则统一声明为 `warn`，沿用 oxlint 默认的 `correctness: warn`，因此 `pnpm lint` 不会因存量告警而失败。

迁移前的 `oxlint && eslint` 流程中，两者重叠的规则已由 `eslint-plugin-oxlint` 在 ESLint 侧关闭，实际并未强制生效。本包保持同样的行为，避免迁移引入大量阻塞性报错。后续如需收紧，可单独调整分类或规则级别。

## 注意事项

`overrides[].files` 的 glob **不支持** ESLint 的 extglob 语法（`?(...)`），需改用大括号展开：

```ts
// 无效，静默匹配不到任何文件
files: ['**/*.test.?([cm])[jt]s?(x)'];

// 正确
files: ['**/*.test.{js,cjs,mjs,ts,cts,mts,tsx}'];
```

## 从 ESLint 迁移

- 删除 `eslint.config.mjs`，改用 `oxlint.config.ts`。
- `pnpm lint` 由 `pnpm dlx oxlint && eslint` 改为 `oxlint`，新增 `pnpm lint:fix`。
- VS Code 保存自动修复由 `source.fixAll.eslint` 改为 `source.fixAll.oxc`，需安装 `oxc.oxc-vscode` 扩展。

以下能力在 oxlint 中没有等价实现，已随迁移移除：

| 分类       | 移除内容                                                                                                           |
| ---------- | ------------------------------------------------------------------------------------------------------------------ |
| 插件       | `jsonc`（package.json / tsconfig.json 键排序）、`regexp`、`turbo`、`prettier`、`unused-imports`                    |
| Vue        | oxlint 仅检查 `.vue` 的 `<script>` 块，模板类规则（`component-name-in-template-casing`、`block-order` 等）不再生效 |
| Node       | `n/no-deprecated-api`、`n/no-extraneous-import`、`n/no-unsupported-features/es-syntax`、`n/prefer-global/*`        |
| JSDoc      | `check-param-names`、`check-types`、`no-multi-asterisks`、`require-returns-check`、`require-yields-check`          |
| TypeScript | 依赖类型信息的规则未开启，需要时可开启 oxlint 的 type-aware 模式（额外安装 `oxlint-tsgolint`）                     |
