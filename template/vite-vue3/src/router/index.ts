import routerErrorData from '@/router/modules/error'; //  错误
import systemManageData from '@/router/modules/system-manage';
import { createRouter, createWebHistory } from 'vue-router';
import { redirect_route } from './modules/reload';
import { flat_multi_level_routes } from './utils';
import { App } from 'vue';

let _routerData = [...systemManageData, ...routerErrorData, ...operationModule];

// 添加error路由数据
_routerData = [
    ..._routerData,
    redirect_route,
    ...routerErrorData // routerErrorData必须添加在最后
];

_routerData = flat_multi_level_routes(_routerData);

// app router
const router = createRouter({
    history: createWebHistory(import.meta.env.VITE_BASE_PATH as string),
    routes: _routerData,
    strict: true
});

export function setup_router(app: App) {
    app.use(router);
}

export {
    router,
    _routerData
};
