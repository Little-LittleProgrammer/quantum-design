import type { RouteRecordRaw } from 'vue-router';
import {
    LAYOUT
} from '@/router/base';
import { get_parent_layout } from '../utils';

// 系统管理
const _router:RouteRecordRaw[] = [
    {
        path: '/backend/system-management',
        name: 'SystemManagement',
        component: LAYOUT,
        meta: {
            title: '系统管理',
            pid: '0',
            id: 'system-management'
        },
        redirect: '/backend/system-management/permission',
        children: [
            {
                path: 'permission',
                name: 'Permission',
                component: get_parent_layout('Permission'),
                // component: () => import('@/views/system-management/permission/index.vue'),
                meta: {
                    title: '权限管理',
                    pid: 'system-management',
                    id: 'permission'
                },
                redirect: '/backend/system-management/permission/menu-config',
                children: [
                    {
                        path: 'menu-config',
                        name: 'MenuConfig',
                        component: () => import('@/views/system-management/permission/menu-config.vue'),
                        meta: {
                            title: '菜单配置',
                            pid: 'permission',
                            id: 'menu-config'
                        }
                    },
                    {
                        path: 'role',
                        name: 'Role',
                        component: () => import('@/views/system-management/permission/role.vue'),
                        meta: {
                            title: '角色管理',
                            pid: 'permission',
                            id: 'role'
                        }
                    },
                    {
                        path: 'person',
                        name: 'Person',
                        component: () => import('@/views/system-management/permission/person.vue'),
                        meta: {
                            title: '人员管理',
                            pid: 'permission',
                            id: 'person'
                        }
                    }
                ]
            }
        ]
    }
];

export default _router;
