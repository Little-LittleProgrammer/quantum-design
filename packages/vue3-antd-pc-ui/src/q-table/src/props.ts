import type { Component, PropType } from 'vue';
import type { PaginationProps } from './types/pagination';
import type {
    BasicColumn,
    FetchSetting,
    TableSetting,
    SorterResult,
    TableCustomRecord,
    TableRowSelection,
    SizeType,
    Recordable,
    IOptionsTable,
    BasicTableProps
} from './types/table';
import type { FormProps } from '@vue3-antd/q-form';

import { DEFAULT_FILTER_FN, DEFAULT_SORT_FN, FETCH_SETTING, DEFAULT_SIZE } from './enums/const';
import { propTypes } from '@quantum-design/types/vue/types';

export const basicProps = {
    clickToRowSelect: { type: Boolean, default: true, },
    isTreeTable: Boolean,
    tableSetting: propTypes.shape<TableSetting>({}),
    inset: Boolean,
    sortFn: {
        type: Function as PropType<(sortInfo: SorterResult) => any>,
        default: DEFAULT_SORT_FN,
    },
    filterFn: {
        type: Function as PropType<(data: Partial<Recordable<string[]>>) => any>,
        default: DEFAULT_FILTER_FN,
    },
    showTableSetting: Boolean,
    autoCreateKey: { type: Boolean, default: true, },
    striped: { type: Boolean, default: true, },
    summaryFunc: {
        type: [Function, Array] as PropType<(...arg: any[]) => any[]>,
        default: null,
    },
    summaryData: { // 优先级大于 summaryFunc
        type: Array as PropType<Recordable[]>,
        default: null,
    },
    indentSize: propTypes.number.def(24),
    canColDrag: { type: Boolean, default: true, },
    api: {
        type: Function as PropType<(...arg: any[]) => Promise<any>>,
        default: null,
    },
    exportSetting: {
        type: Object as PropType<BasicTableProps['exportSetting']>,
        default: null,
    },
    useExtraComponents: { type: Array as PropType<string[]>, default: () => [], },
    beforeFetch: {
        type: Function as PropType<Fn>,
        default: null,
    },
    afterFetch: {
        type: Function as PropType<Fn>,
        default: null,
    },
    handleSearchInfoFn: {
        type: Function as PropType<Fn>,
        default: null,
    },
    fetchSetting: {
        type: Object as PropType<FetchSetting>,
        default: () => {
            return FETCH_SETTING;
        },
    },
    // 立即请求接口
    immediate: { type: Boolean, default: true, },
    emptyDataIsShowTable: { type: Boolean, default: true, },
    // 额外的请求参数
    searchInfo: {
        type: Object as PropType<Recordable>,
        default: null,
    },
    // 默认的排序参数
    defSort: {
        type: Object as PropType<Recordable>,
        default: null,
    },
    // 使用搜索表单
    useSearchForm: propTypes.bool,
    // 表单配置
    formConfig: {
        type: Object as PropType<Partial<FormProps>>,
        default: null,
    },
    columns: { // 基本信息列
        type: Array as PropType<BasicColumn[]>,
        default: () => [],
    },
    columnsConfig: { // 当 columns 为服务端返回时， 自定义 header 属性的
        type: Object as PropType<IOptionsTable<any>>,
        default: () => {},
    },
    showIndexColumn: { type: Boolean, default: true, },
    indexColumnProps: {
        type: Object as PropType<BasicColumn>,
        default: () => {},
    },
    needActionColumn: propTypes.bool.def(true), // 是否需要操作列
    actionColumn: { // 操作列属性
        type: Object as PropType<BasicColumn>,
        default: null,
    },
    ellipsis: { type: Boolean, default: true, },
    resizable: { type: Boolean, default: true, },
    isCanResizeParent: { type: Boolean, default: false, },
    canResize: { type: Boolean, default: true, },
    clearSelectOnPageChange: propTypes.bool,
    resizeHeightOffset: propTypes.number.def(0),
    rowSelection: {
        type: Object as PropType<TableRowSelection | null>,
        default: null,
    },
    title: {
        type: [String, Function] as PropType<string | ((data: Recordable) => string)>,
        default: null,
    },
    titleHelpMessage: {
        type: [String, Array] as PropType<string | string[]>,
    },
    maxHeight: propTypes.number,
    dataSource: {
        type: Array as PropType<Recordable[]>,
        default: null,
    },
    rowKey: {
        type: [String, Function] as PropType<string | ((record: Recordable) => string)>,
        default: '',
    },
    bordered: propTypes.bool.def(true),
    pagination: {
        type: [Object, Boolean] as PropType<PaginationProps | boolean>,
        default: null,
    },
    loading: propTypes.bool,
    rowClassName: {
        type: Function as PropType<(record: TableCustomRecord<any>, index: number) => string>,
    },
    scroll: {
        type: Object as PropType<{ x: number | string | true; y: number | string }>,
        default: null,
    },
    beforeEditSubmit: {
        type: Function as PropType<
        (data: {
            record: Recordable;
            index: number;
            key: string | number;
            value: any;
        }) => Promise<any>
        >,
    },
    size: {
        type: String as PropType<SizeType>,
        default: DEFAULT_SIZE,
    },
};
