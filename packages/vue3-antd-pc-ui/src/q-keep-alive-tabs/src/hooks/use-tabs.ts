import { useTabsStore } from './use-tabs-store';
import { unref } from 'vue';
import { type RouteLocationNormalized, type Router, useRouter } from 'vue-router';

// 枚举, 为了统一
export enum TableActionEnum {
    REFRESH,
    CLOSE_ALL,
    CLOSE_LEFT,
    CLOSE_RIGHT,
    CLOSE_OTHER,
    CLOSE_CURRENT,
    CLOSE,
}

// 右键菜单设置
export function useTabs(_router?: Router) {
    const store = useTabsStore();

    const router = _router || useRouter();

    const { currentRoute } = router;

    function get_current_tab() {
        const route = unref(currentRoute);
        return store.getTabList.find((item) => item.path === route.path)!;
    }

    async function handle_tab_action(action: TableActionEnum, tab?: RouteLocationNormalized) {
        const currentTab = get_current_tab();
        switch (action) {
            case TableActionEnum.REFRESH:
                await store.refresh_page(router);
                break;

            case TableActionEnum.CLOSE_ALL:
                await store.close_all_tab(router);
                break;

            case TableActionEnum.CLOSE_LEFT:
                await store.close_left_tabs({route: currentTab, router});
                break;

            case TableActionEnum.CLOSE_RIGHT:
                store.close_right_tabs({route: currentTab, router});
                break;

            case TableActionEnum.CLOSE_OTHER:
                store.close_other_tabs({route: currentTab, router});
                break;

            case TableActionEnum.CLOSE_CURRENT:
            case TableActionEnum.CLOSE:
                store.close_tab({tab: tab || currentTab, router});
                break;
        }
    }

    return {
        refreshPage: () => handle_tab_action(TableActionEnum.REFRESH),
        closeAll: () => handle_tab_action(TableActionEnum.CLOSE_ALL),
        closeLeft: () => handle_tab_action(TableActionEnum.CLOSE_LEFT),
        closeRight: () => handle_tab_action(TableActionEnum.CLOSE_RIGHT),
        closeOther: () => handle_tab_action(TableActionEnum.CLOSE_OTHER),
        closeCurrent: () => handle_tab_action(TableActionEnum.CLOSE_CURRENT),
        close: (tab?: RouteLocationNormalized) => handle_tab_action(TableActionEnum.CLOSE, tab)
    };
}
