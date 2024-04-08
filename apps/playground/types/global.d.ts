// 编写业务时,用到的常用接口类型
import { ColumnType } from 'ant-design-vue/lib/table/interface';

declare global {

    // selectOption
    interface ISelectOption {
        label: string | number;
        value: string | number;
        [key: string]: string | number | boolean
    }

    // select
    type ISelectList<T extends string> = {
        [key in T] : ISelectOption[];
    }

    // 接口返回的 table
    type IApiTableData<T extends string, V extends string> = {
        header: {
            [key in T]: string;
        };
        list: {
            [key in T | V]: string | Object | string[]
        }[];
        pagination?: {
            page: string;
            page_size: string;
            count: string
        };
        [k: string]: string | Object | undefined
    }

    // 实际渲染的 Table
    type ITableData<T extends string> = {
        header: ColumnType[];
        list: {
            [key in T & string]: string | Object | string[]
        }[];
    }

    // 分页信息
    type IPageOption = Record<'current' | 'pageSize' | 'total', number>

    // modal信息
    type IModalData<T = Recordable<string>> = {
        visible: boolean,
        formData: T
    }

}

