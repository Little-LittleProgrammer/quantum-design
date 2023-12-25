import Vue from 'vue';
import App from './App.vue';
import Router from 'vue-router';
// 引入element-ui
import '../src/element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// 引入主项目样式
import '@/assets/style/global.scss';
// markdown转html的css样式
import 'github-markdown-css/github-markdown.css';
// 代码高亮样式
import 'highlight.js/styles/color-brewer.css';
// 注册DemoBlock组件供dotmd-loader使用
import DemoBlock from '@docs/public/demoBlock.vue';
import 'vue-dotmd-loader/dist/css/default.css';
Vue.component('DemoBlock', DemoBlock);
// 导入左侧菜单列表数据
import menuList from '@docs/public/readFile.js';
Vue.prototype.$menuList = menuList;
// 将项目组件及md组件批量注册为全局组件
import comp from '@docs/public/regComponents';
Vue.use(comp);
// 将非src/component下的组件注册为全局组件
import otherComponent from '@docs/public/otherComponent.js';
Vue.use(otherComponent);

// 项目名称
Vue.prototype.$projectName = '业务组件库文档';
// 创建eventbus进行消息传递
Vue.prototype.$bus = new Vue();

Vue.use(Router);
const _router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: []
});
new Vue({
    router: _router,
    render: h => h(App)
}).$mount('#app');
