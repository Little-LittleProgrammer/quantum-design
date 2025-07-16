import type { ExtractPropTypes, PropType } from 'vue';
import type { TreeTableData } from './tree-table';

export const treeTableProps = {
    treeData: { // 树形结构数据
        type: Array as PropType<TreeTableData[]>,
        default: () => []
    },
    header: { // 头部字段
        type: Object as PropType<Record<string, string>>,
        default: () => {}
    }
};

export type TreeTableProps = Partial<ExtractPropTypes<typeof treeTableProps>>

export const treeTableCellProps = {
    data: { // 当前单元格数据
        type: Object as PropType<TreeTableData>,
        default: () => {
            return {
                value: ''
            };
        }
    },
    parent: { // 父级单元格数据
        type: Object as PropType<TreeTableData>,
        default: () => {
            return {
                children: []
            };
        }
    },
    header: { // 表头key数组（按顺序的）
        type: Array as PropType<string[]>,
        default: () => []
    },
    rootIndex: { // 表头key数组（按顺序的）
        type: Number,
        default: 0
    }
};

export type TreeTableCellProps = Partial<ExtractPropTypes<typeof treeTableCellProps>>
