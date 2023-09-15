import { ComputedRef, Ref, computed, reactive, ref, toRaw, unref, watch } from 'vue';
import { BasicColumn, BasicTableProps, CellFormat, GetColumnsParams, Recordable } from '../types/table';
import { cloneDeep, isEqual } from 'lodash-es';
import { FETCH_SETTING, DEFAULT_ALIGN } from '../enums/const';
import { js_is_array, js_is_boolean, js_is_function, js_is_map, js_is_string, js_utils_format_date } from '@quantum-design/utils';
import { render_edit_cell } from '../components/editable';

interface ActionType {
    columns: Ref<Recordable[]>
}

function deep_merge_by_key(arr1: BasicColumn[], arr2: BasicColumn[]): BasicColumn[] {
    if (!arr1 || arr1.length == 0) {
        return arr2 || [];
    }
    if (!arr2 || arr2.length == 0) {
        return arr1 || [];
    }
    const _cacheObj: Recordable = {};
    for (const item of arr2) {
        const _key = item.key || item.dataIndex as string;
        _cacheObj[_key] = item;
    }
    for (const item of arr1) {
        const _key = item.key || item.dataIndex as string;
        if (_cacheObj[_key]) {
            Object.assign(_cacheObj[_key], item);
        } else {
            _cacheObj[_key] = item;
        }
    }
    return Object.values(_cacheObj);
}

// ellipsis 统一设置进去
function handle_item(item: BasicColumn, ellipsis: boolean) {
    const { key, dataIndex, children } = item;
    item.align = item.align || DEFAULT_ALIGN;
    if (ellipsis) {
        if (!key) {
            item.key = dataIndex as any;
        }
        if (!js_is_boolean(item.ellipsis)) {
            Object.assign(item, {
                ellipsis
            });
        }
    }
    if (children && children.length) {
        handle_children(children, !!ellipsis);
    }
}

// 处理 treetable
function handle_children(children: BasicColumn[] | undefined, ellipsis: boolean) {
    if (!children) return;
    children.forEach((item) => {
        const { children } = item;
        handle_item(item, ellipsis);
        handle_children(children, ellipsis);
    });
}

function handle_action_column(propsRef: ComputedRef<BasicTableProps>, columns: BasicColumn[], actionField: string) {
    const { actionColumn, needActionColumn } = unref(propsRef);
    if (!needActionColumn) return;
    columns.push({
        fixed: 'right',
        title: '操作',
        key: actionField,
        dataIndex: actionField,
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
    if (js_is_function(format)) {
        return format(text, record, index);
    }

    try {
        // date type
        const DATE_FORMAT_PREFIX = 'date|';
        if (js_is_string(format) && format.startsWith(DATE_FORMAT_PREFIX) && text) {
            const _dateFormat = format.replace(DATE_FORMAT_PREFIX, '');

            if (!_dateFormat) {
                return text;
            }
            return js_utils_format_date(text, _dateFormat as any);
        }

        // Map
        if (js_is_map(format)) {
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
        const { ellipsis } = unref(propsRef);

        _columns.forEach((item) => {
            const { customRender, slots } = item;

            handle_item(
                item,
                Reflect.has(item, 'ellipsis') ? !!item.ellipsis : !!ellipsis && !customRender && !slots
            );
        });
        return _columns;
    });

    function isIfShow(column: BasicColumn): boolean {
        const _ifShow = column.ifShow;

        let _isIfShow = true;

        if (js_is_boolean(_ifShow)) {
            _isIfShow = _ifShow;
        }
        if (js_is_function(_ifShow)) {
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

    watch(
        [() => unref(propsRef).columns, () => columns],
        ([columnsProp, columnRef]) => {
            const _header = deep_merge_by_key((columnsProp || []), (columnRef.value || []));
            columnsRef.value = _header;
            cacheColumns = _header?.filter(item => item.dataIndex !== actionField) ?? [];
        },
        {deep: true}
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
        if (!js_is_array(_columns)) return;

        if (_columns.length <= 0) {
            columnsRef.value = [];
            return;
        }

        const _firstColumn = _columns[0];
        const _cacheKeys = cacheColumns.map((item) => item.dataIndex);

        if (!js_is_string(_firstColumn) && !js_is_array(_firstColumn)) {
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
        const {ignoreAction, sort} = opt || {};
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
        if (!js_is_array(columns)) return;
        cacheColumns = columns.filter((item) => item.dataIndex !== actionField);
    }
    return {
        getColumnsRef,
        getCacheColumns,
        getColumns,
        setColumns,
        getViewColumns,
        setCacheColumnsByField,
        setCacheColumns
    };
}
