import { computed, ref, watch } from 'vue';
import settingManager from './setting-manager';
import { js_utils_diff } from '@quantum-design/utils';
import { isDarkMode } from './update-css-variables';
import type { IProjectConfig } from './types';
import type { BuiltinThemePreset, BuiltinThemeType } from './constants';
import { BUILT_IN_THEME_PRESETS } from './constants';

export function useProjectSetting() {
    const getConfig = ref(settingManager.getConfig);
    watch(
        () => settingManager.state,
        (newVal) => {
            getConfig.value = newVal;
        },
        { deep: true },
    );
    const initialConfig = settingManager.getInitialConfig();
    const getDiffConfig = computed(() => js_utils_diff(getConfig.value || {}, initialConfig || {}));

    const isDiff = computed(() => {
        return Object.keys(getDiffConfig.value || {}).length > 0;
    });

    const isDark = computed(() => {
        return isDarkMode(getConfig.value.theme?.mode || 'light');
    });

    const theme = computed(() => {
        return isDark.value ? 'dark' : 'light';
    });

    const getThemeMode = computed(() => {
        return getConfig.value.theme?.mode || 'light';
    });

    const isUseThemeSwitch = computed(() => getConfig.value.theme?.showDarkModeToggle);
    const isUseGraySwitch = computed(() => getConfig.value.theme?.grayMode);
    const isUseSearchButton = computed(() => getConfig.value.func?.showSearchButton);
    const isUseBackTop = computed(() => getConfig.value.func?.showBackTop);
    const isUseBreadCrumb = computed(() => getConfig.value.func?.showBreadCrumb);
    const isUseAsideRepeatClick = computed(() => getConfig.value.func?.asideRepeatClick);
    const isUseRemoveAllHttpPending = computed(() => getConfig.value.func?.removeAllHttpPending);
    const isUseReloadButton = computed(() => getConfig.value.func?.showReloadButton);
    const isUseTableCacheSetting = computed(() => getConfig.value.func?.tableCache);
    const isUseCacheTabsSetting = computed(() => getConfig.value.cacheTabsSetting?.show);
    const isUseKeepAlive = computed(() => getConfig.value.cacheTabsSetting?.openKeepAlive);
    const isUseQuick = computed(() => getConfig.value.cacheTabsSetting?.showQuick);
    const isUseCacheCanDrag = computed(() => getConfig.value.cacheTabsSetting?.canDrag);
    const isUseCacheCanCache = computed(() => getConfig.value.cacheTabsSetting?.cache);
    const isUseTransition = computed(() => getConfig.value.transition?.enable);
    const isUsePageLoading = computed(() => getConfig.value.transition?.openPageLoading);
    const isUseNProgress = computed(() => getConfig.value.transition?.openNProgress);

    function updateProjectConfig(config: IProjectConfig) {
        settingManager.updateConfig(config);
    }

    function resetProjectConfig() {
        settingManager.resetConfig();
    }
    function initProjectConfig(config: IProjectConfig) {
        settingManager.initConfig(config);
    }

    return {
        isDiff,
        isDark,
        theme,
        getProjectConfig: getConfig,
        getThemeMode,
        isUseThemeSwitch,
        isUseGraySwitch,
        isUseSearchButton,
        isUseBackTop,
        isUseBreadCrumb,
        isUseAsideRepeatClick,
        isUseRemoveAllHttpPending,
        isUseReloadButton,
        isUseTableCacheSetting,
        isUseCacheTabsSetting,
        isUseKeepAlive,
        isUseQuick,
        isUseCacheCanDrag,
        isUseCacheCanCache,
        isUseTransition,
        isUsePageLoading,
        isUseNProgress,
        updateProjectConfig,
        resetProjectConfig,
        initProjectConfig,
    };
}

export { BUILT_IN_THEME_PRESETS };

export type { IProjectConfig, BuiltinThemePreset, BuiltinThemeType };
