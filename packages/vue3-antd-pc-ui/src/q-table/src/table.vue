<!--  -->
<template>
    <div ref="wrapRef" :class="getWrapperClass">
        <card size="small" class="g-mb">
            <q-antd-form
                ref="formRef"
                submitOnReset
                v-if="getBindValues.useSearchForm"
                v-bind="getFormProps"
                :tableAction="tableAction"
                @register="registerForm"
                @submit="handleSearchInfoChange"
            >
                <template #[replaceFormSlotKey(item)]="data" v-for="item in getFormSlotKeys">
                    <slot :name="item" v-bind="data || {}"></slot>
                </template>
            </q-antd-form>
        </card>
        <card size="small">
            <Table ref="tableElRef"
                v-bind="getBindValues"
                :rowClassName="getRowClassName"
                v-show="getEmptyDataIsShowTable"
                @change="handle_table_change"
                @resizeColumn="handle_resize_change"
            >
                <template #headerCell="{ column }">
                    <header-cell :column="column" />
                </template>
                <template #bodyCell="data">
                    <slot name="bodyCell" v-bind="data || {}"></slot>
                </template>
                <template v-if="getSummaryData.length > 0" #summary>
                    <table-summary-row v-for="(item, _index) in getSummaryData" :key="_index">
                        <table-summary-cell v-for="(e, _index2) in Object.keys(item)" :key="_index2">{{ item[e] }}</table-summary-cell>
                    </table-summary-row>
                </template>
            </Table>
        </card>
    </div>
</template>

<script lang='ts' setup>
import { computed, ref, toRaw, unref, useAttrs, useSlots } from 'vue';
import { basicProps } from './props';
import QAntdForm, { useForm } from '@vue3-antd/q-form';
import { Card, Table, TableSummaryRow, TableSummaryCell } from 'ant-design-vue';
import { BasicTableProps, ColumnChangeParam, InnerHandlers, SizeType, TableActionType } from './types/table';

import { usePagination } from './hooks/use-pagination';

import { useLoading } from './hooks/use-loading';
import { useTableStyle } from './hooks/use-table-style';

import './style/table.scss';
import { useDataSource } from './hooks/use-data-source';
import { js_is_function } from '@quantum-design/utils';
import { useSummary } from './hooks/use-summary';
import { useColumns } from './hooks/use-columns';
import { useTableForm } from './hooks/use-table-form';
import { createTableContext } from './hooks/use-table-context';
import { useRowSelection } from './hooks/use-row-selection';
import {useTableScroll} from './hooks/use-table-scroll';
import {useTableScrollTo} from './hooks/use-scroll-to';
import { omit } from 'lodash-es';
import { useTableHeader } from './hooks/use-table-header';
import { useCustomRow } from './hooks/use-cuctom-row';
import { useTableExpand } from './hooks/use-table-expand';
import HeaderCell from './components/header/header-cell.vue';

defineOptions({
    name: 'QAntdTable'
});

const props = defineProps(basicProps);
const emit = defineEmits([
    'fetch-success',
    'fetch-error',
    'selection-change',
    'register',
    'row-click',
    'row-dbClick',
    'row-contextmenu',
    'row-mouseenter',
    'row-mouseleave',
    'edit-end',
    'edit-cancel',
    'edit-row-end',
    'edit-change',
    'expanded-rows-change',
    'change',
    'columns-change']);
const attrs = useAttrs();
const slots = useSlots();

const tableElRef = ref(null);
const tableData = ref([]);
const summaryData = ref([]);
const columns = ref([]);

const wrapRef = ref(null);
const formRef = ref(null);
const innerPropsRef = ref<Partial<BasicTableProps>>();

const prefixCls = 'q-table';
const [registerForm, formActions] = useForm();

const getProps = computed(() => {
    return { ...props, ...unref(innerPropsRef) } as BasicTableProps;
});

const { getLoading, setLoading } = useLoading(getProps);
const {
    getPaginationInfo,
    getPagination,
    setPagination,
    setShowPagination,
    getShowPagination
} = usePagination(getProps);

const {
    getRowSelection,
    getRowSelectionRef,
    getSelectRows,
    setSelectedRows,
    clearSelectedRowKeys,
    getSelectRowKeys,
    deleteSelectRowByKey,
    setSelectedRowKeys
} = useRowSelection(getProps, tableData, emit);

const {
    handleTableChange,
    getDataSourceRef,
    getDataSource,
    getRawDataSource,
    setTableData,
    updateTableDataRecord,
    deleteTableDataRecord,
    insertTableDataRecord,
    findTableDataRecord,
    fetch,
    getRowKey,
    reload,
    getAutoCreateKey,
    updateTableData
} = useDataSource(
    getProps,
    {
        tableData,
        getPaginationInfo,
        setLoading,
        setPagination,
        getFieldsValue: formActions.getFieldsValue,
        clearSelectedRowKeys,
        columns,
        summaryData
    },
    emit
);

const {
    getViewColumns,
    getColumns,
    setCacheColumnsByField,
    setCacheColumns,
    setColumns,
    getColumnsRef,
    getCacheColumns
} = useColumns(getProps, {columns});

const { getScrollRef, redoHeight } = useTableScroll(
    getProps,
    tableElRef,
    getColumnsRef,
    getRowSelectionRef,
    getDataSourceRef,
    wrapRef,
    formRef
);

const { scrollTo } = useTableScrollTo(tableElRef, getDataSourceRef);

function handle_table_change(...args: any) {
    /* eslint-disable  */ 
    handleTableChange.call(undefined, ...args);
    emit('change', ...args);
    // 解决通过useTable注册onChange时不起作用的问题
    const { onChange } = unref(getProps);
    onChange && js_is_function(onChange) && onChange.call(undefined, ...args);
}

function handle_resize_change(w: number, col: any) {
    col.width = w
}

const { getFormProps, replaceFormSlotKey, getFormSlotKeys, handleSearchInfoChange } = useTableForm(getProps, slots, fetch, getLoading);

const { customRow } = useCustomRow(getProps, {
    setSelectedRowKeys,
    getSelectRowKeys,
    clearSelectedRowKeys,
    getAutoCreateKey,
    emit: emit,
});

const { getRowClassName } = useTableStyle(getProps, prefixCls);

const { getExpandOption, expandAll, expandRows, collapseAll } = useTableExpand(
    getProps,
    tableData,
    emit,
);

const {getSummaryData} = useSummary(getProps, {
    getDataSourceRef,
    summaryData
})

const getWrapperClass = computed(() => {
    const values = unref(getBindValues);
    return [
        prefixCls,
        attrs.class,
        {
            [`${prefixCls}-form-container`]: values.useSearchForm,
            [`${prefixCls}--inset`]: values.inset
        }
    ];
});

const handlers: InnerHandlers = {
        onColumnsChange: (data: ColumnChangeParam[]) => {
          emit('columns-change', data);
          // support useTable
          unref(getProps).onColumnsChange?.(data);
        },
      };

const { getHeaderProps } = useTableHeader(getProps, slots, handlers);

const getBindValues = computed(() => {
    const dataSource = unref(getDataSourceRef);
    let propsData: any = {
        ...attrs,
        customRow,
        ...unref(getProps),
        ...unref(getHeaderProps),
        scroll: unref(getScrollRef),
        loading: unref(getLoading),
        tableLayout: 'fixed',
        rowSelection: unref(getRowSelectionRef),
        rowKey: unref(getRowKey),
        columns: toRaw(unref(getViewColumns)),
        pagination: toRaw(unref(getPaginationInfo)),
        dataSource,
        ...unref(getExpandOption),
    };
    // if (slots.expandedRowRender) {
    //   propsData = omit(propsData, 'scroll');
    // }

    propsData = omit(propsData, ['class', 'onChange']);
    return propsData;
});

const getEmptyDataIsShowTable = computed(() => {
    const { emptyDataIsShowTable, useSearchForm } = unref(getProps);
    if (emptyDataIsShowTable || !useSearchForm) {
        return true;
    }
    return !!unref(getDataSourceRef).length;
});

function setProps(props: Partial<BasicTableProps>) {
    innerPropsRef.value = { ...unref(innerPropsRef), ...props };
}

const tableAction: TableActionType = {
    reload,
    getSelectRows,
    setSelectedRows,
    clearSelectedRowKeys,
    getSelectRowKeys,
    deleteSelectRowByKey,
    setPagination,
    setTableData,
    updateTableDataRecord,
    deleteTableDataRecord,
    insertTableDataRecord,
    findTableDataRecord,
    redoHeight,
    setSelectedRowKeys,
    setColumns,
    setLoading,
    getDataSource,
    getRawDataSource,
    setProps,
    getRowSelection,
    getPaginationRef: getPagination,
    getColumns,
    getCacheColumns,
    emit,
    updateTableData,
    setShowPagination,
    getShowPagination,
    setCacheColumnsByField,
    expandAll,
    expandRows,
    collapseAll,
    scrollTo,
    getSize: () => {
        return unref(getBindValues).size as SizeType;
    },
    setCacheColumns,
};

createTableContext({ ...tableAction, wrapRef, getBindValues });

defineExpose(tableAction);

emit('register', tableAction, formActions);

</script>
