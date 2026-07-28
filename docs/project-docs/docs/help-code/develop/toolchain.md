# 工程化工具链

Quantum Design 使用现代化的工程工具链，提供高效的开发体验和严格的代码质量保障。

## 工具链概览

### 构建工具

- **Vite**: 现代前端构建工具，提供极速的开发体验
- **Rolldown**: Rust 驱动的 JavaScript/TypeScript 打包器，用于库和 CLI 构建
- **Turbo**: Monorepo 构建加速工具，提供缓存和并行构建能力

### 代码质量工具

- **Oxlint**: 高性能 JavaScript/TypeScript Linter，仓库唯一的 lint 工具
- **Prettier**: 代码格式化工具
- **TypeScript**: 类型检查和编译
- **Vitest**: 单元测试框架

### 版本控制与发布

- **Changesets**: 多包仓库变更日志与版本管理
- **Husky**: Git hooks 工具
- **Lint-staged**: 针对暂存文件运行 lint
- **Commitlint**: Commit 消息规范检查

## 构建工具详解

### Vite

Vite 是一个现代前端构建工具，提供极速的开发体验。

**版本**: ^8.1.5

**配置文件**: `vite.config.ts`

**主要功能**:

- 极速的热模块替换 (HMR)
- 按需编译，无需打包
- 内置 TypeScript 支持
- CSS 预处理器支持
- 插件系统

**使用示例**:

```js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { viteVueConfig } from '@quantum-design-configs/vite';

export default defineConfig({
    ...viteVueConfig,
    plugins: [vue()],
});
```

### Rolldown

Rolldown 是兼容 Rollup 插件模型的 Rust 打包器，负责仓库中的库和 CLI 构建。

**版本**: 1.2.0

**配置文件**: `rolldown.config.mjs`

**主要功能**:

- Tree-shaking
- ES 模块输出
- 代码分割
- 插件系统

**使用示例**:

```js
import { defineRolldownLibraryConfig } from '@quantum-design-configs/rolldown';

export default defineRolldownLibraryConfig({
    entries: { name: 'example', input: './index.ts' },
});
```

### Turbo

Turbo 是一个高性能的构建系统，专为 Monorepo 设计。

**版本**: ^2.5.5

**配置文件**: `turbo.json`

**主要功能**:

- 增量构建
- 远程缓存
- 任务编排
- 并行执行

**使用示例**:

```json
{
    "$schema": "https://turbo.build/schema.json",
    "pipeline": {
        "build": {
            "dependsOn": ["^build"],
            "outputs": ["dist/**"]
        },
        "dev": {
            "cache": false,
            "persistent": true
        }
    }
}
```

## 代码质量工具

### Oxlint

Oxlint 是基于 Rust 的高性能 JavaScript/TypeScript Linter，仓库中已完全取代 ESLint。

**版本**: ^1.75.0

**配置文件**: `oxlint.config.ts`

**内置插件**:

- `typescript`: TypeScript 规则
- `vue`: Vue 规则（仅检查 `<script>` 块）
- `node`、`jsdoc`、`vitest`

**使用示例**:

```ts
import { defineOxlintConfig } from '@quantum-design-configs/oxlint';

export default defineOxlintConfig();
```

代码格式化由 Prettier 负责，lint 侧不声明格式化规则。

### Prettier

Prettier 是一个固执己见的代码格式化工具。

**版本**: ^3.5.3

**配置文件**: `.prettierrc.js`

**主要功能**:

- 自动格式化代码
- 支持多种语言
- 与编辑器集成

**使用示例**:

```js
module.exports = require('@quantum-design-configs/prettier');
```

### TypeScript

TypeScript 是 JavaScript 的超集，添加了类型系统。

**版本**: ^5.9.2

**配置文件**: `tsconfig.json`

**主要功能**:

- 静态类型检查
- 代码补全
- 重构工具
- 接口和类型定义

**使用示例**:

```json
{
    "extends": "@quantum-design-configs/tsconfig/base.json",
    "compilerOptions": {
        "outDir": "dist"
    },
    "include": ["src"]
}
```

### Vitest

Vitest 是一个 Vite 原生的单元测试框架。

**版本**: ^3.2.4

**配置文件**: `vitest.config.ts`

**主要功能**:

- 快速执行
- 与 Vite 共享配置
- 支持 TypeScript
- 兼容 Jest 的 API

**使用示例**:

```js
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'jsdom',
        coverage: {
            provider: 'v8',
        },
    },
});
```

## 版本控制与发布

### Changesets

Changesets 是一个多包仓库变更日志与版本管理工具。

**版本**: ^2.29.5

**配置文件**: `.changeset/config.json`

**主要功能**:

- 版本管理
- 变更日志生成
- 发布工作流

**使用示例**:

```bash
# 创建变更集
pnpm changeset

# 更新版本
pnpm changeset version

# 发布
pnpm changeset publish
```

### Husky

Husky 是一个 Git hooks 工具。

**版本**: ^9.1.6

**配置文件**: `.husky/`

**主要功能**:

- 提交前检查
- 推送前检查
- 自定义 Git hooks

**使用示例**:

```bash
# .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

pnpm lint-staged
```

### Commitlint

Commitlint 是一个 Commit 消息规范检查工具。

**配置文件**: `commitlint.config.mjs`

**主要功能**:

- 检查 Commit 消息格式
- 强制执行 Commit 规范
- 自定义规则

**使用示例**:

```js
import { commitlintConfig } from '@quantum-design-configs/commitlint';

export default commitlintConfig;
```

## 工具链集成

### 开发流程

1. **本地开发**: `pnpm dev` - 启动开发服务器
2. **代码检查**: `pnpm lint` - 运行 Oxlint
3. **单元测试**: `pnpm test` - 运行 Vitest
4. **构建**: `pnpm build` - 使用 Turbo 构建所有包
5. **发布准备**: `pnpm changeset` - 创建变更集
6. **版本更新**: `pnpm changeset version` - 更新版本号
7. **发布**: `pnpm changeset publish` - 发布到 npm

### CI/CD 集成

项目使用 GitHub Actions 进行 CI/CD：

- **代码检查**: 每次提交运行 Oxlint 和 TypeScript 检查
- **单元测试**: 每次提交运行单元测试
- **构建验证**: 每次提交验证构建是否成功
- **发布**: 合并到主分支时自动发布

## 最佳实践

### 代码质量

1. **遵循 Oxlint 规则**: 确保代码通过 Oxlint 检查
2. **使用类型注解**: 为函数和变量添加 TypeScript 类型
3. **编写测试**: 为关键功能编写单元测试
4. **遵循 Commit 规范**: 使用规范化的 Commit 消息

### 性能优化

1. **利用 Turbo 缓存**: 避免重复构建
2. **优化依赖**: 减少不必要的依赖
3. **代码分割**: 使用动态导入分割代码
4. **懒加载**: 对非关键资源使用懒加载

### 工作流优化

1. **使用工作区命令**: 使用 `pnpm --filter` 针对特定包运行命令
2. **并行开发**: 利用 Turbo 的并行执行能力
3. **增量构建**: 只构建更改的包
4. **自动化测试**: 在提交前自动运行测试
