# @quantum-design-configs/oxlint

目的: 统一所有代码的 oxlint 规范

## 使用

在项目根目录新增 `oxlint.config.ts`：

```ts
import { defineOxlintConfig } from '@quantum-design-configs/oxlint';

export default defineOxlintConfig();
// 或添加自定义规则：
// export default defineOxlintConfig({ rules: { 'no-console': 'off' } });
```

`plugins`、`rules`、`overrides`、`ignorePatterns` 会与内置配置合并，其余字段直接覆盖。

内置插件：`eslint`、`typescript`、`vue`、`node`、`jsdoc`、`vitest`。

严重级别沿用 oxlint 默认的 `correctness: warn`，`pnpm lint` 不会因存量告警失败。迁移前的 `oxlint && eslint` 流程中，重叠规则已被 `eslint-plugin-oxlint` 关闭，因此这些规则实际未强制生效；本包保持一致，规则统一声明为 `warn`。需要收紧时再单独调整。

> 注意：`overrides[].files` 的 glob 不支持 ESLint 的 extglob 语法（`?(...)`），需改用大括号展开，例如 `**/__tests__/**/*.test.{js,ts,tsx,mts,cts}`。

## 相较 ESLint 配置的差异

本包由 `@quantum-design-configs/eslint` 迁移而来，以下能力在 oxlint 中没有等价实现，已移除：

- 插件级：`jsonc`（package.json / tsconfig.json 键排序）、`regexp`、`turbo`、`prettier`、`unused-imports`
- Vue：oxlint 仅检查 `.vue` 的 `<script>` 块，模板类规则（`component-name-in-template-casing`、`block-order`、`no-unused-refs`、`no-restricted-v-bind` 等）不再生效
- Node：`n/no-deprecated-api`、`n/no-extraneous-import`、`n/no-unsupported-features/es-syntax`、`n/prefer-global/*`、`n/process-exit-as-throw`
- JSDoc：`check-param-names`、`check-types`、`no-multi-asterisks`、`require-returns-check`、`require-yields-check`
- TypeScript：依赖类型信息的规则未开启，需要时可开启 oxlint 的 type-aware 模式（额外安装 `oxlint-tsgolint`）

代码格式化统一交给 prettier，lint 侧不再声明任何格式化规则。
