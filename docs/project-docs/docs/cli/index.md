# CLI 工具

Quantum Design 提供了一系列命令行工具，用于提高开发效率和项目管理。

## 工具概览

| 工具名称                              | 描述                                 |
| ------------------------------------- | ------------------------------------ |
| [create-app](#create-app)             | 项目脚手架工具，用于创建新项目       |
| [product-analysis](#product-analysis) | 产品分析工具，用于分析项目结构和依赖 |
| [workflow-cloud](#workflow-cloud)     | 工作流云工具，用于管理云端工作流     |

## create-app

`create-app` 是一个项目脚手架工具，用于快速创建新项目。

### 安装

```bash
npm install @quantum-design/create-app -g
```

### 使用方法

```bash
quantum-design-create-app my-project
```

### 支持的项目模板

- Vue3 + Ant Design + Vite
- Vue3 组件库
- Nuxt3
- Monorepo
- VitePress 文档
- VuePress 文档
- API 服务

## product-analysis

`product-analysis` 是一个产品分析工具，用于分析项目结构和依赖关系。

### 安装

```bash
npm install @quantum-design/product-analysis -g
```

### 使用方法

```bash
quantum-design-analysis [options]
```

### 主要功能

- 分析项目依赖关系
- 生成项目结构报告
- 检测潜在问题和优化建议

## workflow-cloud

`workflow-cloud` 是一个工作流云工具，用于管理云端工作流。

### 安装

```bash
npm install @quantum-design/workflow-cloud -g
```

### 使用方法

```bash
quantum-design-workflow [command] [options]
```

### 主要命令

- `init`: 初始化工作流配置
- `deploy`: 部署工作流到云端
- `status`: 查看工作流状态
- `logs`: 查看工作流日志

## 开发指南

如果你想为 CLI 工具贡献代码，可以按照以下步骤进行：

1. 克隆仓库

```bash
git clone https://github.com/Little-LittleProgrammer/quantum-design.git
```

2. 安装依赖

```bash
cd quantum-design
pnpm install
```

3. 进入 CLI 工具目录

```bash
cd cli/[tool-name]
```

4. 启动开发模式

```bash
pnpm dev
```

5. 构建

```bash
pnpm build
```
