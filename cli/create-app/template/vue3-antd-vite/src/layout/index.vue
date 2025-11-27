<!--  -->
<template>
    <div>
        <qm-header :environmentData="globalStore.environmentData" :systemName="globalStore.systemName" :initMenu="sysStore.initMenuData" :menuData="sysStore.mainMenuData">
            <template #header-function>
                <div v-if="isUseSearchButton" class="flex-center h-full w-11 cursor-pointer hover:bg-[var(--header-tabs-hover-bg)]" @click="change_search_modal">
                    <a-tooltip v-if="isUseSearchButton">
                        <template #title>
                            <span>搜索</span>
                        </template>
                        <a-button type="link">
                            <template #icon>
                                <q-antd-icon class="line-height-1 text-lg text-white" type="SearchOutlined" />
                            </template>
                        </a-button>
                    </a-tooltip>
                </div>
                <q-antd-theme-mode-button v-if="isUseThemeSwitch" class="flex-center h-full w-11 cursor-pointer hover:bg-[var(--header-tabs-hover-bg)]"></q-antd-theme-mode-button>
                <q-antd-setting class="flex-center h-full w-11 cursor-pointer hover:bg-[var(--header-tabs-hover-bg)]" :defaultSetting="setting"></q-antd-setting>
            </template>
        </qm-header>
        <div class="wrapper">
            <qm-aside :menuData="sysStore.asideMenuData"></qm-aside>
            <div class="main js-layout-main">
                <div class="main-header sticky top-0 z-[970] h-10 bg-[var(--aside-bg)] pl-[calc(var(--space)+14px)]" v-if="isUseBreadCrumb || isUseCacheTabsSetting" size="small">
                    <div class="flex-center h-full w-full">
                        <q-breadcrumb v-if="isUseBreadCrumb" class="mr-2.5 whitespace-nowrap text-sm" :router-list="routerData" :class="!isUseCacheTabsSetting ? 'flex' : ''"></q-breadcrumb>
                        <q-antd-keep-alive-tabs v-if="isUseCacheTabsSetting" :canDrag="isUseCacheCanDrag" :showQuick="isUseQuick" :init-path="sysStore.initMenuData" class="flex-1" :style="data.width" @cache-list="set_cache_list" @register="register"></q-antd-keep-alive-tabs>
                        <div class="h-7 w-9 border-l border-[var(--border-color-base)] text-center leading-[30px]" v-if="isUseReloadButton">
                            <a-tooltip>
                                <template #title>
                                    <span>刷新页面</span>
                                </template>
                                <a-button size="small" type="link" @click="reload_page">
                                    <template #icon><q-antd-icon type="RedoOutlined" :spin="data.reloadLoading" /></template>
                                </a-button>
                            </a-tooltip>
                        </div>
                    </div>
                </div>
                <div class="relative box-border h-[calc(100%-40px)] pl-2.5 pt-2.5">
                    <router-view>
                        <template #default="{ Component, route }">
                            <q-loading :loading="isUsePageLoading ? globalStore.pageLoading : false" size="large">
                                <transition :name="getTransName" mode="out-in" appear>
                                    <keep-alive v-if="isUseCacheTabsSetting && isUseKeepAlive" :include="cacheList">
                                        <component :is="Component" :key="route.fullPath"></component>
                                    </keep-alive>
                                    <component v-else :is="Component" :key="route.fullPath"></component>
                                </transition>
                            </q-loading>
                        </template>
                    </router-view>
                </div>
            </div>
        </div>
        <back-top v-if="isUseBackTop" :target="getTarget"></back-top>
        <q-antd-search :visible="data.modalVisible" :mainMenuData="sysStore.mainMenuData" @cancel="change_search_modal"></q-antd-search>
    </div>
</template>

<script lang="ts" setup>
import { reactive, computed, ref, watch, nextTick } from 'vue';
import { useProjectSetting } from '@quantum-design/hooks/vue/use-project-setting';
import { setGlobalTableSetting } from '@quantum-design/vue3-antd-pc-ui';
import elementResizeDetectorMaker from 'element-resize-detector';
import QmHeader from '@/components/layout/qm-header.vue';
import QmAside from '@/components/layout/qm-aside.vue';
import { useRouter } from 'vue-router';
import { useSysStore } from '@/store/modules/systemManage';
import { useGlobalStore } from '@/store/modules/global';
import { routerData } from '@/router';
import setting from '@/enums/projectEnum';
import { BackTop } from 'ant-design-vue';
import { useParamsAliveRoot } from '@quantum-design/hooks/vue/use-params-alive';
import { QLoading, QBreadcrumb } from '@quantum-design/vue3-pc-ui';
const router = useRouter();
const globalStore = useGlobalStore();
const sysStore = useSysStore();
const { isUseSearchButton, isUseThemeSwitch, isUseReloadButton, isUseTransition, isUseCacheTabsSetting, isUseBreadCrumb, isUseBackTop, isUsePageLoading, isUseKeepAlive, isUseCacheCanDrag, isUseQuick, isUseCacheCanCache, isUseTableCacheSetting } = useProjectSetting();
const data = reactive({
    // routeRefresh: 1,
    modalVisible: false,
    reloadLoading: false,
    width: '',
});
// watch(route, (to, from) => {
//     if (to.path == from.path && !to.query.no_refresh) {
//         data.routeRefresh = 0;
//         nextTick(() => {
//             data.routeRefresh = 1;
//         });
//     }
// });
const getTarget = () => document.getElementsByClassName('js-main-conatiner')[0] as HTMLElement;
const change_search_modal = () => {
    data.modalVisible = !data.modalVisible;
};
const getTransName = computed(() => {
    if (isUseTransition.value) {
        return 'fade-slide';
    }
    return '';
});

const cacheList = ref<string[]>([]);
const set_cache_list = (list: string[]) => {
    cacheList.value = [...list];
};
let funcObj: any = {};
function register(obj: any) {
    funcObj = obj;
}
const reload_page = async () => {
    data.reloadLoading = true;
    await funcObj.refreshPage(router);
    setTimeout(() => {
        data.reloadLoading = false;
    }, 1000);
};

// 刷新时记住参数, 具体使用请参考文档
// https://project-docs.qmniu.com/packages/hooks/use-params-alive.html
useParamsAliveRoot({
    aliveTabs: cacheList,
    projectSetting: {
        cache: isUseCacheCanCache.value ?? false,
        keepalive: isUseKeepAlive.value ?? false,
        show: isUseCacheTabsSetting.value ?? false,
    },
});

watch(
    () => isUseBreadCrumb.value,
    (val) => {
        nextTick(() => {
            if (isUseCacheTabsSetting.value && val) {
                const _erd = elementResizeDetectorMaker();
                _erd.listenTo(document.getElementsByClassName('breadcrumb')[0] as HTMLElement, function (e) {
                    const $dom = document.getElementsByClassName('main-header')[0]!;
                    data.width = `width: ${$dom.clientWidth - e.clientWidth - 74}px`; // 当开启tabs配置与面包屑配置时, 要动态计算下tabs的宽度
                });
            } else if (isUseCacheTabsSetting.value && !val) {
                const $dom = document.getElementsByClassName('main-header')[0]!;
                data.width = `width: ${$dom.clientWidth - 40}px`; // 当开启tabs配置与面包屑配置时, 要动态计算下tabs的宽度
            }
        });
    },
    { immediate: true },
);
watch(isUseTableCacheSetting, (val) => {
    setGlobalTableSetting({
        cache: val,
    });
});
</script>
<!-- 使用 Tailwind CSS 类替代了所有 SCSS 样式，无需单独的 style 块 -->
