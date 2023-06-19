# search

::: tip

- 全局搜索, 搜索权限内的菜单

:::

## 使用方式

```vue
<template>
  <search :visible="visible"></search>
</template>
<script lang="ts">

import Search from '@/components/search/search.vue';
export default defineComponent({
  components: {search}
})
</script>

```



## 原理
1. 将 服务器返回的菜单数据拍平, 并保存到对象中
2. 根据搜索词, 查询条件, 并且根据pid和id匹配祖先
3. 展示

目录: [packages/vue3-antd-pc-ui/src/q-search](packages/vue3-antd-pc-ui/src/q-search/index.ts)