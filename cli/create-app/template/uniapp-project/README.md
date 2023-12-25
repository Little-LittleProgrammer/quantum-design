## uniapp 小程序模板
uniapp + vue3 + js + pinia

### 1. 目录

|-- src

​	|-- api

​		|-- http.js  请求方法

​		|-- sensors.js  埋点

​	|-- assets

​		|-- js 公共 js 方法

​		|-- style 基础样式

​	|-- components   公共组件

​	|-- pages 页面

​		|-- index

​			|-- index.vue

​			|-- components 页面相关组件

​	|-- qm-statistics 埋点方法

​	|-- static 静态图片资源，打包会复制到 /dist

​	|-- store 状态管理

​	|-- subpages 分包

​	|-- pages.json  配置

​	|-- uni.scss  uni-app内置的常用样式变量



### 2. 编写规范

#### 2.1 基础规范

​	http://wiki.km.com/pages/viewpage.action?pageId=2428382#id-%E8%A7%84%E8%8C%83-4%E3%80%81ES6%E8%A7%84%E8%8C%83

#### 2.2 其他规范

1. 对应页面的接口请求，在 api 中新建对应 js 文件， 

2. 公共组件放 components 下， 以 qm- 开头， 页面相关组件在页面文件下新建 components

3. src/assets/js/tools 命名规范为 js_tools_

4. store状态管理根据功能模块划分





