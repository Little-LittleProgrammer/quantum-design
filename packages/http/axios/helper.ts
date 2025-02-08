import { isFunction, isClient } from '@quantum-design/utils';
import { js_create_local_storage } from '@quantum-design/utils/extra';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { CreateAxiosOptions } from './axios-transform';

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
    return { t: now, };
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
    return { env: env(), };
}

/**
 * @description: 添加cookie
 */

export function joinCookieToUrl(join: boolean, restful = false): string | Recordable<string> {
    if (!join) {
        return restful ? '' : {};
    }
    const _cookie = globalThis?.document?.cookie;
    const _cookieObj:any = {};
    if (_cookie) {
        _cookie.split(';').forEach(item => {
            if (item.includes('=')) {
                const _key = item.split('=')[0]?.trim() || '';
                const _value = item.split('=')[1]?.trim();
                _cookieObj[_key] = _value;
            }
        });
    }
    if (restful) {
        return `qm_csrf_backend=${_cookieObj['qm_csrf_backend']}`;
    }
    return { qm_csrf_backend: _cookieObj['qm_csrf_backend'], };
}

/**
 * @description: 添加token
 */

export function dealToken() {
    const ls = isClient ? js_create_local_storage() : {
        get: () => { console.log('dealToken暂不支持service'); },
        set: () => { console.log('dealToken暂不支持service'); },
    };
    function setTokenToHeader(options: CreateAxiosOptions, config: AxiosRequestConfig<any>) {
        const {withToken = true, } = options.requestOptions!;
        if (!withToken) {
            return config;
        }
        const _token = ls.get('qm_token');
        if (_token && _token['x-qm-devops-token']) {
            if (config.headers) {
                config.headers['x-qm-devops-token'] = _token['x-qm-devops-token'];
            } else {
                config.headers = {
                    'x-qm-devops-token': options.authenticationScheme ? `${options.authenticationScheme} ${_token['x-qm-devops-token']}` : _token['x-qm-devops-token'],
                };
            }
        }
        return config;
    }
    function setTokenToLs(join: boolean, res:AxiosResponse<any>) {
        if (!join) {
            return;
        }
        if (res.headers['x-qm-devops-token']) {
            ls.set('qm_token', {
                'x-qm-devops-token': res.headers['x-qm-devops-token'],
            });
        }
    }
    return {
        setTokenToHeader, setTokenToLs,
    };
}
