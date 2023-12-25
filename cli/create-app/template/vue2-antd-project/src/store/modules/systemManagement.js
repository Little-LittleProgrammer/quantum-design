const state = {
    mainMenuData: [], // 顶部主导航数据
    asideMenuData: [], // 侧边栏导航数据
    initMenuData: '/', //  默认地址
    menuDataLoadingEnd: false, // 加载导航数据
};

const getters = {
};

const mutations = {
    SET_SYSTEM_MANAGEMENT_MAIN_MENU_DATA(state, data) { // 顶部主导航数据
        state.mainMenuData = data;
    },
    SET_SYSTEM_MANAGEMENT_ASIDE_MENU_DATA(state, data) { // 侧边栏导航数据
        state.asideMenuData = data;
    },
    SET_SYSTEM_MANAGEMENT_INIT_MENU_DATA(state, data) { // 默认地址
        state.initMenuData = data;
    },
    SET_SYSTEM_MANAGEMENT_MENU_LOADING_END_STATUS(state, data) { //  设置导航菜单数据加载状态
        state.menuDataLoadingEnd = data;
    },
};

const actions = {};

export default {
    state,
    getters,
    actions,
    mutations
};
