import { ComputedRef, unref } from 'vue';
import { BasicTableProps, TableCustomRecord } from '../types/table';
import { js_is_function } from '@quantum-design/utils';

export function useTableStyle(propsRef: ComputedRef<BasicTableProps>, prefixCls: string) {
    function getRowClassName(record: TableCustomRecord, index: number) {
        const {striped, rowClassName} = unref(propsRef);
        const classNames: string[] = [];
        if (striped) {
            classNames.push((index || 0) % 2 === 1 ? `${prefixCls}-row-striped` : '');
        }
        if (rowClassName && js_is_function(rowClassName)) {
            classNames.push(rowClassName(record, index));
        }
        return classNames.filter((cls) => !!cls).join(' ');
    }
    return {getRowClassName};
}
