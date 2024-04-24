module.exports = {
    title: '量子组件库',
    description: '量子组件库，富含了量子前端组集体对前端组件库的钻研与封装',
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
        repo: 'xxx',
        repoLabel: 'github',
        searchPlaceholder: '搜索组件...',
        backToTop: true,
         // 为以下路由添加侧边栏
        sidebar:{
        }
    }
}