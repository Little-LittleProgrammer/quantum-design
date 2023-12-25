import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';
import baseData from '@/router/modules/base-data'; //  router数据
import systemManagement from '@/router/modules/system-management'; //  权限
import routerExampleData from '@/router/modules/example'; //  案例
import routerErrorData from '@/router/modules/error'; //  错误

// 项目内容路由数据
let _routerData = [
    ...baseData,
    ...systemManagement,
    ...routerExampleData
];

// 未开启权限功能时 设置初始页面（未开始权限时必须设置）
if (!store.state.global.authorityMannage){
    const _initRouter = [
        {
            path: '/',
            redirect: '/backend'
        },
        {
            path: '/backend',
            redirect: '/backend/base-data' // 默认初始页面
        }
    ];
    _routerData = [
        ..._initRouter,
        ..._routerData
    ];
}

// 添加error路由数据
_routerData = [
    ..._routerData,
    ...routerErrorData  // routerErrorData必须添加在最后
];


Vue.use(VueRouter);

const _router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: _routerData
});

export default _router;
