
import { PaginationProps } from '../types/pagination';
import { ComputedRef, Ref, computed, onMounted, reactive, ref, unref, watch, watchEffect } from 'vue';
import { BasicColumn, BasicTableProps, FetchParams, SorterResult, Recordable } from '../types/table';
import { js_is_array, js_is_boolean, js_is_function, js_is_object, js_utils_get_table_header_columns, js_utils_get_uuid } from '@quantum-design/utils';
import { FETCH_SETTING, PAGE_SIZE, ROW_KEY } from '../enums/const';
import { cloneDeep, get, merge } from 'lodash-es';

interface ActionType {
    getPaginationInfo: ComputedRef<boolean | PaginationProps>;
    setPagination: (info: Partial<PaginationProps>) => void;
    setLoading: (loading: boolean) => void;
    getFieldsValue: () => Recordable;
    clearSelectedRowKeys: () => void;
    tableData: Ref<Recordable[]>;
    columns: Ref<Recordable[]>;
    summaryData: Ref<Recordable[]>
}

interface SearchState {
    sortInfo: Recordable;
    filterInfo: Record<string, string[]>;
}

export function useDataSource(
    propsRef: ComputedRef<BasicTableProps>,
    {
        getPaginationInfo,
        setPagination,
        setLoading,
        getFieldsValue,
        clearSelectedRowKeys,
        tableData,
        columns,
        summaryData
    }: ActionType,
    emit: EmitType
) {
    const searchState = reactive<SearchState>({
        sortInfo: {},
        filterInfo: {}
    });
    const columnsRef = ref<BasicColumn[]>([]);
    const dataSourceRef = ref<Recordable[]>([]);
    const rawDataSourceRef = ref<Recordable>({}); // 原始的 res 数据

    watchEffect(() => {
        tableData.value = unref(dataSourceRef);
    });
    watchEffect(() => {
        columns.value = unref(columnsRef);
    });

    watch(
        () => unref(propsRef).dataSource,
        () => {
            const { dataSource, api } = unref(propsRef);
            !api && dataSource && (dataSourceRef.value = dataSource);
        },
        {
            immediate: true
        }
    );

    function handleTableChange(
        pagination: PaginationProps,
        filters: Partial<Recordable>,
        sorter: SorterResult
    ) {
        const { clearSelectOnPageChange, sortFn, filterFn, fetchSetting } = unref(propsRef);
        if (clearSelectOnPageChange) {
            clearSelectedRowKeys();
        }
        setPagination(pagination);

        const params: Recordable = {};

        if (sorter && js_is_function(sortFn)) {
            const _sortInfo = sortFn(sorter);
            searchState.sortInfo = _sortInfo;
            params.sortInfo = _sortInfo;
        }
        if (filters && js_is_function(filterFn)) {
            const filterInfo = filterFn(filters);
            searchState.filterInfo = filterInfo;
            params.filterInfo = filterInfo;
        }
        fetch(params);
    }

    // 树形表格设置 key
    function setTableKey(items: any[]) {
        if (!items || !Array.isArray(items)) return;
        items.forEach((item) => {
            if (!item[ROW_KEY]) {
                item[ROW_KEY] = js_utils_get_uuid(8);
            }
            if (item.children && item.children.length) {
                setTableKey(item.children);
            }
        });
    }

    // 自动创建 key
    const getAutoCreateKey = computed(() => {
        return unref(propsRef).autoCreateKey && !unref(propsRef).rowKey;
    });

    const getRowKey = computed(() => {
        const { rowKey } = unref(propsRef);
        return unref(getAutoCreateKey) ? ROW_KEY : rowKey;
    });

    // 获取 datasource，并且根据配置设置值
    const getDataSourceRef = computed(() => {
        const _dataSource = unref(dataSourceRef);
        if (!_dataSource || _dataSource.length === 0) {
            return unref(dataSourceRef);
        }
        if (unref(getAutoCreateKey)) {
            const _firstItem = _dataSource[0];
            const _lastItem = _dataSource[_dataSource.length - 1];

            if (_firstItem && _lastItem) {
                if (!_firstItem[ROW_KEY] || !_lastItem[ROW_KEY]) {
                    const _data = cloneDeep((unref(dataSourceRef)));
                    _data.forEach(item => {
                        if (!item[ROW_KEY]) {
                            item[ROW_KEY] = js_utils_get_uuid(8);
                        }
                        if (item.children && item.children.length) {
                            setTableKey(item.children);
                        }
                    });
                    dataSourceRef.value = _data;
                }
            }
        }
        return unref(dataSourceRef);
    });

    function findTableDataRecord(rowKey: string | number) {
        if (!dataSourceRef.value || dataSourceRef.value.length === 0) return;
        const _rowKeyName = unref(getRowKey);
        if (!_rowKeyName) return;
        const { childrenColumnName = 'children' } = unref(propsRef);

        const _findRow = (arr: any[]) => {
            let _ret: any;
            arr.some(function iter(r) {
                if (js_is_function(_rowKeyName)) {
                    if (_rowKeyName(r) === rowKey) {
                        _ret = r;
                        return true;
                    }
                } else {
                    if (Reflect.has(r, _rowKeyName) && r[_rowKeyName] === rowKey) {
                        _ret = r;
                        return true;
                    }
                }
                return r[childrenColumnName] && r[childrenColumnName].some(iter);
            });
            return _ret;
        };
        return _findRow(dataSourceRef.value);
    }

    // 插入表格行，根据 index 插入, 纯前端更新
    function insertTableDataRecord(
        record: Recordable | Recordable[],
        index: number
    ): Recordable[] | undefined {
        // if (!dataSourceRef.value || dataSourceRef.value.length == 0) return;
        index = index ?? dataSourceRef.value?.length;
        const _record = js_is_object(record) ? [record as Recordable] : (record as Recordable[]);
        unref(dataSourceRef).splice(index, 0, ..._record);
        return unref(dataSourceRef);
    }

    // 更新表格行，根据 index 更新, 纯前端更新
    async function updateTableData(index: number, key: string, value: any) {
        const _record = dataSourceRef.value[index];
        if (_record) {
            dataSourceRef.value[index][key] = value;
        }
        return dataSourceRef.value[index];
    }

    // 更新表格行，根据 rowkey 更新, 纯前端更新
    function updateTableDataRecord(rowKey: string | number, record: Recordable) {
        const _row = findTableDataRecord(rowKey);
        if (_row) {
            for (const field in _row) {
                if (Reflect.has(record, field)) _row[field] = record[field];
            }
            return _row;
        }
    }

    // 删除表格行, 纯前端删除
    function deleteTableDataRecord(rowKey: string | number | string[] | number[]) {
        if (!dataSourceRef.value || dataSourceRef.value.length == 0) return;
        const rowKeyName = unref(getRowKey);
        if (!rowKeyName) return;
        const _rowKeys = !Array.isArray(rowKey) ? [rowKey] : rowKey;

        function deleteRow(data:any, key:string | number) {
            const row: { index: number; data: [] } = findRow(data, key);
            if (row === null || row.index === -1) {
                return;
            }
            row.data.splice(row.index, 1);

            function findRow(data:any, key:string | number):any {
                if (data === null || data === undefined) {
                    return null;
                }
                for (let i = 0; i < data.length; i++) {
                    const row = data[i];
                    let targetKeyName: string = rowKeyName as string;
                    if (js_is_function(rowKeyName)) {
                        targetKeyName = rowKeyName(row);
                    }
                    if (row[targetKeyName] === key) {
                        return { index: i, data };
                    }
                    if (row.children?.length > 0) {
                        const result = findRow(row.children, key);
                        if (result != null) {
                            return result;
                        }
                    }
                }
                return null;
            }
        }

        for (const key of _rowKeys) {
            deleteRow(dataSourceRef.value, key);
            deleteRow(unref(propsRef).dataSource, key);
        }
        setPagination({
            total: unref(propsRef).dataSource?.length
        });
    }

    // 根据 api 获取表格数据
    async function fetch(opt?: FetchParams): Promise<any>{
        const {
            api,
            searchInfo,
            defSort,
            fetchSetting,
            beforeFetch,
            afterFetch,
            useSearchForm,
            pagination,
            columnsConfig,
            columns
        } = unref(propsRef);
        if (!api || !js_is_function(api)) {
            return;
        }
        try {
            setLoading(true);
            // 得到映射关系
            const { pageField, sizeField, listField, totalField, headerField, summaryField } = merge(
                {},
                FETCH_SETTING, // 默认映射关系
                fetchSetting // 自定义映射关系
            );
            let pageParams: Recordable = {};

            const { current = 1, pageSize = PAGE_SIZE } = unref(getPaginationInfo) as PaginationProps;

            if ((js_is_boolean(pagination) && !pagination) || js_is_boolean(getPaginationInfo)) {
                pageParams = {};
            } else {
                pageParams[pageField] = (opt && opt.page) || current;
                pageParams[sizeField] = pageSize;
            }

            const { sortInfo = {}, filterInfo } = searchState; // 搜索项

            let params: Recordable = merge(
                pageParams,
                useSearchForm ? getFieldsValue() : {},
                searchInfo,
                opt?.searchInfo ?? {},
                defSort,
                sortInfo,
                filterInfo,
                opt?.sortInfo ?? {},
                opt?.filterInfo ?? {}
            );
            if (beforeFetch && js_is_function(beforeFetch)) {
                params = (await beforeFetch(params)) || params;
            }

            let _res = await api(params);
            if (_res.code) {
                _res = _res.data;
            }
            rawDataSourceRef.value = _res;

            const _isArrayResult = js_is_array(_res);

            let _resultItems: Recordable[] = _isArrayResult ? _res : get(_res, listField);
            const _resultTotal: number = _isArrayResult ? _res.length : get(_res, totalField);

            // 假如数据变少，导致总页数变少并小于当前选中页码，通过getPaginationRef获取到的页码是不正确的，需获取正确的页码再次执行
            if (Number(_resultTotal)) {
                const currentTotalPage = Math.ceil(_resultTotal / pageSize);
                if (current > currentTotalPage) {
                    setPagination({
                        current: currentTotalPage
                    });
                    return await fetch(opt);
                }
            }

            if (afterFetch && js_is_function(afterFetch)) {
                _resultItems = (await afterFetch(_resultItems)) || _resultItems;
            }
            dataSourceRef.value = _resultItems;
            if (!_isArrayResult && get(_res, headerField)) {
                const _header = get(_res, headerField);
                columnsRef.value = js_is_array(_header) ? _header : js_utils_get_table_header_columns(_header, columnsConfig);
            }

            if (!_isArrayResult && get(_res, summaryField)) {
                const _data = get(_res, summaryField);
                summaryData.value = js_is_array(_data) ? _data : [_data];
            }

            setPagination({
                total: _resultTotal || 0
            });
            if (opt && opt.page) {
                setPagination({
                    current: opt.page || 1
                });
            }
            emit('fetch-success', {
                list: unref(_resultItems),
                total: _resultTotal
            });
            return _resultItems;
        } catch (err) {
            emit('fetch-error', err);
            dataSourceRef.value = [];
            setPagination({
                total: 0
            });
        } finally {
            setLoading(false);
        }
    }

    // 手动设置表格值
    function setTableData<T extends Recordable = Recordable>(values: T[]) {
        dataSourceRef.value = values;
    }

    function getDataSource<T extends Recordable = Recordable>() {
        return getDataSourceRef.value as T[];
    }

    function getRawDataSource<T = Recordable>() {
        return rawDataSourceRef.value as T;
    }

    async function reload(opt?: FetchParams) {
        return await fetch(opt);
    }

    onMounted(() => {
        setTimeout(() => {
            unref(propsRef).immediate && fetch();
        }, 16);
    });
    return {
        getDataSourceRef,
        getDataSource,
        getRawDataSource,
        getRowKey,
        setTableData,
        getAutoCreateKey,
        fetch,
        reload,
        updateTableData,
        updateTableDataRecord,
        deleteTableDataRecord,
        insertTableDataRecord,
        findTableDataRecord,
        handleTableChange
    };
}
