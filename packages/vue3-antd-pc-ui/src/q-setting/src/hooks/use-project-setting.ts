import { computed } from 'vue';
import { useProjectSettingStore } from '../store';
import type { IProjectConfig } from '../type';

export function useProjectSetting() {
    const projectSettingStore = useProjectSettingStore();
    const getShowThemeSwitch = computed(() => projectSettingStore.getProjectConfig.theme?.showDarkModeToggle);
    const getGraySwitch = computed(() => projectSettingStore.getProjectConfig.theme?.grayMode);
    const getSearchButton = computed(() => projectSettingStore.getProjectConfig.func?.showSearchButton);
    const getBackTop = computed(() => projectSettingStore.getProjectConfig.func?.showBackTop);
    const getBreadCrumb = computed(() => projectSettingStore.getProjectConfig.func?.showBreadCrumb);
    const getAsideRepeatClick = computed(() => projectSettingStore.getProjectConfig.func?.asideRepeatClick);
    const getRemoveAllHttpPending = computed(() => projectSettingStore.getProjectConfig.func?.removeAllHttpPending);
    const getShowReloadButton = computed(() => projectSettingStore.getProjectConfig.func?.showReloadButton);
    const getShowCacheTabsSetting = computed(() => projectSettingStore.getProjectConfig.cacheTabsSetting?.show);
    const getOpenKeepAlive = computed(() => projectSettingStore.getProjectConfig.cacheTabsSetting?.openKeepAlive);
    const getShowQuick = computed(() => projectSettingStore.getProjectConfig.cacheTabsSetting?.showQuick);
    const getCacheCanDrag = computed(() => projectSettingStore.getProjectConfig.cacheTabsSetting?.canDrag);
    const getCacheCanCache = computed(() => projectSettingStore.getProjectConfig.cacheTabsSetting?.cache);
    const getShowTransition = computed(() => projectSettingStore.getProjectConfig.transition?.enable);
    const getShowPageLoading = computed(() => projectSettingStore.getProjectConfig.transition?.openPageLoading);
    const getShowNProgress = computed(() => projectSettingStore.getProjectConfig.transition?.openNProgress);
    function setRootSetting(setting: IProjectConfig) {
        projectSettingStore.set_project_config(setting);
    }
    return {
        setRootSetting,
        getShowNProgress,
        getShowPageLoading,
        getShowTransition,
        getCacheCanCache,
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
    };
}
