# 项目配置项

用于修改项目的配色、布局、缓存、多语言、组件默认配置

## 环境变量配置

项目的环境变量配置位于项目根目录下的 [.env](https://github.com/anncwb/vite-project/blob/main/.env)、[.env.development](https://github.com/anncwb/vite-project/blob/main/.env.development)、[.env.production](https://github.com/anncwb/vite-project/blob/main/.env.production)

具体可以参考 [Vite 文档](https://github.com/vitejs/vite#modes-and-environment-variables)

```bash
.env                # 在所有的环境中被载入
.env.local          # 在所有的环境中被载入，但会被 git 忽略
.env.[mode]         # 只在指定的模式中被载入
.env.[mode].local   # 只在指定的模式中被载入，但会被 git 忽略

```

::: tip 温馨提醒

- 只有以 `VITE_ ` 开头的变量会被嵌入到客户端侧的包中，你可以项目代码中这样访问它们：

```js
console.log(import.meta.env.VITE_PROT);
```

<!-- - 以 `VITE_GLOB_*` 开头的的变量，在打包的时候，会被加入[\_app.config.js](#生产环境动态配置)配置文件当中. -->

:::

### 配置项说明

### .env

所有环境适用

```bash
# port
VITE_PORT = 8081
VITE_APP_RELEASE_VERSION = 'vue-project-temp 1.0.0'
VITE_GLOB_APP_TITLE = 'vue-project-temp 1.0.0'

# 路由基本前缀路径
VITE_BASE_PATH = '/'
```

### .env.development

开发环境适用

```bash


# public path
VITE_APP_BASE_API = 

# Delete console
VITE_DROP_CONSOLE = false

# 开发环境的接口
VITE_GLOB_API_URL = '/'

# 本开发环境的接口前缀
VITE_GLOB_API_URL_PREFIX = '/manage'

# 本地上传前缀, 主要用于设置代理
VITE_GLOB_UPLOAD_URL= '/upload'

# 设置代理 ["/upload","http://aliyun/upload"]
VITE_PROXY = [["/api","https://zhike.qimao.com"]]
```

::: warning 注意

这里配置的 `VITE_PROXY` 以及 `VITE_GLOB_API_URL`, /api 需要是唯一的，不要和接口有的名字冲突

如果你的接口是 `http://localhost:3000/api` 之类的，请考虑将 `VITE_GLOB_API_URL=/xxxx` 换成别的名字

:::

### .env.production

生产环境适用

```bash
# 打包是否输出gz｜br文件
# 可选: gzip | brotli | none
# 也可以有多个, 例如 ‘gzip’|'brotli',这样会同时生成 .gz和.br文件
VITE_BUILD_COMPRESS = 'gzip'

# 是否压缩图片
VITE_USE_IMAGEMIN= true

#pwa
VITE_USE_PWA = false

# 生产版本请求路径
VITE_GLOB_API_URL = 'https://zhike.qimao.com'

# 生产环境 请求路径前缀
VITE_GLOB_API_URL_PREFIX = '/manage'

# 生产环境 上传请求路径
VITE_GLOB_UPLOAD_URL = '/upload'
```

### 如何获取变量

1. 使用 `import.meta.env` 可以获得以 `VITE_` 开口的 env文件变量
2. 使用 `/build/utils.ts` 里的 `wrapperEnv`方法也可获得全局变量
 
### 如何新增

1. 首先在 `.env` 或者对应的开发环境配置文件内，新增需要可动态配置的变量，需要以 `VITE_`开头

2. 在 `types/global.d.ts` 的 `ViteEnv`接口中新增此变量

## 生产环境动态配置

### 说明

当执行`yarn build`构建项目之后，会自动生成 `_app.config.js` 文件并插入 `index.html`。

**注意: 开发环境不会生成**

```js
// _app.config.js
// 变量名命名规则  __PRODUCTION__xxx_CONF__   xxx：为.env配置的VITE_GLOB_APP_SHORT_NAME
window.__PRODUCTION__VUE_VBEN_ADMIN__CONF__ = {
  VITE_GLOB_APP_TITLE: 'qm',
};
```

### 作用

`_app.config.js` 用于项目在打包后，需要动态修改配置的需求，如接口地址。不用重新进行打包，可在打包后修改 `/dist/_app.config.js` 内的变量，刷新即可更新代码内的局部变量。变量须以`VITE_GLOB_`开头


## 项目配置

### 配置文件路径
[src/enums/projectEnum.ts]()

### 说明

```js
const setting = {
    // 主题配置
    theme: {
        // 是否展示主题切换按钮
        showDarkModeToggle: true,
        // 是否开启网站灰色模式，悼念的日期开启(4.4, 4.5, 12.13)
        grayMode: true
    },
    // 功能配置
    func: {
        // 是否展示菜单搜索按钮
        showSearchButton: true,
        // 是否开启回到顶部
        showBackTop: true,
        // 显示面包屑
        showBreadCrumb: true,
        // 是否显示刷新按钮
        showReloadButton: true,
        // 左侧菜单栏是否可重复点击
        asideRepeatClick: false,
        // 切换界面的时候是否取消已经发送但是未响应的http请求, openKeepAlive为true是失效
        removeAllHttpPending: true
    },
    // 动画配置
    transition: {
        // 是否开启页面切换动画
        enable: true,
        // 是否打开页面切换loading
        openPageLoading: true,
        // 是否打开页面切换顶部进度条
        openNProgress: false
    },
    cacheTabsSetting: {
        show: true,
        // 是否开启KeepAlive缓存
        openKeepAlive: true,
        // 是否展示快速操作
        showQuick: true,
        // 是否可以拖拽
        canDrag: true,
        // 刷新后是否保留已经打开的标签页
        cache: false
    }
};
```

## 样式配置

### 全局样式路径
[src/assets/]()

### 颜色配置路径
[src/assets/includes/base.scss]()