import { ExtractPropTypes, PropType } from 'vue';
import { RouteRecordRaw } from 'vue-router';

export const breadcrumbProps = {
    routerList: {
        type: Array as PropType<RouteRecordRaw[]>,
        default: () => []
    }
};
export type BreadcrumbProps = ExtractPropTypes<typeof breadcrumbProps>
