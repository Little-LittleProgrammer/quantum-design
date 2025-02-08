<!--  -->
<template>
  <div>
        <a-transfer
            class="q-transfer area-transfer"
            :data-source="data.dataSource"
            :target-keys="targetKeys"
            :render="render_title"
            :show-select-all="false"
            @change="on_change"
        >
            <template #children="{ direction, selectedKeys, onItemSelect }">
                <a-input-search v-model:value="data.searchWord" v-if="direction === 'left'" placeholder="请选择" @change="on_search" />
                <a-tree
                    :expandedKeys="data.expandedKeys"
                    blockNode
                    checkable
                    checkStrictly
                    :checkedKeys="direction === 'left' ? [...selectedKeys, ...targetKeys]: selectedKeys "
                    :treeData=" direction === 'left'? getFilterLeftTreeData : data.filterRightTreeData"
                    @expand="on_expand"
                    @check="
                        (_: boolean, props: AntTreeNodeCheckedEvent) => {
                            on_checked(direction, _, props, direction === 'left' ? [...selectedKeys, ...targetKeys]: [...selectedKeys] , onItemSelect)
                        }
                    "
                ></a-tree>
            </template>
        </a-transfer>
  </div>
</template>

<script lang='ts' setup>

import { reactive, type PropType, computed, watch} from 'vue';
import { js_utils_deep_copy, isObject } from '@quantum-design/utils';
import type { AntTreeNodeCheckedEvent } from 'ant-design-vue/lib/tree/Tree';
import { handle_tree_data, type ICity, is_checked, render_title, filter_tree_data, type IFieldNames, dfs, get_parent_keys } from './transfer';
import './style/transfer.scss';
import { Transfer as ATransfer, Tree as ATree, InputSearch as AInputSearch} from 'ant-design-vue';
import { propTypes } from '@quantum-design/types/vue/types';

defineOptions({
    name: 'QAntdTransfer'
});

interface DataProps {
    expandedKeys: string[];
    dataSource: ICity[];
    filterRightTreeData: ICity[];
    filterLeftTreeData: ICity[];
    selectedTreeData: ICity[];
    searchWord: string
}

const props = defineProps({
    targetKeys: {
        type: Array as PropType<string[]>,
        default: () => []
    },
    treeData: {
        type: Array as PropType<ICity[]>,
        default: () => []
    },
    fieldNames: {
        type: Object as PropType<IFieldNames>,
        default: () => {}
    },
    returnAll: propTypes.bool.def(false)
});
const emit = defineEmits(['update:targetKeys', 'change']);

const getTreeData = computed<ICity[]>(() => {
    if (!isObject(props.fieldNames)) {
        throw Error('fieldNames must be object');
    }
    if (props.fieldNames.key || props.fieldNames.children || props.fieldNames.title) {
        return dfs(props.treeData, props.fieldNames);
    }
    return props.treeData;
});

const data: DataProps = reactive({
    dataSource: [],
    filterRightTreeData: [],
    expandedKeys: [],
    filterLeftTreeData: [],
    selectedTreeData: [],
    searchWord: ''
});

const getFilterLeftTreeData = computed<ICity[]>(() => {
    return handle_tree_data(
        data.filterLeftTreeData,
        props.targetKeys
    );
});
// 展开的父节点
function on_expand(expandedKeys: string[]) {
    data.expandedKeys = expandedKeys;
}
// 格式化结构, 将带children的数据都放到一个层级下，为了让a-transfre识别正确的个数
function flatten(list: ICity[] = []) {
    list.forEach((item) => {
        data.dataSource.push(item);
        flatten(item.children);
    });
}
// 点击左选右选按钮的回调
function on_change(targetKeys: string[], direction: 'left' | 'right', moveKeys:string[]) {
    // 防止左侧FilterLeftTreeData值不全, 导致移到右侧时有问题
    data.searchWord = '';
    on_search();
    let _perentKey:string[] = [];
    targetKeys = targetKeys.filter(key => {
        return !getTreeData.value.some(item => {
            if (item.children && item.children.length == 1) {
                return false;
            }
            return !!(key == item.key && item.children);
        });
    });
    if (props.returnAll) {
        _perentKey = get_parent_keys(targetKeys, getTreeData.value);
    }

    if (direction === 'right') {
        // 将带对勾的数据过滤掉，复制给右侧的数组
        data.selectedTreeData = filter_tree_data(
            [...getFilterLeftTreeData.value],
            targetKeys,
            direction
        );
        data.filterRightTreeData = data.selectedTreeData;
    } else {
        // 将带对勾的数据过滤掉，返回给给左侧的数组
        data.selectedTreeData = filter_tree_data(
            data.selectedTreeData,
            moveKeys,
            direction
        );
        setTimeout(() => {
            data.filterRightTreeData = data.selectedTreeData;
        });
    }
    // 最终返回的$emit
    if (moveKeys.length != 0) {
        emit('update:targetKeys', [...new Set(targetKeys)]);
        emit('change', [...new Set(targetKeys)], _perentKey);
    }
}
// 点击复选框时的回调
function on_checked(_direction:'left' |'right', _:boolean, e: AntTreeNodeCheckedEvent, checkedKeys:string[], itemSelect: (n: any, c: boolean) => void) {
    const { eventKey } = e.node;
    // 筛选
    if (e.node.dataRef && e.node.dataRef.children) {
        const _treeNode = e.node.dataRef.children.map(
            (item) => item.key
        );
        if (eventKey) {
            const _check = !is_checked(checkedKeys, eventKey);
            _treeNode.forEach(item => {
                itemSelect(item, _check);
            });
        }
    }
    // itemSelect是为了让a-transfer组件知道你所选择了
    if (eventKey) itemSelect(eventKey, !is_checked(checkedKeys, eventKey));
}
function on_search() {
    const value = data.searchWord;
    data.expandedKeys = [];
    data.filterLeftTreeData = filter_search_data(
        value,
        js_utils_deep_copy(getTreeData.value)
    );
}
function filter_search_data(value: string, treeData: ICity[]) {
    let _result:ICity[] = [];
    treeData.forEach((item) => {
        if (item.children) {
            const _child = {
                key: item.key,
                title: item.title,
                children: item.children.filter((e) => {
                    return e.title.includes(value);
                })
            };
            if (
                item.children.filter((e) => e.title.includes(value))
                    .length !== 0
            ) {
                _result = [..._result, _child];
                if (value != '') {
                    data.expandedKeys.push(item.key);
                }
            }
        }
    });
    return _result;
}

watch(props.targetKeys, (val) => {
    on_change(val, 'right', []);
});
watch(() => getTreeData.value, (val) => {
    if (val.length > 0) {
        data.searchWord = '';
        flatten(js_utils_deep_copy(getTreeData.value));
        data.filterLeftTreeData = js_utils_deep_copy(getTreeData.value);
        // 初始化右侧数据
        setTimeout(() => {
            on_change(props.targetKeys, 'right', []);
        });
    }
}, {immediate: true});
</script>
