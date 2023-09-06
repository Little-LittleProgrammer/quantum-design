import { js_create_local_storage, js_is_function } from '@q-front-npm/utils';

/**
 * @description 添加时间戳
 * @param join 是否添加
 * @param restful 添加方式
 */
export function joinTimestamp(join: boolean): string | Recordable<string> {
    if (!join) {
        return  {};
    }
    const now = new Date().getTime() + '';
    return { t: now };
}

/**
 * @description: 添加环境变量
 */

export function joinEnvToUrl(env: ()=>string): string | Recordable<string> {
    if (!env || !js_is_function(env)) {
        return {};
    }
    return { env: env()};
}

/**
 * @description: 添加cookie
 */

export function joinCookieToUrl(join: boolean): string | Recordable<string> {
    if (!join) {
        return {};
    }
    const _cookie = document.cookie;
    const _cookieObj:any = {};
    _cookie.split(';').forEach(item => {
        const _key = item.split('=')[0];
        const _value = item.split('=')[1];
        _cookieObj[_key] = _value;
    });
    return { qm_csrf_backend: _cookieObj['qm_csrf_backend']};
}

/**
 * @description: 添加token
 */

// export function dealToken() {
//     const ls = js_create_local_storage();
//     function setTokenToHeader(options: CreateAxiosOptions, config: AxiosRequestConfig<any>) {
//         const {withToken = true } = options.requestOptions!;
//         if (!withToken) {
//             return config;
//         }
//         const _token = ls.get('qm_token');
//         if (_token && _token['x-qm-devops-token']) {
//             if (config.headers) {
//                 config.headers['x-qm-devops-token'] = _token['x-qm-devops-token'];
//             } else {
//                 config.headers = {
//                     'x-qm-devops-token': options.authenticationScheme ? `${options.authenticationScheme} ${_token['x-qm-devops-token']}` : _token['x-qm-devops-token']
//                 };
//             }
//         }
//         return config;
//     }
//     function setTokenToLs(join: boolean, res:AxiosResponse<any>) {
//         if (!join) {
//             return;
//         }
//         if (res.headers['x-qm-devops-token']) {
//             ls.set('qm_token', {
//                 'x-qm-devops-token': res.headers['x-qm-devops-token']
//             });
//         }
//     }
//     return {
//         setTokenToHeader, setTokenToLs
//     };
// }
