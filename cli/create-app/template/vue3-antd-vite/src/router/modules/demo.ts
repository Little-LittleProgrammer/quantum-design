import type { RouteRecordRaw } from 'vue-router';

import {
    LAYOUT
} from '@/router/base';

const _router: RouteRecordRaw[] = [
    {
        path: '/demo',
        component: LAYOUT,
        name: 'demo',
        meta: {
            title: 'demo',
            id: 'demo',
            pid: '0',
        },
        redirect: '/demo/form',
        children: [
            {
                path: 'form',
                name: 'Form',
                meta: {
                    title: 'Form表单',
                    id: 'Form',
                    pid: 'demo',
                },
                redirect: '/demo/form/use-form',
                children: [{
                    path: 'use-form',
                    name: 'UseForm',
                    component: () => import('@/views/demo/form/UseForm.vue'),
                    meta: {
                        title: 'UseForm',
                        id: 'UseForm',
                        pid: 'Form',
                    },
                }, {
                    path: 'extra-form',
                    name: 'ExtraForm',
                    component: () => import('@/views/demo/form/ExtraForm.vue'),
                    meta: {
                        title: 'ExtraForm',
                        id: 'ExtraForm',
                        pid: 'Form',
                    },
                }],
            },
            {
                path: 'table',
                name: 'Table',
                meta: {
                    title: 'Table表格',
                    id: 'Table',
                    pid: 'demo',
                },
                redirect: '/demo/table/use-table',
                children: [{
                    path: 'use-table',
                    name: 'UseTable',
                    component: () => import('@/views/demo/table/UseTable.vue'),
                    meta: {
                        title: 'UseTable',
                        id: 'UseTable',
                        pid: 'Table',
                    },
                }, {
                    path: 'form-table',
                    name: 'FormTable',
                    component: () => import('@/views/demo/table/FormTable/index.vue'),
                    meta: {
                        title: 'FormTable',
                        id: 'FormTable',
                        pid: 'Table',
                    },
                }],
            }
        ],
    }
];

export default _router;
