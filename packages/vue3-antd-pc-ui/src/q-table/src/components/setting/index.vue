<!--  -->
<template>
    <div :class="prefixCls">
        <redo-setting v-if="getSetting.redo" :getPopupContainer="get_table_container"></redo-setting>
        <size-setting v-if="getSetting.size" :getPopupContainer="get_table_container"></size-setting>
        <column-setting
            v-if="getSetting.setting"
            @columns-change="handle_column_change"
            :getPopupContainer="get_table_container"
        ></column-setting>
    </div>
</template>

<script lang='ts' setup>
import type { TableSetting, ColumnChangeParam } from '../../types/table';
import ColumnSetting from './column-setting.vue';
import SizeSetting from './size-setting.vue';
import RedoSetting from './redo-setting.vue';
import { PropType, computed, unref } from 'vue';
import { useTableContext } from '../../hooks/use-table-context';

const prefixCls = 'q-table-setting';

const props = defineProps({
    setting: {
        type: Object as PropType<TableSetting>,
        default: () => ({})
    }
});

const emit = defineEmits(['columns-change']);

const table = useTableContext();

const getSetting = computed((): TableSetting => {
    return {
        redo: true,
        size: true,
        setting: true,
        fullScreen: false,
        ...props.setting
    };
});

function handle_column_change(data: ColumnChangeParam[]) {
    emit('columns-change', data);
}

function get_table_container() {
    return table ? unref(table.wrapRef) : document.body;
}

</script>
