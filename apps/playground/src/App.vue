<template>
    <a-config-provider :locale="locale" :theme="getThemeMode">
        <div id="app" >
            <router-view></router-view>
        </div>
    </a-config-provider>
</template>

<script lang="ts">
import { defineComponent} from 'vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { get_net_router } from '@quantum-design/vue3-antd-pc-ui';
import { useUserStore } from '@/store/modules/user';
import { useGlobalStore } from '@/store/modules/global';
import { useSysStore } from '@/store/modules/systemManage';
import { useProjectSetting } from '@quantum-design/vue3-antd-pc-ui';
import { IMenuData } from '@quantum-design/types/vue/router';
import { useThemeSetting } from '@/hooks/settings/use-theme-setting';

export default defineComponent({
    name: 'App',
    setup() {
        const locale = zhCN;
        const userStore = useUserStore();
        const globalStore = useGlobalStore();
        const {getSearchButton, } = useProjectSetting();
        const sysStore = useSysStore();
        const {getThemeMode, } = useThemeSetting();
        const get_menus_data = async() => {
            const _res = import('@/menus/index');
            const _list = (await _res).default;
            sysStore.initMenuData = '/backend/data-modules/dashboard';
            sysStore.set_format_route_list(_list);
            getSearchButton.value && get_net_router(sysStore.mainMenuData as Required<IMenuData>[]);
        };
        get_menus_data();

        return {
            locale,
            getThemeMode,
            userStore,
            globalStore,
            sysStore,
        };
    },
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
    overflow-x: auto
}
</style>

<style lang="scss">
@import '@quantum-design/shared/style/antd/antd.scss';
@import '@quantum-design/shared/style/base/index.scss';
.table-nowrap{
    .ant-table-cell {
        white-space: nowrap ;
        min-width: 100px
    }
}
</style>
