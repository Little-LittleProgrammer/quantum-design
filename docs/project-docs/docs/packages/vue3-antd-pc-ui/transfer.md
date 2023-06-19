# 穿梭框

二级筛选框的穿梭组件

## Usage

::: details 点击查看代码
```vue
<!--  -->
<template>
    <div>
        <q-transfer v-bind="data"></q-transfer>
    </div>
</template>

<script lang='ts' setup>
import { reactive } from 'vue'
const data = reactive({
    treeData: [],
    fieldNames: {
        key: 'value',
        title: 'label',
        children: 'children'
    },
})

</script>
<style lang='scss' scoped>
</style>
```
::: 


## API

| 属性   | 类型    | 默认值 | 可选值 | 说明      |
| ------ | ------ | ------ | ---- | ----------- |
| treeData | `ITreeData` | -      |  -   | 筛选框内容 |
| targetKeys(v-model)  |  `string[]` |-      | -      | 目标值  |
| fieldNames  |  `IFieldNames` |-      | -      | 更改所有值的映射  |
| returnAll  |  `boolean` | `false`   | -      | 是否返回父节点  |
| change  |  `emit` | `emit('change', targetKeys, _perentKey);`   | -      | 在改变时触发  |

```ts
export interface ITreeData {
    title: string,
    key: string,
    children?: ITreeData[],
    disabled?: boolean
}

export interface IFieldNames {
    title: string,
    key: string,
    children: string,
}
```