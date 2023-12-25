module.exports = {
    title: '七猫组件库',
    description: '七猫组件库，富含了七猫前端组集体对前端组件库的钻研与封装',
    host: '172.16.70.132',
    theme: 'copy-antdocs',
    themeConfig: {
        logo: '/logo.png',
        nav: [
            { text: '主页', link: '/' }, // 导航条
            { text: '组件', link: '/baseComponents/0.1.0/' },
            { text: '知识库', link: '/knowledge/' },
            {
                text: '版本',
                ariaLabel: 'version Menu',
                items: [
                  { text: '0.1.0', link: '/baseComponents/0.1.0/' },
                  { text: '0.0.9', link: '/baseComponents/0.0.9/' },
                ]
            },
            { text: '开发手册', link: '/help/' },
        ],
        // 顶部栏右侧的链接
        repo: 'https://codeup.aliyun.com/qimao/front/qm-npm-pc',
        repoLabel: 'github',
        searchPlaceholder: '搜索组件...',
        backToTop: true,
         // 为以下路由添加侧边栏
        sidebar:{
            '/baseComponents/0.1.0/': [
                {
                    title: '布局类组件',
                    collapsable: true,
                    children: [
                    ]
                },
                {
                    title: '可视化组件',
                    collapsable: true,
                    children: [
                    ]
                },
                {
                    title: '工具类组件',
                    collapsable: true,
                    children: [
                        'q-button',
                    ]
                },
                {
                    title: '方法类函数',
                    collapsable: true,
                    children: [

                    ]
                },
            ],
            '/baseComponents/0.0.9/': [
                {
                    title: '布局类组件',
                    collapsable: true,
                    children: [
                    ]
                },
                {
                    title: '可视化组件',
                    collapsable: true,
                    children: [
                    ]
                },
                {
                    title: '工具类组件',
                    collapsable: true,
                    children: [
                        'tool/q-button',
                    ]
                },
                {
                    title: '方法类函数',
                    collapsable: true,
                    children: [

                    ]
                },
            ],
            '/knowledge/': [
                {
                    title: 'vue知识点',
                    collapsable: true,
                    children: [
                        'test'
                    ]
                },
            ]
        }
    }
}