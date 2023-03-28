<template>
    <a-config-provider :locale="locale">
        <div id="app" >
            <router-view v-if="sysStore.menuDataLoadingEnd"></router-view>
            <export-file></export-file>
            <component v-if="dynamicComponent" :is="dynamicComponent"></component>
        </div>
    </a-config-provider>
</template>

<script lang="ts">
import { defineComponent} from 'vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { useMessage } from '@wuefront/hooks/vue';
import { api_global_env } from '@/http/api/global';
import { api_manage_user_auths } from './http/api/system-management/permission/person';
import { router } from './router';
import { get_net_router } from '@wuefront/vue3-antd-ui';
import settings from '@/enums/projectEnum';
import { useUserStore } from '@/store/modules/user';
import { useGlobalStore } from '@/store/modules/global';
import { useSysStore } from '@/store/modules/systemManage';
import ExportFile from '@/components/export-file/index.vue';

export default defineComponent({
    name: 'App',
    components: {ExportFile},
    setup() {
        const locale = zhCN;
        const {createMessage} = useMessage();
        const userStore = useUserStore();
        const globalStore = useGlobalStore();
        const sysStore = useSysStore();
        let requestNum = 0;
        const get_global_env = () => { // 环境检测
            api_global_env().then(res => {
                globalStore.set_environment_data(res.data);
                userStore.username = res.data.username;
                if (requestNum === 0) {
                    get_menus_data(); // 为了防止页面请求时，此接口还未返回环境数据env
                }
                requestNum++;
            });
            setTimeout(() => {
                get_global_env();
            }, 3 * 60 * 1000);
        };
        const get_menus_data = async() => {
            if (globalStore.authorityManage) {
                const _res = await api_manage_user_auths();
                if (_res.code == 200) {
                    sysStore.mainMenuData = _res.data.auth_list;
                    sysStore.initMenuData = _res.data.init_path;
                    sysStore.menuDataLoadingEnd = true;
                    settings.func.showSearchButton && get_net_router(sysStore.mainMenuData);
                    if (!window.location.href.includes('/backend/')) {
                        if (_res.data.init_path == '') {
                            router.replace({
                                path: '/backend'
                            });
                            createMessage.error('请通知管理员设置初始页面');
                        } else {
                            router.replace({
                                path: _res.data.init_path
                            });
                        }
                    }
                }
            } else {
                const _res = import('@/menus/index');
                sysStore.mainMenuData = (await _res).default;
                sysStore.initMenuData = '/backend/operation-module/canary-management';
                sysStore.menuDataLoadingEnd = true;
                settings.func.showSearchButton && get_net_router(sysStore.mainMenuData);
            }
        };
        get_global_env();
        const dynamicComponent = import.meta.env.VITE_USE_PWA ? defineAsyncComponent(() => {
            return import ('@/components/layout/qm-reload-prompt.vue');
        }) : null;
        return {
            locale,
            userStore,
            globalStore,
            sysStore,
            dynamicComponent
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
    overflow-x: auto
}
</style>

<style lang="scss">
@import '@wuefront/shared/style/base/index.scss';
@import '@wuefront/shared/style/antd/antd.scss';
.table-nowrap{
    .ant-table-cell {
        white-space: nowrap;
        min-width: 100px;
    }
}
</style>
