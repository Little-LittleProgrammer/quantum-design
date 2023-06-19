# keep-alive-tabs

:::warning 提示
1. 为了全局美观, tabs与面包屑放在一行里, 会自动适应样式
2. [src/enums/projectEnum.ts](apps/ad.qmniu.com/src/enums/projectEnum.ts)  
    (`cacheTabsSetting.show`) 为开启tab  
    (`cacheTabsSetting.openKeepAlive`) 为开启页面缓存
:::

## 使用
开启方式: [src/enums/projectEnum.ts](apps/ad.qmniu.com/src/enums/projectEnum.ts)里 (`cacheTabsSetting.show`) 设置为true  
右键点击可以打开操作栏

```vue
<template>
  <keep-alive-tabs></keep-alive-tabs>
</template>

<script lang="ts">
import KeepAliveTabs from '@/components/keep-alive-tabs/index.vue';
export default defineComponent({
  components: {KeepAliveTabs}
})
</script>
```


## 原理
大致原理:
1. 将 要展示的tab(tabsList)、要缓存的tab(cacheTabList) 在store声明
2. 在action中声明 操作方法(添加, 删除, 右键点击的方法) - 判断不进行操作的页面, 以及初始化页面
3. 封装hooks, 里面指定初始化方法, 以及将操作方法再次封装, 简化开发
4. 声明操作枚举, 以保证调用和执行的方法为一个方法, 并且方便代码阅读
5. 在vue初始化的时候, 执行路由守卫
6. 书写业务组件

具体实现原理请看
  1.  [packages/vue3-antd-pc-ui/src/components/keep-alive-tabs](packages/vue3-antd-pc-ui/src/components/keep-alive-tabs/index.ts)