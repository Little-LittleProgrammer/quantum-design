<!--  -->
<template>
    <div>
        <qm-header
            :environmentData="globalStore.environmentData"
            :systemName="globalStore.systemName"
            :initMenu="sysStore.initMenuData"
            :menuData="sysStore.mainMenuData"
        >
            <template #header-function>
                <div v-if="getSearchButton" class="g-flex-center search-container"  @click="change_search_modal">
                    <a-tooltip v-if="getSearchButton">
                        <template #title>
                            <span>搜索</span>
                        </template>
                        <a-button type="link">
                            <template #icon>
                                <QAntdIcon class="search-icon" type="SearchOutlined" />
                            </template>
                        </a-button>
                    </a-tooltip>
                </div>
                <q-theme-mode-button v-model:mode="themePorxy" v-if="getShowThemeSwitch" class="g-flex-center search-container"></q-theme-mode-button>
                <q-antd-setting class="g-flex-center search-container" :defaultSetting="setting"></q-antd-setting>
            </template>
        </qm-header>
        <div class="wrapper">
            <qm-aside :menuData="sysStore.asideMenuData"></qm-aside>
            <div class="main js-layout-main">
                <div class="main-header sticky-header" v-if="getBreadCrumb || getShowCacheTabsSetting" size="small">
                    <div class="g-flex">
                        <q-antd-breadcrumb v-if="getBreadCrumb" class="breadcrumb" :router-list="routerData" :class="!getShowCacheTabsSetting ? 'flex': ''"></q-antd-breadcrumb>
                        <q-antd-keep-alive-tabs v-if="getShowCacheTabsSetting" :canDrag="getCacheCanDrag" :showQuick="getShowQuick" :init-path="sysStore.initMenuData" class="keep-alive" :style="data.width" @cache-list="set_cache_list" @register="register"></q-antd-keep-alive-tabs>
                        <div class="reload" v-if="getShowReloadButton">
                            <a-tooltip  >
                                <template #title>
                                    <span>刷新页面</span>
                                </template>
                                <a-button size="small" type="link" @click="reload_page">
                                    <template #icon><QAntdIcon type="RedoOutlined" :spin="data.reloadLoading"/></template>
                                </a-button>
                            </a-tooltip>
                        </div>
                    </div>
                </div>
                <div class="layout-content">
                    <router-view >
                        <template #default="{ Component, route }">
                            <q-loading :loading="getShowPageLoading ? globalStore.pageLoading : false" size="large">
                                <transition :name="getTransName" mode="out-in" appear>
                                    <keep-alive v-if="getShowCacheTabsSetting && getOpenKeepAlive" :include="cacheList">
                                        <component :is="Component" :key="route.fullPath"></component>
                                    </keep-alive>
                                    <component  v-else :is="Component" :key="route.fullPath"></component>
                                </transition>
                            </q-loading>
                        </template>
                    </router-view>
                </div>
            </div>
        </div>
        <back-top v-if="getBackTop" :target="getTarget"></back-top>
        <q-antd-search :visible="data.modalVisible" :mainMenuData="sysStore.mainMenuData" @cancel="change_search_modal"></q-antd-search>
    </div>
</template>

<script lang='ts' setup>
import { reactive, computed, ref, watch, nextTick } from 'vue';
import { useProjectSetting} from '@quantum-design/vue3-antd-pc-ui';
import elementResizeDetectorMaker from 'element-resize-detector';
import QmHeader from '@/components/layout/qm-header.vue';
import QmAside from '@/components/layout/qm-aside.vue';
import { useRouter } from 'vue-router';
import {QLoading, QThemeModeButton} from '@quantum-design/vue3-pc-ui';
import { useSysStore } from '@/store/modules/systemManage';
import { useGlobalStore } from '@/store/modules/global';
import { routerData } from '@/router';
import { useThemeSetting } from '@/hooks/settings/use-theme-setting';
import setting from '@/enums/projectEnum';
import { BackTop } from 'ant-design-vue';
const router = useRouter();
const globalStore = useGlobalStore();
const sysStore = useSysStore();
const {getSearchButton, getShowThemeSwitch, getShowReloadButton, getShowTransition, getShowCacheTabsSetting, getBreadCrumb, getBackTop, getShowPageLoading, getOpenKeepAlive, getCacheCanDrag, getShowQuick} = useProjectSetting();
const {setThemeMode} = useThemeSetting();
const data = reactive({
    // routeRefresh: 1,
    modalVisible: false,
    reloadLoading: false,
    width: ''
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
    if (getShowTransition.value) {
        return 'fade-slide';
    }
    return '';
});

const cacheList = ref<string[]>([]);
const set_cache_list = (list: string[]) => {
    cacheList.value = [...list];
};
let funcObj:any = {};
function register(obj:any) {
    funcObj = obj;
}
const reload_page = async() => {
    data.reloadLoading = true;
    await funcObj.refreshPage(router);
    setTimeout(() => {
        data.reloadLoading = false;
    }, 1000);
};

// 设置主题
const themePorxy = computed<'dark' | 'light'>({
    get() {
        return globalStore.getThemeMode;
    },
    set(val: 'dark' | 'light') {
        setThemeMode(val);
    }
});
setThemeMode(themePorxy.value);
watch(() => getBreadCrumb.value, (val) => {
    nextTick(() => {
        if (getShowCacheTabsSetting.value && val) {
            const _erd = elementResizeDetectorMaker();
            _erd.listenTo(document.getElementsByClassName('breadcrumb')[0] as HTMLElement, function(e) {
                const $dom = document.getElementsByClassName('main-header')[0];
                data.width = `width: ${$dom.clientWidth - e.clientWidth - 74}px`; // 当开启tabs配置与面包屑配置时, 要动态计算下tabs的宽度
            });
        } else if (getShowCacheTabsSetting.value && !val) {
            const $dom = document.getElementsByClassName('main-header')[0];
            data.width = `width: ${$dom.clientWidth - 40}px`; // 当开启tabs配置与面包屑配置时, 要动态计算下tabs的宽度
        }
    });
}, {immediate: true});

</script>
<style lang='scss' scoped>
.main-header {
    height: 40px;
    padding-left: $space + 14;
    @include bg-color(aside-bg);
    .g-flex {
        width: 100%;
        height: 100%;
        .breadcrumb {
            font-size: 14px;
            margin-right: 10px;
            white-space: nowrap;
        }
        .keep-alive {
            flex: 1;
        }
        .reload {
            width: 36px;
            height: 28px;
            text-align: center;
            line-height: 30px;
            border-left: 1px solid;
            @include border-color(border-color, 'left');
        }

    }
}
.sticky-header {
    position: sticky;
    top: 0px;
    z-index: 999;
}
.search-container {
    width: 44px;
    height: 100%;
    cursor: pointer;
    .search-icon {
        color: #fff;
        font-size: 18px;
    }
    &:hover {
        background: $header-tabs-hover-bg;
    }
}

.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all 0.3s;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.js-layout-main {
}
.layout-content {
    height: calc(100% - 40px);
    position: relative;
    padding-top: 10px;
    padding-left: 10px;
}
</style>
