---
'@quantum-design-configs/oxlint': major
---

移除 ESLint，全量迁移到 oxlint。

新增 `@quantum-design-configs/oxlint`（导出 `defineOxlintConfig`），删除 `@quantum-design-configs/eslint`。仓库根配置由 `eslint.config.mjs` 改为 `oxlint.config.ts`，`pnpm lint` 仅运行 `oxlint`，代码格式化统一由 Prettier 负责。

## 破坏性变更

- `eslint.config.mjs` 需替换为 `oxlint.config.ts`，`defineEslintConfig` 替换为 `defineOxlintConfig`。
- `overrides[].files` 的 glob **不支持** ESLint 的 extglob 语法（`?(...)`），需改用大括号展开，例如 `**/__tests__/**/*.test.{js,ts,tsx,mts,cts}`。
- 行内注释 `eslint-disable-*` 建议改为 `oxlint-disable-*`（oxlint 默认仍兼容前者）。

## 不再覆盖的能力

oxlint 中没有等价实现，已移除：

- 插件级：`jsonc`（package.json / tsconfig.json 键排序）、`regexp`、`turbo`、`prettier`、`unused-imports`
- Vue：oxlint 仅检查 `.vue` 的 `<script>` 块，模板类规则（`component-name-in-template-casing`、`block-order`、`no-unused-refs`、`no-restricted-v-bind`、`prefer-separate-static-class` 等）不再生效
- Node：`n/no-deprecated-api`、`n/no-extraneous-import`、`n/no-unsupported-features/es-syntax`、`n/prefer-global/*`、`n/process-exit-as-throw`
- JSDoc：`check-param-names`、`check-types`、`no-multi-asterisks`、`require-returns-check`、`require-yields-check`
- TypeScript：依赖类型信息的规则未开启，需要时可开启 oxlint 的 type-aware 模式（额外安装 `oxlint-tsgolint`）

## 规则级别

严重级别沿用 oxlint 默认的 `correctness: warn`。迁移前的 `oxlint && eslint` 流程中，两者重叠的规则已由 `eslint-plugin-oxlint` 在 ESLint 侧关闭，因此实际并未强制生效；本包保持一致，避免迁移引入阻塞性报错。后续如需收紧可单独调整。
