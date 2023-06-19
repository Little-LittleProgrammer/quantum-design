# Vue 3 + Typescript + Vite

这个模板可以帮助你开始使用Vue 3和Vite中的Typescript进行开发。

## 推荐IDE安装

[VSCode] (https://code.visualstudio.com/) + (Volar) (https://marketplace.visualstudio.com/items?itemName=octref.Volar)

### 如果使用 `<script setup>`

[` <script setup> `](https://github.com/vuejs/rfcs/pull/227)是目前处于RFC阶段的一个特性。要获得对语法的正确IDE支持，请使用[Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)而不是Vetur(并禁用Vetur)。

## 支持 `.vue` TS中的引入

因为TypeScript不能处理`.vue `的导入，所以`import 'xxx.vue'` 的时候会报错, 有两种解决方法
1. 使用volar插件
2. 声明
```js
declare module '*.vue' {
    import { DefineComponent } from 'vue'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
    const component: DefineComponent<{}, {}, any>
    export default component
  }
```


## 使用
1. ****使用前请更新 q-front-npm 所有组件版本****
2. 开发前, 请务必看文档