import setting from '@/enums/projectEnum';
import { IBreadcrumb } from '@/store';
import type { Router, RouteRecordRaw } from 'vue-router';
import NProgress from 'nprogress'; // Progress 进度条
import { AxiosCanceler } from '@wuefront/http';
import { useGlobalStore } from '@/store/modules/global';
import { useSysStore } from '@/store/modules/systemManage';

export function setup_outer_guard(router: Router, routerData:RouteRecordRaw[]) {
    set_progress(router);
    create_http_guard(router);
    cancel_page_loading(router);
    flatten(routerData);
    create_permission_route(router);
}

// 基本router方法
function cancel_page_loading(router: Router) {
    const globalStore = useGlobalStore();
    router.beforeEach((to, from, next) => {
        if (from.path != '' && from.path != '/' && !globalStore.hasHistoryUrl){
            globalStore.hasHistoryUrl = true;
        }
        // 切换页面后loading清除
        if (globalStore.dataLoading){
            globalStore.dataLoading = false;
        }
        if (globalStore.pageLoading){
            globalStore.pageLoading = false;
        }
        document.title = to.meta.title;
        next();
    });
}

// 设置进度条
function set_progress(router: Router) {
    if (setting.transition.openNProgress) {
        router.beforeEach(async() => {
            NProgress.start();
            return true;
        });
        router.afterEach(async() => {
            NProgress.done();
            // document.title = to.meta.title
            // next()
            return true;
        });
    }
}

// 切换页面时, 取消已发送的但未成功的请求
function create_http_guard(router: Router) {
    let requestNum = 0;
    let axiosCanceler: Nullable<AxiosCanceler>;
    if (setting.func.removeAllHttpPending && !setting.cacheTabsSetting.openKeepAlive) {
        axiosCanceler = new AxiosCanceler();
    }
    router.beforeEach(async() => {
        // 第一次路由跳转不处理
        if (requestNum != 0) {
            // 跳转前清除所有请求
            axiosCanceler?.removeAllPending();
        }
        requestNum++;
        return true;
    });
}

// 格式化数据
const formatObj: Record<string, IBreadcrumb> = {};
function flatten(list:RouteRecordRaw[]) {
    const sysStore = useSysStore();
    if (setting.func.showBreadCrumb) {
        list.forEach((item) => {
            if (item.children) {
                let _cacheObj: IBreadcrumb = {
                    id: '',
                    name: '',
                    path: '',
                    pid: '',
                    title: ''
                };
                if (item.meta) {
                    _cacheObj = {
                        id: item.meta.id,
                        pid: item.meta.pid,
                        path: item.path,
                        title: item.meta.title,
                        name: item.name as string
                    };
                    formatObj[item.meta.id] = _cacheObj;
                }
                flatten(item.children);
            } else {
                if (item.meta) {
                    const _cacheObj: IBreadcrumb = {
                        id: item.meta.id,
                        pid: item.meta.pid,
                        path: item.path,
                        title: item.meta.title,
                        name: item.name as string
                    };
                    formatObj[item.meta.id] = _cacheObj;
                }
            }
        });
        sysStore.formatRouteList = formatObj;
    }
}
function create_permission_route(router: Router) { // 是否包含权限管理
    const globalStore = useGlobalStore();
    if (!globalStore.authorityManage){
        const _initRouter:RouteRecordRaw[] = [
            {
                path: '/',
                redirect: '/backend',
                name: 'first',
                meta: {
                    title: '第一初始页面',
                    pid: '0',
                    id: 'first'
                }
            },
            {
                path: '/backend',
                redirect: '/backend/data-modules', // 默认初始页面
                name: 'home',
                meta: {
                    title: '初始页面',
                    pid: 'first',
                    id: 'home'
                }
            }
        ];
        _initRouter.forEach(route => {
            router.addRoute(route);
        });
        setTimeout(() => { // 路由的添加并不会及时刷新, 必须延时进行自行调用
            const isInitPath = router.currentRoute.value.fullPath.split('/').length === 2;
            if (isInitPath) {
                router.push({
                    path: '/'
                });
            }
        }, 1500);
    }
}

