# 自定义维度组件

## 功能
选择维度, 并在右侧展示, 并会记录本地

## 展示

<script setup>
    import QmComplexTh from '@components/ad.qmniu.com/qm-complex-th/index.vue';
    import {reactive} from 'vue';
    import {Button as AButton} from 'ant-design-vue'

    const code = `<template>
    <qm-complex-th
        v-model:value="data.value"
        :thList="data.thList"
        title="展示指标"
        :visible="data.visible"
        pageName="test"
        @cancel="data.visible = false;"
        @ok="commit_selfth"
    ></qm-complex-th>
</template>
<script setup>
    import QmComplexTh from '@components/ad.qmniu.com/qm-complex-th/index.vue'
    const data = reactive({
        value: [],
        thList: [{
            title: '1',
            data: [{
                label: '1-1', 
                value: '1-1', 
                children: [
                    {label: '1-1-1', value: '1-1-1'}, 
                    {label: '1-1-2', value: '1-1-2'}, 
                    {label: '1-1-3', value: '1-1-3'}, 
                ]
            }, {
                label: '1-2', 
                value: '1-2', 
                children: [
                    {label: '1-2-1', value: '1-2-1'}, 
                    {label: '1-2-2', value: '1-2-2'}, 
                    {label: '1-2-3', value: '1-2-3'}, 
                ]
            }]
        }],
        visible: false
    })
    function commit_selfth(value) {
        console.log(value)
    }
\<\/script>`;

const data = reactive({
    value: [],
    thList: [{
        title: '自定义维度',
        data: [{
            label: '1-1', 
            value: '1-1', 
            children: [
                {label: '1-1-1', value: '1-1-1'}, 
                {label: '1-1-2', value: '1-1-2'}, 
                {label: '1-1-3', value: '1-1-3'}, 
            ]
        }, {
            label: '1-2', 
            value: '1-2', 
            children: [
                {label: '1-2-1', value: '1-2-1'}, 
                {label: '1-2-2', value: '1-2-2'}, 
                {label: '1-2-3', value: '1-2-3'}, 
            ]
        }]
    }],
    visible: false
})
function commit_selfth(value) {
    console.log(value)
}
</script>

<codeView title="基本用法" description="自定义维度用法">
    <a-button @click="data.visible=true">打开modal</a-button>
    <qm-complex-th
        v-model:value="data.value"
        :thList="data.thList"
        title="展示指标"
        :visible="data.visible"
        pageName="test"
        @cancel="data.visible = false;"
        @ok="commit_selfth"
    ></qm-complex-th>
    <template #codeText>
        <highlight-code :code="code" >
        </highlight-code>
    </template>
</codeView>

<style>
    .ant-checkbox-group {
        width: 100%
    }
</style>


## api

|属性|说明|类型|默认值|
|-----|--|--|--|
|title|modal的标题|`string`|`自定义列表`|
|visible|modal的打开状态|`boolean`|`false`|
|thList|筛选配置项|`IThListUni`|`[]`|
|pageName|当前名称, 用于`localStorage`存储|`boolean`|`false`|
|value|值|`string[]`|`[]`|

```js
{
    title: propTypes.string.def('自定义列表'),
    visible: propTypes.bool.def(false),
    thList: {
        type: Array as PropType<IThListUni[]>,
        default: () => []
    },
    pageName: propTypes.string.def(''),
    value: {
        type: Array as PropType<string[]>,
        default: () => []
    }
}

export interface IThListUni {
    title: string,
    data: (ISelectOption & Record<'checkbox', boolean>)[]
}
```