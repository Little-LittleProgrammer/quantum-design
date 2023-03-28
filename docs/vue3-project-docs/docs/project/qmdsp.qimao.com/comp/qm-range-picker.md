# 日期范围选择器 组件

## 功能
带有快捷项功能的日期范围选择器以提高用户体验，可设置禁用条件

## 展示

<script lang="ts" setup>
    import { reactive } from 'vue';
    import QmRangePicker from '@components/qmdsp.qimao.com/qm-range-picker/index.vue';
    import { date_util } from '@wuefront/utils';
    import { Dayjs } from 'dayjs';
    const code = 
`<template>
    <qm-range-picker
        v-model:value="dataState.time"
        :disabledDate="disabledDate"
        @change="time_range_change"
    ></qm-range-picker>
</template>
<script lang="ts" setup>
    import { reactive } from 'vue';
    import QmRangePicker from '@/components/qm-range-picker/index.vue';
    import { date_util } from '@wuefront/utils';
    import { Dayjs } from 'dayjs';

    interface IDataProps {
        time: string[];
        start: string;
        end: string;
    }
    const dataState: IDataProps = reactive({
        time: [],
        start: '',
        end: ''
    });
    // 日期选择器置灰项
    const disabledDate = (current: Dayjs, selectTimeDate: string[]) => {
        if (!selectTimeDate || selectTimeDate.length === 0) {
            return current && current < date_util().startOf('day');
        }
        const _tooLate = selectTimeDate[0] && current.diff(date_util(selectTimeDate[0]), 'days') > 180;
        const _tooEarly = selectTimeDate[1] && date_util(selectTimeDate[1]).diff(current, 'days') > 180;
        return _tooEarly || _tooLate || (current && current < date_util().startOf('day'));
    };
    // 选中值发生改变
    function time_range_change(val: [string, string]) {
        dataState.start = val ? val[0] : '';
        dataState.end = val ? val[1] : '';
    }
<\/script>`
    interface IDataProps {
        time: string[];
        start: string;
        end: string;
    }
    const dataState: IDataProps = reactive({
        time: [],
        start: '',
        end: ''
    });
    // 日期选择器置灰项
    const disabledDate = (current: Dayjs, selectTimeDate: string[]) => {
        if (!selectTimeDate || selectTimeDate.length === 0) {
            return current && current < date_util().startOf('day');
        }
        const _tooLate = selectTimeDate[0] && current.diff(date_util(selectTimeDate[0]), 'days') > 180;
        const _tooEarly = selectTimeDate[1] && date_util(selectTimeDate[1]).diff(current, 'days') > 180;
        return _tooEarly || _tooLate || (current && current < date_util().startOf('day'));
    };
    // 选中值发生改变
    function time_range_change(val: [string, string]) {
        dataState.start = val ? val[0] : '';
        dataState.end = val ? val[1] : '';
    }
</script>
<codeView title="基本用法" description="可通过 showRanges 属性控制是否显示快捷项，也可以设置自定义禁用条件来控制可选择的日期范围">
    <qm-range-picker
        v-model:value="dataState.time"
        :disabledDate="disabledDate"
        @change="time_range_change"
    ></qm-range-picker>
    <template #codeText>
        <highlight-code :code="code"></highlight-code>
    </template>
</codeView>

## API
| 属性   |     类型     |      默认值       | 可选值 | 说明      |
| ------ |  ----------  | --------------- | ---- | ----------- |
| value(v-model) | `string[]` |  -  |  -   | 日期 |
| size | `string` |  'default'   |  default｜small｜large   | 输入框大小 |
| ranges | `string[]` |  全部可选值   |   ['today', 'yesterday', 'last_7_days', 'last_30_days', 'this_week', 'last_week', 'this_month', 'last_month']  | 所展示的快捷项，传空数组则不展示快捷项 |
| valueFormat | `string` |  `YYYY-MM-DD`   |  [可选属性](https://day.js.org/docs/zh-CN/display/format)   | 绑定值的格式 |
| todayDisabled | `boolean` |  false   |  -   | 今日是否禁用 |
| disabledDate | `Function` |  -   |  -   | 不可选择的日期 |

### 事件
| 事件名称   |                 说明                | 回调参数 |
| ------ | ---------------------------------- | ------ | 
| change | 变化时回调函数  |  Function(selectValue)  |