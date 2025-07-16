
import type { IMenuData } from '@quantum-design/types/vue/router';
const _menus:IMenuData[] = [{
    path: '/demo',
    auth_name: 'demo',
    id: 1,
    pid: 0,
    path_type: 1,
    children: [{
        path: '/demo/form',
        auth_name: 'form',
        id: 2,
        pid: 1,
        path_type: 1,
        children: [{
            path: '/demo/form/use-form',
            auth_name: 'use-form',
            id: 3,
            pid: 2,
            path_type: 1
        }, {
            path: '/demo/form/extra-form',
            auth_name: 'extra-form',
            id: 11,
            pid: 2,
            path_type: 1
        }]
    }, {
        path: '/demo/table',
        auth_name: 'table',
        id: 4,
        pid: 1,
        path_type: 1,
        children: [{
            path: '/demo/table/form-table',
            auth_name: 'form-table',
            id: 6,
            pid: 4,
            path_type: 1
        }, {
            path: '/demo/table/tree-table',
            auth_name: 'tree-table',
            id: 12,
            pid: 4,
            path_type: 1
        }]
    }, {
        path: '/demo/modal',
        auth_name: 'modal',
        id: 7,
        pid: 1,
        path_type: 1
    }, {
        path: '/demo/drawer',
        auth_name: 'drawer',
        id: 24,
        pid: 1,
        path_type: 1
    }, {
        path: '/demo/echarts',
        auth_name: 'echarts',
        id: 8,
        pid: 1,
        path_type: 1
    }, {
        path: '/demo/upload',
        auth_name: 'upload',
        id: 13,
        pid: 1,
        path_type: 1,
        children: [{
            path: '/demo/upload/card-upload',
            auth_name: 'card-upload',
            id: 14,
            pid: 13,
            path_type: 1
        }]
    }, {
        path: '/demo/editor',
        auth_name: 'editor',
        id: 15,
        pid: 1,
        path_type: 1,
        children: [{
            path: '/demo/editor/code-editor',
            auth_name: 'code-editor',
            id: 16,
            pid: 15,
            path_type: 1
        }, {
            path: '/demo/editor/rich-text',
            auth_name: 'rich-text',
            id: 17,
            pid: 15,
            path_type: 1
        }]
    }, {
        path: '/demo/feedback',
        auth_name: 'feedback',
        id: 18,
        pid: 1,
        path_type: 1,
        children: [{
            path: '/demo/feedback/loading',
            auth_name: 'loading',
            id: 19,
            pid: 18,
            path_type: 1
        }]
    }, {
        path: '/demo/data-display',
        auth_name: 'data-display',
        id: 20,
        pid: 1,
        path_type: 1,
        children: [{
            path: '/demo/data-display/tag',
            auth_name: 'tag',
            id: 21,
            pid: 20,
            path_type: 1
        }]
    }, {
        path: '/demo/data-entry',
        auth_name: 'data-entry',
        id: 22,
        pid: 1,
        path_type: 1,
        children: [{
            path: '/demo/data-entry/transfer',
            auth_name: 'transfer',
            id: 23,
            pid: 22,
            path_type: 1
        }]
    }]
}];

console.log('_menus', _menus);

export default _menus;
