import type { ViteEnv } from '@q-front-npm-configs/vite';
import { componentsModules } from './components';
import { dev_proxy } from './dev-proxy';
import type { INuxtConfig } from './types';
import { devtools } from './dev-tools';
import { piniaModules } from './pinia';
import { pwa_module } from './pwa';
import { js_utils_deep_merge } from '@q-front-npm/utils';
import {tsConfig} from './tsconfig'

export function get_modules_config(env: ViteEnv): INuxtConfig {
    const _modules = ['@ant-design-vue/nuxt', '@pinia/nuxt', '@vite-pwa/nuxt', '@q-front-npm/vue3-pc-ui-nuxt', '@q-front-npm/vue3-antd-pc-ui-nuxt'];
    const _devProxy = dev_proxy(env);
    const _pwaModule = pwa_module(env);
    return {
        ..._devProxy,
        ...devtools,
        ...js_utils_deep_merge(piniaModules, componentsModules),
        ..._pwaModule,
        ...tsConfig,
        modules: _modules
    };
}
