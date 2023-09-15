import { ExtractPropTypes, PropType } from 'vue';
import { RouteRecordRaw } from 'vue-router';

export const breadcrumbProps = {
    routerList: {
        type: Array as PropType<RouteRecordRaw[]>,
        default: () => []
    }
};
export type BreadcrumbProps = ExtractPropTypes<typeof breadcrumbProps>

export interface IBreadcrumb {
    id: string | number;
    name: string;
    path: string;
    pid: string | number;
    title: string
}
