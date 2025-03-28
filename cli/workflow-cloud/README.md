# @quantum-design-cli/workflow

一个强大的工作流 CLI 工具，用于自动化开发流程和团队协作。

## 功能特点

- 飞书集成：支持与飞书平台的深度集成，实现工作流程自动化
- 阿里云集成：支持阿里云相关服务的操作
- AI 支持：集成 OpenAI 功能，提供智能化辅助
- 命令行工具：提供简单易用的命令行界面

## 安装

```bash
# 使用 npm 安装
npm install @quantum-design-cli/workflow -g

# 或使用 yarn
yarn global add @quantum-design-cli/workflow
```

## 使用方法

工具提供了两个命令行别名：
- `qm-workflow`
- `qw` (简写)

### 阿里云工作流

#### 运行 appstack

- `qw -a appstack`

#### 运行 codeup

- `qw -a` || `qw -a codeup`

### 飞书工作流

- `qw -f`

###

## 配置

在项目根目录创建 `qm-workflow.json` 配置文件：

```json
{
    "feishuConfig": {
        "appId": "your_feishu_app_id",
        "appSecret": "your_feishu_app_secret",
    },
    "aliConfig": {
        "token": "your_ali_token",
        "appStackName": "your_app_stack_name",
        "repoName": "your_repo_name",
        "targetBranch": "your_target_branch"
    },
    "openaiConfig": {
        "apiKey": "your_openai_api_key"
    }
}
```

## 项目结构

```
src/
├── cli.ts          # CLI 入口文件
├── command/        # 命令实现
├── client/         # 客户端实现
├── enums/          # 枚举定义
├── questions/      # 交互式问题
├── types/          # 类型定义
└── utils/          # 工具函数
```

## 技术栈

- Node.js (v18.18.2)
- TypeScript
- 主要依赖：
  - axios：HTTP 客户端
  - @larksuiteoapi/node-sdk：飞书 SDK
  - openai：OpenAI API 客户端
  - prompts：命令行交互
  - unbuild：构建工具

## 开发

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建
pnpm build
```

## TODO

1. 飞书集成
   - 获取飞书 userToken
     - 文件：`src/client/feishu-client/feishu-base-client.ts`
   - 获取知识库文档纯文本
     - 文件：`src/client/feishu-client/docx-client.ts`
   - 根据文档块内容的 token 获取图片地址，并下载到本地隐藏文件夹
     - 文件：`src/client/feishu-client/docx-client.ts`
   - 调用飞书 API 发送消息，创建云文档记录 MR 详情
     - 文件：`src/command/codeup.ts`

## 许可证

ISC License © Evan Wu

## 参数

### 参数等级

2. 其次是 环境变量
```bash
vim ~/.zshrc

export FEISHU_APP_ID=xxxx # 飞书应用 id
export FEISHU_APP_SECRET=xxxx # 飞书应用 密钥
export FEISHU_PROJECT_APP_ID=xxxx # 飞书项目 id
export FEISHU_PROJECT_APP_SECRET=xxxx # 飞书项目 密钥
export FEISHU_APP_SPACE_NAME=xxxx # 飞书命名空间

export BAILIAN_API_KEY=xxxx # 百炼 api key
export BAILIAN_MODELNAME=xxxx # 百炼 api key

export REPO_NAME=xxxx # 仓库名称
export APP_STACK_NAME=xxxx # appstack名称
```

或者
具体参数同上
```js
// .env 文件

FEISHU_APP_ID=xxx
FEISHU_APP_SECRET=xxx
```

3. 最后是项目中的 `qm-workflow.json`

### 参数名称

#### 普通变量
```js
{
    "feishuConfig": {
        "appId": "your_feishu_app_id",
        "appSecret": "your_feishu_app_secret",
        "spaceName": "知识库名称"
    },
    "aliConfig": {
        "token": "your_ali_token",
        "appStackName": "your_app_stack_name",
        "repoName": "your_repo_name",
        "targetBranch": "your_target_branch"
    },
    "openaiConfig": {
        "apiKey": "your_openai_api_key"，
        "modelName": "模型名称"
    }
}
```
