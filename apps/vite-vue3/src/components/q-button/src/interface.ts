import { ButtonProps } from 'ant-design-vue/es/button/buttonTypes';
import { TooltipProps } from 'ant-design-vue/es/tooltip/Tooltip';
export type { PaginationProps } from 'ant-design-vue/lib/pagination';

interface Fn<T = any, R = T> {
    (...arg: T[]): R;
}

export interface ActionItem extends ButtonProps {
    onClick?: Fn;
    label?: string;
    color?: 'success' | 'error' | 'warning';
    icon?: string;
    popConfirm?: PopConfirm;
    disabled?: boolean;
    divider?: boolean;
    // 业务控制是否显示
    ifShow?: boolean | ((action: ActionItem) => boolean);
    tooltip?: string | TooltipProps;
}

export interface PopConfirm {
    title: string;
    okText?: string;
    cancelText?: string;
    confirm: Fn;
    cancel?: Fn;
    icon?: string;
    placement?:string
}
