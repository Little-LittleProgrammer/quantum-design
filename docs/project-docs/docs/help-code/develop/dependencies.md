# 依赖版本管理

Quantum Design 使用 pnpm workspace 和 catalog 功能管理依赖版本，确保整个 monorepo 使用一致的依赖版本。

## 环境要求

根据 `package.json` 中的配置，项目要求：

```json
"engines": {
  "npm": ">=9.0.0",
  "node": ">=20.19.0"
},
"packageManager": "pnpm@10.13.1",
"volta": {
  "node": "20.19.4",
  "pnpm": "10.13.1"
}
```

- **Node.js**: 20.19.0 或更高版本（推荐 20.19.4）
- **pnpm**: 10.13.1
- **npm**: 9.0.0 或更高版本

## 依赖管理策略

### Catalog 依赖

项目使用 pnpm 的 catalog 功能集中管理核心依赖版本，在 `pnpm-workspace.yaml` 中定义。使用方式：

```json
{
    "devDependencies": {
        "typescript": "catalog:"
    }
}
```

这确保了所有包使用相同版本的依赖，避免版本冲突。

### 主要依赖版本

以下是项目中使用的主要依赖版本：

#### 核心框架

- **vue**: ^3.5.18
- **vue-router**: ^4.5.1
- **pinia**: ^3.0.3
- **nuxt**: ^4.0.3

#### 构建工具

- **vite**: ^7.1.1
- **rollup**: ^4.46.2
- **typescript**: ^5.9.2
- **unbuild**: ^3.6.0
- **turbo**: ^2.5.5

#### UI 组件库

- **ant-design-vue**: ^4.2.6
- **@ant-design/icons-vue**: ^7.0.1
- **echarts**: ^6.0.0

#### 样式与预处理器

- **sass**: ^1.83.0
- **tailwindcss**: ^3.4.17
- **postcss**: ^8.5.3

#### 工具库

- **axios**: ^1.11.0
- **dayjs**: ^1.11.13
- **lodash-es**: ^4.17.21
- **zod**: ^4.0.17

#### 代码质量

- **eslint**: ^9.22.0
- **prettier**: ^3.5.3
- **vitest**: ^3.2.4

#### 桌面应用

- **@tauri-apps/cli**: ^2
- **@tauri-apps/api**: ^2

#### AI 集成

- **openai**: ^4.86.1
- **@modelcontextprotocol/sdk**: ^1.17.2

## 依赖分类

根据 `pnpm-workspace.yaml` 中的 catalog 配置，依赖被分为以下几类：

### 提交规范与变更日志

- **czg**: ^1.12.0 - 交互式提交工具
- **cz-git**: ^1.12.0 - git commit 规范工具
- **@changesets/cli**: ^2.29.5 - 多包仓库变更日志与版本管理工具

### Git hooks 与工作流

- **husky**: ^9.1.6 - Git hooks 工具
- **lint-staged**: ^15.2.10 - 针对暂存文件运行 lint

### Lint/类型检查

- **prettier**: ^3.5.3 - 代码格式化工具
- **eslint**: ^9.22.0 - 代码质量和风格检查工具
- **typescript**: ^5.9.2 - TypeScript 语言支持

### 构建工具链

- **vite**: ^7.1.1 - 前端构建工具
- **rollup**: ^4.46.2 - JS 打包工具
- **unbuild**: ^3.6.0 - 通用包构建工具
- **turbo**: ^2.5.5 - monorepo 构建加速工具

### Vue 生态

- **vue**: ^3.5.18 - Vue.js 框架
- **vue-router**: ^4.5.1 - Vue 路由管理
- **pinia**: ^3.0.3 - 现代化状态管理库

### Nuxt 生态

- **nuxt**: ^4.0.3 - Nuxt.js 框架
- **@nuxt/kit**: ^4.0.3 - Nuxt 工具包

### UI 组件与可视化

- **ant-design-vue**: ^4.2.6 - Ant Design Vue 组件库
- **echarts**: ^6.0.0 - 可视化图表库

### 样式与预处理器

- **sass**: ^1.83.0 - Sass 预处理器
- **tailwindcss**: ^3.4.17 - 原子 CSS 框架

### 客户端

- **@tauri-apps/cli**: ^2 - Tauri CLI 工具
- **@tauri-apps/api**: ^2 - Tauri API

## 依赖覆盖

项目使用 pnpm 的 overrides 功能确保关键依赖的版本一致性：

```json
"pnpm": {
  "overrides": {
    "eslint": "catalog:",
    "typescript": "catalog:",
    "vite": "catalog:"
  }
}
```

## 添加依赖指南

### 添加工作区依赖

```bash
# 为根目录添加开发依赖
pnpm add -Dw <package-name>

# 为特定包添加依赖
pnpm --filter <package-name> add <dependency>
```

### 添加 Catalog 依赖

1. 在 `pnpm-workspace.yaml` 的 catalog 部分添加依赖及版本
2. 在需要的包的 package.json 中使用 `"dependency-name": "catalog:"` 引用

### 添加工作区内部依赖

在 package.json 中使用 `workspace:*` 语法：

```json
{
    "dependencies": {
        "@quantum-design/utils": "workspace:*"
    }
}
```

## 依赖更新策略

1. 小版本和补丁版本更新可以直接在 catalog 中更新
2. 大版本更新需要测试兼容性后再更新
3. 使用 `pnpm update -r` 递归更新所有包的依赖
4. 使用 changesets 记录依赖变更
