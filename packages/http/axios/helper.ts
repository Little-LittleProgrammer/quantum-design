import { createLocalStorage, isFunction } from '@wuefront/utils';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * @description 添加时间戳
 * @param join 是否添加
 * @param restful 添加方式
 */
export function joinTimestamp(join: boolean, restful = false): string | Recordable<string> {
    if (!join) {
        return restful ? '' : {};
    }
    const now = new Date().getTime() + '';
    if (restful) {
        return `t=${now}`;
    }
    return { t: now };
}

/**
 * @description: 添加环境变量
 */

export function joinEnvToUrl(env: ()=>string, restful = false): string | Recordable<string> {
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

export function joinCookieToUrl(join: boolean, restful = false): string | Recordable<string> {
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

/**
 * @description: 添加cookie
 */

export function dealToken() {
    const ls = createLocalStorage();
    function joinTokenToHeader(join: boolean, config: AxiosRequestConfig<any>) {
        if (!join) {
            return config;
        }
        const _token = ls.get('qm-token');
        if (_token && _token['x-qm-devops-token']) {
            if (config.headers) {
                config.headers['x-qm-devops-token'] = _token['x-qm-devops-token'];
            } else {
                config.headers = {
                    'x-qm-devops-token': _token['x-qm-devops-token']
                };
            }
        }
        console.log(ls.get('qm-token'));
        return config;
    }
    function setTokenToHeader(join: boolean, res:AxiosResponse<any>) {
        if (!join) {
            return;
        }
        console.log(ls.get('qm-token'));
        if (res.headers['x-qm-devops-token']) {
            ls.set('qm-token', {
                'x-qm-devops-token': res.headers['x-qm-devops-token']
            });
        }
    }
    return {
        joinTokenToHeader, setTokenToHeader
    };
}
