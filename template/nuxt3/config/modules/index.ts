import type { ViteEnv } from '@quantum-design-configs/vite';
import { componentsModules } from './components';
import { dev_proxy } from './dev-proxy';
import { INuxtConfig } from './types';
import { devtools } from './dev-tools';
import { piniaModules } from './pinia';
import { pwa_module } from './pwa';
import { js_utils_deep_merge } from '@quantum-design/utils';

export function get_modules_config(env: ViteEnv): INuxtConfig {
    const _modules = ['@ant-design-vue/nuxt', '@pinia/nuxt', '@vite-pwa/nuxt', '@quantum-design/vue3-pc-ui-nuxt', '@quantum-design/vue3-antd-pc-ui-nuxt'];
    const _devProxy = dev_proxy(env);
    const _pwaModule = pwa_module(env);
    return {
        ..._devProxy,
        ...devtools,
        ...js_utils_deep_merge(piniaModules, componentsModules),
        ..._pwaModule,
        modules: _modules
    };
}
