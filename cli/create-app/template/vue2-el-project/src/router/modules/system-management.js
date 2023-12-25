// 系统管理
const _router = [
    {
        path: '/backend/system-management',
        component: (resolve) => require(['@/layout/index'], resolve),
        meta: {
            title: '系统管理'
        },
        redirect: '/backend/system-management/permission',
        children: [
            {
                path: 'permission',
                component: (resolve) => require(['@/views/system-management/permission/index'], resolve),
                meta: {
                    title: '系统管理-权限管理'
                },
                redirect: '/backend/system-management/permission/menu-config',
                children: [
                    {
                        path: 'menu-config',
                        component: (resolve) => require(['@/views/system-management/permission/menu-config'], resolve),
                        meta: {
                            title: '系统管理-权限管理-菜单配置'
                        }
                    },
                    {
                        path: 'role',
                        component: (resolve) => require(['@/views/system-management/permission/role'], resolve),
                        meta: {
                            title: '系统管理-权限管理-角色管理'
                        }
                    },
                    {
                        path: 'person',
                        component: (resolve) => require(['@/views/system-management/permission/person'], resolve),
                        meta: {
                            title: '系统管理-权限管理-人员管理'
                        }
                    }
                ]
            }
        ]
    }
];

export default _router;
