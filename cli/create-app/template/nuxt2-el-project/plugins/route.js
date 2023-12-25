export default ({ app, store, route }) => {
    app.router.beforeEach((to, from, next) => {
        // 设置是否有历史地址
        if (from.path != '' && from.path != '/' && !app.store.state.global.hasHistoryUrl){
            app.store.commit('SET_HISTORY_URL', true);
        }
        // 切换页面后loading清楚
        // if (app.store.state.global.dataLoading){
        //     app.store.commit('SET_DATA_LOADING_STATUS', false);
        // }
        // if (store.state.global.pageLoadingObj.visible){
        //     store.commit('SET_PAGE_LOADING_STATUS', false);
        // }
        // app.store.commit('SET_PAGE_LOADING_STATUS', true);
        next();
    });
};
