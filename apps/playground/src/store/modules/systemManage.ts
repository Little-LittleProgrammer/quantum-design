import { defineStore } from 'pinia';
import type { ISysModuleState } from '../index';
import type { IMenuData } from '@quantum-design/types/vue/router';

// state
const createState = () => {
    const state: ISysModuleState = {
        mainMenuData: [], // 顶部主导航数据
        asideMenuData: [], // 侧边栏导航数据
        initMenuData: '/quantum-design/playground/demo/form', //  默认地址
        menuDataLoadingEnd: false, // 加载导航数据
        formatPathRouteList: {}, // 格式化后的路由 <path: menuList>
        formatIdRouteList: {}, // 格式化后的路由  <id: menuList>
        permCodeList: [] // 权限code列表
    };
    return state;
};

const state = createState();

export const useSysStore = defineStore('sys', {
    state: ():ISysModuleState => (state),
    getters: {
        getFormatPathRouteList(): Record<string, IMenuData> {
            return this.formatPathRouteList;
        },
        getFormatIdRouteList(): Record<number, IMenuData> {
            return this.formatIdRouteList;
        },
        getPermCodeList(state) {
            return state.permCodeList;
        }
    },
    actions: {
        set_format_route_list(menuData: IMenuData[] = []){
            if (menuData.length === 0) {
                return {};
            }
            const flatten = (list: IMenuData[], parentObj: IMenuData = {}) => {
                list.forEach((e, index) => {
                    if (e.id) {
                        this.formatIdRouteList[e.id] = e;
                    }
                    if (e.path) {
                        if (e.path_type === 1) { // 页面
                            this.formatPathRouteList[e.path] = e;
                        } else {
                            if (e.path_type === 3) { // 按钮
                                this.permCodeList.push(e.path);
                            }
                            list!.splice(index, 1);
                            if (parentObj.children && parentObj.children.length === 0) {
                                parentObj.children = undefined;
                            }
                        }
                    }
                    if (e.children) {
                        flatten(e.children, e);
                    }
                });
            };
            flatten(menuData);
            console.log('menuData', menuData);
            this.mainMenuData = menuData;
        }
    }
});
