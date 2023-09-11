import TreeTable from './src/tree-table.vue';
import type {TreeTableData} from './src/type/tree-table';
import type {TreeTableProps, TreeTableCellProps} from './src/type/props';

import { component_with_install } from '@quantum-design/utils';
const QTreeTable = component_with_install(TreeTable);

export type {TreeTableData, TreeTableProps, TreeTableCellProps};
export default QTreeTable;
