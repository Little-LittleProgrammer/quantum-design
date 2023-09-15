<!--  -->
<template>
    <div :class="prefixCls" v-if="getTitle">
        <span>{{ getTitle }}</span>
        <Tooltip>
            <template #title>
                <template v-for="item in getHelpMessage" :key="item">
                    <p>{{ item }}</p>
                </template>
            </template>
            <InfoCircleOutlined></InfoCircleOutlined>
        </Tooltip>
    </div>
</template>

<script lang='ts' setup>
import { InfoCircleOutlined } from '@ant-design/icons-vue';
import { js_is_function, js_is_string } from '@quantum-design/utils';
import { Tooltip } from 'ant-design-vue';
import { PropType, computed } from 'vue';
defineOptions({
    name: 'QAntdTableTitle'
});

const props = defineProps({
    title: {
        type: [Function, String] as PropType<string | ((data: any) => string)>
    },
    getSelectRows: {
        type: Function as PropType<() => any[]>
    },
    helpMessage: {
        type: [String, Array] as PropType<string | string[]>
    }
});

const prefixCls = 'q-table-basic-header-title';

const getHelpMessage = computed(() => {
    if (js_is_string(props.helpMessage)) {
        return [props.helpMessage];
    }
    return props.helpMessage;
});

const getTitle = computed(() => {
    const { title, getSelectRows = () => {} } = props;
    let _title = title;

    if (js_is_function(title)) {
        _title = title({
            selectRows: getSelectRows()
        });
    }
    return _title;
});

</script>
