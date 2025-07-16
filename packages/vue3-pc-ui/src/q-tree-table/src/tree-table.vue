<!--  -->
<template>
    <div class="qm-tree-table" style="margin: 10px;">
    <!-- 表格头部 -->
        <TreeTableCell class="qm-tree-table-cell-border-b qm-tree-table-header" :data="data.headerTree" :header="data.headerFormat">
            <template #default="scope">
                <slot name="header" :hKey="scope.cell.key">
                    <span class="qm-tree-table-cell-content-span">{{ scope.cell[scope.headerKey] }}</span>
                </slot>
            </template>
        </TreeTableCell>
        <!-- 列表数据 -->
        <TreeTableCell v-for="(item, index) in data.dataTree" :class="{'qm-tree-table-cell-border-b': index !== props.treeData.length - 1}" :key="item.key" :rootIndex="index" :data="item" :header="data.headerFormat">
            <template #default="scope">
                <slot :cell="scope.cell" :parent="scope.parent" :headerKey="scope.headerKey" :index="scope.index">
                    <span class="qm-tree-table-cell-content-span">{{ scope.cell[scope.headerKey] }}</span>
                </slot>
            </template>
        </TreeTableCell>
    </div>
</template>

<script lang='ts' setup>
import { reactive, watch } from 'vue';
import TreeTableCell from './components/cell.vue';
import type { TreeTableData } from './type/tree-table';
import { treeTableProps } from './type/props';

defineOptions({
    name: 'QTreeTable'
});

const props = defineProps({
    ...treeTableProps
});

const data = reactive({
    headerFormat: Object.keys(props.header) || [],
    headerTree: {},
    dataTree: [] as TreeTableData[]
});

watch(
    () => props.treeData,
    () => {
        data.dataTree = props.treeData;
        const _fn = (arr:TreeTableData[], index:number) => {
            arr.forEach(_d => {
                _d.level = index;
                if (_d.children && _d.children.length > 0) {
                    _fn(_d.children, _d.level + (_d.sub_key ? _d.sub_key.length : 1));
                }
            });
        };
        _fn(data.dataTree, 1);
    },
    {deep: true, immediate: true}
);

const format_header = () => {
    data.headerFormat = [];
    let _obj:TreeTableData;
    Object.keys(props.header).forEach((_k, _i) => {
        const _o: TreeTableData = {
            level: data.headerFormat.length + 1
        };
        if (typeof props.header[_k] !== 'object') {
            _o.key = _k;
            _o[_k] = props.header[_k];
            data.headerFormat.push(_k);
        } else {
            _o.sub_key = [...Object.keys(props.header[_k])];
            _o.sub_key.forEach(_subk => {
                _o[_subk] = props.header[_k][_subk];
                data.headerFormat.push(_subk);
            });
        }
        if (_i !== Object.keys(props.header).length - 1) {
            _o.children = [];
        }
        if (_i === 0) {
            Object.assign(data.headerTree, _o);
        } else {
            _obj.children && _obj.children.push(_o);
        }
        _obj = _o;
    });
};

watch(() => props.header, () => {
    format_header();
}, {immediate: true});

</script>
<style lang="scss">
.qm-tree-table {
    // 边框颜色
    $border-color: #eee;
    @include border-color(border-color);

    display: flex;
    flex-direction: column;
    border: 1px solid $border-color;
    @include border-color(border-color);
    &-cell {
        display: flex;
        flex: 1;
        &-content {
            display: flex;
            padding: 10px;
            justify-content: center;
            box-sizing: border-box;
            &-span {
                display: inline-block;
                width: 100%;
            }
        }
        &-border-l {
            border-left: 1px solid $border-color;
            @include border-color(border-color, 'left');
        }
        &-border-r {
            align-items: center;
            border-right: 1px solid $border-color;
            @include border-color(border-color, 'right');
        }
        &-border-b {
            border-bottom: 1px solid $border-color;
            @include border-color(border-color, 'bottom');
        }
    }
    &-header {
        background: #fafafa;
        color: #000;
        @include text-color(text-color);
        @include bg-color(body-bg);
        .qm-tree-table-cell-content {
            &-span {
                text-align: center;
            }

        }
    }
}
</style>
