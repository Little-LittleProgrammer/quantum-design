# 图标

项目对 `ant-design-vue` 的图标进行了二次封装, 使其的使用更加贴近 `ant-design-vue`1.x 版本

## 组件库图标
图标使用有两种方式

1. 使用 `ant-design-vue` 提供的图标

```vue
<template>
  <StarOutlined />
  <StarFilled />
  <StarTwoTone twoToneColor="#eb2f96" />
</template>

<script>
  import { defineComponent } from 'vue';
  import { StarOutlined, StarFilled, StarTwoTone } from '@ant-design/icons-vue';
  export default defineComponent({
    components: { StarOutlined, StarFilled, StarTwoTone },
  });
</script>
```

2. 使用 项目中 二次封装的 icon, 方便动态配置

```vue
<template>
  <icon type="StarOutlined" :spin="true">
</template>

<script>
  import { defineComponent } from 'vue';
  import { icon } from '@/components/icon';
  export default defineComponent({
    components: { icon },
  });
</script>
```

## API
| 属性   | 类型    | 默认值 | 可选值 | 说明      |
| ------ | ------ | ------ | ---- | ----------- |
| type | `string` | -      |  -   | `antdv`中的icon标签名 |
| spin  |  `boolean` |  false      | -      | 是否旋转  |