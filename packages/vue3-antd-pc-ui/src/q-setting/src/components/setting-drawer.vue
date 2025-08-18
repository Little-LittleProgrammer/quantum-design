<!--  -->
<template>
    <q-antd-drawer v-bind="$attrs" @register="registerDrawer">
        <divider>主题功能</divider>
        <switch-item title="主题切换按钮" :event="HandleEnum.theme_mode_change" :default="isUseThemeSwitch"></switch-item>
        <switch-item title="公祭日灰色模式" tooltip="纪念日: 4月4日, 4月5日, 12月13日" :event="HandleEnum.theme_gray_status" :default="isUseGraySwitch"></switch-item>
        <divider>功能配置</divider>
        <switch-item title="菜单搜索" :event="HandleEnum.func_search_status" :default="isUseSearchButton"></switch-item>
        <switch-item title="回到顶部" :event="HandleEnum.func_top_status" :default="isUseBackTop"></switch-item>
        <switch-item title="面包屑" :event="HandleEnum.func_bread_status" :default="isUseBreadCrumb"></switch-item>
        <switch-item title="重复点击" :event="HandleEnum.func_aside_repeat_status" :default="isUseAsideRepeatClick"></switch-item>
        <switch-item title="刷新按钮" :event="HandleEnum.func_reload_status" :default="isUseReloadButton"></switch-item>
        <switch-item title="缓存表格配置" tooltip="自动保存表格列设置、排序等配置信息，关闭后会清空所有已有配置信息" :event="HandleEnum.func_table_cache_status" :default="isUseTableCacheSetting"></switch-item>
        <divider>tab栏配置</divider>
        <switch-item title="展示Tab栏" :event="HandleEnum.cache_tabs_status" :default="isUseCacheTabsSetting"></switch-item>
        <switch-item title="tab栏缓存" tooltip="切换tab及刷新页面时保存页面状态" :event="HandleEnum.cache_alive_status" :default="isUseKeepAlive" :disabled="!isUseCacheTabsSetting"></switch-item>
        <switch-item title="刷新时缓存" tooltip="刷新后仍保留已经打开的tab" :event="HandleEnum.cache_cache" :default="isUseCacheCanCache" :disabled="!isUseCacheTabsSetting"></switch-item>
        <switch-item title="tab栏拖拽" :event="HandleEnum.cache_drag_status" :default="isUseCacheCanDrag" :disabled="!isUseCacheTabsSetting"></switch-item>
        <switch-item title="tab栏快速操作" :event="HandleEnum.cache_quick_status" :default="isUseQuick" :disabled="!isUseCacheTabsSetting"></switch-item>
        <divider>动画配置</divider>
        <switch-item title="切换动画" :event="HandleEnum.transition_status" :default="isUseTransition"></switch-item>
        <switch-item title="切换loading" :event="HandleEnum.transition_page_loading" :default="isUsePageLoading"></switch-item>
        <switch-item title="顶部进度条" :event="HandleEnum.transition_progress" :default="isUseNProgress"></switch-item>
        <divider></divider>
        <setting-footer :defaultSetting="props.defaultSetting"></setting-footer>
    </q-antd-drawer>
</template>

<script lang="ts" setup>
import { type PropType, onMounted } from 'vue';
import { useDrawerInner } from '@vue3-antd/q-drawer';
import QAntdDrawer from '@vue3-antd/q-drawer';
import { Divider } from 'ant-design-vue';
import SwitchItem from './switch-item.vue';
import settingFooter from './setting-footer.vue';
import { HandleEnum } from '../enums/enum';
import { useProjectSetting, type IProjectConfig } from '@quantum-design/hooks/vue/use-project-setting';
const props = defineProps({
    defaultSetting: {
        type: Object as PropType<IProjectConfig>,
        default: () => {},
    },
});
const { isUseNProgress, isUsePageLoading, isUseTransition, isUseCacheCanDrag, isUseThemeSwitch, isUseGraySwitch, isUseSearchButton, isUseBackTop, isUseBreadCrumb, isUseAsideRepeatClick, isUseReloadButton, isUseCacheTabsSetting, isUseKeepAlive, isUseCacheCanCache, isUseQuick, isUseTableCacheSetting } = useProjectSetting();
const [registerDrawer, { setDrawerProps }] = useDrawerInner();
onMounted(() => {
    setDrawerProps({
        isDetail: false,
        width: 330,
        title: '项目配置',
        showFooter: false,
    });
});
</script>
<style lang="scss" scoped></style>
