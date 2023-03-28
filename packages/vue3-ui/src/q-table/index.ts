import TreeTable from './src/tree-table.vue';
import type {TreeTableData} from './src/type/tree-table';
import type {TreeTableProps, TreeTableCellProps} from './src/type/props';

import { withInstall } from '@wuefront/utils';
const QTreeTable = withInstall(TreeTable);

export type {TreeTableData, TreeTableProps, TreeTableCellProps};
export {QTreeTable};
