<!--  -->
<template>
    <q-drawer v-bind="$attrs" @register="registerDrawer">
        <Divider>主题功能</Divider>
        <switch-item title="主题切换按钮" :event="HandleEnum.theme_mode_change" :default="getShowThemeSwitch"></switch-item>
        <switch-item title="公祭日灰色模式" :event="HandleEnum.theme_gray_status" :default="getGraySwitch"></switch-item>
        <Divider>功能配置</Divider>
        <switch-item title="菜单搜索" :event="HandleEnum.func_search_status" :default="getSearchButton"></switch-item>
        <switch-item title="回到顶部" :event="HandleEnum.func_top_status" :default="getBackTop"></switch-item>
        <switch-item title="面包屑" :event="HandleEnum.func_bread_status" :default="getBreadCrumb"></switch-item>
        <switch-item title="重复点击" :event="HandleEnum.func_aside_repeat_status" :default="getAsideRepeatClick"></switch-item>
        <switch-item title="刷新按钮" :event="HandleEnum.func_reload_status" :default="getShowReloadButton"></switch-item>
        <Divider>tab栏配置</Divider>
        <switch-item title="展示Tab栏" :event="HandleEnum.cache_tabs_status" :default="getShowCacheTabsSetting"></switch-item>
        <switch-item title="tab栏缓存" :event="HandleEnum.cache_alive_status" :default="getOpenKeepAlive" :disabled="!getShowCacheTabsSetting"></switch-item>
        <switch-item title="tab栏拖拽" :event="HandleEnum.cache_drag_status" :default="getCacheCanDrag" :disabled="!getShowCacheTabsSetting"></switch-item>
        <switch-item title="tab栏快速操作" :event="HandleEnum.cache_quick_status" :default="getShowQuick" :disabled="!getShowCacheTabsSetting"></switch-item>
        <Divider>动画配置</Divider>
        <switch-item title="切换动画" :event="HandleEnum.transition_status" :default="getShowTransition"></switch-item>
        <switch-item title="切换loading" :event="HandleEnum.transition_page_loading" :default="getShowPageLoading"></switch-item>
        <switch-item title="顶部进度条" :event="HandleEnum.transition_progress" :default="getShowNProgress"></switch-item>
        <Divider></Divider>
        <setting-footer :defaultSetting="props.defaultSetting"></setting-footer>
    </q-drawer>
</template>

<script lang='ts' setup>
import { PropType, onMounted} from 'vue';
import { QDrawer, useDrawerInner } from '@/q-drawer';
import { Divider } from 'ant-design-vue';
import SwitchItem from './switch-item.vue';
import settingFooter from './setting-footer.vue';
import { HandleEnum } from '../enums/enum';
import { useProjectSetting } from '../hooks/use-project-setting';
import { IProjectConfig } from '../type';
const props = defineProps({
    defaultSetting: {
        type: Object as PropType<IProjectConfig>,
        default: () => {}
    }
});
const {
    getShowNProgress,
    getShowPageLoading,
    getShowTransition,
    getCacheCanDrag,
    getShowThemeSwitch,
    getGraySwitch,
    getSearchButton,
    getBackTop,
    getBreadCrumb,
    getAsideRepeatClick,
    getRemoveAllHttpPending,
    getShowReloadButton,
    getShowCacheTabsSetting,
    getOpenKeepAlive,
    getShowQuick
} = useProjectSetting();
const [registerDrawer, {setDrawerProps}] = useDrawerInner();
onMounted(() => {
    setDrawerProps({
        isDetail: false,
        width: 330,
        title: '项目配置',
        showFooter: false
    });
});

</script>
<style lang='scss' scoped>
</style>
