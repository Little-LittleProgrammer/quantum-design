# 项目开发

## monorepo项目
1. 复制 `template` 文件夹下的 `monorepo`文件夹, 到各自组项目仓库中
2. 复制 `vue3-antd-vite` 到 各自组项目仓库 中的 `apps`文件夹下, 并更改文件夹名称与`package.json`的名称
3. 复制 `vue3-project-docs` 到 各自组项目仓库 中的 `docs` 文件夹下, 并更改文件夹名称与`package.json`的名称
4. 将多项目公用的方法, 组件, 样式 等 封装至 各自组项目仓库 中的 `packages` 文件夹下

### 项目公共部分

#### 公共的组件库

##### 要用到的基本包
> @q-front-npm 开头的包的版本 请按照 npm库版本进行更新
```json
"dependencies": {
    "@q-front-npm/shared": "1.0.0", 
    "@q-front-npm/utils": "1.0.0",
    "@q-front-npm-configs/vite": "1.0.0",
    "vue": "3.2.47",
    "vue-router": "4.1.6"
  },
  "devDependencies": {
    "@q-front-npm/types": "1.0.0",
    "sass": "1.63.3"
  }
```

##### 搭建流程
具体请参考 [packages/vue3-pc-ui/vite.config.ts](packages/vue3-pc-ui/vite.config.ts)

##### 开发注意事项

::: danger 注意事项
开发文件夹格式要以下格式开发, 并且在组件中引入 `style/index.scss`
```
|-you-component
    |-src
        |-style
            |-index.scss
        |- xxx
    |-index
```
:::

目的: 为了项目中不用再次引入样式

#### 公共的方法库
##### 要用到的基本包
> @q-front-npm 开头的包的版本 请按照 npm库版本进行更新
```json
"dependencies": {
    "@q-front-npm/shared": "1.0.0",
    "@q-front-npm/utils": "1.0.0",
},
"devDependencies": {
    "@q-front-npm/types": "1.0.0",
    "@q-front-npm-configs/rollup": "1.0.0",
}
```

##### 搭建流程
具体请参考 [packages/utils/rollup.config.mjs](packages/utils/rollup.config.mjs)

## 单项目
1. 复制 `vue3-antd-vite` 到 单仓库 下, 并更改`package.json`的名称

## 后台项目

### vite环境变量
1. .env.development
```bash

# 路由基本前缀路径
VITE_BASE_PATH = '/'

# Delete console
VITE_DROP_CONSOLE = false

# 开发环境的接口
VITE_GLOB_API_URL = ''

# 本开发环境的接口前缀 /api /local
VITE_GLOB_API_URL_PREFIX = '/local'

# sentry
VITE_USE_SENTRY = false

# 本地上传前缀, 主要用于设置代理
VITE_GLOB_UPLOAD_URL= '/local'

# 设置代理 ["/upload","http://aliyun/upload"]
VITE_PROXY = [["/api","https://api-ad.qmniu.com"], ["/local","http://127.0.0.1:8999/local"]]
```

2. .env.production

```bash
# 路由基本前缀路径
VITE_BASE_PATH = '/'

# 注释console.log
VITE_DROP_CONSOLE = true

# 打包是否输出gz｜br文件
# 可选: gzip | brotli | none
# 也可以有多个, 例如 ‘gzip’|'brotli',这样会同时生成 .gz和.br文件
VITE_BUILD_COMPRESS = 'none'
VITE_USE_VISUALIZER = false

#pwa
VITE_USE_PWA = true

# sentry
VITE_USE_SENTRY = true

# 生产版本请求路径
VITE_GLOB_API_URL =https://ad.qmniu.com

# 生产环境 请求路径前缀
VITE_GLOB_API_URL_PREFIX = '/api'

# 生产环境 上传请求路径
VITE_GLOB_UPLOAD_URL =https://ad.qmniu.com/api
```