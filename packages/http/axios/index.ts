// axios配置  可自行根据项目进行更改，只需更改该文件即可，其他文件可以不动
// The axios configuration can be changed according to the project, just change the file, other files can be left unchanged

import type { AxiosResponse } from 'axios';
import type { AxiosTransform, CreateAxiosOptions } from './axios-transform';
import { VAxios } from './axios';
import { check_status } from './check-status';
import {
    gContentTypeEnum,
    gRequestEnum,
    gResultEnum
} from '@quantum-design/shared/enums';
import {
    js_utils_deep_merge,
    isString,
    isService
} from '@quantum-design/utils';
import {
    joinTimestamp,
    joinEnvToUrl,
    joinCookieToUrl,
    dealToken
} from './helper';
import { AxiosRetry } from './axios-retry';

const { setTokenToHeader, setTokenToLs, } = dealToken();

/**
 * @description: 数据处理，方便区分多种处理方式
 */
export const defaultTransform: AxiosTransform = {
    /**
     * 发送请求前
     * @param config
     * @param options
     */
    beforeRequestHook: (config, options) => {
        const { apiUrl, urlPrefix, joinTime = true, env = () => '', joinPrefix, joinCookie = true, } = options;
        const params = config.params || {};
        const data = config.data || false;

        if (!(config.url?.match(/^http/) != null || config.url?.match(/^\/\//) != null)) {
            if (joinPrefix) {
                config.url = `${urlPrefix}${config.url}`;
            }
            if (apiUrl && isString(apiUrl)) {
                config.url = `${apiUrl}${config.url}`;
            }
        }

        // 处理时间戳
        if (config.method?.toUpperCase() === gRequestEnum.GET) {
            if (!isString(params)) {
                // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
                config.params = Object.assign(params || {}, joinEnvToUrl(env, false), joinTimestamp(joinTime, false), joinCookieToUrl(joinCookie, false));
            } else {
                // 兼容restful风格
                config.url = config.url + params + '?' + `${joinTimestamp(joinTime, true)}&` + `${joinEnvToUrl(env, true)}&` + `${joinCookieToUrl(joinCookie, true)}`;
                config.params = undefined;
            }
        } else {
            if (!isString(params)) {
                config.url = config.url + (config.url?.includes('?') ? '&' : '?') + `${joinTimestamp(joinTime, true)}&` + `${joinEnvToUrl(env, true)}&` + `${joinCookieToUrl(joinCookie, true)}`;
                if (Reflect.has(config, 'data') && config.data && Object.keys(config.data).length > 0) {
                    config.data = Object.assign(data || {}, joinEnvToUrl(env, false));
                    config.params = params;
                } else {
                    // 非GET请求如果没有提供data，则将params视为data
                    config.data = Object.assign(params || {}, joinEnvToUrl(env, false));
                    config.params = undefined;
                }
            } else {
                // 兼容restful风格
                config.url = config.url + params + '?' + `${joinTimestamp(joinTime, true)}&` + `${joinCookieToUrl(joinCookie, true)}`;
                config.params = undefined;
                config.data = joinEnvToUrl(env, true);
            }
        }
        return config;
    },
    /**
     * @description: 请求拦截器处理
     */
    requestInterceptors: (config, options) => {
        if (options.customTransform && options.customTransform.customRequest) {
            config = options.customTransform.customRequest(config);
        }
        config = setTokenToHeader(options, config);
        return config;
    },

    /**
     * @description: 请求拦截器错误处理
     * @param error
     */
    requestInterceptorsCatch: (error: any, options) => {
        if (options.customTransform && options.customTransform.customRequestError) {
            options.customTransform.customRequestError(error);
        }
        if (error && error.response) {
            check_status(error.response?.status, '连接错误', error.config?.requestOptions?.errorMessageCb);
        } else {
            check_status('400', '连接到服务器失败', error.config?.requestOptions?.errorMessageCb);
        }
        return Promise.reject(error.response);
    },

    /**
     * @description: 响应拦截器处理
     */
    responseInterceptors: (res: AxiosResponse<any>, options) => {
        console.log(res, options);
        if (options.customTransform && options.customTransform.customResponse) {
            res = options.customTransform.customResponse(res);
        }
        setTokenToLs(!!options.requestOptions?.withToken, res);
        if (res.data.errors && res.data.errors.code) {
            res.data.code = res.data.errors.code;
            res.data.msg = res.data.errors.title;
        }
        if (res.data.code == gResultEnum.RELOAD) {
            setTokenToLs(options.requestOptions?.withToken || true, res);
            if (!isService) {
                window.location.reload();
            } 
            return res;
        } else if (res.data.code == gResultEnum.LOGIN) {
            if (!isService) {
                window.location.href = res.data.data?.url;
            }
            return res;
        } else if (res.data.code == gResultEnum.NOTFOUND) {
            location.replace(options.requestOptions?.errorPage || '/backend/error');
            return res;
        }
        if (options.requestOptions?.useServiceMsg && res.data.code != gResultEnum.SUCCESS) {
            check_status('400', res.data.msg, options.requestOptions?.errorMessageCb);
        } else if (res.data.code == gResultEnum.ERROR) {
            check_status('400', res.data.msg, options.requestOptions?.errorMessageCb);
        } else if (res.data.code == gResultEnum.SERVERERROR) {
            check_status('400', res.data.msg, options.requestOptions?.errorMessageCb);
        } else if (res.data.code == gResultEnum.TIMEOUT) {
            check_status('408', '', options.requestOptions?.errorMessageCb);
        }
        return res;
    },

    /**
     * @description: 响应错误处理
     */
    responseInterceptorsCatch: (error: any, options, axiosInstance) => {
        if (options.customTransform && options.customTransform.customResponseError) {
            options.customTransform.customResponseError(error);
        }

        const err: string = error?.toString?.() ?? '';
        let errMsg = '';
        if (err?.includes('Network Error')) {
            errMsg = '网络异常，请检查您的网络连接后重试。';
        } else if (error?.message?.includes?.('timeout')) {
            errMsg = '请求超时，请稍后再试。';
        }
        if (errMsg) {
            check_status('400', errMsg, options.requestOptions?.errorMessageCb);
            return Promise.reject(error);
        }

        if (error && error.response) {
            check_status(error.response?.status, '连接错误', options.requestOptions?.errorMessageCb);
        } else if (error.code === 'ERR_CANCELED') {
            // 如果手动取消, 不予受理
            console.log('请求重复, 手动取消请求');
            return Promise.resolve(error);
        } else {
            check_status('400', '连接到服务器失败', options.requestOptions?.errorMessageCb);
        }

        // 添加自动重试机制
        const retry = new AxiosRetry();
        const { isOpenRetry, } = options.requestOptions?.retryRequest || {};
        // 重试请求只针对get
        if (error && error.config?.method && error.config?.method?.toUpperCase() === gRequestEnum.GET) {
            if (isOpenRetry) {
                retry.retry(axiosInstance, error);
            }
        }
        return Promise.reject(error.response ? error.response : error);
    },
};

export function createAxios(opt?: Omit<Partial<CreateAxiosOptions>, 'defaultTransform'>) {
    return new VAxios(
        js_utils_deep_merge(
            {
                // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#authentication_schemes
                // authentication schemes，e.g: Bearer
                // authenticationScheme: 'Bearer',
                authenticationScheme: '',
                timeout: 60 * 1000,
                headers: { 'Content-Type': gContentTypeEnum.FORM_URLENCODED, },
                defaultTransform,
                customTransform: {},
                // 配置项，下面的选项都可以在独立的接口请求中覆盖
                requestOptions: {
                    // 默认将prefix 添加到url
                    joinPrefix: true,
                    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
                    isReturnNativeResponse: false,
                    //  是否加入时间戳
                    joinTime: true,
                    // 是否在请求中加入环境参数
                    env: () => '',
                    // 是否加入cokie
                    joinCookie: true,
                    // 忽略重复请求
                    cancelToken: true,
                    // 是否携带token
                    withToken: true,
                    // 接口地址
                    apiUrl: '',
                    uploadUrl: '',
                    // 接口拼接地址
                    urlPrefix: 'api',
                    // 重试机制
                    retryRequest: {
                        isOpenRetry: false,
                        count: 5,
                        waitTime: 100,
                    },
                    errorPage: '/backend/error',
                },
            },
            opt || {}
        )
    );
}


// other api url
// export const otherHttp = createAxios({
//   requestOptions: {
//     apiUrl: 'xxx',
//   },
// });
