<template>
    <a-config-provider :locale="locale">
        <div id="app" >
            <router-view v-if="sysStore.menuDataLoadingEnd"></router-view>
            <!-- 异步导出文件提示窗 -->
            <a-modal
                v-model:visible="globalStore.asyncExportNoticePop.visible"
                class="async-export-notice-pop"
                :centered="true"
                :show-close="false"
                title="导出"
            >
                <div class="async-download-tips">
                    <span class="s-tit">
                        文件名：
                        <em>{{ globalStore.asyncExportNoticePop.file }}</em>
                    </span>
                    <span
                        v-if="globalStore.asyncExportNoticePop.title && globalStore.asyncExportNoticePop.title != ''"
                        v-html="globalStore.asyncExportNoticePop.title"
                    ></span>
                </div>
                <template #footer>
                    <span class="dialog-footer">
                        <a-button type="primary" @click="globalStore.asyncExportNoticePop.visible = false">确定</a-button>
                    </span>
                </template>
            </a-modal>
            <!-- 异步导出文件提示窗 -->
        </div>
    </a-config-provider>
</template>

<script lang="ts">
import { defineComponent} from 'vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { useMessage } from '@qmfront/hooks/vue';
import { api_global_env } from '@/http/api/global';
import { api_manage_user_auths } from './http/api/system-management/permission/person';
import { router } from './router';
import { get_net_router } from '@qmfront/vue3-antd-ui';
import settings from '@/enums/projectEnum';
import { useUserStore } from '@/store/modules/user';
import { useGlobalStore } from '@/store/modules/global';
import { useSysStore } from '@/store/modules/systemManage';

export default defineComponent({
    name: 'App',
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
                sysStore.initMenuData = '/backend/home-page/index';
                sysStore.menuDataLoadingEnd = true;
                settings.func.showSearchButton && get_net_router(sysStore.mainMenuData);
            }
        };
        get_global_env();
        return {
            locale,
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
// 异步提示弹窗
.async-export-notice-pop {
    .async-download-tips {
        span {
            display: block;
            line-height: 30px;
            font-size: 16px;
            &.s-tit {
                em {
                    font-weight: bold;
                    font-size: 18px;
                }
            }
            a {
                color: $primary-color;
            }
        }
    }
}
</style>
