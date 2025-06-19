# 性能分析脚本

## 技术栈
- **构建工具**: TypeScript + unbuild 实现 CLI 脚本
- **AI 分析**: 使用 [@quantum-design/ai-hub](../../packages/ai-hub) 包集成阿里云百炼 AI
- **文件处理**: fs-extra 处理文件读写
- **命令行**: minimist 解析命令行参数
- **消息推送**: 飞书 webhook 发送分析报告

## 功能特性

### 分析数据
1. **项目配置分析**
   - 解析 `package.json` 获取项目依赖和基本信息
   - 读取 `vite.config.ts/js` 获取构建配置
   - 扫描 `dist` 目录获取构建产物信息（文件路径和大小）

2. **依赖分析**
   - 使用 `pnpm ls --depth=2 -r` 获取项目依赖树（深度为2层）
   - 分析依赖关系和版本信息
   - 识别重复依赖和潜在的依赖冲突

3. **源码结构分析**（新增 🎉）
   - **目录结构分析**: 生成 `src` 目录的可视化结构树
   - **代码统计**: 总文件数、代码行数、文件类型分布、平均文件大小
   - **技术栈识别**: 自动识别框架、UI库、状态管理、路由等技术栈
   - **关键文件分析**: 自动读取并分析入口文件、路由配置、状态管理等核心文件
   - **大文件识别**: 识别可能存在性能问题的大体积文件

4. **AI 智能分析**
   - 利用阿里云百炼 AI 进行深度分析
   - 支持自定义百炼应用 ID
   - 从以下维度进行分析：
     - 项目概述和技术栈
     - 依赖包分析和优化建议
     - 构建产物大小分析
     - 性能优化建议
     - 具体改进方案

### 脚本参数
- `<项目目录>`: 必需参数，要分析的项目目录路径
- `--webhook <url>`: 可选，飞书 webhook 地址
- `--api-key <key>`: 可选，阿里云 API Key（可通过环境变量设置）
- `--bailian-app-id <id>`: 可选，百炼应用 ID（可通过环境变量设置）

### 结果输出
1. **本地报告**: 在项目目录下生成 `report.md` 文件
2. **飞书通知**: 通过 webhook 发送报告到飞书群聊
3. **控制台输出**: 实时显示分析进度和结果

## 安装与使用

### 1. 安装依赖
```bash
cd scripts/product-analysis
npm install
```

### 2. 构建脚本
```bash
npm run build
```

### 3. 使用方式

#### 基本使用
```bash
# 分析指定项目（需要设置环境变量 BAILIAN_API_KEY）
product-analysis ./my-project

# 带参数使用
product-analysis ./my-project --api-key your-api-key
```

#### 完整功能使用
```bash
# 包含飞书通知
product-analysis ./my-project \
  --api-key your-api-key \
  --webhook https://open.feishu.cn/open-apis/bot/v2/hook/xxx

# 使用百炼应用
product-analysis ./my-project \
  --api-key your-api-key \
  --bailian-app-id your-app-id \
  --webhook https://open.feishu.cn/open-apis/bot/v2/hook/xxx
```

### 4. 环境变量配置

建议将敏感信息设置为环境变量：

```bash
# 设置阿里云 API Key
export BAILIAN_API_KEY=your-api-key

# 设置百炼应用 ID（可选）
export BAILIAN_APP_ID=your-bailian-app-id
```

## 开发指南

### 项目结构
```
scripts/product-analysis/
├── src/
│   ├── index.ts          # 主入口文件
│   ├── cli.ts            # 命令行参数解析
│   ├── analyzer.ts       # AI 分析核心逻辑
│   ├── types.ts          # 类型定义
│   └── utils/
│       ├── file.ts       # 文件操作工具
│       └── feishu.ts     # 飞书 webhook 工具
├── package.json          # 项目配置
├── build.config.ts       # unbuild 构建配置
├── tsconfig.json         # TypeScript 配置
└── README.md            # 使用文档
```

### 开发模式
```bash
# 开发模式（自动重建）
npm run dev

# 构建生产版本
npm run build
```

### 扩展功能

#### 1. 添加新的分析维度
在 `src/analyzer.ts` 的 `generatePrompt` 方法中添加新的分析要求。

#### 2. 支持其他构建工具
在 `src/utils/file.ts` 中扩展配置文件读取逻辑，支持 webpack、rollup 等。

#### 3. 集成其他通知方式
参考 `src/utils/feishu.ts`，添加钉钉、企业微信等通知方式。

## 注意事项

1. **API Key 安全**: 请妥善保管 API Key，不要将其硬编码在代码中
2. **网络环境**: 确保网络可以访问阿里云 API 和飞书 webhook
3. **项目构建**: 建议在分析前先构建项目，以获取最新的构建产物
4. **大型项目**: 对于大型项目，AI 分析可能需要较长时间，请耐心等待

## 错误排查

### 常见问题

1. **API Key 错误**
   ```
   ❌ 错误: 请提供阿里云 API Key
   ```
   解决：设置环境变量 `BAILIAN_API_KEY` 或使用 `--api-key` 参数

2. **项目目录无效**
   ```
   ❌ 错误: 目录中未找到 package.json 文件
   ```
   解决：确保指定的是有效的前端项目目录

3. **网络连接问题**
   ```
   ❌ AI 分析失败: Network Error
   ```
   解决：检查网络连接，确保可以访问阿里云 API

### 调试模式
```bash
# 启用详细错误信息
DEBUG=1 product-analysis ./my-project
```

## 更新日志

### v1.0.0
- ✅ 基础功能实现
- ✅ 支持项目配置分析
- ✅ 集成阿里云百炼 AI
- ✅ 支持飞书 webhook 通知
- ✅ 生成详细分析报告
