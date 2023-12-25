import Vue from 'vue';
// 注册DemoBlock组件供dotmd-loader使用
import DemoBlock from '~/docs/public/demoBlock.vue';
import 'vue-dotmd-loader/dist/css/default.css';
Vue.component('DemoBlock', DemoBlock);
// 导入左侧菜单列表数据
import menuList from '~/docs/public/readFile.js';
Vue.prototype.$menuList = menuList;
// 将项目组件及md组件批量注册为全局组件
import comp from '~/docs/public/regComponents';
Vue.use(comp);
// 将非src/component下的组件注册为全局组件
import otherComponent from '~/docs/public/otherComponent.js';
Vue.use(otherComponent);

// 项目名称
Vue.prototype.$projectName = '影视前台';
// 创建eventbus进行消息传递
Vue.prototype.$bus = new Vue();
