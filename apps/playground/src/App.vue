<template>
    <a-config-provider :locale="locale" :theme="getThemeMode">
        <div id="app">
            <router-view></router-view>
        </div>
    </a-config-provider>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { get_net_router } from '@quantum-design/vue3-antd-pc-ui';
import { useUserStore } from '@/store/modules/user';
import { useGlobalStore } from '@/store/modules/global';
import { useSysStore } from '@/store/modules/systemManage';
import { useProjectSetting } from '@quantum-design/vue3-antd-pc-ui';
import type { IMenuData } from '@quantum-design/types/vue/router';
import { useThemeSetting } from '@/hooks/settings/use-theme-setting';
import { useGo } from '@quantum-design/hooks/vue/use-page';
import { js_utils_get_current_url } from '@quantum-design/utils';

export default defineComponent({
    name: 'App',
    setup() {
        const locale = zhCN;
        const userStore = useUserStore();
        const globalStore = useGlobalStore();
        const { getSearchButton } = useProjectSetting();
        const sysStore = useSysStore();
        const { getThemeMode } = useThemeSetting();
        const go = useGo();
        const get_menus_data = async() => {
            const _res = import('@/menus/index');
            const _list = (await _res).default;
            sysStore.initMenuData = '/demo/form';
            sysStore.set_format_route_list(_list);
            getSearchButton.value && get_net_router(sysStore.mainMenuData as Required<IMenuData>[]);
            const curUrlInfo = js_utils_get_current_url();
            if (!curUrlInfo) {
                go({
                    path: sysStore.initMenuData
                });
                return;
            }
            console.log('curUrlInfo', curUrlInfo);
            if (!curUrlInfo?.hash || curUrlInfo?.hash === '#/') {
                go({
                    path: sysStore.initMenuData
                });
            }
        };
        get_menus_data();

        return {
            locale,
            getThemeMode,
            userStore,
            globalStore,
            sysStore
        };
    }
});
</script>
<style data-type="start">
.style-start-load {
    text-align: center;
}
</style>
<style lang="scss" scoped>
#app {
    min-width: 1024px;
    overflow-x: auto;
}
</style>

<style lang="scss">
@use '@quantum-design/styles/antd/antd.scss';
@use '@quantum-design/styles/base/index.scss';
.table-nowrap {
    .ant-table-cell {
        white-space: nowrap;
        min-width: 100px;
    }
}
</style>
