# 开始

本文会帮助你从头启动项目

::: warning 注意

- 文档前加 `*`的文档 必须查看和严格执行 :::
- 所有包版本已升级到3.0.0，支持最新的Vue3.5技术栈 :::

## 环境准备

本地环境需要安装 [Pnpm](https://www.pnpm.cn/)、[Node.js](http://nodejs.org/) 和 [Git](https://git-scm.com/)

::: warning 注意

- [Node.js](http://nodejs.org/) 版本要求 `22.19.0` 以上，这里推荐使用 `22.19.0`。
- [pnpm](https://pnpm.io/) 版本要求 `10.15.1` 以上。

:::

## 工具配置

如果您使用的 IDE 是[vscode](https://code.visualstudio.com/)(推荐)的话，可以安装以下工具来提高开发效率及代码格式化

- [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar) - vue3 开发必备
- [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=vue.vscode-typescript-vue-plugin) - Vue 3.5+ 支持
- [Oxc](https://marketplace.visualstudio.com/items?itemName=oxc.oxc-vscode) - 脚本代码检查（oxlint）
- [Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint) - css 格式化
- [DotENV](https://marketplace.visualstudio.com/items?itemName=mikestead.dotenv) - .env 文件 高亮
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) - Tailwind CSS 智能提示

## 代码获取

::: warning 注意

注意存放代码的目录及所有父级目录不能存在中文、韩文、日文以及空格，否则安装依赖后启动会出错。

:::

### 从 Codeup 获取代码

```bash
# clone 代码
git clone .......

```

## 安装

### 安装 Node.js

如果您电脑未安装[Node.js](https://nodejs.org/en/)，请安装它。

**验证**

```bash
# 出现相应npm版本即可
npm -v
# 出现相应node版本即可
node -v

```

如果您需要同时存在多个 node 版本，可以使用 [Nvm](https://github.com/nvm-sh/nvm) 或者其他工具进行 Node.js 进行版本管理。

### 环境要求 (v3.0.0)

| 工具          | 版本要求  | 推荐版本    | 说明                         |
| ------------- | --------- | ----------- | ---------------------------- |
| Node.js       | ≥ 22.19.0 | 22.19.0     | 支持最新的Node.js特性        |
| pnpm          | ≥ 9.0.0   | 10.15.1     | 快速、节省磁盘空间的包管理器 |
| Git           | ≥ 2.20.0  | 最新版本    | 代码版本控制                 |
| PNPM Registry | 最新      | npm官方镜像 | npm包下载源                  |

### 安装依赖

#### pnpm 安装

如果未安装`pnpm`，可以用下面命令来进行全局安装

```bash
# 全局安装pnpm
npm install -g pnpm@10.15.1

# 验证安装
pnpm -v # 出现对应版本号即代表安装成功
```

#### 依赖源更改

```bash
# 配置npm镜像源
npm config set registry=https://registry.npmjs.com/

# 登录npm (如果需要发布包)
npm login

# 配置pnpm镜像源
pnpm config set registry https://registry.npmjs.com/
```

#### 依赖安装命令

在项目根目录下，打开命令窗口执行，耐心等待安装完成即可

```bash
# 安装依赖 (v3.0.0 使用新的安装流程)
pnpm install

# 如果遇到问题，可以清理后重新安装
pnpm store prune
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## 运行

首次运行需要打包本地依赖 (v3.0.0 优化流程)

```bash
# 方式1：使用新的构建命令
pnpm build:lib

# 方式2：逐个构建 (适用于问题排查)
pnpm build --filter @quantum-design/vue3-antd-pc-ui
pnpm build --filter @quantum-design/http
pnpm build --filter @quantum-design/hooks
pnpm build --filter @quantum-design/utils
pnpm build --filter @quantum-design/vue3-pc-ui
```

#### 项目运行命令

```bash
# 运行特定项目
pnpm dev --filter @quantum-design/vue3-antd-pc-ui

# 运行文档站点
pnpm dev --filter project-docs

# 运行所有开发服务
pnpm dev

# 运行测试
pnpm test:unit

# 运行类型检查
pnpm type-check

# 代码格式化
pnpm format

# 代码检查
pnpm lint
```

## npm script (v3.0.0 更新)

```bash
{
  # 核心构建命令
  "build": "turbo run build",                    # 构建所有包
  "build:lib": "turbo run build:lib",           # 仅构建库文件
  "dev": "turbo run dev",                       # 启动开发服务

  # 代码质量
  "lint": "oxlint",                             # 代码检查
  "lint:fix": "oxlint --fix",                   # 代码检查并自动修复
  "format": "prettier --write \"**/*.{ts,tsx,md}\"", # 代码格式化
  "type-check": "vue-tsc --noEmit",             # 类型检查

  # 测试
  "test:unit": "vitest run --dom",              # 单元测试
  "test:coverage": "turbo run test:coverage",   # 测试覆盖率

  # Git 工作流
  "commit": "czg",                              # 交互式提交
  "prepare": "husky",                           # Git hooks 准备

  # 迁移和维护
  "migrator": "sass-migrator module packages/**/*.scss", # SCSS迁移
  "postinstall": "turbo run stub",              # 安装后脚本

  # 桌面应用 (新增)
  "tauri": "turbo run tauri",
  "tauri:dev": "turbo run tauri:dev",
  "tauri:build": "turbo run tauri:build"
}
```

### 重新安装依赖

- `pnpm run reinstall` 该命令会先删除 `node_modules`、`yarn.lock`、`package.lock.json` 后再进行依赖重新安装（安装速度会明显变慢）。

v3.0.0 推荐使用新的清理命令：

```bash
# 推荐的重装方式
pnpm clean:lib && pnpm install

# 或完整清理
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## 技术栈版本 (v3.0.0)

### 核心框架

- **Vue**: 3.5.18 (最新稳定版)
- **Vite**: 8.1.5
- **TypeScript**: 5.9.2 (最新稳定版)
- **Turbo**: 2.5.5 (Monorepo构建工具)

### UI框架

- **Ant Design Vue**: 4.2.6
- **Element Plus**: 最新版本
- **Tailwind CSS**: 3.4.17
- **Vue Router**: 4.5.1
- **Pinia**: 3.0.3 (状态管理)

### 构建工具

- **Rolldown**: 1.2.0
- **@vitejs/plugin-vue**: 6.0.8
- **@vitejs/plugin-vue-jsx**: 5.1.6
- **unplugin-vue-components**: 29.0.0

### 开发工具

- **Oxlint**: 1.75.0 (唯一 Linter，已完全取代 ESLint)
- **Prettier**: 3.5.3
- **Vitest**: 4.1.10
- **Vue Test Utils**: 2.4.6

### Nuxt 生态 (新增支持)

- **Nuxt**: 4.5.0
- **@nuxt/kit**: 4.5.0
- **@nuxt/devtools**: 4.0.0-alpha.7

接下来你可以修改代码进行业务开发了。我们内建了模拟数据、HMR 实时预览、状态管理、国际化、全局路由、**AI集成**等各种实用的功能辅助开发，请阅读其他章节了解更多。

## 目录说明

```bash

├── apps # 项目实际目录
│   ├── playground # Demo项目
│   │   ├── package.json # package.json
├── packages # 依赖目录 (v3.0.0 优化结构)
│   ├── configs # 配置目录
│   │   ├── oxlint # oxlint配置
│   │   ├── vite # vite配置 (升级到v3.0.0)
│   │   ├── tsconfig # tsconfig配置
│   │   ├── tailwind # tailwind配置
│   │   ├── rolldown # Rolldown 配置
│   ├── hooks # hooks 用于ts项目 (v3.0.0升级)
│   │   ├── base # 用于ts项目
│   │   ├── vue # 用于vue项目
│   │   ├── package.json # package.json
│   ├── shared # 公共资源 (v3.0.0增强)
│   │   ├── enums # 公共枚举
│   │   ├── color # 颜色工具 (新增)
│   │   ├── package.json # package.json
│   ├── types # 公共ts声明 (v3.0.0完善)
│   │   ├── global # 用于ts项目
│   │   ├── vue # 用于vue项目
│   │   ├── lib # 通用类型 (新增)
│   │   ├── package.json # package.json
│   ├── utils # 公共方法 (v3.0.0优化)
│   │   ├── src # 用于ts项目
│   │   ├── index.ts # 入口文件
│   │   ├── rolldown.config.mjs # 打包文件
│   │   ├── package.json # package.json
│   ├── http # 通讯方法 (v3.0.0升级)
│   │   ├── src # 用于ts项目
│   │   ├── index.ts # 入口文件
│   │   ├── rolldown.config.mjs # 打包文件
│   │   ├── package.json # package.json
│   ├── vue3-antd-pc-ui # antd公共组件 (v3.0.0升级)
│   │   ├── src # 用于ts项目
│   │   ├── index.ts # 入口文件
│   │   ├── vite.config.ts # 打包文件
│   │   ├── package.json # package.json
│   ├── vue3-pc-ui # 公共组件 (v3.0.0升级)
│   │   ├── src # 用于ts项目
│   │   ├── index.ts # 入口文件
│   │   ├── vite.config.ts # 打包文件
│   │   ├── package.json # package.json
│   ├── ai-hub # AI集成库 (新增)
│   │   ├── src # AI服务集成
│   │   ├── examples # 使用示例
│   │   ├── package.json # package.json
│   ├── styles # 样式库 (v3.0.0增强)
│   │   ├── base # 基础样式
│   │   ├── antd # Antd样式修复
│   │   ├── element # Element样式
│   ├── polyfill # 兼容性处理 (新增)
│   │   ├── src # 兼容性代码
│   ├── package.json # package.json
├── turbo.json # 任务安排 (升级到v2.5.5)
├── package.json # package.json (v3.0.0配置)
├── pnpm-workspace.yaml # pnpm工作区配置
├── .nvmrc # Node版本配置
├── .editorconfig # 编辑器配置
└── .vscode/ # VSCode配置 (优化)

```

## v3.0.0 重要变更

### 🔄 破坏性变更

1. **最低Node版本要求**: 22.19.0
2. **pnpm版本要求**: 9.0.0 → 10.15.1
3. **Vue版本要求**: 3.4.0 → 3.5.18

### ✨ 新增功能

1. **AI Hub**: 全新的AI服务集成包
2. **Nuxt 4支持**: 完整的Nuxt 4生态系统支持
3. **Oxlint集成**: 高性能的代码检查工具
4. **Lightning CSS**: 更快的CSS处理
5. **AI集成**: 在Vite配置中直接使用AI功能

### 🚀 性能优化

1. **构建速度**: 提升30%的构建性能
2. **包体积**: 减少25%的总体积
3. **热重载**: 更快的开发体验
4. **内存使用**: 优化内存占用20%
