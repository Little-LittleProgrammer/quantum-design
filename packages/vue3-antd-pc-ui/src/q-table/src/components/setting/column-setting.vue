<!--  -->
<template>
    <tooltip placement="top" title="列设置">
        <popover placement="bottomLeft" trigger="click" :overlayClassName="`${prefixCls}`" :getPopupContainer="get_popup_container" @open-change="handle_visible_change">
            <template #title>
                <div :class="`${prefixCls}-popover-title`">
                    <Checkbox v-model:checked="state.checkAll" :indeterminate="indeterminate" @change="on_check_all_change">列展示</Checkbox>
                    <Checkbox v-model:checked="checkSelect" :disabled="!defaultRowSelection" @change="handle_select_check_Change">勾选列</Checkbox>

                    <a-button size="small" type="link" @click="reset">重置</a-button>
                </div>
            </template>
            <template #content>
                <checkbox-group v-model:value="state.checkedList" @change="on_change" ref="columnListRef">
                    <template v-for="item in plainOptions" :key="item.value">
                        <div :class="`${prefixCls}-check-item`" v-if="!('ifShow' in item && !item.ifShow)">
                            <DragOutlined class="table-column-drag-icon"></DragOutlined>
                            <Checkbox :value="item.value">
                                {{ item.label }}
                            </Checkbox>
                            <Tooltip
                                placement="bottomLeft"
                                title="固定到左侧"
                                :mouseLeaveDelay="0.4"
                                :getPopupContainer="get_popup_container"
                            >
                                <VerticalRightOutlined
                                    :class="[
                                        `${prefixCls}-fixed-left`,
                                        {
                                            active: item.fixed === 'left',
                                            disabled: !state.checkedList.includes(item.value),
                                        },
                                    ]"
                                    @click="handle_column_fixed(item, 'left')"
                                />
                            </Tooltip>
                            <Divider type="vertical" />
                            <Tooltip
                                placement="bottomLeft"
                                title="固定到右侧"
                                :mouseLeaveDelay="0.4"
                                :getPopupContainer="get_popup_container"
                            >
                                <VerticalRightOutlined
                                    :class="[
                                        `${prefixCls}-fixed-right`,
                                        {
                                            active: item.fixed === 'right',
                                            disabled: !state.checkedList.includes(item.value),
                                        },
                                    ]"
                                    @click="handle_column_fixed(item, 'right')"
                                />
                            </Tooltip>
                        </div>
                    </template>
                </checkbox-group>
            </template>
            <SettingOutlined />
        </popover>
    </tooltip>
</template>

<script lang='ts' setup>
import { computed, nextTick, reactive, ref, unref, useAttrs, watchEffect } from 'vue';
import { Tooltip, Popover, Checkbox, CheckboxGroup, Divider } from 'ant-design-vue';
import type { CheckboxChangeEvent } from 'ant-design-vue/lib/checkbox/interface';
import { useTableContext } from '../../hooks/use-table-context';
import { cloneDeep, omit } from 'lodash-es';
import { BasicColumn, BasicTableProps, ColumnChangeParam } from '../../types/table';
import {useSortable} from '@quantum-design/hooks';
import { js_is_function, js_is_null_or_undef } from '@quantum-design/utils';
import { SettingOutlined, DragOutlined, VerticalRightOutlined } from '@ant-design/icons-vue';
interface State {
    checkAll: boolean;
    isInit?: boolean;
    checkedList: string[];
    defaultCheckList: string[];
}

interface Options {
    label: string;
    value: string;
    fixed?: boolean | 'left' | 'right';
}

const emit = defineEmits(['columns-change']);
const prefixCls = 'q-table-setting-column';
const table = useTableContext();

const defaultRowSelection = omit(table.getRowSelection(), 'selectedRowKeys');
let inited = false;
// 是否当前的setColums触发的
let isSetColumnsFromThis = false;
// 是否当前组件触发的setProps
let isSetPropsFromThis = false;

const cachePlainOptions = ref<Options[]>([]);
const plainOptions = ref<Options[] | any>([]);

const plainSortOptions = ref<Options[]>([]);

const columnListRef = ref(null);

const state = reactive<State>({
    checkAll: true,
    checkedList: [],
    defaultCheckList: []
});

// 缓存初始化props
let cacheTableProps: Partial<BasicTableProps<any>> = {};
const checkIndex = ref(false);
const checkSelect = ref(false);

const getValues = computed(() => {
    return unref(table?.getBindValues) || {};
});

watchEffect(() => {
    const _columns = table.getColumns();
    setTimeout(() => {
        if (isSetColumnsFromThis) {
            isSetColumnsFromThis = false;
        } else if (_columns.length) {
            init();
        }
    }, 0);
});

watchEffect(() => {
    const _values = unref(getValues);
    if (isSetPropsFromThis) {
        isSetPropsFromThis = false;
    } else {
        cacheTableProps = cloneDeep(_values);
    }
    checkIndex.value = !!_values.showIndexColumn;
    checkSelect.value = !!_values.rowSelection;
});

// 获取列
function get_columns() {
    const _ret: Options[] = [];
    table.getColumns({ ignoreAction: true }).forEach((item) => {
        _ret.push({
            label: (item.title as string) || (item.customTitle as string),
            value: (item.dataIndex || item.title) as string,
            ...item
        });
    });
    return _ret;
}

// 初始化
async function init(isReset = false) {
    // Sortablejs存在bug，不知道在哪个步骤中会向el append了一个childNode，因此这里先清空childNode
    // 有可能复现上述问题的操作：拖拽一个元素，快速的上下移动，最后放到最后的位置中松手
    plainOptions.value = [];
    const _columnListEl = unref(columnListRef);
    if (_columnListEl && (_columnListEl as any).$el) {
        const _el = (_columnListEl as any).$el as Element;
        Array.from(_el.children).forEach((item) => _el.removeChild(item));
    }
    await nextTick();
    const _columns = isReset ? cloneDeep(cachePlainOptions.value) : get_columns();

    const _checkList = table
        .getColumns({ ignoreAction: true, ignoreIndex: true })
        .map((item) => {
            if (item.defaultHidden) {
                return '';
            }
            return item.dataIndex || item.title;
        })
        .filter(Boolean) as string[];
    plainOptions.value = _columns;
    plainSortOptions.value = _columns;
    // 更新缓存配置
    table.setCacheColumns?.(_columns);
    !isReset && (cachePlainOptions.value = cloneDeep(_columns));
    state.defaultCheckList = _checkList;
    state.checkedList = _checkList;
    // 是否列展示全选
    state.checkAll = _checkList.length === _columns.length;
    inited = false;
    handle_visible_change();
}

// checkAll change
function on_check_all_change(e: CheckboxChangeEvent) {
    const _checkList = plainSortOptions.value.map((item) => item.value);
    plainSortOptions.value.forEach(
        (item) => ((item as BasicColumn).defaultHidden = !e.target.checked)
    );
    if (e.target.checked) {
        state.checkedList = _checkList;
        set_columns(_checkList);
    } else {
        state.checkedList = [];
        set_columns([]);
    }
}

const indeterminate = computed(() => {
    const _len = plainOptions.value.length;
    const _checkedLen = state.checkedList.length;
    // unref(checkIndex) && checkedLen--;
    return _checkedLen > 0 && _checkedLen < _len;
});

// check handle
function on_change(checkedList: string[]) {
    const _len = plainSortOptions.value.length;
    state.checkAll = checkedList.length === _len;
    const _sortList = unref(plainSortOptions).map(item => item.value);
    checkedList.sort((pre, next) => {
        return _sortList.indexOf(pre) - _sortList.indexOf(next);
    });
    unref(plainSortOptions).forEach((item) => {
        (item as BasicColumn).defaultHidden = !checkedList.includes(item.value);
    });
    set_columns(checkedList);
}

let sortable: any;
let sortableOrder: string[] = [];
// reset columns
function reset() {
    set_columns(cachePlainOptions.value);
    init(true);
    checkIndex.value = !!cacheTableProps.showIndexColumn;
    checkSelect.value = !!cacheTableProps.rowSelection;
    table.setProps({
        showIndexColumn: checkIndex.value,
        rowSelection: checkSelect.value ? defaultRowSelection : undefined
    });
    sortable?.sort(sortableOrder);
}

function handle_visible_change() {
    if (inited) return;
    nextTick(async() => {
        const _columnListEl = unref(columnListRef);
        if (!_columnListEl) return;
        const _el = (_columnListEl as any).$el;
        if (!_el) return;
        const {initSortable} = useSortable(unref(_el), {
            handle: '.table-column-drag-icon',
            onEnd: (evt) => {
                const { oldIndex, newIndex } = evt;
                if (js_is_null_or_undef(oldIndex) || js_is_null_or_undef(newIndex) || oldIndex === newIndex) {
                    return;
                }
                // Sort column
                const _columns = cloneDeep(plainSortOptions.value);

                if (oldIndex > newIndex) {
                    _columns.splice(newIndex, 0, _columns[oldIndex]);
                    _columns.splice(oldIndex + 1, 1);
                } else {
                    _columns.splice(newIndex + 1, 0, _columns[oldIndex]);
                    _columns.splice(oldIndex, 1);
                }

                plainSortOptions.value = _columns;
                set_columns(_columns.filter((item) => state.checkedList.includes(item.value)));
            }
        });
        sortable = await initSortable();
        // 记录原始order 序列
        sortableOrder = sortable?.toArray();
        inited = true;
    });
}

// 控制是否显示筛选列
function handle_select_check_Change(e: CheckboxChangeEvent) {
    isSetPropsFromThis = true;
    isSetColumnsFromThis = true;
    table.setProps({
        rowSelection: e.target.checked ? defaultRowSelection : undefined
    });
}

// 控制固定列
function handle_column_fixed(item: BasicColumn, fixed?: 'left' | 'right') {
    if (!state.checkedList.includes(item.dataIndex as string)) return;

    const _columns = get_columns().filter((c: BasicColumn) => state.checkedList.includes(c.dataIndex as string)) as BasicColumn[];
    const _isFixed = item.fixed === fixed ? false : fixed;
    const _index = _columns.findIndex(col => col.dataIndex === item.dataIndex);
    if (_index !== -1) {
        _columns[_index].fixed = _isFixed;
    }
    item.fixed = _isFixed;

    if (_isFixed && !item.width) {
        item.width = 100;
    }
    update_sort_option(item);
    table.setCacheColumnsByField?.(item.dataIndex as string, { fixed: _isFixed });
    set_columns(_columns);
}

// 更改列
function set_columns(columns: BasicColumn[] | string[]) {
    isSetPropsFromThis = true;
    isSetColumnsFromThis = true;
    table.setColumns(columns);
    const _data: ColumnChangeParam[] = unref(plainSortOptions).map((col) => {
        const _visible =
            columns.findIndex(
                (c: BasicColumn | string) =>
                    c === col.value || (typeof c !== 'string' && c.dataIndex === col.value)
            ) !== -1;
        return { dataIndex: col.value, fixed: col.fixed, visible: _visible };
    });

    emit('columns-change', _data);
}

const attrs = useAttrs();

function get_popup_container() {
    return js_is_function(attrs.getPopupContainer)
        ? attrs.getPopupContainer()
        : 'body';
}

function update_sort_option(column: BasicColumn) {
    plainSortOptions.value.forEach((item) => {
        if (item.value === column.dataIndex) {
            Object.assign(item, column);
        }
    });
}

</script>
<style lang='scss' scoped>
</style>
