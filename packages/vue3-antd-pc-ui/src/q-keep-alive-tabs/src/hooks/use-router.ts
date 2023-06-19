import type { Router } from 'vue-router';
import { useTabsStore } from './use-tabs-store';

// keep-alive-tab
export function create_tab(router: Router) {
    const tabsStore = useTabsStore();
    tabsStore.add_tab(router.currentRoute.value); // 首次加载
    router.beforeEach((to) => {
        tabsStore.add_tab(to);
        return true;
    });
}
