import type { App, Plugin } from 'vue';
import type {ActionItem, PopConfirm} from './src/interface';
import QAntdTableAction from './src/components/table-action.vue';
import QAntdTablePagination from './src/components/table-pagination.vue';
import QAntdTableTreeDrag from './src/components/table-tree-drag.vue';
import type { PaginationProps } from './src/interface';
import type { TableProps } from 'ant-design-vue/lib/table/Table';
import QAntdTable from './src/table.vue';
export type {
    PopConfirm,
    ActionItem,
    PaginationProps,
    TableProps
};

QAntdTable.TableAction = QAntdTableAction;
QAntdTable.TablePagination = QAntdTablePagination;
QAntdTable.TableTreeDrag = QAntdTableTreeDrag;

QAntdTable.install = function(app: App) {
    app.component(QAntdTable.name, QAntdTable);
    app.component(QAntdTable.TableAction.name, QAntdTable.TableAction);
    app.component(QAntdTable.TablePagination.name, QAntdTable.TablePagination);
    app.component(QAntdTable.TableTreeDrag.name, QAntdTable.TableTreeDrag);
};

export {
    QAntdTableAction,
    QAntdTablePagination,
    QAntdTableTreeDrag
};

export default QAntdTable as typeof QAntdTable &
Plugin & {
    readonly TableAction: typeof QAntdTableAction;
    readonly TablePagination: typeof QAntdTablePagination;
    readonly TableTreeDrag: typeof QAntdTableTreeDrag;
};
