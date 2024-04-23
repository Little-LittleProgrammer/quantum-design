import { ComputedRef, Ref, computed, reactive, ref, toRaw, unref, watch } from 'vue';
import { BasicColumn, BasicTableProps, CellFormat, GetColumnsParams, Recordable } from '../types/table';
import { cloneDeep, isEqual } from 'lodash-es';
import { FETCH_SETTING, DEFAULT_ALIGN, DEFAULT_NORMAL_WIDTH } from '../enums/const';
import { isArray, isBoolean, isFunction, isMap, isNumber, isString } from '@quantum-design/utils';
import { render_edit_cell } from '../components/editable';

interface ActionType {
    columns: Ref<Recordable[]>
}

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
function handle_item(item: BasicColumn, options: Record<'resizable' | 'ellipsis', boolean>) {
    const { key, dataIndex, children } = item;
    const {ellipsis, resizable } = options;
    item.align = item.align || DEFAULT_ALIGN;
    if (ellipsis) {
        if (!key) {
            item.key = dataIndex as any;
        }
        if (!isBoolean(item.ellipsis)) {
            Object.assign(item, {
                ellipsis
            });
        }
    }
    if (resizable) {
        if (!key) {
            item.key = dataIndex as any;
        }
        if (!isBoolean(item.resizable)) {
            const _obj: any = {
                resizable
            };
            if (!isNumber(item.width)) {
                console.info(`当 resizable 为 ture 时，请保证 width 属性设置，当前以默认为您设置为${DEFAULT_NORMAL_WIDTH}`);
                _obj.width = DEFAULT_NORMAL_WIDTH;
            }
            Object.assign(item, _obj);
        }
    }
    if (children && children.length) {
        handle_children(children, options);
    }
}

// 处理 treetable
function handle_children(children: BasicColumn[] | undefined, options: Record<'resizable' | 'ellipsis', boolean>) {
    if (!children) return;
    children.forEach((item) => {
        const { children } = item;
        handle_item(item, options);
        handle_children(children, options);
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
        return text;
    }
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

    const getColumnsRef = computed(() => {
        const _columns = cloneDeep(unref(columnsRef));

        handle_action_column(propsRef, _columns, actionField);
        console.log(_columns);
        if (!_columns) {
            return [];
        }
        const { ellipsis, resizable } = unref(propsRef);

        _columns.forEach((item) => {
            const { customRender, slots, dataIndex } = item;

            const _options = {
                ellipsis: isBoolean(item.ellipsis) ? item.ellipsis : !!ellipsis && !customRender && !slots,
                resizable: isBoolean(item.resizable) ? item.resizable : !!resizable && !customRender && !slots
            };

            if (dataIndex !== actionField) {
                handle_item(
                    item,
                    _options
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
            const { slots, customRender, format, edit, editRow, flag } = column;

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
        return _columns
            .filter((column) => isIfShow(column))
            .map((column) => {
                // Support table multiple header editable
                if (column.children?.length) {
                    // @ts-ignore
                    column.children = column.children.map(map_fn);
                }
                return map_fn(column);
            });
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
            columnsRef.value = _header;
            cacheColumns = _header?.filter(item => item.dataIndex !== actionField) ?? [];
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
    return {
        getColumnsRef,
        getCacheColumns,
        getColumns,
        setColumns,
        getViewColumns,
        setCacheColumnsByField,
        setCacheColumns,
        getFlatColumns
    };
}
