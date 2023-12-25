import Vue from 'vue';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';
import '@/element-ui';
// import ElementUi from 'element-ui';
import '@/assets/style/global.scss';

// Vue.use(ElementUi);
Vue.config.productionTip = false;

import * as Sentry from '@sentry/browser';
import { Integrations } from '@sentry/tracing';

process.env.NODE_ENV === 'production' && Sentry.init({
    Vue,
    dsn: '',
    release: process.env.VUE_APP_RELEASE_VERSION,
    autoSessionTracking: true,
    integrations: [
        new Integrations.BrowserTracing()
    ],
    sampleRate: 1.0
});

// 修复页面前进后退功能
// if (window.history && window.history.pushState) {
//     window.addEventListener('popstate', function(e) {
//         window.location.reload();
//     }, false);
// }

router.beforeEach((to, from, next) => {
    // 设置是否有历史地址
    if (from.path != '' && from.path != '/' && !store.state.global.hasHistoryUrl){
        store.commit('SET_HISTORY_URL', true);
    }
    // 切换页面后loading清楚
    if (store.state.global.dataLoading){
        store.commit('SET_DATA_LOADING_STATUS', false);
    }
    // if (store.state.global.pageLoadingObj.visible){
    //     store.commit('SET_PAGE_LOADING_STATUS', false);
    // }
    store.commit('SET_PAGE_LOADING_STATUS', true);
    document.title = to.meta.title;
    next();
});


router.afterEach((to, from, next) => {
    // document.title = to.meta.title
    // next()
});

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
