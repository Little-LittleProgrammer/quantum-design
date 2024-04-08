import { useGo, useRedo } from '@quantum-design/hooks/vue';
import { defineStore } from 'pinia';
import { toRaw, unref } from 'vue';
import { RouteLocationNormalized, RouteLocationRaw, Router } from 'vue-router';
import { js_is_client } from '@quantum-design/utils';
import { js_create_local_storage, js_create_session_storage } from '@quantum-design/utils/extra';
import { TabKeys } from '../enums/cacheEnum';

export interface TabState {
    cacheTabList: Set<string>;
    tabList: RouteLocationNormalized[];
    lastDragEndIndex: number;
    initPath: string
}

function handle_goto_page(router: Router) {
    const go = useGo(router);
    go({
        path: unref(router.currentRoute).path,
        query: unref(router.currentRoute).query ?? {} // 针对含有query的路由, 防止replace失败
    }, true);
}

export function ignore_t(fullPath: string):string {
    if (fullPath.indexOf('?t=') > -1) {
        return fullPath.split('?t=')[0];
    }
    return fullPath.split('&t=')[0];
}

const get_to_target = (tabItem: RouteLocationNormalized) => {
    const { params, path, query } = tabItem;
    return {
        params: params || {},
        path,
        query: query || {}
    };
};

const ls = js_is_client && js_create_local_storage();
const ss = js_is_client && js_create_session_storage();
const cacheTab = ls && ls.get('project_config')?.cacheTabsSetting?.cache || false;

// state
const createState = () => {
    const state: TabState = {
        // 被 keepalive 缓存的 name
        cacheTabList: new Set(),
        // 显示在 tab 上的页面list
        tabList: cacheTab ? ss && ss.get(TabKeys) || [] : [],
        // tabList: cacheTab ? Persistent.getLocal(MULTIPLE_TABS_KEY) || [] : [],
        // Index of the last moved tab
        lastDragEndIndex: 0,
        initPath: ''
    };
    return state;
};
const state = createState();

const tabsGetters = {
    getTabList(state: TabState): RouteLocationNormalized[] {
        // 过滤undefined
        return state.tabList;
    },
    getCachedTabList(state: TabState): string[] {
        // 过滤undefined
        return Array.from(state.cacheTabList).filter(item => !!item);
    },
    getLastDragEndIndex(state: TabState): number {
        return state.lastDragEndIndex;
    }
};

export const useTabsStore = defineStore('tabs', {
    state: ():TabState => (state),
    getters: tabsGetters,
    actions: {
        // 更新缓 keepalive 缓存的页面 namelist
        async update_cache_tab() {
            const cacheMap: Set<string> = new Set();
            for (const tab of this.tabList) {
            // 忽视以下页面
                if (['Redirect', 'RedirectTo', '/backend/error', '/backend/*', 'error1', 'error2'].indexOf(tab.name as string) > -1 || !!tab.meta?.ignoreKeepAlive) {
                    continue;
                }
                const name = tab.name as string;
                cacheMap.add(name);
            }
            cacheTab && ss && ss.set(TabKeys, this.tabList);
            this.cacheTabList = cacheMap;
        },
        /**
         * 刷新页面
         */
        async refresh_page(router: Router) {
            const { currentRoute } = router;
            const route = unref(currentRoute);
            const name = route.name;

            const findTab = this.getCachedTabList.find((item: string) => item === name);
            if (findTab) {
                this.cacheTabList.delete(findTab);
            }
            const redo = useRedo(router);
            await redo();
        },

        // 清空 所有 keepalive 缓存的页面
        clear_cache_tabs(): void {
            this.cacheTabList = new Set();
        },
        // 清空所有 tabs 的页面
        reset_state(): void {
            this.tabList = [];
            this.clear_cache_tabs();
        },
        // 关闭全部页面时, 跳转到基本页面
        go_to_page(router: Router) {
            const go = useGo(router);
            const len = this.tabList.length;
            const { path } = unref(router.currentRoute);

            let toPath = this.initPath;

            if (len > 0) {
                const page = this.tabList[len - 1];
                const p = page.fullPath ? ignore_t(page.fullPath) : page.path;
                if (p) {
                    toPath = p;
                }
            }
            // Jump to the current page and report an error
            path !== toPath && go(toPath, true);
        },
        // 添加tab
        async add_tab(route: RouteLocationNormalized) {
            const { path, name, fullPath, params, query } = route;
            // 忽视以下页面
            if (
                ['Redirect', 'RedirectTo', '/backend/error', '/backend/*', 'error1', 'error2'].indexOf(name as string) > -1 ||
            path == '/'
            ) {
                return;
            }
            let updateIndex = -1;
            // 判断也是是否已打开
            const tabHasExits = this.tabList.some((tab, index) => {
                updateIndex = index;
                return (tab.fullPath ? tab.fullPath : tab.path) === (fullPath ? ignore_t(fullPath) : path);
            });
            // 如果已经打开
            if (tabHasExits) {
                const curTab = toRaw(this.tabList)[updateIndex];
                if (!curTab) {
                    return;
                }
                curTab.params = params || curTab.params;
                curTab.query = query || curTab.query;
                curTab.fullPath = ignore_t(fullPath) || curTab.fullPath;
                this.tabList.splice(updateIndex, 1, curTab);
            } else {
                this.tabList.push({
                    ...route,
                    fullPath: ignore_t(route.fullPath)
                });
            }
            this.update_cache_tab();
        // 预留位置, 以后开发刷新浏览器保留已打开页面
        },
        // 关闭tab
        async close_tab(obj: {tab: RouteLocationNormalized, router: Router}) {
            const close = (route: RouteLocationNormalized) => {
                const { fullPath } = route;
                // 初始化页面不关闭
                const noClosePathFlag = fullPath == this.initPath;
                if (noClosePathFlag) {
                    return;
                }
                const index = this.tabList.findIndex((item) => item.fullPath === ignore_t(fullPath));
                index !== -1 && this.tabList.splice(index, 1);
            };
            const { currentRoute, replace } = obj.router;

            const { path } = unref(currentRoute);
            if (path !== obj.tab.path) {
            // 关闭未在活动的tab
                close(obj.tab);
                this.update_cache_tab();
                return;
            }

            // 关闭正在在活动的tab(为了区分页面跳转问题)
            let toTarget: RouteLocationRaw = {};
            const index = this.tabList.findIndex((item) => item.path === path);
            if (index === 0) {
            // 如果只有一个tab, 直接跳到初始化页面
                if (this.tabList.length === 1) {
                    toTarget = this.initPath;
                } else {
                //  跳到右边的tab
                    const page = this.tabList[index + 1];
                    toTarget = get_to_target(page);
                }
            } else {
            // 关闭当前的tab, 会跳到左边的页面
                const page = this.tabList[index - 1];
                toTarget = get_to_target(page);
            }
            // 关闭当前的tab
            close(currentRoute.value);
            await replace(toTarget);
        },

        // 通关key, 关闭tab
        async close_tab_by_key(obj:{key: string, router: Router}) {
            const index = this.tabList.findIndex((item) => (item.fullPath || item.path) === obj.key);
            if (index !== -1) {
                await this.close_tab({tab: this.tabList[index], router: obj.router});
                const { currentRoute, replace } = obj.router;
                // 检查当前路由是否存在于tabList中
                const isActivated = this.tabList.findIndex((item) => {
                    return item.fullPath === ignore_t(currentRoute.value.fullPath);
                });
                // 如果当前路由不存在于TabList中，尝试切换到其它路由
                if (isActivated === -1) {
                    let pageIndex;
                    if (index > 0) {
                        pageIndex = index - 1;
                    } else if (index < this.tabList.length - 1) {
                        pageIndex = index + 1;
                    } else {
                        pageIndex = -1;
                    }
                    if (pageIndex >= 0) {
                        const page = this.tabList[index - 1];
                        const toTarget = get_to_target(page);
                        await replace(toTarget);
                    }
                }
            }
        },

        // 排序用
        async sort_tabs(obj: {oldIndex: number, newIndex: number}) {
            const currentTab = this.tabList[obj.oldIndex];
            this.tabList.splice(obj.oldIndex, 1);
            this.tabList.splice(obj.newIndex, 0, currentTab);
            this.lastDragEndIndex = this.lastDragEndIndex + 1;
        },

        // 关闭左侧tab
        async close_left_tabs(obj: {route: RouteLocationNormalized, router: Router}) {
            const index = this.tabList.findIndex((item) => item.path === obj.route.path);

            if (index > 0) {
            // 删除左侧的tab
                const leftTabs = this.tabList.slice(0, index);
                const pathList: string[] = [];
                for (const item of leftTabs) {
                    const affix = item.fullPath == this.initPath;
                    if (!affix) {
                        pathList.push(ignore_t(item.fullPath));
                    }
                }
                this.bulk_close_tabs(pathList);
            }
            this.update_cache_tab();
            handle_goto_page(obj.router);
        },

        // 关闭右侧tab
        async close_right_tabs(obj: {route: RouteLocationNormalized, router: Router}) {
            const index = this.tabList.findIndex((item) => item.fullPath === ignore_t(obj.route.fullPath));

            if (index >= 0 && index < this.tabList.length - 1) {
                const rightTabs = this.tabList.slice(index + 1, this.tabList.length);

                const pathList: string[] = [];
                for (const item of rightTabs) {
                    const affix = item.fullPath == this.initPath;
                    if (!affix) {
                        pathList.push(item.fullPath);
                    }
                }
                this.bulk_close_tabs(pathList);
            }
            this.update_cache_tab();
            handle_goto_page(obj.router);
        },
        // 关闭所有tab
        async close_all_tab(router: Router) {
            this.tabList = this.tabList.filter((item) => {
                return item.fullPath == this.initPath;
            });
            this.clear_cache_tabs();
            this.go_to_page(router);
        },

        /**
     * 关闭其他tab
     */
        async close_other_tabs(obj: {route: RouteLocationNormalized, router: Router}) {
            const closePathList = this.tabList.map((item) => item.fullPath);

            const pathList: string[] = [];

            for (const path of closePathList) {
                if (path !== ignore_t(obj.route.fullPath)) {
                    const closeItem = this.tabList.find((item) => item.path === path);
                    if (!closeItem) {
                        continue;
                    }
                    const affix = path == this.initPath;
                    if (!affix) {
                        pathList.push(closeItem.fullPath);
                    }
                }
            }
            this.bulk_close_tabs(pathList);
            this.update_cache_tab();
            handle_goto_page(obj.router);
        },

        /**
     * 批量关闭tab
     */
        async bulk_close_tabs(pathList: string[]) {
            this.tabList = this.tabList.filter((item) => !(pathList.indexOf(item.fullPath) > -1));
        }
    }
});
