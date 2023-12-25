const _menus = [
    {
        id: '99999',
        path: '/backend/system-management',
        auth_name: '系统管理',
        icon: '',
        children: [
            {
                id: '99999-1',
                path: '/backend/system-management/permission',
                auth_name: '权限管理',
                icon: '',
                children: [
                    {
                        id: '99999-1-1',
                        path: '/backend/system-management/permission/menu-config',
                        auth_name: '菜单配置',
                        icon: '',

                    },
                    {
                        id: '99999-1-2',
                        path: '/backend/system-management/permission/role',
                        auth_name: '角色管理',
                        icon: '',
                    },
                    {
                        id: '99999-1-3',
                        path: '/backend/system-management/permission/person',
                        auth_name: '人员管理',
                        icon: '',
                    }
                ]
            }
        ]
    }
];

export default _menus;
