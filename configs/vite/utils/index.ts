import { ProxyList, ProxyTargetList, ViteEnv, httpsRE } from "../types";

export const outputDir = 'dist';

// Read all environment variable configuration files to process.env
export function vite_utils_wrapper_env(envConf: Record<string, any>): ViteEnv {
    const ret: any = {};

    for (const envName of Object.keys(envConf)) {
        let realName = envConf[envName].replace(/\\n/g, '\n');
        realName = realName === 'true' ? true : realName === 'false' ? false : realName;

        if (envName === 'VITE_PORT') {
            realName = Number(realName);
        }
        if (envName === 'VITE_PROXY' && realName) {
            try {
                realName = JSON.parse(realName.replace(/'/g, '"'));
            } catch (error) {
                realName = '';
            }
        }
        ret[envName] = realName;
        if (typeof realName === 'string') {
            process.env[envName] = realName;
        } else if (typeof realName === 'object') {
            process.env[envName] = JSON.stringify(realName);
        }
    }
    return ret;
}

/**
 * Generate 代理
 * @param list
 */
export function vite_utils_create_proxy(list: ProxyList = []) {
    const _ret: ProxyTargetList = {};
    for (const [prefix, target] of list) {
        const _isHttps = httpsRE.test(target);
        _ret[prefix] = {
            target: target,
            changeOrigin: true,
            ws: true,
            rewrite: (path) => path.replace(new RegExp(`^${prefix}`), ''),
            // https is require secure=false
            ...(_isHttps ? { secure: false } : {})
        };
    }

    return _ret;
}
