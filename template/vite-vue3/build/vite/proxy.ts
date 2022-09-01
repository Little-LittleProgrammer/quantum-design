/**
 * Used to parse the .env.development proxy configuration
 */
import type { ProxyOptions } from 'vite';

type ProxyItem = [string, string];

type ProxyList = ProxyItem[];

type ProxyTargetList = Record<string, ProxyOptions & { rewrite: (path: string) => string }>;

const httpsRE = /^https:\/\//;

/**
 * Generate proxy
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
