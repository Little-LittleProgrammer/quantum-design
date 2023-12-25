const _router = [
    {
        path: '/backend/error',
        component: (resolve) => require(['@/layout/index'], resolve),
        redirect: '/backend/error/404',
        children: [
            {
                path: '404',
                component: (resolve) => require(['@/views/error/404'], resolve),
                meta: {
                    title: '404'
                },
                name: 'error2'
            }
        ]
    },
    {
        path: '/backend/*',
        component: (resolve) => require(['@/layout/index'], resolve),
        redirect: '/backend/error/404',
        children: [
            {
                path: '404',
                component: (resolve) => require(['@/views/error/404'], resolve),
                meta: {
                    title: '404'
                },
                name: 'error1'
            }
        ]
    }
];

export default _router;
