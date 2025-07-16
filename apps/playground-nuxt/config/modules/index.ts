import type { ViteEnv } from '@quantum-design-configs/vite';
import { componentsModules } from './components';
import { dev_proxy } from './dev-proxy';
import type { INuxtConfig } from './types';
import { devtools } from './dev-tools';
import { pwa_module } from './pwa';
import {tsConfig} from './tsconfig'

export function get_modules_config(env: ViteEnv): INuxtConfig {
    const _modules = ['@ant-design-vue/nuxt', '@pinia/nuxt', '@vite-pwa/nuxt', '@quantum-design/vue3-pc-ui-nuxt', '@quantum-design/vue3-antd-pc-ui-nuxt'];
    const _devProxy = dev_proxy(env);
    const _pwaModule = pwa_module(env);
    return {
        ..._devProxy,
        ...devtools,
        ...componentsModules,
        ..._pwaModule,
        ...tsConfig,
        modules: _modules
    };
}
