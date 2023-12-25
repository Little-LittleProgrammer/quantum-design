const _router = [
    {
        path: '/backend/example',
        component: (resolve) => require(['@/views/example/index'], resolve),
        meta: {
            title: 'example'
        },
        name: 'example'
    }
];

export default _router;
