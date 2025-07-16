import type { ColumnProps } from 'ant-design-vue/lib/table';
import type { TableRowSelection as ITableRowSelection, ColumnFilterItem } from 'ant-design-vue/lib/table/interface';
import type { PaginationProps } from './pagination';
import type { FormProps } from '@vue3-antd/q-form';
import type { VNodeChild } from 'vue';
import type { ComponentType } from './component-type';
import type { JSX } from 'vue/jsx-runtime';

export declare type SortOrder = 'ascend' | 'descend';

export type Recordable<T = any> = {
    [x: string]: T;
}
// current page data
export interface TableCurrentDataSource<T = any> {
    currentDataSource: T[];
}

export interface TableRowSelection<T = any> extends ITableRowSelection {
    /**
     * Callback executed when selected rows change
     * @type Function
     */
    onChange?: (selectedRowKeys: string[] | number[], selectedRows: T[]) => any;
    /**
     * Callback executed when select/deselect one row
     * @type Function
     */
    onSelect?: (record: T, selected: boolean, selectedRows: object[], nativeEvent: Event) => any;

    /**
     * Callback executed when select/deselect all rows
     * @type Function
     */
    onSelectAll?: (selected: boolean, selectedRows: T[], changeRows: T[]) => any;
    /**
     * Callback executed when row selection is inverted
     * @type Function
     */
    onSelectInvert?: (selectedRows: string[] | number[]) => any;
}

// current row data
export interface TableCustomRecord<T = Recordable> {
    record?: T;
    index?: number;
}

// current expanded row data
export interface ExpandedRowRenderRecord<T> extends TableCustomRecord<T> {
    indent?: number;
    expanded?: boolean;
}

// table header filters props - 使用 ant-design-vue 的 ColumnFilterItem 类型
// export interface ColumnFilterItem {
//     text: string;
//     value: string;
//     children?:
//     | any[]
//     | (((props: Record<string, any>) => any[]) & (() => any[]) & (() => any[]));
// }

// table header sorters props
export interface SorterResult {
    column: ColumnProps;
    order: SortOrder; // 'ascend' or 'descend';
    field: string; // 排序字段
    columnKey: string; // 需要排序的列
}

// api params
export interface FetchParams {
    searchInfo?: Record<string, any>; // formData
    page?: number; // current page
    sortInfo?: Record<string, any>;
    filterInfo?: Record<string, any>;
}

// column data filter
export interface GetColumnsParams {
    ignoreIndex?: boolean; // filter rowkey
    ignoreAction?: boolean; // filter action
    sort?: boolean; // re sort by fix [ ...fixedLeft, ...def, ... fixedRight]
}

// table size
export type SizeType = 'default' | 'middle' | 'small' | 'large';

// table action type api
export interface TableActionType {
    reload: (opt?: FetchParams) => Promise<void>;
    setSelectedRows: (rows: Recordable[]) => void;
    getSelectRows: <T = Recordable>() => T[];
    clearSelectedRowKeys: () => void;
    expandAll: () => void;
    expandRows: (keys: string[] | number[]) => void;
    collapseAll: () => void;
    scrollTo: (pos: string) => void; // pos: id | "top" | "bottom"
    getSelectRowKeys: () => string[];
    deleteSelectRowByKey: (key: string) => void;
    setPagination: (info: Partial<PaginationProps>) => void;
    setTableData: <T extends Recordable = Recordable>(values: T[]) => void;
    updateTableDataRecord: (rowKey: string | number, record: Recordable) => Recordable | void;
    deleteTableDataRecord: (rowKey: string | number | string[] | number[]) => void;
    insertTableDataRecord: (record: Recordable | Recordable[], index?: number) => Recordable[] | void;
    findTableDataRecord: (rowKey: string | number) => Recordable | void;
    getColumns: (opt?: GetColumnsParams) => BasicColumn[];
    setColumns: (columns: BasicColumn[] | string[]) => void;
    getDataSource: <T extends Recordable = Recordable>() => T[];
    getRawDataSource: <T = Recordable>() => T;
    setLoading: (loading: boolean) => void;
    setProps: (props: Partial<BasicTableProps>) => void;
    redoHeight: () => void;
    setSelectedRowKeys: (rowKeys: string[] | number[]) => void;
    getPaginationRef: () => PaginationProps | boolean;
    getSize: () => SizeType;
    getRowSelection: () => TableRowSelection<Recordable>;
    getCacheColumns: () => BasicColumn[];
    emit?: EmitType;
    updateTableData: (index: number, key: string, value: any) => Recordable;
    setShowPagination: (show: boolean) => Promise<void>;
    getShowPagination: () => boolean;
    setCacheColumnsByField?: (dataIndex: string | undefined, value: BasicColumn) => void;
    setCacheColumns?: (columns: BasicColumn[]) => void;
    exportData: (opt?: FetchParams) => Promise<any>;
}
// table api Mapping field, support 'a.b.c'
// pageField, sizeField, listField, totalField, headerField, summaryField
export interface FetchSetting {
    // page key, default: 'page'
    pageField: string;
    // size key, default: 'page_size'
    sizeField: string;
    // list key  default: 'list'
    listField: string;
    // total key default: 'count'
    totalField: string;
    summaryField: string; // default: 'total'
    actionField: string; // default 'action'
    headerField: string; // default 'header'
}

// table setting set table base conf
export interface TableSetting {
    redo?: boolean;
    size?: boolean;
    setting?: boolean;
    fullScreen?: boolean;
    export?: boolean;
    cache?: boolean;
}

export interface ExtraComponents {
    component: string;
    componentProps: Record<string, any>;
}

// base
export interface BasicTableProps<T = any> {
    // 点击行选中
    clickToRowSelect?: boolean;
    isTreeTable?: boolean;
    // 自定义排序方法
    sortFn?: (sortInfo: SorterResult) => any;
    // 排序方法
    filterFn?: (data: Partial<Recordable<string[]>>) => any;
    // 取消表格的默认padding
    inset?: boolean;
    // 显示表格设置
    showTableSetting?: boolean;
    tableSetting?: TableSetting;
    // 斑马纹
    striped?: boolean;
    // 是否自动生成key
    autoCreateKey?: boolean;
    // 计算合计行的方法
    summaryFunc?: (...arg: any) => Recordable[];
    // 自定义合计表格内容
    summaryData?: Recordable[];
    summaryConfig?: {fixed: string};
    // 是否可拖拽列
    canColDrag?: boolean;
    // 接口请求对象
    api?: (...arg: any) => Promise<any>;
    exportSetting?: {
        custom?: boolean;
        api: (...arg: any) => Promise<any>;
        beforeFetch?: Fn;
        afterFetch?: Fn;
    }
    useExtraComponents?: ExtraComponents[];
    // 请求之前处理参数
    beforeFetch?: Fn;
    // 自定义处理接口返回参数
    afterFetch?: Fn;
    // 查询条件请求之前处理
    handleSearchInfoFn?: Fn;
    // 请求接口配置
    fetchSetting?: Partial<FetchSetting>;
    // 立即请求接口
    immediate?: boolean;
    // 在开起搜索表单的时候，如果没有数据是否显示表格
    emptyDataIsShowTable?: boolean;
    // 额外的请求参数
    searchInfo?: Recordable;
    // 默认的排序参数
    defSort?: Recordable;
    // 使用搜索表单
    useSearchForm?: boolean;
    // 表单配置
    formConfig?: Partial<FormProps>;
    // 列配置
    columns: BasicColumn[];
    columnsConfig: IOptionsTable<any>;
    // 是否显示序号列
    showIndexColumn?: boolean;
    // 序号列配置
    indexColumnProps?: BasicColumn;
    // 是否需要操作列
    needActionColumn?: boolean;
    actionColumn?: BasicColumn;
    // 文本超过宽度是否显示。。。
    ellipsis?: boolean;
    // 列表是否可拖拽
    resizable?: boolean;
    // 是否继承父级高度（父级高度-表单高度-padding高度）
    isCanResizeParent?: boolean;
    // 是否可以自适应高度
    canResize?: boolean;
    // 自适应高度偏移， 计算结果-偏移量
    resizeHeightOffset?: number;

    // 在分页改变的时候清空选项
    clearSelectOnPageChange?: boolean;
    //
    rowKey?: string | ((record: Recordable) => string);
    // 数据
    dataSource?: Recordable[];
    // 标题右侧提示
    titleHelpMessage?: string | string[];
    // 表格滚动最大高度
    maxHeight?: number;
    // 是否显示边框
    bordered?: boolean;
    // 分页配置
    pagination?: PaginationProps | boolean;
    // loading加载
    loading?: boolean;

    /**
     * The column contains children to display
     * @default 'children'
     * @type string | string[]
     */
    childrenColumnName?: string;

    /**
     * Override default table elements
     * @type object
     */
    components?: object;

    /**
     * Expand all rows initially
     * @default false
     * @type boolean
     */
    defaultExpandAllRows?: boolean;

    /**
     * Initial expanded row keys
     * @type string[]
     */
    defaultExpandedRowKeys?: string[];

    /**
     * Current expanded row keys
     * @type string[]
     */
    expandedRowKeys?: string[];

    /**
     * Expanded container render for each row
     * @type Function
     */
    expandedRowRender?: (record?: ExpandedRowRenderRecord<T>) => VNodeChild | JSX.Element;

    /**
     * Customize row expand Icon.
     * @type Function | VNodeChild
     */
    expandIcon?: Fn | VNodeChild | JSX.Element;

    /**
     * Whether to expand row by clicking anywhere in the whole row
     * @default false
     * @type boolean
     */
    expandRowByClick?: boolean;

    /**
     * The index of `expandIcon` which column will be inserted when `expandIconAsCell` is false. default 0
     */
    expandIconColumnIndex?: number;

    /**
     * Table footer renderer
     * @type Function | VNodeChild
     */
    footer?: Fn | VNodeChild | JSX.Element;

    /**
     * Indent size in pixels of tree data
     * @default 15
     * @type number
     */
    indentSize?: number;

    /**
     * i18n text including filter, sort, empty text, etc
     * @default { filterConfirm: 'Ok', filterReset: 'Reset', emptyText: 'No Data' }
     * @type object
     */
    locale?: object;

    /**
     * Row's className
     * @type Function
     */
    rowClassName?: (record: TableCustomRecord<T>, index: number) => string;

    /**
     * Row selection config
     * @type object
     */
    rowSelection?: TableRowSelection;

    /**
     * Set horizontal or vertical scrolling, can also be used to specify the width and height of the scroll area.
     * It is recommended to set a number for x, if you want to set it to true,
     * you need to add style .ant-table td { white-space: nowrap; }.
     * @type object
     */
    scroll?: { x?: number | string | true; y?: number | string };

    /**
     * Whether to show table header
     * @default true
     * @type boolean
     */
    showHeader?: boolean;

    /**
     * Size of table
     * @default 'default'
     * @type string
     */
    size?: SizeType;

    /**
     * Table title renderer
     * @type Function | ScopedSlot
     */
    title?: VNodeChild | JSX.Element | string | ((data: Recordable) => string);

    /**
     * Set props on per header row
     * @type Function
     */
    customHeaderRow?: (column: ColumnProps, index: number) => object;

    /**
     * Set props on per row
     * @type Function
     */
    customRow?: (record: T, index: number) => object;

    /**
     * `table-layout` attribute of table element
     * `fixed` when header/columns are fixed, or using `column.ellipsis`
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/table-layout
     * @version 1.5.0
     */
    tableLayout?: 'auto' | 'fixed' | string;

    /**
     * the render container of dropdowns in table
     * @param triggerNode
     * @version 1.5.0
     */
    getPopupContainer?: (triggerNode?: HTMLElement) => HTMLElement;

    /**
     * Data can be changed again before rendering.
     * The default configuration of general user empty data.
     * You can configured globally through [ConfigProvider](https://antdv.com/components/config-provider-cn/)
     *
     * @version 1.5.4
     */
    transformCellText?: Fn;

    /**
     * Callback executed before editable cell submit value, not for row-editor
     *
     * The cell will not submit data while callback return false
     */
    beforeEditSubmit?: (data: {
        record: Recordable;
        index: number;
        key: string | number;
        value: any;
    }) => Promise<any>;

    /**
     * Callback executed when pagination, filters or sorter is changed
     * @param pagination
     * @param filters
     * @param sorter
     * @param currentDataSource
     */
    onChange?: (pagination: any, filters: any, sorter: any, extra: any) => void;

    /**
     * Callback executed when the row expand icon is clicked
     *
     * @param expanded
     * @param record
     */
    onExpand?: (expande: boolean, record: T) => void;

    /**
     * Callback executed when the expanded rows change
     * @param expandedRows
     */
    onExpandedRowsChange?: (expandedRows: string[] | number[]) => void;

    onColumnsChange?: (data: ColumnChangeParam[]) => void;

}

// customRender
export type CellFormat =
  | string
  | ((text: string, record: Recordable, index: number) => string | number)
  | Map<string | number, any>;

// BasicColumn
export interface BasicColumn extends ColumnProps<Recordable> {
    children?: BasicColumn[];
    filters?: ColumnFilterItem[];

    //
    flag?: 'INDEX' | 'DEFAULT' | 'CHECKBOX' | 'RADIO' | 'ACTION';
    customTitle?: VNodeChild | JSX.Element;

    slots?: Recordable;

    // Whether to hide the column by default, it can be displayed in the column configuration
    defaultHidden?: boolean;

    // Help text for table column header
    helpMessage?: string | string[];

    format?: CellFormat;

    // Editable
    edit?: boolean;
    editRow?: boolean;
    editable?: boolean;
    editComponent?: ComponentType;
    editComponentProps?:
    | ((opt: {
        text: string | number | boolean | Recordable;
        record: Recordable;
        column: BasicColumn;
        index: number;
    }) => Recordable)
    | Recordable;
    editRule?: boolean | ((text: string, record: Recordable) => Promise<string>);
    editValueMap?: (value: any) => string;
    onEditRow?: () => void;
    // 权限编码控制是否显示 authCode
    auth?: string | string[];
    // 业务控制是否显示
    ifShow?: boolean | ((column: BasicColumn) => boolean);
    // 自定义修改后显示的内容
    editRender?: (opt: {
        text: string | number | boolean | Recordable;
        record: Recordable;
        column: BasicColumn;
        index: number;
    }) => VNodeChild | JSX.Element;
    // 动态 Disabled
    editDynamicDisabled?: boolean | ((record: Recordable) => boolean);
}

export type ColumnChangeParam = {
    dataIndex: string;
    fixed: boolean | 'left' | 'right' | undefined;
    visible: boolean;
};

// 列改变事件
export interface InnerHandlers {
    onColumnsChange: (data: ColumnChangeParam[]) => void;
}

export type IOptionsTable<C extends string | number | symbol> = {
    alignData?: Partial<Record<C | 'all', 'left' | 'right' | 'center'>>;
    widthData?: Partial<Record<C | 'all', string | number>>,
    fixedData?: Partial<Record<C | 'all', 'left' | 'right'>>,
    sortData?: (C | 'all' | undefined)[] | Partial<Record<(C | 'all'), Fn>>;
    customTitle?: (C | 'all')[],
    customCell?:Partial< Record<(C | 'all'), any>>,
    resizableData?: Partial<Record<C | 'all', boolean>> // 是否可拖拽
}
