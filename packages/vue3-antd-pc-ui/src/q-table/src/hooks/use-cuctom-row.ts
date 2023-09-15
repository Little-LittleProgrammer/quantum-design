import { unref, type ComputedRef } from 'vue';
import type { BasicTableProps, Recordable } from '../types/table';
import { ROW_KEY } from '../enums/const';
import { js_is_function, js_is_string } from '@quantum-design/utils';

interface Options {
    setSelectedRowKeys: (_keys: string[]) => void;
    getSelectRowKeys: () => string[];
    clearSelectedRowKeys: () => void;
    emit: EmitType;
    getAutoCreateKey: ComputedRef<boolean | undefined>;
}

function get_key(
    record: Recordable,
    rowKey: string | ((record: Record<string, any>) => string) | undefined,
    autoCreateKey?: boolean
) {
    if (!rowKey || autoCreateKey) {
        return record[ROW_KEY];
    }
    if (js_is_string(rowKey)) {
        return record[rowKey];
    }
    if (js_is_function(rowKey)) {
        return record[rowKey(record)];
    }
    return null;
}

// a-table 行属性
export function useCustomRow(
    propsRef: ComputedRef<BasicTableProps>,
    { setSelectedRowKeys, getSelectRowKeys, getAutoCreateKey, clearSelectedRowKeys, emit }: Options
) {
    const customRow = (record: Recordable, index: number) => {
        return {
            onClick: (e: Event) => {
                e?.stopPropagation();
                function handle_click() {
                    const { rowSelection, rowKey, clickToRowSelect } = unref(propsRef);
                    if (!rowSelection || !clickToRowSelect) return;
                    const _keys = getSelectRowKeys() || [];
                    const _key = get_key(record, rowKey, unref(getAutoCreateKey));
                    if (_key === null) return;

                    const _isCheckbox = rowSelection.type === 'checkbox';
                    if (_isCheckbox) {
                        // 找到tr
                        const tr: HTMLElement = (e as MouseEvent)
                            .composedPath?.()
                            .find((dom: HTMLElement) => dom.tagName === 'TR') as HTMLElement;
                        if (!tr) return;
                        // 找到Checkbox，检查是否为disabled
                        const checkBox = tr.querySelector('input[type=checkbox]');
                        if (!checkBox || checkBox.hasAttribute('disabled')) return;
                        if (!_keys.includes(_key)) {
                            _keys.push(_key);
                            setSelectedRowKeys(_keys);
                            return;
                        }
                        const keyIndex = _keys.findIndex((item) => item === _key);
                        _keys.splice(keyIndex, 1);
                        setSelectedRowKeys(_keys);
                        return;
                    }

                    const _isRadio = rowSelection.type === 'radio';
                    if (_isRadio) {
                        if (!_keys.includes(_key)) {
                            if (_keys.length) {
                                clearSelectedRowKeys();
                            }
                            setSelectedRowKeys([_key]);
                            return;
                        }
                        clearSelectedRowKeys();
                    }
                }
                handle_click();
                emit('row-click', record, index, e);
            },
            onDblclick: (event: Event) => {
                emit('row-dbClick', record, index, event);
            },
            onContextmenu: (event: Event) => {
                emit('row-contextmenu', record, index, event);
            },
            onMouseenter: (event: Event) => {
                emit('row-mouseenter', record, index, event);
            },
            onMouseleave: (event: Event) => {
                emit('row-mouseleave', record, index, event);
            }
        };
    };

    return {
        customRow
    };
}
