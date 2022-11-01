// 编写业务时,用到的常用接口类型
import { ColumnType } from 'ant-design-vue/lib/table/interface';

declare global {

    // selectOption
    interface ISelectOption {
        label: string | number;
        value: string | number;
        children?: ISelectOption[];
    }

    // select
    type ISelectList<T extends string> = {
        [key in T] : ISelectOption[];
    }

    type IApiPageOption = {
        page: number;
        page_size: number;
        count?: number
    }

    // 接口返回的 table
    type IApiTableData<T, V> = {
        header: T;
        list: V[];
        pagination?: IApiPageOption;
        [k: string]: string | Object | undefined
    }

    // 实际渲染的 Table
    type ITableData<T> = {
        header: ColumnType[];
        list: T[];
    }

    // 分页信息
    type IPageOption = Record<'current' | 'pageSize' | 'total', number>

    // modal信息
    type IModalData<T = Record<string, any>> = {
        visible: boolean,
        formData: T
    }
    type TimeoutHandle = ReturnType<typeof setTimeout>;
    type IntervalHandle = ReturnType<typeof setInterval>;
}

