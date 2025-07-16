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
            pid: '0'
        },
        redirect: '/demo/form',
        children: [{
            path: 'form',
            name: 'Form',
            meta: {
                title: 'Form表单',
                id: 'Form',
                pid: 'demo'
            },
            redirect: '/demo/form/use-form',
            children: [{
                path: 'use-form',
                name: 'UseForm',
                component: () => import('@/views/demo/form/UseForm.vue'),
                meta: {
                    title: 'UseForm',
                    id: 'UseForm',
                    pid: 'Form'
                }
            }, {
                path: 'extra-form',
                name: 'ExtraForm',
                component: () => import('@/views/demo/form/ExtraForm.vue'),
                meta: {
                    title: 'ExtraForm',
                    id: 'ExtraForm',
                    pid: 'Form'
                }
            }]
        }, {
            path: 'drawer',
            name: 'Drawer',
            component: () => import('@/views/demo/drawer/index.vue'),
            meta: {
                title: 'Drawer抽屉',
                id: 'Drawer',
                pid: 'demo'
            }
        }, {
            path: 'table',
            name: 'Table',
            meta: {
                title: 'Table表格',
                id: 'Table',
                pid: 'demo'
            },
            redirect: '/demo/table/form-table',
            children: [ {
                path: 'form-table',
                name: 'FormTable',
                component: () => import('@/views/demo/table/FormTable/index.vue'),
                meta: {
                    title: 'FormTable',
                    id: 'FormTable',
                    pid: 'Table'
                }
            }, {
                path: 'tree-table',
                name: 'TreeTable',
                component: () => import('@/views/demo/tree-table/index.vue'),
                meta: {
                    title: 'TreeTable',
                    id: 'TreeTable',
                    pid: 'Table'
                }
            }]
        }, {
            path: 'modal',
            name: 'Modal',
            component: () => import('@/views/demo/modal/index.vue'),
            meta: {
                title: 'Modal',
                id: 'Modal',
                pid: 'demo'
            }
        }, {
            path: 'echarts',
            name: 'Echarts',
            component: () => import('@/views/demo/echarts/useEcharts.vue'),
            meta: {
                title: 'Echarts',
                id: 'Echarts',
                pid: 'demo'
            }
        }, {
            path: 'upload',
            name: 'Upload',
            meta: {
                title: '上传组件',
                id: 'Upload',
                pid: 'demo'
            },
            redirect: '/demo/upload/card-upload',
            children: [{
                path: 'card-upload',
                name: 'CardUpload',
                component: () => import('@/views/demo/card-upload/index.vue'),
                meta: {
                    title: 'CardUpload',
                    id: 'CardUpload',
                    pid: 'Upload'
                }
            }]
        }, {
            path: 'editor',
            name: 'Editor',
            meta: {
                title: '编辑器组件',
                id: 'Editor',
                pid: 'demo'
            },
            redirect: '/demo/editor/code-editor',
            children: [{
                path: 'code-editor',
                name: 'CodeEditor',
                component: () => import('@/views/demo/code-editor/index.vue'),
                meta: {
                    title: 'CodeEditor',
                    id: 'CodeEditor',
                    pid: 'Editor'
                }
            }, {
                path: 'rich-text',
                name: 'RichText',
                component: () => import('@/views/demo/rich-text/index.vue'),
                meta: {
                    title: 'RichText',
                    id: 'RichText',
                    pid: 'Editor'
                }
            }]
        }, {
            path: 'feedback',
            name: 'Feedback',
            meta: {
                title: '反馈组件',
                id: 'Feedback',
                pid: 'demo'
            },
            redirect: '/demo/feedback/loading',
            children: [{
                path: 'loading',
                name: 'Loading',
                component: () => import('@/views/demo/loading/index.vue'),
                meta: {
                    title: 'Loading',
                    id: 'Loading',
                    pid: 'Feedback'
                }
            }]
        }, {
            path: 'data-display',
            name: 'DataDisplay',
            meta: {
                title: '数据展示',
                id: 'DataDisplay',
                pid: 'demo'
            },
            redirect: '/demo/data-display/tag',
            children: [{
                path: 'tag',
                name: 'Tag',
                component: () => import('@/views/demo/tag/index.vue'),
                meta: {
                    title: 'Tag',
                    id: 'Tag',
                    pid: 'DataDisplay'
                }
            }]
        }, {
            path: 'data-entry',
            name: 'DataEntry',
            meta: {
                title: '数据录入',
                id: 'DataEntry',
                pid: 'demo'
            },
            redirect: '/demo/data-entry/transfer',
            children: [{
                path: 'transfer',
                name: 'Transfer',
                component: () => import('@/views/demo/transfer/index.vue'),
                meta: {
                    title: 'Transfer',
                    id: 'Transfer',
                    pid: 'DataEntry'
                }
            }]
        }]
    }
];

export default _router;
