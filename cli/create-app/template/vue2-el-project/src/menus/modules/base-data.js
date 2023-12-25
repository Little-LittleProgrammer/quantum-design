const _menus = [
    {
        id: '1',
        path: '/backend/base-data',
        auth_name: '基础数据',
        children: [
            {
                id: '1-1',
                path: '/backend/base-data/event-analysis/overview',
                auth_name: '事件分析',
                children: [
                    {
                        id: '1-1-1',
                        path: '/backend/base-data/event-analysis/overview',
                        auth_name: '概况'
                    },
                    {
                        id: '1-1-2',
                        path: '/backend/base-data/event-analysis/customize',
                        auth_name: '自定义分组'
                    }
                ]
            },
            {
                id: '1-2',
                path: '/backend/base-data/day-active-degree',
                auth_name: '日活跃度构成'
            }
        ]
    }
];

export default _menus;
