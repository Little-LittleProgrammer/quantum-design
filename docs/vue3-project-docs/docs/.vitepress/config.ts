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
        {
            text: '开发',
            link: '/helpDevelop/style'
        }
      ],
    },
    {
      text: '组件',
      link: '/components/introduction',
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
        text: 'ad.qmniu.com',
        link: '/project/ad.qmniu.com/'
    },
    {
        text: 'qmdsp.qimao.com',
        link: '/project/qmdsp.qimao.com/'
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
    '/components/': [
      {
        text: '组件',
        items: [
          {
            text: '前言',
            link: '/components/introduction',
          },
        ],
      },
      {
        text: '全局组件',
        items: [
          {
            text: 'search',
            link: '/components/glob/search',
          },
          {
            text: 'q-breadcrumb',
            link: '/components/glob/q-breadcrumb',
          },
          {
            text: 'qm-aside',
            link: '/components/glob/qm-aside',
          },
          {
            text: 'qm-header',
            link: '/components/glob/qm-header',
          },
          {
            text: 'qm-theme-mode-switch',
            link: '/components/glob/qm-theme-mode-switch',
          },
          {
            text: 'keep-alive-tabs',
            link: '/components/glob/keep-alive-tabs',
          },
        ],
      },
      {
        text: '常用组件',
        items: [
          {
            text: 'icon',
            link: '/components/basic/icon',
          },
          {
            text: 'qm-tag',
            link: '/components/basic/qm-tag',
          },
          {
            text: 'q-loading',
            link: '/components/basic/q-loading',
          },
          {
            text: 'table',
            link: '/components/basic/table',
          },
          {
            text: 'dropdown',
            link: '/components/basic/dropdown',
          },
          {
            text: 'form',
            link: '/components/basic/form',
          },
        ],
      },
      {
        text: '工具',
        items: [
          {
            text: 'domTools',
            link: '/components/functional/domTools',
          },
          {
            text: 'is',
            link: '/components/functional/is',
          },
          {
            text: 'theme',
            link: '/components/functional/theme',
          },
          {
            text: 'tools',
            link: '/components/functional/tools',
          },
          {
            text: 'cipher',
            link: '/components/functional/cipher',
          },
          {
            text: 'storage',
            link: '/components/functional/storage',
          },
          {
            text: 'propTypes',
            link: '/components/functional/propTypes',
          },
        ],
      },
      {
        text: 'hooks',
        items: [
          {
            text: 'vuex',
            link: '/components/hooks/vuex',
          },
          {
            text: 'message',
            link: '/components/hooks/message',
          },
          {
            text: 'router',
            link: '/components/hooks/router',
          },
          {
            text: 'vite-env',
            link: '/components/hooks/vite-env',
          },
          {
            text: 'echarts',
            link: '/components/hooks/echarts',
          },
          {
            text: 'multipart-upload',
            link: '/components/hooks/multipart-upload',
          },
        ],
      },
      {
        text: '自定义指令',
        items: [
          {
            text: 'debounce',
            link: '/components/directives/debounce',
          },
          {
            text: 'ellipsis',
            link: '/components/directives/ellipsis',
          },
        ],
      },
    ],
    '/project/ad.qmniu.com/': [
        {
            text: '业务',
            items: [{
                text: '总览',
                link: '/project/ad.qmniu.com/business/index.md'
            }, {
                text: '流量配置',
                link: '/project/ad.qmniu.com/business/operation/flow.md'
            },{
                text: '策略',
                link: '/project/ad.qmniu.com/business/operation/policy.md'
            },{
                text: '切量',
                link: '/project/ad.qmniu.com/business/operation/canary.md'
            },{
                text: 'ABtest',
                link: '/project/ad.qmniu.com/business/operation/abtest-group.md'
            },{
                text: '媒体资源',
                link: '/project/ad.qmniu.com/business/operation/media-resource.md'
            }]
        },
        {
            text: 'hooks',
            items: [{
                text: '精度值处理',
                link: '/project/ad.qmniu.com/hooks/valueDeal.md'
            }, {
                text: '子组件数据处理',
                link: '/project/ad.qmniu.com/hooks/valueSet.md'
            }, 
            {
                text: '数据部分筛选框校验',
                link: '/project/ad.qmniu.com/hooks/useValidator.md'
            },
            {
                text: 'drawer关闭',
                link: '/project/ad.qmniu.com/hooks/use-drawer-close.md'
            },
            {
                text: '定向',
                link: '/project/ad.qmniu.com/hooks/use-direction.md'
            }
        ]
        },
        {
            text: 'func',
            items: [{
                text: '分桶处理',
                link: '/project/ad.qmniu.com/func/deal-bucket.md'
            }]
        },
        {
            text: '组件',
            items: [{
                text: 'basicButton',
                link: '/project/ad.qmniu.com/comp/button.md'
            }, {
                text: 'qmComplexTh',
                link: '/project/ad.qmniu.com/comp/qm-complex-th.md'
            }, {
                text: 'policy-target',
                link: '/project/ad.qmniu.com/comp/policy-target.md'
            }]
        },
    ],
    '/project/qmdsp.qimao.com/': [
        {
            text: 'hooks',
            items: [{
                text: 'useValueDeal',
                link: '/project/qmdsp.qimao.com/hooks/valueDeal.md'
            }]
        },
        {
            text: '组件',
            items: [
              {
                text: 'qmCheckboxGroup',
                link: '/project/qmdsp.qimao.com/comp/qm-checkbox-group.md'
              }, {
                text: 'qmEmpty',
                link: '/project/qmdsp.qimao.com/comp/qm-empty.md'
              }, {
                text: 'qmRangePicker',
                link: '/project/qmdsp.qimao.com/comp/qm-range-picker.md'
              }, {
                text: 'qmTransferList',
                link: '/project/qmdsp.qimao.com/comp/qm-transfer-list.md'
              }, {
                text: 'qmTransferListMultiple',
                link: '/project/qmdsp.qimao.com/comp/qm-transfer-list-multiple.md'
              }, {
                text: 'qmCascaderTransfer',
                link: '/project/qmdsp.qimao.com/comp/qm-cascader-transfer.md'
              }, {
                text: 'schedule',
                link: '/project/qmdsp.qimao.com/comp/schedule.md'
              }
            ]
        },
    ],
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
      {
        text: '开发',
        items: [{
            text: '开发风格',
            link: '/helpDevelop/style',
          },{
            text: '服务端接口',
            link: '/helpDevelop/serviceApi',
          },{
            text: '全局',
            link: '/helpDevelop/global',
          },{
            text: 'hooks',
            link: '/helpDevelop/hooks',
          },]
      }
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
