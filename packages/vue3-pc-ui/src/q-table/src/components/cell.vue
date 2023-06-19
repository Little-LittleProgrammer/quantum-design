<script lang="ts">
import { h, defineComponent } from 'vue';
import { treeTableCellProps } from '../type/props';
import { TreeTableData } from '../type/tree-table';
import '../style/index.scss';

export default defineComponent({
    name: 'TreeTableCell',
    props: {
        ...treeTableCellProps
    },
    setup(props, {slots}) {
        // 构建dom节点结构
        // cData: 当前单元格对象对应的数据 cParent: 当前单元格的父级单元格数据
        const content = (cData:TreeTableData, index: number, cParent?:TreeTableData) => {
            const arr = [];
            if (!cData.sub_key || cData.sub_key.length === 0) {
                arr.push(
                    h(
                        'div',
                        {
                            class: {'qm-tree-table-cell-content': true},
                            style: {
                                width: `${(1 / (props.header.length + 1 - cData.level!) * 100)}%`,
                                alignItems: 'center'
                            } // width设置宽度百分比
                        },
                        slots.default
                            ? slots.default({ cell: cData, parent: cParent || {}, headerKey: cData.key, index: index }) // 作用域插槽
                            : cData[cData.key!] || cData.value || '' // 默认值
                    )
                );
            } else {
                cData.sub_key.forEach((_k, _i) => {
                    arr.push(
                        h(
                            'div',
                            {
                                class: {'qm-tree-table-cell-content': true, 'qm-tree-table-cell-border-r': cData.sub_key && _i !== cData.sub_key.length - 1},
                                style: {
                                    width: `${(1 / (props.header.length + 1 - cData.level!) * 100)}%`,
                                    alignItems: 'center'
                                } // width设置宽度百分比

                            },
                            slots.default
                                ? slots.default({ cell: cData, parent: cParent || {}, headerKey: _k, index: index }) // 作用域插槽
                                : cData[_k] || cData.value || '' // 默认值

                        )
                    );
                });
            }
            // 当前单元格数据存在children循环调用
            if (cData.children && cData.children.length > 0) {
                const _cells: any[] = [];
                cData.children.forEach((_c:TreeTableData, _index:number) => {
                    _cells.push(
                        // cell dom构造方法(可看做调用当前组件)
                        recursion(_c, _index, cData, true)
                    );
                });
                arr.push(
                    h(
                        'div',
                        {
                            style: {flex: `1`, display: '-webkit-flex', flexDirection: 'column' }
                        },
                        _cells
                    )
                );
            }
            return arr;
        };

        /* cell组件构造入口
            cData: 当前单元格数据,
            parent: 父节点
            index: 当前cell是父children的下标 (动态class使用)
            isChild: 是否是子节点(动态class使用,除了第一列false其余全是true);
        */
        const recursion = (cData:TreeTableData, index:number, parent?:TreeTableData, isChild = false) => {
            return h(
                'div',
                {
                    class: {
                        'qm-tree-table-cell': true,
                        'qm-tree-table-cell-border-l': isChild,
                        'qm-tree-table-cell-border-b': isChild && parent && parent.children && index != parent.children.length - 1
                    }
                },
                content(cData, index, parent)
            );
        };
        return () => {
            // 起始渲染
            return recursion(props.data, props.rootIndex || 0);
        };
    }
});
</script>
