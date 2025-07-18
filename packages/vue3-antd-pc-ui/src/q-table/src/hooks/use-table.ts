import type { BasicTableProps, TableActionType, FetchParams, BasicColumn, Recordable } from '../types/table';
import type { PaginationProps } from '../types/pagination';
import type { ComputedRef, Ref, WatchStopHandle } from 'vue';
import { ref, onUnmounted, unref, watch, toRaw } from 'vue';
import type { FormActionType } from '@vue3-antd/q-form';

type Props = Partial<DynamicProps<BasicTableProps>>;

type DynamicProps<T> = {
    [P in keyof T]: Ref<T[P]> | T[P] | ComputedRef<T[P]>;
};

type UseTableMethod = TableActionType & {
    getForm: () => FormActionType;
};

function get_dynamic_props<T extends Record<string, unknown>, U>(props: T): Partial<U> {
    const ret: Recordable = {};

    Object.keys(props).map((key) => {
        ret[key] = unref((props as Recordable)[key]);
    });

    return ret as Partial<U>;
}

export function useTable(tableProps?: Props): [
    (instance: TableActionType, formInstance: UseTableMethod) => void,
    TableActionType & {
        getForm: () => FormActionType;
    },
] {
    const tableRef = ref<Nullable<TableActionType>>(null);
    const loadedRef = ref<Nullable<boolean>>(false);
    const formRef = ref<Nullable<UseTableMethod>>(null);

    let stopWatch: WatchStopHandle;

    function register(instance: TableActionType, formInstance: UseTableMethod) {
        import.meta.env.PROD &&
      onUnmounted(() => {
          tableRef.value = null;
          loadedRef.value = null;
      });

        if (unref(loadedRef) && import.meta.env.PROD && instance === unref(tableRef)) return;

        tableRef.value = instance;
        formRef.value = formInstance;
        tableProps && instance.setProps(get_dynamic_props(tableProps));
        loadedRef.value = true;

        stopWatch?.();

        stopWatch = watch(
            () => tableProps,
            () => {
                tableProps && instance.setProps(get_dynamic_props(tableProps));
            },
            {
                immediate: true,
                deep: true
            }
        );
    }

    function getTableInstance(): TableActionType {
        const table = unref(tableRef);
        if (!table) {
            console.error(
                'The table instance has not been obtained yet, please make sure the table is presented when performing the table operation!'
            );
        }
        return table as TableActionType;
    }

    const methods: TableActionType & {
        getForm: () => FormActionType;
    } = {
        reload: async(opt?: FetchParams) => {
            return await getTableInstance().reload(opt);
        },
        setProps: (props: Partial<BasicTableProps>) => {
            getTableInstance().setProps(props);
        },
        redoHeight: () => {
            getTableInstance().redoHeight();
        },
        setSelectedRows: (rows: Recordable[]) => {
            return toRaw(getTableInstance().setSelectedRows(rows));
        },
        setLoading: (loading: boolean) => {
            getTableInstance().setLoading(loading);
        },
        getDataSource: () => {
            return getTableInstance().getDataSource();
        },
        getRawDataSource: () => {
            return getTableInstance().getRawDataSource();
        },
        getColumns: ({ ignoreIndex = false }: { ignoreIndex?: boolean } = {}) => {
            const columns = getTableInstance().getColumns({ ignoreIndex }) || [];
            return toRaw(columns);
        },
        setColumns: (columns: BasicColumn[]) => {
            getTableInstance().setColumns(columns);
        },
        setTableData: (values: any[]) => {
            return getTableInstance().setTableData(values);
        },
        setPagination: (info: Partial<PaginationProps>) => {
            return getTableInstance().setPagination(info);
        },
        deleteSelectRowByKey: (key: string) => {
            getTableInstance().deleteSelectRowByKey(key);
        },
        getSelectRowKeys: () => {
            return toRaw(getTableInstance().getSelectRowKeys());
        },
        getSelectRows: () => {
            return toRaw(getTableInstance().getSelectRows());
        },
        clearSelectedRowKeys: () => {
            getTableInstance().clearSelectedRowKeys();
        },
        setSelectedRowKeys: (keys: string[] | number[]) => {
            getTableInstance().setSelectedRowKeys(keys);
        },
        getPaginationRef: () => {
            return getTableInstance().getPaginationRef();
        },
        getSize: () => {
            return toRaw(getTableInstance().getSize());
        },
        updateTableData: (index: number, key: string, value: any) => {
            return getTableInstance().updateTableData(index, key, value);
        },
        deleteTableDataRecord: (rowKey: string | number | string[] | number[]) => {
            return getTableInstance().deleteTableDataRecord(rowKey);
        },
        insertTableDataRecord: (record: Recordable | Recordable[], index?: number) => {
            return getTableInstance().insertTableDataRecord(record, index);
        },
        updateTableDataRecord: (rowKey: string | number, record: Recordable) => {
            return getTableInstance().updateTableDataRecord(rowKey, record);
        },
        findTableDataRecord: (rowKey: string | number) => {
            return getTableInstance().findTableDataRecord(rowKey);
        },
        getRowSelection: () => {
            return toRaw(getTableInstance().getRowSelection());
        },
        getCacheColumns: () => {
            return toRaw(getTableInstance().getCacheColumns());
        },
        getForm: () => {
            return unref(formRef) as unknown as FormActionType;
        },
        setShowPagination: async(show: boolean) => {
            getTableInstance().setShowPagination(show);
        },
        getShowPagination: () => {
            return toRaw(getTableInstance().getShowPagination());
        },
        expandAll: () => {
            getTableInstance().expandAll();
        },
        expandRows: (keys: string[]) => {
            getTableInstance().expandRows(keys);
        },
        collapseAll: () => {
            getTableInstance().collapseAll();
        },
        scrollTo: (pos: string) => {
            getTableInstance().scrollTo(pos);
        }
    };

    return [register, methods];
}
