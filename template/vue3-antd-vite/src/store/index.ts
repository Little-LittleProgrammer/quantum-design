// store.ts
import type {App} from 'vue';
import {createPinia} from 'pinia';

import type { IMenuData } from '@quantum-design/types/vue/router';
export interface sysModuleState {
    mainMenuData: IMenuData[]; // 顶部主导航数据
    asideMenuData: IMenuData[]; // 侧边栏导航数据
    initMenuData: string; // 默认地址
    menuDataLoadingEnd: boolean; // 加载导航数据
    formatPathRouteList: Record<string, IMenuData>
    formatIdRouteList: Record<number, IMenuData>
    permCodeList: string[]
}

const store = createPinia();

export function setup_store(app:App) {
    app.use(store);
}

export { store };
