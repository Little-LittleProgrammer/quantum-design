import type { RouteRecordRaw } from 'vue-router';

import {
    ERROR_COMPONENT,
    LAYOUT
} from '@/router/base';

const _router: RouteRecordRaw[] = [
    {
        path: '/backend/error',
        name: '/backend/error',
        component: LAYOUT,
        redirect: '/backend/error/404',
        meta: {
            title: 'error',
            pid: '0',
            id: 'error'
        },
        children: [
            {
                path: '404',
                component: ERROR_COMPONENT,
                meta: {
                    title: '404',
                    pid: 'error',
                    id: 'error2'
                },
                name: 'error2'
            }
        ]
    },
    {
        path: '/backend/:pathMatch(.*)*',
        name: 'NotFound',
        component: LAYOUT,
        redirect: '/backend/error/404',
        meta: {
            title: 'error',
            pid: '0',
            id: 'error/*'
        },
        children: []
    }
];

export default _router;
