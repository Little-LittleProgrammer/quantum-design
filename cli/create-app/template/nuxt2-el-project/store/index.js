
export const state = () => ({

});

export const mutations = {

};

import global from './modules/global';
import elementUi from './modules/element-ui';
import systemManagement from './modules/system-management';

export const modules = {
    global,
    elementUi,
    systemManagement
};

export const actions = {
    async nuxtServerInit({ commit }, { route, $axios}) {
        const { code, data } = await $axios.$get('https://infrastructure.wtzw.com/manage/user/auths');
        if (code == 200){
            commit('SET_SYSTEM_MANAGEMENT_MAIN_MENU_DATA', data.auth_list);
            commit('SET_SYSTEM_MANAGEMENT_INIT_MENU_DATA', data.init_path);
        } else {
            const _menuData = require('@/menus/index');
            commit('SET_SYSTEM_MANAGEMENT_MAIN_MENU_DATA', _menuData.default);
            commit('SET_SYSTEM_MANAGEMENT_INIT_MENU_DATA', '');
        }
        const _currentPath = route.path == '/' ? data.init_path : route.path;
        data.auth_list.some((n, i) => {
            if (_currentPath.includes(n.path)){
                if (n.children != undefined){
                    commit('SET_SYSTEM_MANAGEMENT_ASIDE_MENU_DATA', n.children);
                } else {
                    commit('SET_SYSTEM_MANAGEMENT_ASIDE_MENU_DATA', []);
                }
                return true;
            }
        });
    }
};
