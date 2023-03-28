# tag组件


## 使用

1. 使用方式

```vue
<template>
  <qm-tag value="qm" />
</template>

<script>
  import { defineComponent } from 'vue';
  import { qmTag } from '@/components/qm-tag';
  export default defineComponent({
    components: { qmTag },
  });
</script>
```


## API
| 属性   | 类型    | 默认值 | 可选值 | 说明      |
| ------ | ------ | ------ | ---- | ----------- |
| value | `string` | -      |  -   | tag值 |
