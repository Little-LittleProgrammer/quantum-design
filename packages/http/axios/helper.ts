import { isFunction } from "@qmfront/shared/utils";

/**
 * @description 添加时间戳
 * @param join 是否添加
 * @param restful 添加方式
 */
export function joinTimestamp(join: boolean, restful = false): string | object {
    if (!join) {
        return restful ? '' : {};
    }
    const now = new Date().getTime();
    if (restful) {
        return `t=${now}`;
    }
    return { t: now };
}

/**
 * @description: 添加环境变量
 */

export function joinEnvToUrl(env: ()=>string, restful = false): string | object {
    if (!env || !isFunction(env)) {
        return restful ? '' : {};
    }
    if (restful) {
        return `env=${(env())}`;
    }
    return { env: env()};
}

/**
 * @description: 添加cookie
 */

export function joinCookieToUrl(join: boolean, restful = false): string | object {
    if (!join) {
        return restful ? '' : {};
    }
    const _cookie = document.cookie;
    const _cookieObj:any = {};
    _cookie.split(';').forEach(item => {
        const _key = item.split('=')[0];
        const _value = item.split('=')[1];
        _cookieObj[_key] = _value;
    });
    if (restful) {
        return `qm_csrf_backend=${_cookieObj['qm_csrf_backend']}`;
    }
    return { qm_csrf_backend: _cookieObj['qm_csrf_backend']};
}

