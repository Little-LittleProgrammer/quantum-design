import setting from '@/enums/projectEnum';
import type { Router, RouteRecordRaw } from 'vue-router';
import NProgress from 'nprogress'; // Progress 进度条
import { AxiosCanceler } from '@quantum-design/http';
import { useGlobalStore } from '@/store/modules/global';
import { useProjectSetting } from '@quantum-design/vue3-antd-pc-ui';

export function setup_outer_guard(router: Router) {
    set_progress(router);
    create_http_guard(router);
    cancel_page_loading(router);
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
    const {getShowNProgress} = useProjectSetting();
    if (getShowNProgress.value) {
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
    if (setting.func!.removeAllHttpPending && !setting.cacheTabsSetting!.openKeepAlive) {
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
