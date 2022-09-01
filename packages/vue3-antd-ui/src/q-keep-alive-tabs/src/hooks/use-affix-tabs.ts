import { ignore_t, useTabsStore } from './use-tabs-store';
import { ref, toRaw } from 'vue';
import { RouteLocationNormalized, useRouter } from 'vue-router';

// 初始化页面设置
export function init_affix_tabs(initPath: string): string[] {
    const _affixList = ref<RouteLocationNormalized[]>([]);
    const tabsStore = useTabsStore();
    const router = useRouter();

    /**
   * @description: 过滤初始化页面
   */
    function filter_affix_tabs(routes: RouteLocationNormalized[]) {
        const tabs: RouteLocationNormalized[] = [];

        routes &&
            routes.forEach((route) => {
                if (route.path == initPath) {
                    tabs.push(toRaw(route));
                }
            });
        return tabs;
    }
    /**
   * @description: 设置开始时的固定(不可关闭)的页面
   */
    function add_affix_tabs(): void {
        const affixTabs = filter_affix_tabs(router.getRoutes() as unknown as RouteLocationNormalized[]);
        _affixList.value = affixTabs;
        for (const tab of affixTabs) {
            tabsStore.add_tab({
                meta: tab.meta,
                name: tab.name,
                path: tab.path,
                fullPath: ignore_t(tab.fullPath)
            } as unknown as RouteLocationNormalized);
        }
    }
    let isAddAffix = false;

    if (!isAddAffix) {
        add_affix_tabs();

        isAddAffix = true;
    }
    return _affixList.value.map((item) => item.meta?.title).filter(Boolean) as string[];
}

