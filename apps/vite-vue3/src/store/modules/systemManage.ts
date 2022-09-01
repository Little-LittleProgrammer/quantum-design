import { defineStore } from 'pinia';
import { sysModuleState } from '../index';

// state
const createState = () => {
    const state: sysModuleState = {
        mainMenuData: [], // 顶部主导航数据
        asideMenuData: [], // 侧边栏导航数据
        initMenuData: '/', //  默认地址
        menuDataLoadingEnd: false, // 加载导航数据
        formatRouteList: {} // 格式化后的路由
    };
    return state;
};

const state = createState();

export const useSysStore = defineStore('sys', {
    state: ():sysModuleState => (state)
});
