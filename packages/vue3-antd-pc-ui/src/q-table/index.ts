import type { App, Plugin } from 'vue';
import type {ActionItem, PopConfirm} from './src/types/table-action';
import QAntdTableAction from './src/components/table-action.vue';
import QAntdTablePagination from './src/components/table-pagination.vue';
import QAntdTableTreeDrag from './src/components/table-tree-drag.vue';
import QAntdTableImg from './src/components/cell/table-img.vue';
import type { PaginationProps } from './src/types/pagination';
import type { TableProps } from 'ant-design-vue/lib/table/Table';
export type { EditRecordRow } from './src/components/editable';
export type * from './src/types/table';
import QAntdTable from './src/table.vue';
export { useTable } from './src/hooks/use-table';
export {add, del} from './src/component-map';

export type {
    PopConfirm,
    ActionItem,
    PaginationProps,
    TableProps
};

QAntdTable.TableAction = QAntdTableAction;
QAntdTable.TablePagination = QAntdTablePagination;
QAntdTable.TableTreeDrag = QAntdTableTreeDrag;
QAntdTable.TableImg = QAntdTableImg;

QAntdTable.install = function(app: App) {
    app.component(QAntdTable.name, QAntdTable);
    app.component(QAntdTable.TableAction.name, QAntdTable.TableAction);
    app.component(QAntdTable.TablePagination.name, QAntdTable.TablePagination);
    app.component(QAntdTable.TableTreeDrag.name, QAntdTable.TableTreeDrag);
    app.component(QAntdTable.TableImg.name, QAntdTable.TableImg);
};

export {
    QAntdTableAction,
    QAntdTablePagination,
    QAntdTableTreeDrag,
    QAntdTableImg
};

export default QAntdTable as typeof QAntdTable &
Plugin & {
    readonly TableAction: typeof QAntdTableAction;
    readonly TablePagination: typeof QAntdTablePagination;
    readonly TableTreeDrag: typeof QAntdTableTreeDrag;
    readonly TableImg: typeof QAntdTableImg;
};
