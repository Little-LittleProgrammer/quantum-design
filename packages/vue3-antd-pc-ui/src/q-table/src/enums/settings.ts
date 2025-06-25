// Used to configure the general configuration of some components without modifying the components
import type { SorterResult } from '../types/table';

// column: ColumnProps;
//     order: SortOrder; // 'ascend' or 'descend';
//     field: string; // 排序字段
//     columnKey: string; // 需要排序的列
export default {
    // basic-table setting
    table: {
        // Form interface request general configuration
        // support xxx.xxx.xxx
        fetchSetting: {
            // The field name of the current page passed to the background
            pageField: 'page',
            // The number field name of each page displayed in the background
            sizeField: 'page_size',
            // Field name of the form data returned by the interface
            listField: 'list',
            sortHeaderField: 'sort',
            // Total number of tables returned by the interface field name
            totalField: 'count',
            headerField: 'header',
            summaryField: 'total',
            actionField: 'action',
            customExtra: {
                checkField: 'checked_list',
                listField: 'list',
            },
        },
        // Number of pages that can be selected
        pageSizeOptions: ['10', '50', '80', '100'],
        // Default display quantity on one page
        defaultPageSize: 10,
        // Default Size
        defaultSize: 'small',
        // Custom general sort function
        defaultSortFn: (sortInfo: SorterResult) => {
            const { field, order, } = sortInfo;
            if (field && order) {
                return {
                    // The sort field passed to the backend you
                    field,
                    // Sorting method passed to the background asc/desc
                    order,
                    sort_type: order === 'ascend' ? 1 : 2,
                    sort_field: field,
                };
            } else {
                return {};
            }
        },
        // Custom general filter function
        defaultFilterFn: (data: Partial<Record<string, string[]>>) => {
            return data;
        },
    },
};
