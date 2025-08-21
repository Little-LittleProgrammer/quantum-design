import { defineConfig, DefaultTheme } from 'vitepress';

export default defineConfig({
    base: '/quantum-design/docs/',
    title: 'Vite-project',
    lang: 'zh-CN',
    description: '一个开箱即用的前端框架',
    lastUpdated: true,
    ignoreDeadLinks: true,
    outDir: '../dist',
    markdown: {
        anchor: {
            tabIndex: 1,
        },
    },
    themeConfig: {
        logo: '/logo.png',
        siteTitle: '量子',
        nav: createNav(),
        sidebar: createSidebar(),
        lastUpdatedText: '最后更新时间',
        footer: {
            message: 'MIT Licensed',
            copyright: 'Copyright © quantum',
        },
        outlineTitle: '锚点',
        docFooter: {
            prev: '上一篇',
            next: '下一篇',
        },
        socialLinks: [{ icon: 'github', link: 'https://github.com/Little-LittleProgrammer/quantum-design' }],
        editLink: {
            text: '编辑此页',
            pattern: 'https://github.com/Little-LittleProgrammer/quantum-design/tree/master/docs/project-docs/docs/:path',
        },
    },
    vite: {
        base: '/quantum-design/docs/',
        css: {
            preprocessorOptions: {
                scss: {
                    // additionalData: baseScssFile,
                },
            },
        },
        server: {
            host: true,
            port: 9090,
        },
    },
});

function createNav(): DefaultTheme.NavItem[] {
    return [
        {
            text: '开发手册',
            items: [
                {
                    text: '规范',
                    link: '/help-code/standard/publish',
                },
                {
                    text: '开发',
                    link: '/help-code/develop/docs',
                },
                {
                    text: '项目结构',
                    link: '/help-code/develop/project-structure',
                },
                {
                    text: '工程化工具链',
                    link: '/help-code/develop/toolchain',
                },
            ],
        },
        {
            text: '组件与方法',
            items: [
                {
                    text: 'hooks',
                    link: '/packages/hooks/',
                },
                {
                    text: 'http',
                    link: '/packages/http/',
                },
                {
                    text: 'shared',
                    link: '/packages/shared/',
                },
                {
                    text: 'types',
                    link: '/packages/types/',
                },
                {
                    text: 'utils',
                    link: '/packages/utils/',
                },
                {
                    text: 'vue3-antd-pc-ui',
                    link: '/packages/vue3-antd-pc-ui/',
                },
                {
                    text: 'vue3-pc-ui',
                    link: '/packages/vue3-pc-ui/',
                },
                {
                    text: 'ai-hub',
                    link: '/packages/ai-hub/',
                },
            ],
        },
        {
            text: '配置',
            items: [
                {
                    text: '总览',
                    link: '/configs/',
                },
                {
                    text: 'eslint',
                    link: '/configs/eslint/',
                },
                {
                    text: 'rollup',
                    link: '/configs/rollup/',
                },
                {
                    text: 'tsconfig',
                    link: '/configs/tsconfig/',
                },
                {
                    text: 'vite',
                    link: '/configs/vite/',
                },
                {
                    text: 'tailwind',
                    link: '/configs/tailwind/',
                },
            ],
        },
        {
            text: 'CLI工具',
            link: '/cli/',
        },
        {
            text: '项目指南',
            items: [
                {
                    text: 'Vue3/Vite',
                    link: '/guide/introduction/',
                },
                {
                    text: 'Nuxt3',
                    link: '/nuxt3/introduction/',
                },
                {
                    text: 'Tauri',
                    link: '/guide/introduction/tauri',
                },
                {
                    text: 'Tailwind CSS',
                    link: '/guide/dep/tailwind',
                },
            ],
        },
    ];
}

function createSidebar(): DefaultTheme.Sidebar {
    return {
        '/': [
            {
                text: '指南',
                items: [
                    {
                        text: '介绍',
                        link: '/help-code/start/introduction.md',
                    },
                ],
            },
            {
                text: '规范',
                items: [
                    {
                        text: 'commit规范',
                        link: '/help-code/standard/commit',
                    },
                    {
                        text: '版本与发版',
                        link: '/help-code/standard/publish',
                    },
                    {
                        text: '代码规范',
                        link: '/help-code/standard/lint',
                    },
                    {
                        text: '单元测试',
                        link: '/help-code/standard/vitest',
                    },
                ],
            },
            {
                text: '开发',
                items: [
                    {
                        text: '文档',
                        link: '/help-code/develop/docs',
                    },
                    {
                        text: '项目',
                        link: '/help-code/develop/project',
                    },
                    {
                        text: '项目结构',
                        link: '/help-code/develop/project-structure',
                    },
                    {
                        text: '依赖管理',
                        link: '/help-code/develop/dependencies',
                    },
                    {
                        text: '工程化工具链',
                        link: '/help-code/develop/toolchain',
                    },
                    {
                        text: '云效流水线',
                        link: '/help-code/develop/flow',
                    },
                ],
            },
        ],
        '/cli/': [
            {
                text: 'CLI工具',
                items: [
                    {
                        text: '总览',
                        link: '/cli/',
                    },
                ],
            },
        ],
        '/configs/': [
            {
                text: '配置总览',
                items: [
                    {
                        text: '介绍',
                        link: '/configs/',
                    },
                ],
            },
            {
                text: 'eslint',
                items: [
                    {
                        text: '介绍',
                        link: '/configs/eslint/',
                    },
                ],
            },
            {
                text: 'rollup',
                items: [
                    {
                        text: '介绍',
                        link: '/configs/rollup/',
                    },
                ],
            },
            {
                text: 'tsconfig',
                items: [
                    {
                        text: '介绍',
                        link: '/configs/tsconfig/',
                    },
                ],
            },
            {
                text: 'vite',
                items: [
                    {
                        text: '介绍',
                        link: '/configs/vite/',
                    },
                ],
            },
            {
                text: 'tailwind',
                items: [
                    {
                        text: '介绍',
                        link: '/configs/tailwind/',
                    },
                ],
            },
        ],
        '/packages/': [
            {
                text: '组件与方法',
                items: [
                    {
                        text: '总览',
                        link: '/packages/',
                    },
                ],
            },
            {
                text: 'hooks',
                items: [
                    {
                        text: '总览',
                        link: '/packages/hooks/',
                    },
                    {
                        text: '设计令牌',
                        link: '/packages/hooks/use-design-tokens',
                    },
                    {
                        text: 'echarts',
                        link: '/packages/hooks/use-echarts',
                    },
                    {
                        text: '消息弹窗',
                        link: '/packages/hooks/use-message',
                    },
                    {
                        text: '分片上传',
                        link: '/packages/hooks/use-multipart-upload',
                    },
                    {
                        text: '路由跳转',
                        link: '/packages/hooks/use-page',
                    },
                    {
                        text: '前端分页',
                        link: '/packages/hooks/use-pagination',
                    },
                    {
                        text: '刷新保存页面参数',
                        link: '/packages/hooks/use-params-alive',
                    },
                    {
                        text: '插槽',
                        link: '/packages/hooks/use-slots',
                    },
                    {
                        text: '拖拽',
                        link: '/packages/hooks/use-sortable',
                    },
                ],
            },
            {
                text: 'http',
                items: [
                    {
                        text: 'axios通讯',
                        link: '/packages/http/',
                    },
                ],
            },
            {
                text: 'shared',
                items: [
                    {
                        text: '总览',
                        link: '/packages/shared/',
                    },
                    {
                        text: 'enums枚举',
                        link: '/packages/shared/enums',
                    },
                    {
                        text: 'plugins',
                        link: '/packages/shared/plugins',
                    },
                    {
                        text: 'style样式',
                        link: '/packages/shared/style',
                    },
                ],
            },
            {
                text: 'types',
                items: [
                    {
                        text: '总览',
                        link: '/packages/types/',
                    },
                    {
                        text: 'global',
                        link: '/packages/types/global',
                    },
                    {
                        text: 'vue',
                        link: '/packages/types/vue',
                    },
                ],
            },
            {
                text: 'utils',
                items: [
                    {
                        text: '总览',
                        link: '/packages/utils/',
                    },
                    {
                        text: 'cipher加密',
                        link: '/packages/utils/cipher',
                    },
                    {
                        text: 'dom-util',
                        link: '/packages/utils/dom-util',
                    },
                    {
                        text: 'storage本地存储',
                        link: '/packages/utils/storage',
                    },
                    {
                        text: 'is',
                        link: '/packages/utils/is',
                    },
                    {
                        text: 'theme主题',
                        link: '/packages/utils/theme',
                    },
                    {
                        text: 'utils工具类',
                        link: '/packages/utils/utils',
                    },
                    {
                        text: 'install组件安装',
                        link: '/packages/utils/install',
                    },
                ],
            },
            {
                text: 'ai-hub',
                items: [
                    {
                        text: '总览',
                        link: '/packages/ai-hub/',
                    },
                ],
            },
            {
                text: 'vue3-pc-ui',
                items: [
                    {
                        text: '总览',
                        link: '/packages/vue3-pc-ui/',
                    },
                    {
                        text: 'q-loading加载',
                        link: '/packages/vue3-pc-ui/loading',
                    },
                    {
                        text: 'q-tree-table递归表格',
                        link: '/packages/vue3-pc-ui/tree-table',
                    },
                    {
                        text: 'q-watermark水印',
                        link: '/packages/vue3-pc-ui/watermark',
                    },
                ],
            },
            {
                text: 'vue3-antd-pc-ui',
                items: [
                    {
                        text: '总览',
                        link: '/packages/vue3-antd-pc-ui/',
                    },
                    {
                        text: 'q-card-upload卡片上传',
                        link: '/packages/vue3-antd-pc-ui/card-upload',
                    },
                    {
                        text: 'q-drawer抽屉',
                        link: '/packages/vue3-antd-pc-ui/drawer',
                    },
                    {
                        text: 'q-dropdown下拉快捷栏',
                        link: '/packages/vue3-antd-pc-ui/dropdown',
                    },
                    {
                        text: 'q-from表单',
                        link: '/packages/vue3-antd-pc-ui/form',
                    },
                    {
                        text: 'q-icon图标',
                        link: '/packages/vue3-antd-pc-ui/icon',
                    },
                    {
                        text: 'q-keep-alive-tabs标签页',
                        link: '/packages/vue3-antd-pc-ui/keep-alive-tabs',
                    },
                    {
                        text: 'q-search搜索',
                        link: '/packages/vue3-antd-pc-ui/search',
                    },
                    {
                        text: 'q-shrink-card可收缩卡片',
                        link: '/packages/vue3-antd-pc-ui/shrink-card',
                    },
                    {
                        text: 'q-table表格',
                        link: '/packages/vue3-antd-pc-ui/table',
                    },
                    {
                        text: 'q-theme-mode-button主题切换',
                        link: '/packages/vue3-antd-pc-ui/theme-mode-button',
                    },
                    {
                        text: 'q-transfer穿梭框',
                        link: '/packages/vue3-antd-pc-ui/transfer',
                    },
                ],
            },
        ],
        '/guide/': [
            {
                text: 'Vue3/Vite项目',
                items: [
                    {
                        text: '开始',
                        link: '/guide/introduction/',
                    },
                    {
                        text: '项目配置',
                        link: '/guide/introduction/settings',
                    },
                    {
                        text: '路由',
                        link: '/guide/introduction/router',
                    },
                    {
                        text: '菜单',
                        link: '/guide/introduction/menu',
                    },
                    {
                        text: '权限',
                        link: '/guide/introduction/auth',
                    },
                    {
                        text: 'Mock&联调',
                        link: '/guide/introduction/mock',
                    },
                    {
                        text: '组件注册',
                        link: '/guide/introduction/component',
                    },
                    {
                        text: '样式',
                        link: '/guide/introduction/design',
                    },
                    {
                        text: '构建&部署',
                        link: '/guide/introduction/deploy',
                    },
                ],
            },
            {
                text: '高级特性',
                items: [
                    {
                        text: 'Tauri桌面应用',
                        link: '/guide/introduction/tauri',
                    },
                    {
                        text: 'Tailwind CSS',
                        link: '/guide/dep/tailwind',
                    },
                    {
                        text: '暗黑主题',
                        link: '/guide/dep/dark',
                    },
                    {
                        text: '跨域处理',
                        link: '/guide/dep/cors',
                    },
                ],
            },
        ],
        '/nuxt3/': [
            {
                text: 'Nuxt3项目',
                items: [
                    {
                        text: '介绍',
                        link: '/nuxt3/introduction/index.md',
                    },
                    {
                        text: '基础',
                        link: '/nuxt3/introduction/base.md',
                    },
                    {
                        text: 'HTTP通讯',
                        link: '/nuxt3/introduction/http.md',
                    },
                ],
            },
            {
                text: '高级特性',
                items: [
                    {
                        text: '依赖管理',
                        link: '/nuxt3/dep/index.md',
                    },
                ],
            },
        ],
    };
}
