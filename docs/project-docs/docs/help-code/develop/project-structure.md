# 项目结构

## Monorepo 结构

Quantum Design 使用 pnpm workspace 管理 monorepo 项目结构，根据最新的 `pnpm-workspace.yaml` 配置，项目结构如下：

```
quantum-design/
├── apps/                # 应用（示例/演示）
│   └── playground/      # 示例应用
├── cli/                 # CLI 工具集合
│   ├── create-app/      # 项目脚手架工具
│   ├── product-analysis/# 产品分析工具
│   └── workflow-cloud/  # 工作流云工具
├── configs/             # 配置/规范相关
│   ├── commitlint/      # commit 规范配置
│   ├── eslint/          # ESLint 配置
│   ├── prettier/        # Prettier 配置
│   ├── rollup/          # Rollup 配置
│   ├── sentry/          # Sentry 配置
│   ├── tailwind/        # Tailwind CSS 配置
│   ├── tsconfig/        # TypeScript 配置
│   └── vite/            # Vite 配置
├── docs/                # 文档站点与文档工程
│   └── project-docs/    # 项目文档
├── packages/            # 内部共享包
│   ├── ai-hub/          # AI 集成库
│   ├── hooks/           # Vue Hooks
│   ├── http/            # HTTP 通讯
│   ├── polyfill/        # 兼容性填充
│   ├── shared/          # 共享工具
│   ├── styles/          # 样式库
│   ├── types/           # TypeScript 类型
│   ├── utils/           # 工具库
│   ├── vue3-antd-pc-ui/ # Vue3 Ant Design 组件
│   └── vue3-pc-ui/      # Vue3 通用组件
└── server/              # 服务端脚本与服务
    ├── mcp/             # MCP 相关服务
    └── sentry-analyse/  # Sentry 分析服务
```

## Workspace 配置

根据 `pnpm-workspace.yaml` 的配置，项目包含以下工作区：

```yaml
packages:
    # 配置/规范相关（存放各类项目配置、规范、预设等包）
    - 'configs/*'

    # 内部共享包（工具、组件等），排除 @vue3-antd-pc-ui-nuxt/ 和 @vue3-pc-ui-nuxt/
    # 用于存放可复用的工具库、组件库等内部 npm 包
    - 'packages/*'
    - '!**/*-ui-nuxt/**'

    # 文档站点与文档工程（项目文档、组件文档等相关工程）
    - 'docs/*'

    # CLI 工具集合（自定义命令行工具相关包）
    - 'cli/*'

    # 应用（示例/演示）（用于存放示例应用、演示项目等）
    - 'apps/playground'

    # 服务端脚本与服务（后端脚本、API 服务等相关包）
    - 'server/**/*'
```

## 目录说明

### apps

存放示例应用和演示项目，目前包含：

- **playground**: 示例应用，用于展示组件、工具和功能的使用方法，集成了 Tauri 支持

### cli

存放命令行工具，包括：

- **create-app**: 项目脚手架工具，用于快速创建新项目
- **product-analysis**: 产品分析工具，用于分析项目结构和依赖
- **workflow-cloud**: 工作流云工具，用于管理云端工作流

### configs

存放各类项目配置、规范和预设，包括：

- **commitlint**: Commit 规范配置
- **eslint**: ESLint 配置
- **prettier**: Prettier 配置
- **rollup**: Rollup 配置
- **sentry**: Sentry 配置
- **tailwind**: Tailwind CSS 配置
- **tsconfig**: TypeScript 配置
- **vite**: Vite 配置

### docs

存放文档站点与文档工程：

- **project-docs**: 项目文档，使用 VitePress 构建

### packages

存放可复用的工具库、组件库等内部 npm 包：

- **ai-hub**: AI 集成库，提供统一的 AI 服务接口
- **hooks**: Vue Hooks 集合
- **http**: HTTP 通讯库
- **polyfill**: 兼容性填充
- **shared**: 共享工具和常量
- **styles**: 样式库
- **types**: TypeScript 类型定义
- **utils**: 通用工具库
- **vue3-antd-pc-ui**: 基于 Ant Design Vue 的组件库
- **vue3-pc-ui**: Vue3 通用组件库

### server

存放后端脚本和 API 服务：

- **mcp**: MCP (Model Context Protocol) 相关服务
- **sentry-analyse**: Sentry 错误分析服务

## 项目依赖管理

项目使用 pnpm 管理依赖，通过 `catalog:` 语法引用公共依赖版本，确保整个 monorepo 使用一致的依赖版本。

## 开发指南

### 创建新包

1. 在对应目录下创建新包目录
2. 确保包含 `package.json` 文件
3. 遵循目录命名和结构规范
4. 在 `pnpm-workspace.yaml` 中确认包路径已被包含

### 添加依赖

```bash
# 为特定包添加依赖
pnpm --filter <package-name> add <dependency>

# 为所有包添加开发依赖
pnpm add -D <dependency> -w
```

### 引用工作区内的包

在 `package.json` 中使用 `workspace:*` 语法引用工作区内的其他包：

```json
{
    "dependencies": {
        "@quantum-design/utils": "workspace:*"
    }
}
```
