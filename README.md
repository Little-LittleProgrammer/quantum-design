## quantum-design

> 目前仅为自用，文档与示例仍在完善中。

集成从 0-1 所需的基础设施：CLI 脚本、构建配置、文档、组件库、样式库、类型库、工具库等，帮助你快速搭建完整工程。使用者可以快速上手，并根据自身需求进行定制。

## 文档与在线示例

- 文档站点：[quantum-design 文档](https://little-littleprogrammer.github.io/quantum-design/docs/)
- Playground 示例：[Playground](https://little-littleprogrammer.github.io/quantum-design/playground/)

## 环境要求

- Node: >= 20.19.0（推荐使用 Volta 固定到 `20.19.4`）
- pnpm: >= 10.0.0（推荐 `10.13.1`）
- 包管理器已在根 `package.json` 配置 `packageManager: pnpm@10.13.1`，并在 `volta` 指定了 Node 与 pnpm 版本，建议按此安装。

## 快速开始

```bash
# 安装依赖（首次或依赖变更后）
pnpm i

# 本地开发（使用 Turbo 启动各工作区应用/包的 dev）
pnpm dev

# 全量构建（所有包或按依赖拓扑构建）
pnpm build

# 仅构建库型包（按各包内的 build:lib 脚本）
pnpm build:lib

# 运行测试 / 覆盖率
pnpm test
pnpm test:coverage

# 代码检查与格式化
pnpm lint
pnpm format

# 规范提交（使用 czg）
pnpm commit
```

常见问题：

- 首次安装后如果看到 `postinstall` 触发 `turbo run stub`，属于生成占位构建的正常行为。
- 如果你使用了 Volta，请确认 `volta` 中的 Node 与 pnpm 版本均已安装。

## 工作区结构

- **应用 Apps**
    - `apps/playground`: 组件与功能演示的 Vite 应用。
    - `apps/yapi-to-typescript`: 浏览器插件（CRX），将 YApi 接口转换为 TypeScript 类型。

- **CLI 工具**
    - `cli/create-app`: 项目脚手架与模板（`monorepo`、`nuxt3`、`vue3-antd-vite`、`vitepress-docs` 等）。
    - `cli/product-analysis`: 需求/产品分析辅助 CLI。
    - `cli/workflow-cloud`: 工作流云端工具与客户端封装。

- **统一配置 Configs**（作为独立包复用）
    - `configs/eslint`: 统一 ESLint 配置。
    - `configs/prettier`: 统一 Prettier 配置。
    - `configs/tsconfig`: TypeScript 配置。
    - `configs/vite`: Vite 插件与构建封装（当前 peer 依赖为 Vite ^6）。
    - `configs/rollup`: Rollup 构建配置。
    - `configs/commitlint`: Commitlint 配置。
    - `configs/sentry`: Sentry 集成配置。

- **基础库 Packages**
    - `packages/utils`: 通用工具方法。
    - `packages/shared`: 共享常量/枚举等。
    - `packages/types`: 公共类型定义。
    - `packages/http`: HTTP 封装（Axios 等）。
    - `packages/hooks`: 通用 Hooks（含 Vue 相关）。
    - `packages/styles`: 样式库（AntD/Element/base）。
    - `packages/polyfill`: Polyfill 与工具补丁。
    - `packages/ai-hub`: AI 相关封装。
    - `packages/vue3-antd-pc-ui`: 基于 Ant Design Vue 的 PC 组件库。
    - `packages/vue3-pc-ui`: 通用 PC 组件库（不强绑 AntD）。
    - `packages/vue3-antd-pc-ui-nuxt`、`packages/vue3-pc-ui-nuxt`: 对应 Nuxt 集成。

- **文档**
    - `docs/project-docs`: 文档工程（VitePress）。

## 根脚本（package.json）

- `dev`: 使用 Turbo 在工作区内并行运行开发脚本。
- `build`: 使用 Turbo 进行全量构建。
- `build:lib`: 库包构建（依各包 `build:lib`）。
- `test` / `test:coverage`: 使用 Vitest（含 UI/覆盖率）。
- `lint`: 先运行 `oxlint` 再运行 `eslint`。
- `format`: Prettier 批量格式化 `ts/tsx/md`。
- `commit`: 使用 `czg` 进行规范化提交。
- `prepare`: Husky 钩子安装。
- `migrator`: `sass-migrator` 辅助 Sass 模块化迁移。
- `postinstall`: `turbo run stub`（生成占位构建）。

## 开发规范

- 统一提交规范：使用 `pnpm commit` 调用 `czg`，遵守 Conventional Commits。
- 统一 Lint：仓库提供 `@quantum-design-configs/eslint`，请在包内按需继承。
- 统一构建：库包优先使用 `configs/rollup` 与 `configs/vite` 的封装。

## 升级指南

> 当前分支：`feature/3.0.0`（进行中）

### 3.0.0（进行中）

- [x] Vite 升级到 v7，并同步更新 `configs/vite` 的 peer 依赖与适配。
- [x] 重构 ESLint 配置（`configs/eslint`），统一各工作区规则与插件版本。
- [ ] Nuxt 升级到 Nuxt 4，并验证 `*-nuxt` 集成包的兼容性。
- [x] 支持 tarui
- [x] 重构 项目偏好设置，支持 css variables 模式， 多主题
- [ ] 样式库重构，改成 css variables 模式， [TODO] antd design tokens 模式

### 4.0.0（规划）

- [ ] 升级 Vue 3.6。
- [ ] 表格组件从 AntD Table 迁移到 `vxe-table`。
- [ ] AntD 替换为 `shadcn-vue`（或提供可插拔主题方案）。
- [ ] 样式体系切换到 Tailwind（与现有 SCSS 共存/迁移策略）。
