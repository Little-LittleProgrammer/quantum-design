<!--  -->
<template>
    <div :class="prefixCls">
        <div :class="prefixCls+'-top'" v-if="$slots.headerTop"><slot name="headerTop"></slot></div>
        <div :class="prefixCls+'-context'">
            <slot name="tableTitle" v-if="$slots.tableTitle"></slot>
            <table-title :help-message="titleHelpMessage" :title="title" v-if="!$slots.tableTitle && title"></table-title>
            <div :class="prefixCls+'-toolbar'">
                <slot name="toolbar"></slot>
                <Divider type="vertical" v-if="$slots.toolbar && showTableSetting" />
                <table-setting-comp
                    :setting="tableSetting"
                    v-if="showTableSetting"
                    @columns-change="handle_column_change"
                />
            </div>
        </div>
    </div>
</template>

<script lang='ts' setup>
import { PropType } from 'vue';
import {Divider} from 'ant-design-vue';
import type { TableSetting, ColumnChangeParam } from '../../types/table';
import TableTitle from './table-title.vue';
import TableSettingComp from '../setting/index.vue';
interface titleData {
    selectRows: any[]
}

defineOptions({
    name: 'QAntdTableHeader'
});

defineProps({
    title: {
        type: [Function, String] as PropType<string | ((data: titleData) => string)>
    },
    tableSetting: {
        type: Object as PropType<TableSetting>
    },
    showTableSetting: {
        type: Boolean
    },
    titleHelpMessage: {
        type: [String, Array] as PropType<string | string[]>,
        default: ''
    }
});

function handle_column_change(data: ColumnChangeParam[]) {
    emit('columns-change', data);
}
const emit = defineEmits(['columns-change']);
const prefixCls = 'q-table-basic-header';

</script>
<style lang='scss' scoped>
</style>
