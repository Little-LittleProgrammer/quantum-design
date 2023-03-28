# 介绍

## 简介

Vite-project 是一个基于 [Vue3.X](https://github.com/vuejs/vue-next)、[Vite2.0](https://github.com/vitejs/vite)、 [Ant-Design-Vue2.x](https://2x.antdv.com/docs/vue/introduce-cn/)、[TypeScript](https://www.typescriptlang.org/)、[monorepo]() 的中后台解决方案.


## 优势
### VITE优点介绍
1. 在开发模式下, 可以更方便的进行调适, 可以极速的启用本地服务, 并且支持以很快的方式进行热重载
2. 丰富的功能: 对TS、 jsx、css 等很多常用的配置无需下载另外的插件
3. 针对ts, 可以更方便的进行打包前的代码类型校验
4. 可以本地build后并预览
### TS优点介绍
1. 可以在构建期间, 即代码的编写期间就可以进行代码类型校验, 提升开发效率
2. 规范代码, 更加清晰思路
3. 接口便是最好的文档
4. 类型语法提示



## 针对vue2拓展
此项目 在原来的 `vue-project-single` 项目基础上, 拓展了
- 框架上, 升级到了 `vue3 + ts + vite`

- 架构上, 升级到了 `monorepo`的 `turborepo`解决方案 

- 开发时, 只需关注业务代码和配置文件, 无需更改核心文件

- 内容上, 额外拓展了 (以下拓展均可在 [src/enum/projectEnum]()中配置是否开启), 具体在[项目配置查看](settings.md?#项目配置)
    1. 主题切换, 暗黑模式, 正常模式, 灰色模式
    2. 全局搜索, 可根据菜单名称搜索, 并跳到搜索的页面
    3. 显示keepAliveTabs缓存
    4. 显示面包屑
    5. 页面切换动画
    6. 页面切换loading
    7. 页面顶部进度条
    8. 切换菜单时, 取消正在发送未返回的请求, keep-alive开启时无效
    9. 页面刷新按钮
    10. 左侧菜单是否可以重复点击
    11. 回到顶部

- 针对业务组件上, 二次封装了`a-form`, `table`, `loading`等大量的`antd`组件   
    采用v-bind, 使开发`form`和`table`时只需传入json数据便自动生成

- 全局配置上, 更加细致了env配置, 具体在[项目配置查看](settings.md?#环境变量配置)
    1. 生产模式: 可配置跨域接口, 上传接口以及接口前缀, 并增加了是否开启`代码压缩`,`pwa`的配置项,
    2. .env变量获取方法封装, 更方便的去使用

- 全局模块化, 公共方法, 公共变量, 接口, 常用方法全部抽离
    1. `vuex, vue-router`, 二次封装, 更方便的使用
    2. 业务上 `antd-message, antd-modal, echarts`, 二次封装, 更方便的去使用
    3. 全局变量, 配置项, 正则, 抽离至 [enums]() 文件中
    5. storage二次封装, 加入了过期时间, 与重要storage加密处理逻辑
    6. 更加全面的工具库, 优化了原有基础方法, 并拓展了 对象判断, dom操作, 加密, 主题配置, 时间格式, props类型声明

- 更加全面的 axios 封装, 增加如下配置
    ```js
    // 默认将prefix 添加到url
    joinPrefix: true,
    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
    isReturnNativeResponse: false,
    //  是否加入时间戳
    joinTime: true,
    // 是否在请求中加入环境参数
    joinEnv: true,
    // 忽略重复请求
    cancelToken: true,
    // 消息提示类型
    errorMessageMode: 'message',
    // 接口地址
    apiUrl: env.apiUrl,
    // 接口拼接地址
    urlPrefix: env.urlPrefix
    ```

- `vite plugin` 配置, 单独文件夹配置,更加精细的进行了模块化, 目录[build]()  
    1. 将跨域方法,单独提出, 并暴露出核心的api, 方便以后更改管理
    2. 将所有的plugins配置, 都单独抽离到一个文件中, 方便管理, 即根据业务添加

- 更小的打包体积, 在拓展这么多的功能基础上, dist文件夹, 比原有的小了 2.5m 左右

## 需要掌握的基础知识

本项目需要一定前端基础知识，请确保掌握 Vue 的基础知识，以便能处理一些常见的问题。
建议在开发前先学一下以下内容，提前了解和学习这些知识，会对项目理解非常有帮助:

- [Vue3 文档](https://v3.vuejs.org/)
<!-- - [Vue-RFCS](https://github.com/vuejs/rfcs) -->
- [Vue2 迁移到 3](https://v3.vuejs.org/guide/migration/introduction.html)
- [TypeScript](https://www.typescriptlang.org/)
- [Vue-router](https://next.router.vuejs.org/)
- [Ant-Design-Vue](https://2x.antdv.com/docs/vue/introduce-cn/)
- [Es6](https://es6.ruanyifeng.com/)
- [Vitejs](https://vitejs.dev/)
<!-- - [WindiCss](https://windicss.netlify.app/) -->


## vite 插件推荐

如果这些插件对你有帮助，可以给一个 star 支持下

- [vite-plugin-html](https://github.com/anncwb/vite-plugin-html) - 用于 `html` 模版转换，可以在`html`文件内进行书写模版语法
- [vite-plugin-style-import](https://github.com/anncwb/vite-plugin-style-import) - 用于组件库样式按需引入
- [vite-plugin-imagemin](https://github.com/anncwb/vite-plugin-imagemin) - 用于打包压缩图片资源
- [vite-plugin-compression](https://github.com/anncwb/vite-plugin-compression) - 用于打包输出`.gz`|`.br`文件

## 浏览器支持

**本地开发**推荐使用`Chrome 最新版`浏览器，**不支持**`Chrome 80`以下版本。

**生产环境**支持现代浏览器，不支持 IE。

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png" alt="IE" width="24px" height="24px"  />](http://godban.github.io/browsers-support-badges/)IE | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt=" Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)Safari |
| :-: | :-: | :-: | :-: | :-: |
| not support | last 2 versions | last 2 versions | last 2 versions | last 2 versions |
