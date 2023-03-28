# 多选按钮 组件

## 功能
单选项（不限）和自定义多选项混合展示

## 展示

<script setup>
    import { reactive } from 'vue';
    import QmCheckboxGroup from '@components/qmdsp.qimao.com/qm-checkbox-group/index.vue';
    const code = 
`<template>
    <qm-checkbox-group
        v-model:value="dataState.value"
        :options="optionsWithDisabled"
        :disabled="false"
        @change="checkbox_group_change"
    >
    </qm-checkbox-group>
</template>
<script setup>
    import { reactive } from 'vue';
    import QmCheckboxGroup from '@/components/qm-checkbox-group/index.vue';
    const optionsWithDisabled = [
        { label: 'Apple', value: 'Apple' },
        { label: 'Pear', value: 'Pear', disabled: false },
        { label: 'Orange', value: 'Orange', disabled: false }
    ];
    const dataState = reactive({
        value: ['Apple', 'Orange']
    });
    function checkbox_group_change(val) {
        console.log(val);
    }
<\/script>`
    const optionsWithDisabled = [
        { label: 'Apple', value: 'Apple' },
        { label: 'Pear', value: 'Pear', disabled: false },
        { label: 'Orange', value: 'Orange', disabled: false }
    ];
    const dataState = reactive({
        value: ['Apple', 'Orange']
    });
    function checkbox_group_change(val) {
        console.log(val);
    }
</script>
<codeView title="基本用法" description="不限和自定义多选项之间可相互切换">
    <qm-checkbox-group
        v-model:value="dataState.value"
        :options="optionsWithDisabled"
        :disabled="false"
        @change="checkbox_group_change"
    >
    </qm-checkbox-group>
    <template #codeText>
        <highlight-code :code="code"></highlight-code>
    </template>
</codeView>

## API
| 属性   |                 类型                | 默认值 | 可选值 | 说明      |
| ------ | ---------------------------------- | ------ | ---- | ----------- |
| value(v-model) | `string[]｜number[]` |  -  |  -   | 指定选中的选项 |
| options | `string[], number[], Array<{ label: string; value: string｜number; disabled?: boolean; }>` |  -   |  -   | 以配置形式设置自定义可选项 |
| disabled | `boolean` |  false   |  false｜true   | 整组失效 |

### 事件
| 事件名称   |                 说明                | 回调参数 |
| ------ | ---------------------------------- | ------ | 
| change | 变化时回调函数  |  Function(checkedValue)  |