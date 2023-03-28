import { defineConfig, DefaultTheme } from 'vitepress'

export default defineConfig({
  base: '/',
  title: 'Vite-project',
  lang: 'zh-CN',
  description: '一个开箱即用的前端框架',
  themeConfig: {
    logo: '/logo.png',
    siteTitle: '七猫',
    nav: createNav(),
    sidebar: createSidebar(),
    footer: {
      message: 'MIT Licensed',
      copyright: 'Copyright © qmfront',
    },
  },
})

function createNav(): DefaultTheme.NavItem[] {
  return [
    {
      text: '指南',
      link: '/guide/',
      items: [
        {
          text: '指南',
          link: '/guide/introduction',
        },
        {
          text: '深入',
          link: '/dep/dark',
        },
      ],
    },
    {
      text: '组件',
      link: '/components/common/introduction',
      items: [
        {
          text: '介绍',
          link: '/components/common/introduction',
        },
        {
          text: '全局组件',
          link: '/components/common/glob/search',
        },
        {
          text: '常用组件',
          link: '/components/common/basic/icon',
        },
        {
          text: '工具',
          link: '/components/common/functional/domTools',
        },
        {
          text: 'hooks',
          link: '/components/common/hooks/vuex',
        },
        {
          text: '自定义指令',
          link: '/components/common/directives/debounce',
        },
      ],
    },
    {
        text: 'ad.qmniu.com',
        link: '/components/ad.qmniu.com/'
    },
    {
      text: '开发手册',
      link: '/helpCode/',
    },
  ]
}

function createSidebar(): DefaultTheme.Sidebar {
  return {
    '/helpCode': [],
    '/': [
      {
        text: '指南',
        items: [
          {
            text: '介绍',
            link: '/guide/introduction',
          },
          {
            text: '开始',
            link: '/guide/',
          },
          {
            text: '项目配置',
            link: '/guide/settings',
          },
          {
            text: '路由',
            link: '/guide/router',
          },
          {
            text: '菜单',
            link: '/guide/menu',
          },
          {
            text: 'Mock&联调',
            link: '/guide/mock',
          },
          {
            text: '组件注册',
            link: '/guide/component',
          },
          {
            text: '样式',
            link: '/guide/design',
          },
          {
            text: '构建&部署',
            link: '/guide/deploy',
          },
        ],
      },
      {
        text: '深入',
        items: [
          {
            text: '跨域处理',
            link: '/dep/cors',
          },
          {
            text: '项目规范',
            link: '/dep/lint',
          },
          {
            text: '黑暗主题',
            link: '/dep/dark',
          },
        ],
      },
      // {
      //   text: '其他',
      //   items: [
      //     {
      //       text: '常见问题',
      //       link: '/other/faq',
      //     },
      //     {
      //       text: '常见疑点',
      //       link: '/other/doubt',
      //     },
      //     {
      //       text: '测试服务',
      //       link: '/other/server',
      //     },
      //   ],
      // },
    ],
  }
}

// /**
//  * @type {(namespace:string,items:string[])=>string[]}
//  */
// function urlWrapper(namespace, items) {
//   return items.map((item) => namespace + item);
// }

// function getGuildNav() {
//   return urlWrapper('/guide', ['/']);
// }
