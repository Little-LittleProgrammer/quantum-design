# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

**quantum-design** 是一个企业级前端开发基础设施项目，提供从 0-1 所需的完整工具链：CLI 脚本、构建配置、文档、组件库、样式库、类型库、工具库等，帮助快速搭建完整的工程。

当前分支：`feature/3.0.0`（进行中）

**环境要求**：

- Node.js: >= 22.19.0（推荐 22.19.0）
- pnpm: >= 10.0.0（推荐 10.15.1）
- 包管理器已在根 `package.json` 中配置 `packageManager: pnpm@10.15.1`，并使用 Volta 管理版本

## 常用命令

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
pnpm test:unit        # 单次运行测试
pnpm test:coverage    # 带覆盖率的测试

# 代码检查与格式化
pnpm lint             # 运行 oxlint（唯一 linter，已移除 eslint）
pnpm lint:fix         # oxlint 自动修复
pnpm format           # Prettier 批量格式化 ts/tsx/md

# 规范提交（使用 czg 交互式提交）
pnpm commit

# Tauri 应用开发
pnpm tauri            # 构建 Tauri
pnpm tauri:dev        # 开发模式
pnpm tauri:build      # 构建生产版本

# 其他工具
pnpm migrator         # Sass 模块化迁移辅助工具
```

**注意**：

- 首次安装后如果看到 `postinstall` 触发 `turbo run stub`，属于生成占位构建的正常行为
- 测试命令是 `pnpm test:unit` 而不是 `pnpm test`

## Monorepo 架构

使用 **Turbo** 进行单仓库多包管理，采用 **pnpm workspaces** 管理依赖。

### 工作区结构

- **apps/** - 应用示例和演示
    - `playground`: 组件与功能演示的 Vite 应用
    - `yapi-to-typescript`: 浏览器插件（CRX），将 YApi 接口转换为 TypeScript 类型

- **cli/** - CLI 工具集合
    - `create-app`: 项目脚手架（支持 monorepo、nuxt3、vue3-antd-vite、vitepress-docs 等模板）
    - `product-analysis`: 需求/产品分析辅助 CLI
    - `workflow-cloud`: 工作流云端工具与客户端封装

- **configs/** - 统一配置包（作为独立包复用）
    - `oxlint`: 统一 oxlint 配置（导出 `defineOxlintConfig`）
    - `prettier`: 统一 Prettier 配置
    - `tsconfig`: TypeScript 配置
    - `vite`: Vite 插件与构建封装（当前 peer 依赖为 Vite ^7）
    - `rolldown`: Rolldown 构建配置
    - `commitlint`: Commitlint 配置
    - `sentry`: Sentry 集成配置
    - `tailwind`: Tailwind CSS 配置

- **packages/** - 基础库（内部共享包）
    - `utils`: 通用工具方法
    - `shared`: 共享常量/枚举等
    - `types`: 公共类型定义
    - `http`: HTTP 封装（基于 Axios）
    - `hooks`: 通用 Hooks（包含 Vue 相关）
    - `styles`: 样式库（AntD/Element/base）
    - `polyfill`: Polyfill 与工具补丁
    - `ai-hub`: AI 相关封装
    - `vue3-antd-pc-ui`: 基于 Ant Design Vue 的 PC 组件库（v3.0.0）
    - `vue3-pc-ui`: 通用 PC 组件库（不强绑 AntD）
    - `vue3-antd-pc-ui-nuxt`、`vue3-pc-ui-nuxt`: 对应 Nuxt 集成包

- **docs/** - 文档
    - `project-docs`: 文档工程（VitePress）

### Turbo 配置要点

- `build`: 依赖 `^build`，输出到 `dist/**` 和 `.next/**`
- `build:lib`: 依赖 `^build`，输出到 `dist/**`、`dist-components/**`、`.next/**`
- `dev`: 不缓存，持久化运行，依赖 `^build`
- `test`: 依赖 `^build`
- `test:coverage`: 依赖 `^build`，输出到 `coverage/**`

## 技术栈

- **构建工具**: Vite 8.x、Rolldown 1.x
- **包管理**: pnpm 10.x + workspaces
- **Monorepo**: Turbo 2.x
- **语言**: TypeScript（严格模式）
- **测试**: Vitest + @vitest/ui + happy-dom/jsdom
- **代码质量**: oxlint 1.x（唯一 linter）、Prettier 3.x
- **Git 工作流**: Husky + lint-staged + commitlint + czg
- **版本管理**: @changesets/cli
- **样式**: Sass、Tailwind CSS、CSS Variables
- **UI 框架**: Vue 3.5+、Nuxt 4.x、Ant Design Vue 4.x
- **桌面应用**: Tauri 2.x

## 开发规范

### 1. 提交规范

- 统一使用 `pnpm commit` 调用 `czg` 进行规范化提交
- 遵守 Conventional Commits 规范（feat、fix、docs、chore 等）
- 通过 `@changesets/cli` 管理版本和变更日志

### 2. 代码质量

- 统一 Lint：仓库提供 `@quantum-design-configs/oxlint`，根目录 `oxlint.config.ts` 统一继承
- 统一构建：库包优先使用 `configs/rolldown` 与 `configs/vite` 的封装
- Lint 流程：仅运行 `oxlint`（`pnpm lint` / `pnpm lint:fix`），ESLint 已完全移除
- 代码格式化统一交给 Prettier，lint 侧不声明格式化规则

### 3. 包发布

- 使用 `pnpm-workspace.yaml` 中的 `catalog` 统一管理依赖版本
- 组件库支持多种导出方式（ESM、CJS、tree-shaking）
- Nuxt 集成包不在 workspaces 根级别暴露（`- "!**/*-ui-nuxt/**"`）

## 升级指南

### 3.0.0（进行中）

- ✅ Vite 升级到 v7，更新 `configs/vite` 的 peer 依赖
- ✅ 移除 ESLint，全量迁移到 oxlint（新增 `configs/oxlint`，删除 `configs/eslint`）
- ✅ 支持 Tailwind CSS
- ✅ 重构项目偏好设置，支持 CSS Variables 模式、多主题、系统主题
- ✅ 增加主题切换动画，优化视觉体验
- ✅ 样式库重构，替换 SCSS 变量为 CSS 变量
- 🔄 样式体系切换到 Tailwind（与现有 SCSS 共存/迁移策略）
- 🔄 Nuxt 升级到 Nuxt 4，验证 `*-nuxt` 集成包兼容性

### 4.0.0（规划）

- 🔜 升级 Vue 3.6
- 🔜 表格组件从 AntD Table 迁移到 `vxe-table`
- 🔜 AntD 替换为 `shadcn-vue`（或提供可插拔主题方案）

## AI/自动化开发

项目已集成 CloudBase AI 开发规则（`.github/copilot-instructions.md`），包含：

- 场景化开发指导（Web 项目、小程序、数据库、UI 设计）
- 标准开发工作流程（需求确认 → 技术方案 → 任务拆分 → 执行）
- MCP 工具集成（`.cursor/mcp.json` 配置 cloudbase-mcp）
- 专业规则文件映射（web-development、cloudbase-platform、database 等）

## 外部资源

- **文档站点**: https://little-littleprogrammer.github.io/quantum-design/docs/
- **Playground**: https://little-littleprogrammer.github.io/quantum-design/playground/
