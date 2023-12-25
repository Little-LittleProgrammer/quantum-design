import { createApp } from 'vue';
import { register_sentry_vue } from '@q-front-npm/shared/plugins';
import {setup_store} from '@/store';
import { router, setup_router } from '@/router';
import { register_glob_comp } from './antd';
import { setup_outer_guard } from './router/setup-router';
import App from './App.vue';
import 'dayjs/locale/zh-cn';
import { setup_project_conf } from '@q-front-npm/vue3-antd-pc-ui';
import setting from './enums/projectEnum';

// 时间组件中文
// dayjs.locale('zh-cn');

const app = createApp(App);

// 安装store
setup_store(app);
setup_project_conf(setting);
// 安装router
setup_router(app);
// router-guard 安装路由守卫
setup_outer_guard(router);

// 安装 antd
register_glob_comp(app);

if (import.meta.env.VITE_USE_SENTRY === 'true') {
    register_sentry_vue(app, {
        dsn: 'xxxxxxx',
        ignoreErrors: [
            'ResizeObserver loop limit exceeded', // ant 官方建议
            'validate error'
        ],
        environment: import.meta.env.VITE_GLOB_ENV
    });
}

app.mount('#app');
