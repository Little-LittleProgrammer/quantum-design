<!--  -->
<template>
    <a-table v-if="data.tableShow" ref="tableElRef" v-bind="getProps" v-model:expandedRowKeys="data.expandKeysList" @expandedRowsChange="expanded_table">
        <template #headerCell="data">
            <slot name="headerCell" v-bind="data || {}"></slot>
        </template>
        <template #bodyCell="data">
            <slot name="bodyCell" v-bind="data || {}"></slot>
        </template>
    </a-table>
</template>

<script lang='ts' setup>
import { reactive, onMounted, computed, nextTick, watch, watchEffect } from 'vue';
import type { PropType } from 'vue';
import { TableProps } from 'ant-design-vue/lib/table/Table';
import { useSortable } from '@wuefront/hooks';
import { js_utils_deep_copy } from '@wuefront/utils';
import { propTypes } from '@wuefront/types/vue/types';
interface DataProps {
    expandKeysList: string[];
    tableShow: boolean;
    tableList: any[]
}
const props = defineProps({
    tableOptions: {
        type: Object as PropType<TableProps>,
        default: () => {}
    },
    expandedRowKeys: {
        type: Array as PropType<string[]>,
        default: () => []
    },
    className: propTypes.string.def(''),
    isCurLevel: propTypes.bool.def(false) // 是否只允许统计交换
});
const emit = defineEmits(['refreshTable', 'update:expandedRowKeys']);
const data: DataProps = reactive({
    expandKeysList: [],
    tableShow: true,
    tableList: []
});
const getProps = computed(():TableProps => {
    return {
        pagination: false,
        bordered: true,
        ...props.tableOptions,
        dataSource: data.tableList
    };
});
watchEffect(() => {
    data.expandKeysList = props.expandedRowKeys;
});

watch(
    () => data.expandKeysList,
    (val:string[]) => {
        emit('update:expandedRowKeys', val);
    }
);
watch(() => props.tableOptions.dataSource, (val) => {
    if (val && val.length) {
        data.tableList = val;
        refresh_table();
    }
});
// 刷新表格, 重置拖拽方法
function refresh_table() {
    data.tableShow = false;
    nextTick(() => {
        data.tableShow = true;
        nextTick(() => {
            init_drag();
        });
    });
}
// 初始化拖拽方法
function init_drag() {
    const $dom = document.querySelector(`${props.className ? '.' + props.className + ' ' : ''}.ant-table-tbody`) as HTMLElement;
    const { initSortable } = useSortable($dom, {
        onStart({item}) {
            // 展开节点中去除正在被拖拽的接待你
            const _targetRowKey = item.dataset.rowKey; // 获取key
            if (_targetRowKey) {
                data.expandKeysList = data.expandKeysList.filter(item => item.toString() !== _targetRowKey.toString());
            }
        },
        onEnd({ newIndex, item}) {
            const _targetRowKey = item.dataset.rowKey; // 获取key
            let _targetArray:any[] = [];
            let _dataListItem: Record<any, any> = {};
            let _targetItem: Record<any, any> = {};
            let _currentRowKey = '';
            let _currentArray:any[] = [];
            let _isNext = false;
            let _notBelong = false;
            if (_targetRowKey) {
                _targetArray = get_target_index(data.tableList, _targetRowKey.toString());
            }
            console.log('_targetArray', _targetArray);
            if (newIndex && newIndex > 0) {
                const $row = document.querySelectorAll(`${props.className ? '.' + props.className + ' ' : ''}.ant-table-row`) as NodeListOf<HTMLElement>;
                _currentRowKey = $row[newIndex - 1].dataset.rowKey as string;
                console.log($row, newIndex);
                if ($row[newIndex + 1]) {
                    if (!props.isCurLevel) {
                        _currentRowKey = $row[newIndex + 1].dataset.rowKey as string;
                        _isNext = true;
                    }
                }
            }
            console.log('_currentRowKey', _currentRowKey);
            _targetArray.forEach((item, index) => {
                item = parseInt(item);
                if (index < _targetArray.length - 1) {
                    if (!index) {
                        _targetItem = data.tableList[item];
                    } else {
                        _targetItem = _targetItem.children[item];
                    }
                } else {
                    if (!index) {
                        _targetItem = js_utils_deep_copy(data.tableList[item]);
                        if (_targetItem.children) {
                            _notBelong = judge_belong(_currentRowKey, _targetItem.children);
                        }
                        if (!_notBelong) {
                            data.tableList.splice(item, 1); // 删除原来的
                        }
                    } else {
                        const _calcItem = js_utils_deep_copy(_targetItem.children[item]);
                        if (_calcItem.children) {
                            _notBelong = judge_belong(_currentRowKey, _calcItem.children);
                        }
                        if (!_notBelong) {
                            _targetItem.children.splice(item, 1); // 删除原来的
                            if (!_targetItem.children.length) {
                                delete _targetItem.children;
                            }
                        }
                        _targetItem = _calcItem;
                    }
                }
            });
            if (newIndex?.toString() && !_notBelong) {
                if (newIndex > 0) {
                    if (_currentRowKey) {
                        _currentArray = get_target_index(data.tableList, _currentRowKey.toString());
                        console.log('_currentArray', _currentArray);
                    }
                    _currentArray.forEach((item, index) => {
                        item = parseInt(item);
                        if (index < _currentArray.length - 1) {
                            if (!index) {
                                _dataListItem = data.tableList[item];
                            } else {
                                _dataListItem = _dataListItem.children[item];
                            }
                        } else {
                            if (!index) {
                                if (!_isNext) {
                                    data.tableList.splice(item + 1, 0, _targetItem); // 新增
                                } else {
                                    data.tableList.splice(item, 0, _targetItem); // 新增
                                }
                            } else {
                                if (!_isNext) {
                                    _dataListItem.children.splice(item + 1, 0, _targetItem); // 新增
                                } else {
                                    _dataListItem.children.splice(item, 0, _targetItem); // 新增
                                }
                            }
                        }
                    });
                } else {
                    data.tableList.unshift(_targetItem);
                }
            }
            data.tableList = JSON.parse(JSON.stringify(data.tableList));
            emit('refreshTable', {
                tableList: data.tableList,
                parentData: _dataListItem,
                targetData: _targetItem
            });
            refresh_table();
        }
    });
    initSortable();
}
// 获得,当前拖拽的节点的在哪一层
function get_target_index(list: any[], id:string, arr:any[] = []): string[] {
    return list.reduce((total, item, index) => {
        if (item.id.toString() === id) {
            return [...total, index];
        } else {
            if (item.children && item.children.length) {
                let childArr = get_target_index(item.children, id, [ ...arr, index ]);
                if (childArr.length === [...arr, index].length) {
                    childArr = total;
                }
                return childArr;
            } else {
                return total;
            }
        }
    }, arr);
}
// 判断当前节点是否 属于
function judge_belong(key:any, list:any[] = []): boolean {
    return list.find((item:any) => {
        if (item.id.toString() === key) {
            return true;
        } else {
            if (item.children && item.children.length) {
                return judge_belong(key, item.children);
            } else {
                return false;
            }
        }
    });
}
function expanded_table(keys: string[]) {
    if (data.tableShow) {
        data.expandKeysList = keys;
    }
    refresh_table();
}
onMounted(() => {
    init_drag();
});

</script>
<style lang='scss' scoped>
</style>
