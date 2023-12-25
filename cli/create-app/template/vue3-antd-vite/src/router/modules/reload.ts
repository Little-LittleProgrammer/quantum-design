import { RouteRecordRaw } from 'vue-router';
import { LAYOUT } from '../base';

export const redirectRoute: RouteRecordRaw = {
    path: '/redirect',
    component: LAYOUT,
    name: 'RedirectTo',
    meta: {
        title: 'Redirect',
        hideBreadcrumb: true,
        hideMenu: true,
        id: 'redirect',
        pid: '0'
    },
    children: [
        {
            path: '/redirect/:path(.*)',
            name: 'Redirect',
            component: () => import('@/views/redirect/index.vue'),
            meta: {
                title: 'Redirect',
                hideBreadcrumb: true,
                id: 'redirectPage',
                pid: 'redirect'
            }
        }
    ]
};
