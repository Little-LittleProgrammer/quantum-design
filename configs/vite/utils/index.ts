/**
 * Used to parse the .env.development proxy configuration
 */
import type { ProxyOptions } from 'vite';

export interface ViteEnv {
    VITE_PORT: number; // 端口
    // VITE_USE_MOCK: boolean;
    VITE_USE_PWA: boolean; // 使用pwa
    VITE_PROXY: [string, string][];
    VITE_GLOB_APP_TITLE: string;
    VITE_BASE_PATH: string;
    // VITE_USE_CDN: boolean;
    VITE_DROP_CONSOLE: boolean; // 是否删除console
    VITE_BUILD_COMPRESS: 'gzip' | 'brotli' | 'none'; // 压缩
    VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE: boolean;
    VITE_USE_IMAGEMIN: boolean; // 图片资源压缩
    VITE_GLOB_API_URL: string; // url
    // VITE_GENERATE_UI: string;
}

// Read all environment variable configuration files to process.env
export function wrapperEnv(envConf: Record<string, any>): ViteEnv {
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

type ProxyItem = [string, string];

type ProxyList = ProxyItem[];

type ProxyTargetList = Record<string, ProxyOptions & { rewrite: (path: string) => string }>;

const httpsRE = /^https:\/\//;


/**
 * Generate 代理
 * @param list
 */
export function create_proxy(list: ProxyList = []) {
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

