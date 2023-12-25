const _router = [
    {
        path: '/backend/element-ui',
        component: (resolve) => require(['@/layout/index'], resolve),
        children: [
            {
                path: '/backend/element-ui/:id',
                component: (resolve) => require(['@/views/element-ui/index'], resolve),
                meta: {
                    title: 'element-ui-id'
                },
                children: [
                    {
                        path: '/backend/element-ui/:id/:type',
                        component: (resolve) => require(['@/views/element-ui/index'], resolve),
                        meta: {
                            title: 'element-ui-type'
                        },
                    }
                ]
            }
        ]
    }
];

export default _router;
