# 前言

::: danger 注意事项

1. 组件的 `defaultXXX` 属性不要使用，`ant-design-vue 2.2` 版本之后将会逐步移除。二次封装的组件也不兼容 `defaultXXX` 属性。
2. 代码演示, 只展示重要片段, 不代表全部代码

:::

## ant-design-vue

> 目录: [src/antd.ts](apps/ad.qmniu.com/src/antd.ts) 中配置想使用的组件

## 组件使用方式
分为两种情况
### 第一种, 未使用插件 `vite-plugin-components`

  - 和vue2 使用方式一致

```js
import Search from '@/components/search/search.vue';
export default defineComponent({
  components: { Search },
})
```

### 第二种 使用插件 `vite-plugin-components`

 - 这种方式下, 不需要引入任何组件(antd组件, 自定义组件), 页面中直接使用即可


