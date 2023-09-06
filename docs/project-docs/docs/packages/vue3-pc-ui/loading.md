# loading组件

## 使用

<script setup>
    const code = `<template>
   <q-loading :loading="true" size="small" mode="wave" />
</template>
<script setup>
    import {QLoading} from '@q-front-npm/vue3-pc-ui'
\<\/script>
`
</script>

<code-view title="基本用法" description="基本loading用法">
    <div style="overflow:hidden;width:100%">
        <q-loading :loading="true" size="small" mode="wave" />
        <q-loading :loading="true" mode="rotate" />
        <q-loading :loading="true" size="large" mode="four-part" />
        <q-loading :loading="true" size="small" mode="out-in" />
    </div>
    <template #codeText>
        <highlight-code :code="code"/>
    </template>
</code-view>


## API
| 属性   | 类型    | 默认值 | 可选值 | 说明      |
| ------ | ------ | ------ | ---- | ----------- |
| mode | `string` | `rotate` |  `rotate \| four-part \| out-in \| wave` | 动画效果 |
| loading | `boolean` | `false` |  ` | 打开关闭 |
| size | `string` | `default` |  `small, default, large` | 大小 |