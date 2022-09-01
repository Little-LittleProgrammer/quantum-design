<!--  -->
<template>
    <div>
        <q-header
            :environmentData="globalStore.environmentData"
            :systemName="globalStore.systemName"
            :initMenu="sysStore.initMenuData"
            :menuData="sysStore.mainMenuData"
        >
            <template #header-function>
                <div v-if="setting.func.showSearchButton" class="qm-flex-center search-container"  @click="change_search_modal">
                    <a-tooltip v-if="setting.func.showSearchButton">
                        <template #title>
                            <span>搜索</span>
                        </template>
                        <a-button type="link">
                            <template #icon>
                                <QIcon class="search-icon" type="SearchOutlined" />
                            </template>
                        </a-button>
                    </a-tooltip>
                </div>
                <q-theme-mode-button v-model:mode="data.mode" v-if="setting.theme.showDarkModeToggle" class="qm-flex-center search-container"></q-theme-mode-button>
            </template>
        </q-header>
        <div class="wrapper">
            <q-aside :menuData="sysStore.asideMenuData"></q-aside>
            <div class="main js-layout-main">
                <div class="main-header mb sticky-header" v-if="setting.func.showBreadCrumb || setting.cacheTabsSetting.show || setting.func.showReloadButton" size="small">
                    <div class="qm-flex">
                        <q-breadcrumb v-if="setting.func.showBreadCrumb" class="breadcrumb" :class="!setting.cacheTabsSetting.show ? 'flex': ''"></q-breadcrumb>
                        <q-keep-alive-tabs v-if="setting.cacheTabsSetting.show" :init-path="sysStore.initMenuData" class="keep-alive" :style="data.width" @cache-list="set_cache_list" @register="register"></q-keep-alive-tabs>
                        <div class="reload" v-if="setting.func.showReloadButton">
                            <a-tooltip  >
                                <template #title>
                                    <span>刷新页面</span>
                                </template>
                                <a-button size="small" type="link" @click="reload_page">
                                    <template #icon><QIcon type="RedoOutlined" :spin="data.reloadLoading"/></template>
                                </a-button>
                            </a-tooltip>
                        </div>
                    </div>
                </div>
                <div>
                    <router-view >
                        <template #default="{ Component, route }">
                            <q-loading :loading="setting.transition.openPageLoading ? globalStore.pageLoading : false" size="large">
                                <transition :name="getTransName" mode="out-in" appear>
                                    <keep-alive v-if="setting.cacheTabsSetting.openKeepAlive" :include="cacheList">
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
        <a-back-top v-if="setting.func.showBackTop" :target="getTarget"></a-back-top>
        <q-search :visible="data.modalVisible" :mainMenuData="sysStore.mainMenuData" @cancel="change_search_modal"></q-search>
    </div>
</template>

<script lang='ts' setup>
import '@qmfront/shared/style/base/index.scss'; // 为了保证 全局样式 不被antd的覆盖， 所以放在此处，避免与antd样式打包到同一文件夹
import '@qmfront/shared/style/antd/antd.scss'; // 为了保证 全局样式 不被antd的覆盖， 所以放在此处，避免与antd样式打包到同一文件夹
import { QBreadcrumb } from '@qmfront/vue3-antd-ui';
import { QKeepAliveTabs } from '@qmfront/vue3-antd-ui';
import setting from '@/enums/projectEnum';
import { reactive, computed, onMounted, ref, watch } from 'vue';
import elementResizeDetectorMaker from 'element-resize-detector';
import QHeader from '@/components/q-header.vue';
import QAside from '@/components/q-aside.vue';
import { useRouter } from 'vue-router';
import {QThemeModeButton} from '@qmfront/vue3-ui';
import { QIcon} from '@qmfront/vue3-antd-ui';
import {QSearch} from '@qmfront/vue3-antd-ui';
import {QLoading} from '@qmfront/vue3-ui';
import { useSysStore } from '@/store/modules/systemManage';
import { useGlobalStore } from '@/store/modules/global';
import { MemorialEnum } from '@qmfront/shared/enums';
import dayjs from 'dayjs';
import { createLocalStorage } from '@qmfront/shared/utils';
import { update_theme } from '@/assets/ts/theme';

const router = useRouter();
const globalStore = useGlobalStore();
const sysStore = useSysStore();
const ls = createLocalStorage();
const data = reactive({
    // routeRefresh: 1,
    modalVisible: false,
    reloadLoading: false,
    width: '',
    mode: ls.get('themeMode') || 'light'
});
// watch(route, (to, from) => {
//     if (to.path == from.path && !to.query.no_refresh) {
//         data.routeRefresh = 0;
//         nextTick(() => {
//             data.routeRefresh = 1;
//         });
//     }
// });
const getTarget = () => document.getElementsByClassName('js-layout-main')[0];
const change_search_modal = () => {
    data.modalVisible = !data.modalVisible;
};
const getTransName = computed(() => {
    if (setting.transition.enable) {
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

// 设置当前主题
const _timeNow = globalStore.date;
console.log('_timeNow', _timeNow);
type Enum = keyof typeof MemorialEnum
for (const key in MemorialEnum) {
    if (dayjs(_timeNow).format('MM-DD') == MemorialEnum[key as Enum]) {
        data.mode = 'gray-mode';
    }
}
watch(() => data.mode, (val) => {
    if (val) {
        ls.set('themeMode', val);
        update_theme(val);
    }
}, {immediate: true});
onMounted(() => {
    if (setting.cacheTabsSetting.show && setting.func.showBreadCrumb) {
        const _erd = elementResizeDetectorMaker();
        _erd.listenTo(document.getElementsByClassName('breadcrumb')[0] as HTMLElement, function(e) {
            const $dom = document.getElementsByClassName('main-header')[0];
            data.width = `width: ${$dom.clientWidth - e.clientWidth - 74}px`;
        });
    } else if (setting.cacheTabsSetting.show && !setting.func.showBreadCrumb) {
        const $dom = document.getElementsByClassName('main-header')[0];
        data.width = `width: ${$dom.clientWidth - 40}px`;
    }
});
</script>
<style lang='scss' scoped>
.main-header {
    margin: -10px;
    margin-left: 0px;
    padding: 5px;
    height: 40px;
    padding-left: 5px;
    @include bg-color(aside-bg);
    .qm-flex {
        width: 100%;
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
    top: -10px;
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
</style>
