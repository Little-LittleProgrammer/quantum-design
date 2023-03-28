# loading组件

## 使用

1. 使用方式

```vue
<template>
  <q-loading :loading="true" size="small" mode="rotate" />
</template>

<script>
  import { defineComponent } from 'vue';
  import { qLoading } from '@/components/q-loading';
  export default defineComponent({
    components: { qLoading },
  });
</script>
```

## API
| 属性   | 类型    | 默认值 | 可选值 | 说明      |
| ------ | ------ | ------ | ---- | ----------- |
| rotate | `string` | `rotate` |  `rotate \| four-part \| out-in \| wave` | 动画效果 |
| loading | `boolean` | `false` |  ` | 是否旋转 |
| size | `string` | `default` |  `small, default, large` | 大小 |