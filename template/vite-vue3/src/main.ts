import { createApp } from 'vue';
import {setup_store} from '@/store';
import { router, setup_router, _routerData } from '@/router';
import { register_glob_comp } from './antd';
import { setup_outer_guard } from './router/setup-router';
import App from './App.vue';
import 'dayjs/locale/zh-cn';

const app = createApp(App);

// 安装store
setup_store(app);
// 安装router
setup_router(app);

// router-guard 安装路由守卫
setup_outer_guard(router, _routerData);

// 安装 antd
register_glob_comp(app);

app.mount('#app');
