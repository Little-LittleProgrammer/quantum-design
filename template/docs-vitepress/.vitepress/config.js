// @ts-check
/**
 * @type {import('vitepress').UserConfig}
 */
module.exports = {
  base: '/vite-project/',
  title: 'Vite-project',
  lang: 'zh-CN',
  description: '一个开箱即用的前端框架',
  themeConfig: {
    repo: 'anncwb/vite-project',
    docsRepo: 'anncwb/vite-project-doc',
    logo: '/logo.png',
    docsBranch: 'main',
    nav: createNav(),
    sidebar: createSidebar(),
  },
};

/**
 * @type {()=>import('./theme-default/config').DefaultTheme.NavItem[]}
 */
function createNav() {
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
      link: '/components/',
      items: [
        {
          text: '介绍',
          link: '/components/introduction',
        },
        {
          text: '全局组件',
          link: '/components/glob/search',
        },
        {
          text: '常用组件',
          link: '/components/basic/icon',
        },
        {
          text: '工具',
          link: '/components/functional/domTools',
        },
        {
          text: 'hooks',
          link: '/components/hooks/vuex',
        },
        {
          text: '自定义指令',
          link: '/components/directives/debounce',
        },
      ],
    },
    {
      text: '相关链接',
      items: [
        {
          text: '文档地址',
          link: '',
        },
      ],
    }
  ];
}

function createSidebar() {
  return {
    '/': [
      {
        text: '指南',
        children: [
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
      }
      // {
      //   text: '其他',
      //   children: [
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
  };
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
