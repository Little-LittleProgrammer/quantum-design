# 面包屑组件

## 使用方式
开启方式: [src/enums/projectEnum.ts](apps/ad.qmniu.com/src/enums/projectEnum.ts)里 (`func.showBreadCrumb`) 设置为true  


```vue
<template>
  <q-breadcrumb></q-breadcrumb>
</template>
<script lang="ts">

import QBreadcrumb from '@/components/q-breadcrumb.vue';
export default defineComponent({
  components: {QBreadcrumb}
})
</script>
```

## 说明
与[组件库文档](https://web-tech.qimao.com/component/pc-doc/v2x/q-breadcrumb.html)中的面包屑有一点不一样, 此版本的面包屑不需要传入props, 并且将全部的功能方法抽离, 更加模块化

## 原理
1. 将query存入 对象中
2. 使用路径匹配query

具体实现原理请看项目目录下
  1.  [packages/vue3-antd-ui/src/q-breadcrumb/index.ts](packages/vue3-antd-ui/src/q-breadcrumb/index.ts)

