import { ComputedRef, Ref, computed, nextTick, ref, toRaw, unref, watch } from 'vue';
import { BasicTableProps, TableRowSelection } from '../types/table';
import { Recordable } from '../types/table';
import { omit } from 'lodash-es';
import { js_is_function } from '@quantum-design/utils';
import { ROW_KEY } from '../enums/const';

import { js_utils_find_node_all } from '@quantum-design/utils';

export function useRowSelection(
    propsRef: ComputedRef<BasicTableProps>,
    tableData: Ref<Recordable[]>,
    emit: EmitType
) {
    const selectedRowKeysRef = ref<string[]>([]);
    const selectedRowRef = ref<Recordable[]>([]);

    const getRowSelectionRef = computed<TableRowSelection | null>(() => {
        const {rowSelection} = unref(propsRef);

        if (!rowSelection) {
            return null;
        }
        return {
            selectedRowKeys: unref(selectedRowKeysRef),
            onChange: (selectedRowKeys: string[]) => {
                set_selected_row_keys(selectedRowKeys);
            },
            ...omit(rowSelection, ['onChange'])
        };
    });

    watch(
        () => unref(propsRef).rowSelection?.selectedRowKeys,
        (v: string[]) => {
            set_selected_row_keys(v);
        }
    );

    watch(
        () => unref(selectedRowKeysRef),
        () => {
            nextTick(() => {
                const {rowSelection} = unref(propsRef);
                if (rowSelection) {
                    const {onChange} = rowSelection;
                    if (onChange && js_is_function(onChange)) {
                        onChange(get_select_row_keys(), get_select_rows());
                    }
                }
                emit('selection-change', {
                    keys: get_select_row_keys(),
                    rows: get_select_rows()
                });
            });
        },
        {deep: true}
    );

    const getAutoCreateKey = computed(() => {
        return unref(propsRef).autoCreateKey && !unref(propsRef).rowKey;
    });

    const getRowKey = computed(() => {
        const {rowKey} = unref(propsRef);
        return unref(getAutoCreateKey) ? ROW_KEY : rowKey;
    });

    function set_selected_row_keys(rowKeys: string[]) {
        selectedRowKeysRef.value = rowKeys;
        const _allSelectedRows: any[] = js_utils_find_node_all(
            toRaw(unref(tableData)).concat(toRaw(unref(selectedRowRef))),
            (item: any) => rowKeys?.includes(item[unref(getRowKey) as string]),
            {
                children: propsRef.value.childrenColumnName ?? 'children'
            }
        );
        const trueSelectedRows: any[] = [];
        rowKeys?.forEach((key: string) => {
            const found = _allSelectedRows.find((item) => item[unref(getRowKey) as string] === key);
            found && trueSelectedRows.push(found);
        });
        selectedRowRef.value = trueSelectedRows;
    }

    function set_selected_rows(rows: Recordable[]) {
        selectedRowRef.value = rows;
    }

    function clear_selected_row_keys() {
        selectedRowRef.value = [];
        selectedRowKeysRef.value = [];
    }

    function delete_select_row_by_key(key: string) {
        const _selectedRowKeys = unref(selectedRowKeysRef);
        const _index = _selectedRowKeys.findIndex((item) => item === key);
        if (_index !== -1) {
            unref(selectedRowKeysRef).splice(_index, 1);
        }
    }

    function get_select_row_keys() {
        return unref(selectedRowKeysRef);
    }

    function get_select_rows<T = Recordable>() {
        // const ret = toRaw(unref(selectedRowRef)).map((item) => toRaw(item));
        return unref(selectedRowRef) as T[];
    }

    function get_row_selection() {
        return unref(getRowSelectionRef)!;
    }

    return {
        getRowSelection: get_row_selection,
        getRowSelectionRef,
        getSelectRows: get_select_rows,
        getSelectRowKeys: get_select_row_keys,
        setSelectedRowKeys: set_selected_row_keys,
        clearSelectedRowKeys: clear_selected_row_keys,
        deleteSelectRowByKey: delete_select_row_by_key,
        setSelectedRows: set_selected_rows
    };
}
