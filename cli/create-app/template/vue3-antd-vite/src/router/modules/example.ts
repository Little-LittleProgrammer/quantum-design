import { RouteRecordRaw } from 'vue-router';
import { LAYOUT } from '../base';

export const exampleRoute: RouteRecordRaw = {
    path: '/example',
    component: LAYOUT,
    name: '例子',
    meta: {
        title: '例子',
        id: 'example',
        pid: '0'
    },
    redirect: '/example/example',
    children: [
        {
            path: '/example/example',
            name: 'Example',
            component: () => import('@/views/example/index.vue'),
            meta: {
                title: '例子',
                id: 'example-child',
                pid: 'example'
            }
        }
    ]
};
