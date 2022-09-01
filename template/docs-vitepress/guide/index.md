# 开始

  <template>
      <div>
        asdasd
      </div>
  </template>

  <script type="text/javascript">
  export default {
      name: '1',
      data() {
          return {

          };
      },
      components: {
      },
      mounted() {
      },
      methods: {
      }
  };
  </script>




本文会帮助你从头启动项目

:::

## 环境准备

本地环境需要安装 [Yarn1.x](https://yarnpkg.com/)、[Node.js](http://nodejs.org/) 和 [Git](https://git-scm.com/)

::: warning 注意

- [Node.js](http://nodejs.org/) 版本要求`12.x`以上，且不能为`13.x`版本，这里推荐 `14.x` 及以上。

:::

## 工具配置

如果您使用的 IDE 是[vscode](https://code.visualstudio.com/)(推荐)的话，可以安装以下工具来提高开发效率及代码格式化

- [Iconify IntelliSense](https://marketplace.visualstudio.com/items?itemName=antfu.iconify) - Iconify 图标插件
- [windicss IntelliSense](https://marketplace.visualstudio.com/items?itemName=voorjaar.windicss-intellisense) - windicss 提示插件=
- [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar) - vue3 开发必备
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) - 脚本代码检查
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) - 代码格式化
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

#### yarn 安装

如果未安装`yarn`，可以用下面命令来进行全局安装(也可使用npm安装)

```bash
# 全局安装yarn
npm i -g yarn
# 验证
yarn -v # 出现对应版本号即代表安装成功
```

#### 依赖安装命令

在项目根目录下，打开命令窗口执行，耐心等待安装完成即可

```bash
# 安装依赖
yarn or npm i
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

- `npm run reinstall`
该命令会先删除 `node_modules`、`yarn.lock`、`package.lock.json` 后再进行依赖重新安装（安装速度会明显变慢）。

接下来你可以修改代码进行业务开发了。我们内建了模拟数据、HMR 实时预览、状态管理、国际化、全局路由等各种实用的功能辅助开发，请阅读其他章节了解更多。

## 目录说明

```bash

.
├── build # 打包脚本相关
│   ├── config # 配置文件
│   └── vite # vite配置
├── public # 公共静态资源目录
├── src # 主目录
│   ├── assets # 资源文件
│   │   ├── font # 字体文件
│   │   ├── images # 项目存放图片的文件夹
│   │   ├── ts # 工具文件
│   │   └── style # 样式文件
│   ├── components # 公共组件
│   ├── directives # 指令
│   ├── enums # 枚举/常量
│   │   ├── cipherEnum # 加密密钥设置
│   │   ├── dateEnum # 日期格式化格式设置
│   │   ├── memorialEnum # 纪念日枚举设置
│   │   ├── projectEnum # 项目配置
│   │   └── regEnum # 正则配置
│   ├── hooks # hook
│   │   ├── vite # vite 变量获取
│   │   ├── Vuex # vuex hook
│   │   └── web # web相关hook
│   ├── http # web 通讯目录
│   │   ├── api # 接口文件
│   │   ├── axios # axios封装
│   │   └── check-status # 状态检查处理
│   ├── layout # 布局文件
│   │   └── index # 页面布局
│   ├── main.ts # 主入口
│   ├── router # 路由配置
│   │   ├── index # 主文件
│   │   ├── base # 基本页面
│   │   ├── setup-router # 初始化项目,安装的路有守卫
│   │   └── modules # 模块
│   ├── store # 数据仓库
│   ├── views # 页面
│   └── App.vue # 主页面
├── tests # 测试
│   └── server # 测试用到的服务
│       ├── api # 测试服务器
│       ├── upload # 测试上传服务器
│       └── websocket # 测试ws服务器
├── .env # 环境属性
├── types # 全局类型文件
│   ├── global.d.ts # 业务常用接口
│   ├── http.d.ts # 通讯常用接口
│   ├── index.d.ts # 全局变量类型声明常用接口
│   ├── vite-env.d.ts # vue全局声明, 使用volar后可以删除
│   └── router.d.ts # 路由接口
├── tsconfig.json # ts配置文件
└── vite.config.ts # vite配置文件

```
