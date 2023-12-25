export const modules = {};

export const actions = {
    async nuxtServerInit ({ commit }, { $axios }) { // 当我们想要将服务端的一些数据传到客户端，可以通过这个获取保存在状态中，客户端再从状态里取出来就好了。
        // const _rest = await $axios.$get(types.API_HEADER_NAV);
        // if (_rest.code == 200){
        //     commit('SET_NAVIGATION_DATA', _rest.data);
        // }
        // // if (code === 1) {
        // //     commit('setSettings', data.settings);
        // // }
    }
};
