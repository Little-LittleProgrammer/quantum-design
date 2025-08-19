import { js_create_local_storage, type WebStorage } from '@quantum-design/utils/extra';
import type { IProjectConfig } from './types';
import { reactive, readonly } from 'vue';
import defaultSetting from './config';
import dayjs from 'dayjs';
import { gMemorialEnum } from '@quantum-design/shared/enums';
import { js_utils_throttle_event, js_utils_deep_merge, js_utils_dom_has_class, js_utils_dom_add_class, js_utils_dom_remove_class, isMacOs } from '@quantum-design/utils';
import { updateCssVariables } from './update-css-variables';

const STORAGE_KEY = 'project_config';
const STORAGE_KEY_THEME = `${STORAGE_KEY}_theme`;

class SettingManager {
    private cache: WebStorage | null = null;
    private initialConfig: IProjectConfig | null = { ...defaultSetting };
    private isInitialized = false;
    private saveConfig: (config: IProjectConfig) => Promise<unknown> | undefined;
    private state: IProjectConfig = reactive({});

    constructor() {
        this.cache = js_create_local_storage({
            timeout: null,
        });

        this.saveConfig = () =>
            js_utils_throttle_event(this._saveConfig, {
                time: 150,
                context: this,
                args: [this.state],
            });
    }

    clearCache() {
        [STORAGE_KEY, STORAGE_KEY_THEME].forEach((key) => {
            this.cache?.remove(key);
        });
    }

    getInitialConfig() {
        return this.initialConfig;
    }

    getConfig() {
        return readonly(this.state);
    }

    async initConfig(overrideConfig: IProjectConfig) {
        if (this.isInitialized) return;
        this.initialConfig = js_utils_deep_merge(this.initialConfig, overrideConfig);
        const mergedConfig = js_utils_deep_merge(this.initialConfig, this.loadConfig() || {});

        this.updateConfig(mergedConfig);
        this.setupWatcher();
        this.initPlatform();
        this.isInitialized = true;
    }

    resetConfig() {
        Object.assign(this.state, this.initialConfig);
        this.saveConfig(this.state);
        this.clearCache();
        this.updateConfig(this.state);
    }

    updateConfig(config: IProjectConfig) {
        const _config = js_utils_deep_merge(this.state, config);
        Object.assign(this.state, _config);

        // 根据更新的键值执行相应的操作
        this.handleUpdates(config);
        this.saveConfig(this.state);
    }

    private handleUpdates(updates: Record<string, any>) {
        const themeUpdates = updates.theme || {};
        if (themeUpdates && Object.keys(themeUpdates).length > 0) {
            updateCssVariables(this.state);
        }

        if (Reflect.has(updates, 'grayMode') && updates.grayMode) {
            this.updateGrayMode(this.state);
        }
    }

    private setupWatcher() {
        if (this.isInitialized) {
            return;
        }
        // 监听系统主题偏好设置变化
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', ({ matches: isDark }) => {
            if (this.state.theme?.mode === 'system') {
                const dom = document.documentElement;
                dom.dataset.system = isDark ? 'dark' : 'light';
                this.updateConfig({
                    theme: { mode: isDark ? 'dark' : 'light' },
                });
                this.updateConfig({
                    theme: {
                        mode: 'system',
                    },
                });
            }
        });
    }

    private initPlatform() {
        const dom = document.documentElement;
        dom.dataset.platform = isMacOs() ? 'macOs' : 'window';
    }

    private loadConfig() {
        return this.loadCacheConfig() || { ...defaultSetting };
    }

    private loadCacheConfig() {
        return this.cache?.get(STORAGE_KEY) as IProjectConfig;
    }
    /**
     * 保存设置
     * @param {IProjectConfig} config - 需要保存的设置
     */
    private _saveConfig(config: IProjectConfig) {
        this.cache?.set(STORAGE_KEY, config);
        this.cache?.set(STORAGE_KEY_THEME, config.theme);
    }

    /**
     * 更新页面颜色模式（灰色）, 悼念的日期开启(4.4, 4.5, 12.13)
     * @param preference
     */
    private updateGrayMode(config: IProjectConfig) {
        if (config.theme) {
            const { grayMode } = config.theme;
            if (!grayMode) return;
            const dom = document.documentElement;
            const COLOR_GRAY = 'gray-mode';
            const _timeNow = dayjs().format('MM-DD');
            const hasGrayClass = js_utils_dom_has_class(dom, COLOR_GRAY);
            if (Object.values(gMemorialEnum).includes(_timeNow)) {
                if (!hasGrayClass) {
                    js_utils_dom_add_class(dom, COLOR_GRAY);
                }
            } else {
                if (hasGrayClass) {
                    js_utils_dom_remove_class(dom, COLOR_GRAY);
                }
            }
        }
    }
}

const settingManager = new SettingManager();

export default settingManager;
