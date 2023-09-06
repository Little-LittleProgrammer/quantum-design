import { antdCssData } from './modules/components';
import type {ThemeConfig} from 'ant-design-vue/es/config-provider/context.d.ts';
import { INuxtConfig } from './modules/types';
import type { ViteEnv } from '@q-front-npm-configs/vite';
import { theme as antdTheme } from 'ant-design-vue';
export const globalThemeConfig: ThemeConfig = {
    algorithm: antdTheme.defaultAlgorithm,
    token: {
        colorPrimary: antdCssData['primary-color'],
        colorLink: antdCssData['link-color'],
        colorSuccess: antdCssData['success-color'],
        colorWarning: antdCssData['warning-color'],
        colorError: antdCssData['error-color'],
        colorTextDisabled: antdCssData['disabled-color']
    }
};

export const sentryConfig = {
    dsn: 'https://4f80cd93adb141668623a5e24b8d56be@qm-front-sentry.wtzw.com/21',
    sampleRate: 1,
    ignoreErrors: [
        'ResizeObserver loop limit exceeded', // ant 官方建议
        'validate error'
    ]
};

export function project_config(env: ViteEnv):INuxtConfig {
    const {VITE_BASE_PATH, VITE_GLOB_API_URL, VITE_USE_SENTRY, VITE_GLOB_API_URL_PREFIX, VITE_USE_SOURCEMAP, VITE_DROP_CONSOLE} = env;
    return {
        srcDir: VITE_BASE_PATH,
        runtimeConfig: { // app 全局配置
            public: {
                baseRemoteUrl: VITE_GLOB_API_URL,
                apiPrefix: VITE_GLOB_API_URL_PREFIX,
                globalThemeConfig: globalThemeConfig as any,
                sentry: {
                    ...sentryConfig,
                    enable: VITE_USE_SENTRY as any
                }
            }
        },
        sourcemap: VITE_USE_SOURCEMAP,
        app: {
            pageTransition: {name: 'fade-slide', mode: 'out-in'}
        },
        vite: {
            esbuild: {
                pure: VITE_DROP_CONSOLE ? ['console.log', 'debugger'] : []
            }
        }
    };
}
