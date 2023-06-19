# 页面水印组件

页面增加水印, 且不可通过控制台删除

## Usage
::: details 点击啊查看代码
```vue
<template>
    <div id="app" >
        <q-page-watermark class="page-watermark-container" :customStyle="customStyle" name="12312" gapX="130" gapY="80">
            <template #content>
                内容
            </template>
        </q-page-watermark>
    </div>
</template>

<script lang="ts">
import { defineComponent} from 'vue';
import { QPageWatermark } from '@qmfront/vue3-ui';

export default defineComponent({
    name: 'App',
    components: {
        QPageWatermark
    },
    setup() {
        const customStyle = {
            zIndex: '10000', fontWeight: '800', opacity: '0.08'
        }
        return {
            customStyle
        };
    }
});
</script>

```
:::

## API
| 属性   | 类型    | 默认值 | 可选值 | 说明      |
| ------ | ------ | ------ | ---- | ----------- |
| customStyle | `CSSStyleDeclaration` | {}      |  -   | 自定义样式 |
| gapY | `string` | `50px`     |  -   | 上下距离 |
| gapX | `string` | `80px`     |  -   | 左右距离 |
| name | `string` | ``     |  -   | 水印名称 |