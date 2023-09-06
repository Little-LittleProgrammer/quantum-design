import { ViteEnv, vite_utils_create_proxy } from '@q-front-npm-configs/vite';
import { INuxtConfig } from './types';

export function dev_proxy(env: ViteEnv): INuxtConfig {
    const {VITE_PROXY, VITE_PORT} = env;
    const _proxyObj = vite_utils_create_proxy(VITE_PROXY);
    const _routerObj: Record<string, any> = {};
    Object.keys(_proxyObj).forEach(key => {
        const _key = key + '/**';
        const _item = {
            ..._proxyObj[key],
            proxy: _proxyObj[key].target + '/**'
        };
        _routerObj[_key] = _item;
    });
    return {
        devServer: {
            port: VITE_PORT
        },
        nitro: {
            devProxy: _proxyObj as any,
            routeRules: _routerObj
        }
    };
}
