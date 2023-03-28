# 排期表 组件

## 功能
可拖拽选择周一至周日的时间段，最小单位为半小时

## 展示

<script setup>
    import { ref } from 'vue';
    import { MSchedule as QSchedule } from '@wuefront-ad/mui-vue3';
    import '@wuefront-ad/mui-vue3/dist/style.css';
    const code = 
`<template>
    <q-schedule @receive="schedule_change" :curValue="curValue"></q-schedule>
</template>
<script setup>
    import { ref } from 'vue';
    import { MSchedule as QSchedule } from '@wuefront-ad/mui-vue3';
    import '@wuefront-ad/mui-vue3/dist/style.css';

    const curValue = ref({
        schedule_time: ''
    });
    function schedule_change(value) {
        // 不能缺少这一步
        curValue.value = value;
    }
<\/script>`
    const curValue = ref({
        schedule_time: ''
    });
    function schedule_change(value) {
        // 不能缺少这一步
        curValue.value = value;
    }
</script>
<codeView title="基本用法" description="排期表">
    <q-schedule @receive="schedule_change" :curValue="curValue"></q-schedule>
    <template #codeText>
        <highlight-code :code="code"></highlight-code>
    </template>
</codeView>

## API
| 属性   |                 类型                |  默认值  | 可选值 | 说明      |
| ------ | ---------------------------------- | --------- | ---- | ----------- |
| curValue | `Record<schedule_time, string>` |  {schedule_time: ''}  |  -   | 必填，排期时间选择值 |

### 事件
| 事件名称   |                 说明                | 回调参数 |
| ------ | ---------------------------------- | ------ | 
| receive | 接受组件回传的数据  |  (value: curValue) => void  |