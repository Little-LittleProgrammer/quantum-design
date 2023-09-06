import { reactive } from 'vue';
import { SorterResult } from 'ant-design-vue/lib/table/interface';

type ISortData = Record<string, string | number | undefined>;
type IPageOption = Record<'current' | 'pageSize' | 'total', number>
interface ITableSortOption {
    // 排序字段
    sort_field?: string;
    // 排序类型
    sort_type?: number | string;
    // 升序值
    ascend_val?: number | string;
    // 降序值
    descend_val?: number | string;
}

/**
 * @param {*} options 自定义字段key配置 排序字段: sort_field, 排序类型: sort_type, 升序值: ascend_val, 降序值: descend_val
 * @description 用于antd表格的指定列排序
 */
export function useOriginTableSort(cb: () => void, options?: ITableSortOption) {
    const _sortData = reactive<ISortData>({});
    const _reqOptions: Required<ITableSortOption> = Object.assign({ sort_field: 'sort_field', sort_type: 'sort_type', ascend_val: 1, descend_val: 2 }, options);
    function change_table_sort(_pagination: IPageOption, _filters: never, sorter: SorterResult) {
        _sortData[_reqOptions.sort_field] = sorter.field as string;
        _sortData[_reqOptions.sort_type] = sorter.order === 'ascend' ? _reqOptions.ascend_val : _reqOptions.descend_val;
        if (!sorter.order) {
            _sortData[_reqOptions.sort_field] = undefined;
            _sortData[_reqOptions.sort_type] = undefined;
        }
        cb();
    }
    return {
        changeTableSort: change_table_sort,
        sortData: _sortData
    };
}
