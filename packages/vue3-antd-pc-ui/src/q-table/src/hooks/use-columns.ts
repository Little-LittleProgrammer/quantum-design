import { type ComputedRef, type Ref, computed, reactive, ref, toRaw, unref, watch } from 'vue';
import type { BasicColumn, BasicTableProps, CellFormat, GetColumnsParams, Recordable } from '../types/table';
import { cloneDeep, isEqual } from 'lodash-es';
import { FETCH_SETTING, DEFAULT_ALIGN, DEFAULT_NORMAL_WIDTH } from '../enums/const';
import { isArray, isBoolean, isObject, isFunction, isMap, isNumber, isString, js_utils_deep_copy, js_utils_get_current_url } from '@quantum-design/utils';
import { render_edit_cell } from '../components/editable';
import dayjs from 'dayjs';
import { IndexedDB } from '@quantum-design/utils';

interface ActionType {
    columns: Ref<Recordable[]>
}

const map = new Map<string, BasicColumn[]>();
let db: IndexedDB | null = null;

function getIndeDB() {
    if (db && !db.support()) {
        return false;
    }
    db = new IndexedDB('vue3-antd-pc-ui', 'q-antd-table');
    return db;
}

async function getIndexDBValue() {
    console.log('getIndexDBValue', map);
    if (map.size > 0) {
        return;
    }
    const db = getIndeDB();
    if (!db) {
        return;
    }
    const res = await db.getAll();
    if (res?.code !== 200) {
        console.log('IndexDB 获取失败', res);
        return;
    }
    for (const item of res.data) {
        map.set(item.key, item.value);
    }
    console.log('getTableIndexDBValueMap', map);
}
getIndexDBValue();

function set_cache(arr: BasicColumn[], cacheObj:Recordable) {
    for (const item of arr) {
        const _key = item.key || item.dataIndex as string;
        // if (item.children) {
        //     set_cache(item.children, cacheObj);
        // }
        if (cacheObj[_key]) {
            Object.assign(cacheObj[_key], item);
        } else {
            cacheObj[_key] = item;
        }
    }
}

function merge_data(arr: BasicColumn[], cacheObj: Recordable, isChild = false) {
    for (const item of arr) {
        const _key = item.key || item.dataIndex as string;
        if (item.children) {
            merge_data(item.children, cacheObj, true);
        }
        if (cacheObj[_key]) {
            if (isChild) {
                Reflect.deleteProperty(cacheObj, _key);
            } else {
                Object.assign(cacheObj[_key], item);
            }
        } else {
            cacheObj[_key] = item;
        }
    }
}

/**
 *
 * @param arr1 props传入的
 * @param arr2 api返回的
 * @returns
 */
function deep_merge_by_key(arr1: BasicColumn[], arr2: BasicColumn[]): BasicColumn[] {
    if (!arr1 || arr1.length == 0) {
        return arr2 || [];
    }
    if (!arr2 || arr2.length == 0) {
        return arr1 || [];
    }
    const _cacheObj: Recordable = {};
    set_cache(arr2, _cacheObj);
    merge_data(arr1, _cacheObj);
    return Object.values(_cacheObj);
}

// ellipsis, resizable 统一设置进去
function handle_item(item: BasicColumn, options: Record<'resizable' | 'ellipsis', boolean>, canResize: boolean) {
    const { key, dataIndex, children } = item;
    const {ellipsis, resizable } = options;
    item.align = item.align || DEFAULT_ALIGN;
    if (ellipsis) {
        if (!key) {
            item.key = dataIndex as any;
        }
        if (!isObject(item.ellipsis)) {
            Object.assign(item, {
                ellipsis
            });
        }
    }
    if (resizable) {
        if (!key) {
            item.key = dataIndex as any;
        }
        if (!isObject(item.resizable) && !canResize) {
            const _obj: any = {
                resizable
            };
            if (!isNumber(item.width)) {
                console.info(`当 resizable 为 ture 时，请保证 width 属性设置, 且存在一项不设置width，当前以默认为您设置为${DEFAULT_NORMAL_WIDTH}`);
                _obj.width = DEFAULT_NORMAL_WIDTH;
            }
            Object.assign(item, _obj);
        }
    }
    if (children && children.length) {
        handle_children(children, options, canResize);
    }
}

// 处理 treetable
function handle_children(children: BasicColumn[] | undefined, options: Record<'resizable' | 'ellipsis', boolean>, canResize: boolean) {
    if (!children) return;
    children.forEach((item) => {
        const { children } = item;
        handle_item(item, options, canResize);
        handle_children(children, options, canResize);
    });
}

function handle_action_column(propsRef: ComputedRef<BasicTableProps>, columns: BasicColumn[], actionField: string) {
    const { actionColumn, needActionColumn } = unref(propsRef);
    if (!needActionColumn) return;
    columns.push({
        fixed: 'right',
        title: '操作',
        key: actionField,
        align: 'center',
        dataIndex: actionField,
        minWidth: 100,
        width: DEFAULT_NORMAL_WIDTH,
        ...actionColumn
    });
}

function sort_fixed_column(columns: BasicColumn[]) {
    const _fixedLeftColumns: BasicColumn[] = [];
    const _fixedRightColumns: BasicColumn[] = [];
    const defColumns: BasicColumn[] = [];
    for (const column of columns) {
        if (column.fixed === 'left') {
            _fixedLeftColumns.push(column);
            continue;
        }
        if (column.fixed === 'right') {
            _fixedRightColumns.push(column);
            continue;
        }
        defColumns.push(column);
    }
    return [..._fixedLeftColumns, ...defColumns, ..._fixedRightColumns].filter(
        (item) => !item.defaultHidden
    );
}

// format cell
export function format_cell(text: string, format: CellFormat, record: Recordable, index: number) {
    if (!format) {
        return text;
    }

    // custom function
    if (isFunction(format)) {
        return format(text, record, index);
    }

    try {
        // date type
        const DATE_FORMAT_PREFIX = 'date|';
        if (isString(format) && format.startsWith(DATE_FORMAT_PREFIX) && text) {
            const _dateFormat = format.replace(DATE_FORMAT_PREFIX, '');

            if (!_dateFormat) {
                return text;
            }
            return dayjs(text).format(_dateFormat);
        }

        // Map
        if (isMap(format)) {
            return format.get(text);
        }
    } catch (error) {
        console.log(error);
        return text;
    }
}

/**
 * 将IndexDB中存储的列和_header的列合并
 * @param headerColumns _header中的列配置
 * @param indexDBColumns IndexDB中存储的列配置
 * @returns 合并后的列配置
 */
function merge_header_with_indexdb(headerColumns: BasicColumn[], indexDBColumns: BasicColumn[] | null): BasicColumn[] {
    if (!indexDBColumns || indexDBColumns.length === 0) {
        return headerColumns;
    }

    if (!headerColumns || headerColumns.length === 0) {
        return indexDBColumns;
    }

    // 创建索引映射，方便查找
    const headerMap = new Map<string, BasicColumn>();
    const indexDBMap = new Map<string, BasicColumn>();

    // 构建映射表
    headerColumns.forEach(column => {
        const key = column.dataIndex as string || column.key as string;
        if (key) {
            headerMap.set(key, column);
        }
    });

    indexDBColumns.forEach(column => {
        const key = column.dataIndex as string || column.key as string;
        if (key) {
            indexDBMap.set(key, column);
        }
    });

    const result: BasicColumn[] = [];
    const processedKeys = new Set<string>();

    // 先按照IndexDB的顺序处理
    indexDBColumns.forEach(indexDBColumn => {
        const key = indexDBColumn.dataIndex as string || indexDBColumn.key as string;
        if (key) {
            const headerColumn = headerMap.get(key);
            if (headerColumn) {
                // 当_header中和indexdb中都存在的，将_header和indexdb合并
                // 以_header为主，但保留indexdb中的一些用户配置（如宽度、排序等）
                const mergedColumn = {
                    ...headerColumn,
                    // 保留IndexDB中的用户配置
                    width: indexDBColumn.width || headerColumn.width,
                    defaultHidden: indexDBColumn.defaultHidden,
                    fixed: indexDBColumn.fixed !== undefined ? indexDBColumn.fixed : headerColumn.fixed,
                    sorter: indexDBColumn.sorter !== undefined ? indexDBColumn.sorter : headerColumn.sorter,
                    // 其他可能的用户配置
                    resizable: indexDBColumn.resizable !== undefined ? indexDBColumn.resizable : headerColumn.resizable,
                    ellipsis: indexDBColumn.ellipsis !== undefined ? indexDBColumn.ellipsis : headerColumn.ellipsis
                };
                result.push(mergedColumn);
            } else {
                // 当_header中不存在，indexdb中存在，保留indexdb的
                // result.push(indexDBColumn);
            }
            processedKeys.add(key);
        }
    });

    // 处理headerColumns中存在但indexdb中不存在的列
    headerColumns.forEach(headerColumn => {
        const key = headerColumn.dataIndex as string || headerColumn.key as string;
        if (key && !processedKeys.has(key)) {
            // 当_header中存在，indexdb中不存在，直接将_header添加
            result.push(headerColumn);
        }
    });

    return result;
}

export function useColumns(
    propsRef: ComputedRef<BasicTableProps>,
    {
        columns
    }: ActionType
) {
    const columnsRef = ref(unref(propsRef).columns) as unknown as Ref<BasicColumn[]>;
    let cacheColumns = unref(propsRef).columns;
    const actionField = unref(propsRef).fetchSetting?.actionField || FETCH_SETTING.actionField;
    const autoScrollXConf = {
        auto: false,
        columnsLen: 0
    };
    const getColumnsRef = computed(() => {
        const _columns = cloneDeep(unref(columnsRef));

        handle_action_column(propsRef, _columns, actionField);
        if (!_columns) {
            return [];
        }
        const { ellipsis, resizable } = unref(propsRef);

        _columns.forEach((item, index) => {
            const { customRender, slots, dataIndex } = item;

            const _options = {
                ellipsis: isBoolean(item.ellipsis) ? item.ellipsis : !!ellipsis && !customRender && !slots,
                resizable: isBoolean(item.resizable) ? item.resizable : !!resizable && !customRender && !slots
            };

            if (dataIndex !== actionField) {
                handle_item(
                    item,
                    _options,
                    (item.fixed === 'left' || item.fixed === 'right') || index === _columns.length - 2
                );
            }
        });
        return _columns;
    });

    function isIfShow(column: BasicColumn): boolean {
        const _ifShow = column.ifShow;

        let _isIfShow = true;

        if (isBoolean(_ifShow)) {
            _isIfShow = _ifShow;
        }
        if (isFunction(_ifShow)) {
            _isIfShow = _ifShow(column);
        }
        return _isIfShow;
    }

    const getViewColumns = computed(() => {
        const _viewColumns = sort_fixed_column(unref(getColumnsRef));

        function map_fn(column:BasicColumn) {
            const { slots, customRender, format, edit, editRow } = column;

            if (!slots || !slots?.title) {
                // column.slots = { title: `header-${dataIndex}`, ...(slots || {}) };
                column.customTitle = column.title as any;
                Reflect.deleteProperty(column, 'title');
            }

            const _isAction = column.key === actionField;

            if (!customRender && format && !edit && !_isAction) {
                column.customRender = ({ text, record, index }) => {
                    return format_cell(text, format, record, index);
                };
            }

            // edit table
            if ((edit || editRow) && !_isAction) {
                column.customRender = render_edit_cell(column);
            }
            return reactive(column);
        }
        const _columns = cloneDeep(_viewColumns);
        const finalColumns = _columns
            .filter((column) => isIfShow(column))
            .map((column) => {
                // Support table multiple header editable
                if (column.children?.length) {
                    column.children = column.children.map(map_fn);
                }
                return map_fn(column);
            });
        console.log('getViewColumns', _columns);
        const len = finalColumns.length;
        if ((isBoolean(propsRef.value.scroll?.x) && propsRef.value.scroll?.x) || autoScrollXConf.auto) {
            autoScrollXConf.auto = true;
        }
        if (autoScrollXConf.auto && autoScrollXConf.columnsLen !== len) {
            autoScrollXConf.columnsLen = len;
            // @ts-expect-error - scroll.x 计算
            const scrollX = finalColumns.reduce((acc: number, column) => {
                return acc + (Number(column.width) || 0);
            }, 0) + 150;
            propsRef.value.scroll!.x = scrollX;
        }
        return finalColumns;
    });

    const getFlatColumns = computed(() => {
        const _columns: BasicColumn[] = [];
        function dfs(arr: BasicColumn[]) {
            for (const item of arr) {
                if (item.children) {
                    dfs(item.children);
                } else {
                    _columns.push(item);
                }
            }
        }
        dfs(unref(getViewColumns));
        return _columns;
    });

    watch(
        [() => unref(propsRef).columns, () => unref(columns)],
        ([columnsProp, column]) => {
            const _header = deep_merge_by_key((columnsProp || []), (unref(column) || []));

            // 如果启用了缓存设置，则从IndexDB获取存储的列配置并合并
            let finalColumns = _header;
            const indexDBColumns = getColumnsFromIndexDB();
            if (isArray(indexDBColumns) && indexDBColumns.length > 0) {
                console.log('indexDBColumns', indexDBColumns);
                finalColumns = merge_header_with_indexdb(_header, indexDBColumns);
            }

            columnsRef.value = finalColumns;
            cacheColumns = finalColumns?.filter(item => item.dataIndex !== actionField) ?? [];
        }, {immediate: true }
    );

    function setCacheColumnsByField(dataIndex: string | undefined, value: Partial<BasicColumn>) {
        if (!dataIndex || !value) {
            return;
        }
        cacheColumns.forEach(item => {
            if (item.dataIndex === dataIndex) {
                Object.assign(item, value);
                return;
            }
        });
    }

    /**
     * 设置列
     * @param columnList BasicColumn 或者 key
     */
    function setColumns(columnList: Partial<BasicColumn>[] | (string | string[])[]) {
        const _columns = cloneDeep(columnList);
        if (!isArray(_columns)) return;

        if (_columns.length <= 0) {
            columnsRef.value = [];
            return;
        }

        const _firstColumn = _columns[0];
        const _cacheKeys = cacheColumns.map((item) => item.dataIndex);

        if (!isString(_firstColumn) && !isArray(_firstColumn)) {
            columnsRef.value = _columns as BasicColumn[];
        } else {
            const _columnKeys = (_columns as (string | string[])[]).map((m) => m.toString());
            const _newColumns: BasicColumn[] = [];
            cacheColumns.forEach(item => {
                _newColumns.push({
                    ...item,
                    defaultHidden: !_columnKeys.includes(item.dataIndex?.toString() || (item.key as string))
                });
            });
            // Sort according to another array
            if (!isEqual(_cacheKeys, _columns)) {
                _newColumns.sort((prev, next) => {
                    return (
                        _columnKeys.indexOf(prev.dataIndex?.toString() as string) -
                        _columnKeys.indexOf(next.dataIndex?.toString() as string)
                    );
                });
            }
            columnsRef.value = _newColumns;
        }
        setColumnsByIndexDB(columnsRef.value);
    }

    function getColumnsFromIndexDB() {
        const props = unref(propsRef);
        if (props.showTableSetting && props.tableSetting?.cache && (props.tableSetting?.setting !== false)) {
            const columns = getFromIndexDB();
            console.log('columns', columns);
            if (columns) {
                return columns;
            }
        }
        return [];
    }

    function setColumnsByIndexDB(columns: BasicColumn[]) {
        const props = unref(propsRef);
        if (props.showTableSetting && props.tableSetting?.cache && (props.tableSetting?.setting !== false)) {
            storeInIndexDB(js_utils_deep_copy(columns));
        }
    }

    function getColumns(opt?: GetColumnsParams) {
        const {ignoreAction, sort } = opt || {};
        let _columns = toRaw(unref(getColumnsRef));
        if (ignoreAction) {
            _columns = _columns.filter((item) => item.dataIndex !== actionField);
        }
        if (sort) {
            _columns = sort_fixed_column(_columns);
        }
        return _columns;
    }
    function getCacheColumns() {
        return cacheColumns;
    }

    function setCacheColumns(columns: BasicColumn[]) {
        if (!isArray(columns)) return;
        cacheColumns = columns.filter((item) => item.dataIndex !== actionField);
    }

    function getCacheKey() {
        const curUrl = js_utils_get_current_url();
        return curUrl?.path;
    }

    async function storeInIndexDB(columns: BasicColumn[]) {
        const curKey = getCacheKey();
        if (!curKey) return;
        const db = getIndeDB();
        if (!db) {
            return;
        }
        const res = await db.set(curKey, columns);
        if (res?.code !== 200) {
            console.log('IndexDB 存储失败', res);
        }
        map.set(curKey, columns);
    }

    function getFromIndexDB() {
        const curKey = getCacheKey();
        console.log('getFromIndexDB', curKey, map);
        if (!curKey) return null;
        return map.get(curKey);
    }

    return {
        getColumnsRef,
        getCacheColumns,
        getColumns,
        setColumns,
        getViewColumns,
        setCacheColumnsByField,
        setCacheColumns,
        getFlatColumns,
        setColumnsByIndexDB
    };
}
