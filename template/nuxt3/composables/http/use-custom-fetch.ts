import { js_is_function, js_utils_deep_merge } from "@q-front-npm/utils";
import type { UseFetchOptions } from "nuxt/app";
import type { IFetchRequest, IHttpOptions, IUseCustomFetch, RequestOptions } from "./types";
import { defaultHttp, transform } from "./enums/deault-config";
import { gContentTypeEnum } from "@q-front-npm/shared";



function before_request(config: IFetchRequest<any>, requestOptions: RequestOptions) {
    if (requestOptions?.joinPrefix && requestOptions.urlPrefix) {
        config.url = requestOptions.urlPrefix + config.url
    }
}

export const useCustomFetch: IUseCustomFetch = (options?: IHttpOptions<any>) => {
    const {public: _appConfig} = useRuntimeConfig();
    const _requestOptions = defaultHttp.requestOptions || {};
    _requestOptions.urlPrefix = _appConfig.apiPrefix
    options = js_utils_deep_merge(defaultHttp, {
        requestOptions: _requestOptions,
        baseURL: _appConfig.baseRemoteUrl,
        ...options,
    });
    const defaultTransform: UseFetchOptions<any> = {
        ...options
    }
    return {
        get: (config) => {
            before_request(config, _requestOptions)
            return useFetch(config.url, {
                ...defaultTransform,
                ...transform(config.params),
                method: 'GET'
            })
        },
        post: (config) => {
            before_request(config, _requestOptions)
            return useFetch(config.url, {
                ...defaultTransform,
                ...transform(config.params),
                method: 'POST'
            })
        },
        upload: (config, params) => {
            const formData = new window.FormData();
            if (params.data) {
                Object.keys(params.data).forEach((key) => {
                    if (!params.data) return;
                    const value = params.data[key];
                    if (Array.isArray(value)) {
                        value.forEach((item) => {
                            formData.append(`${key}[]`, item);
                        });
                        return;
                    }
                    formData.append(key, params.data[key]);
                });
            }
            formData.append(params.name || 'file', params.file, params.filename);
            const customParams = {...params};
            Reflect.get(customParams, 'file') && Reflect.deleteProperty(customParams, 'file')
            Reflect.get(customParams, 'filename') && Reflect.deleteProperty(customParams, 'filename')

            Object.keys(customParams).forEach((key) => {
                formData.append(key, customParams[key]);
            });

            const uploadUrl = _requestOptions?.uploadUrl ? _requestOptions?.uploadUrl : '';
            let url = uploadUrl + '' + config.url ;
            if (_requestOptions?.env && js_is_function(_requestOptions.env)) {
                url  += '?' + _requestOptions.env()
            }
            const opt: RequestOptions = Object.assign({}, _requestOptions || {}, {
                cancelToken: false
            });

            const _option = {
                url: config.url,
                method: 'POST' as 'POST',
                body: formData,
                headers: {
                    'Content-type': gContentTypeEnum.FORM_DATA
                },
                requestOptions: opt
            };
            return useFetch(url, {
                ..._option
            })
        }
    }
}

