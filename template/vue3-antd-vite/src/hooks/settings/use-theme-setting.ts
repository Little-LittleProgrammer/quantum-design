import { useGlobalStore } from '@/store/modules/global';
import { computed } from 'vue';
import { theme as antdTheme } from 'ant-design-vue';
import { useProjectSetting } from '@q-front-npm/vue3-antd-pc-ui';
import { js_utils_dom_add_class, js_utils_dom_has_class } from '@q-front-npm/utils';
import {gDateUtil} from '@q-front-npm/utils';
import { gMemorialEnum } from '@q-front-npm/shared/enums';

// 写成hooks, 方便以后扩展, 扩展项目可视化配置
export function useThemeSetting() {
    const globalStore = useGlobalStore();
    const antdCssData = (window as any).cssData as any
    const getThemeMode = computed(() => {
        console.log('antdCssData',antdCssData)
        if (antdCssData['primary-color']) {
            const _token = {
                colorPrimary: antdCssData['primary-color'],
                colorLink: antdCssData['link-color'],
                colorSuccess: antdCssData['success-color'],
                colorWarning: antdCssData['warning-color'],
                colorError: antdCssData['error-color'],
                colorTextDisabled: antdCssData['disabled-color']
            };
            if (globalStore.theme === 'dark') {
                return {
                    token: _token,
                    algorithm: antdTheme.darkAlgorithm
                };
            } else {
                return {
                    token: _token,
                    algorithm: antdTheme.defaultAlgorithm
                };
            }
        }
        return {
            token: {
                colorPrimary: '#1677ff'
            }
        };
    });

    function add_gray_skin(dom:HTMLElement) {
        const globalStore = useGlobalStore();
        const {getGraySwitch} = useProjectSetting();
        if (getGraySwitch.value) {
            const _timeNow = globalStore.date;
            type Enum = keyof typeof gMemorialEnum
            for (const key in gMemorialEnum) {
                if (gDateUtil(_timeNow).format('MM-DD') == gMemorialEnum[key as Enum]) {
                    const hasGrayClass = js_utils_dom_has_class(dom, 'gray-mode');
                    if (!hasGrayClass) {
                        js_utils_dom_add_class(dom, 'gray-mode');
                    }
                }
            }
        }
    }

    function setThemeMode(theme: 'dark' | 'light') {
        globalStore.set_theme_mode(theme);

        const $htmlRoot = document.getElementById('JsHtmlRoot');
        if (!$htmlRoot) {
            return;
        }
        $htmlRoot.setAttribute('data-theme', theme);
        add_gray_skin($htmlRoot);
    }
    return {
        setThemeMode,
        getThemeMode
    };
}
