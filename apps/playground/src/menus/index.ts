
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
            path: '/demo/table/use-table',
            auth_name: 'use-table',
            id: 5,
            pid: 4,
            path_type: 1
        }, {
            path: '/demo/table/form-table',
            auth_name: 'form-table',
            id: 6,
            pid: 4,
            path_type: 1
        }]
    }]
}];

console.log('_menus', _menus);

export default _menus;
