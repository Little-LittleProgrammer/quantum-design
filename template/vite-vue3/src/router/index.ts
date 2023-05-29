import routerErrorData from '@/router/modules/error'; //  错误
import systemManageData from '@/router/modules/system-manage';
import { createRouter, createWebHistory } from 'vue-router';
import { redirectRoute } from './modules/reload';
import { flat_multi_level_routes } from './utils';
import { App } from 'vue';
import { exampleRoute } from './modules/example';

let routerData = [
    ...systemManageData,
    exampleRoute
];

// 添加error路由数据
routerData = [
    ...routerData,
    redirectRoute,
    ...routerErrorData // routerErrorData必须添加在最后
];

routerData = flat_multi_level_routes(routerData);

// app router
const router = createRouter({
    history: createWebHistory(import.meta.env.VITE_BASE_PATH as string),
    routes: routerData,
    strict: true
});

export function setup_router(app: App) {
    app.use(router);
}

export {
    router,
    routerData
};
