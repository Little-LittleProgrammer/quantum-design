const _router = [
    {
        path: '/backend/base-data',
        component: (resolve) => require(['@/layout/index'], resolve),
        meta: {
            title: '基础数据',
            pathName: '基础数据'
        },
        name: '基础数据',
        redirect: '/backend/base-data/event-analysis/overview',
        children: [
            {
                name: '事件分析',
                path: 'event-analysis',
                component: (resolve) => require(['@/views/base-data/event-analysis/index'], resolve),
                meta: {
                    title: '基础数据-事件分析'
                },
                redirect: '/backend/base-data/event-analysis/overview',
                children: [
                    {
                        path: 'overview',
                        component: (resolve) => require(['@/views/base-data/event-analysis/overview'], resolve),
                        meta: {
                            title: '基础数据-事件分析'
                        },
                        name: '概况'
                    },
                    {
                        path: 'customize',
                        component: (resolve) => require(['@/views/base-data/event-analysis/customize'], resolve),
                        meta: {
                            title: '基础数据-事件分析'
                        },
                        name: '自定义分组'
                    },
                    {
                        path: 'customize1',
                        component: (resolve) => require(['@/views/base-data/event-analysis/customize'], resolve),
                        meta: {
                            title: '基础数据-事件分析11'
                        },
                        name: 'customize1'
                    },
                    {
                        path: 'customize2',
                        component: (resolve) => require(['@/views/base-data/event-analysis/customize'], resolve),
                        meta: {
                            title: '基础数据-事件分析222'
                        },
                        name: 'customize2'
                    }
                ]
            }
        ]
    }
];

export default _router;
