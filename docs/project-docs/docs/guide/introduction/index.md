# 开始

本文会帮助你从头启动项目

::: warning 注意
- 文档前加 `*`的文档 必须查看和严格执行
:::


## 环境准备

本地环境需要安装 [Pnpm](https://www.pnpm.cn/)、[Node.js](http://nodejs.org/) 和 [Git](https://git-scm.com/)

::: warning 注意

- [Node.js](http://nodejs.org/) 版本要求`14.18` 以上，且不能为`15.x`版本，这里推荐 `14.19.1`。

:::

## 工具配置

如果您使用的 IDE 是[vscode](https://code.visualstudio.com/)(推荐)的话，可以安装以下工具来提高开发效率及代码格式化

- [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar) - vue3 开发必备
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) - 脚本代码检查
- [Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint) - css 格式化
- [DotENV](https://marketplace.visualstudio.com/items?itemName=mikestead.dotenv) - .env 文件 高亮

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

如果你需要同时存在多个 node 版本，可以使用 [Nvm](https://github.com/nvm-sh/nvm) 或者其他工具进行 Node.js 进行版本管理。

### 安装依赖

#### pnpm 安装

如果未安装`pnpm`，可以用下面命令来进行全局安装(也可使用npm安装)

```bash
npm config set registry=https://packages.aliyun.com/5f6426fcdb0493ecef9118ab/npm/npm-registry/

npm login
```

#### 依赖源更改

```bash
# 全局安装pnpm
npm i -g pnpm
# 验证
pnpm -v # 出现对应版本号即代表安装成功
```

#### 依赖安装命令

在项目根目录下，打开命令窗口执行，耐心等待安装完成即可

```bash
# 安装依赖
pnpm i
```

## 运行
首次运行需要打包本地依赖

```bash
pnpm build --filter @quantum-design/vue3-antd-pc-ui
pnpm build --filter @quantum-design/http
```

#### 项目运行命令
```bash
pnpm dev --filter xxxx
```

## npm script

```bash
"scripts": {
  # 运行项目
  "dev": "vite",
  # 构建项目
  "build": "vite build",
  # 直接预览本地 dist 文件目录
  "serve": "vite preview",
  # 类型检查
  "type:check": "vue-tsc --noEmit --skipLibCheck",
  # 预览打包后的内容（先打包在进行预览）
  "preview": "npm run build && vite preview",
  # 重新安装依赖，见下方说明
  "reinstall": "rimraf yarn.lock && rimraf package.lock.json && rimraf node_modules && npm i",
  # 执行 eslint 校验，并修复部分问题
  "lint:eslint": "eslint \"{src,mock}/**/*.{vue,ts,tsx}\" --fix",
  # 对打包结果进行 gzip 测试
  "test:gzip": "http-server dist --cors --gzip -c-1",
  # 对打包结果进行 brotli 测试
  "test:br": "http-server dist --cors --brotli -c-1",
  # 删除 node_modules (`window` 系统手动删除该目录较慢，可以使用该命令来进行删除)
  "clean:lib": "rimraf node_modules"
},
```

### 重新安装依赖

- `pnpm run reinstall`
该命令会先删除 `node_modules`、`yarn.lock`、`package.lock.json` 后再进行依赖重新安装（安装速度会明显变慢）。

接下来你可以修改代码进行业务开发了。我们内建了模拟数据、HMR 实时预览、状态管理、国际化、全局路由等各种实用的功能辅助开发，请阅读其他章节了解更多。

## 目录说明

```bash

├── apps # 项目实际目录
│   ├── ad.qmniu.com # Demo项目
│   │   ├── package.json # package.json
├── packages # 依赖目录
│   ├── configs # 配置目录
│   │   ├── eslint # eslint配置
│   │   ├── stylelint # stylelint配置
│   │   ├── tsconfig # tsconfig配置
│   │   ├── package.json # package.json
│   ├── hooks # hooks 用于ts项目
│   │   ├── base # 用于ts项目
│   │   ├── vue # 用于vue项目
│   │   ├── React # 用于React项目
│   │   ├── package.json # package.json
│   ├── shared # 公共资源 
│   │   ├── enums # 公共枚举
│   │   └── style # 公共样式
│   │   ├── package.json # package.json
│   ├── types # 公共ts声明
│   │   ├── global # 用于ts项目
│   │   ├── vue # 用于vue项目
│   │   ├── React # 用于React项目
│   │   ├── package.json # package.json
│   ├── utils # 公共方法, 为了js项目也能使用, 需要打包
│   │   ├── src # 用于ts项目
│   │   ├── index.ts # 入口文件
│   │   ├── rollup.config.js # 打包文件
│   │   ├── package.json # package.json
│   ├── http # 通讯方法
│   │   ├── src # 用于ts项目
│   │   ├── index.ts # 入口文件
│   │   ├── rollup.config.js # 打包文件
│   │   ├── package.json # package.json
│   ├── vue3-antd-pc-ui # antd公共组件, 需要打包
│   │   ├── src # 用于ts项目
│   │   ├── index.ts # 入口文件
│   │   ├── vite.config.ts # 打包文件
│   │   ├── package.json # package.json
│   ├── vue3-pc-ui # 公共组件, 需要打包
│   │   ├── src # 用于ts项目
│   │   ├── index.ts # 入口文件
│   │   ├── vite.config.ts # 打包文件
│   │   ├── package.json # package.json
│   ├── react-ui # react公共组件, 需要打包
│   │   ├── src # 用于ts项目
│   │   ├── index.ts # 入口文件
│   │   ├── webpack.config.ts # 打包文件
│   │   ├── package.json # package.json
├── template # 模版文件 , 新建项目按需复制
│   ├── vite-vue3 # vue3项目
│   ├── nuxt # nuxt项目
│   ├── react # react项目
│   ├── vitepress # docs项目
├── package.json # package.json
├── turbo.json # 任务安排

```
