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
      copyright: 'Copyright © q-front-npm',
    },
  },
})

function createNav(): DefaultTheme.NavItem[] {
  return [
    
  ]
}

function createSidebar(): DefaultTheme.Sidebar {
  return {
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
