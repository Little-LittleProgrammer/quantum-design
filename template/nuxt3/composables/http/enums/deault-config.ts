import { gContentTypeEnum, gResultEnum } from "@q-front-npm/shared";
import { IHttpOptions, RequestOptions } from "../types";
import { UseFetchOptions } from "nuxt/app";
import { check_status } from "../utils/check-status";
import { js_is_function } from "@q-front-npm/utils";

export const defaultRequestOptions: RequestOptions = {
    // 默认将prefix 添加到url
    joinPrefix: true,
    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
    isReturnNativeResponse: false,
    //  是否加入时间戳
    joinTime: true,
    // 是否在请求中加入环境参数
    env: () => '',
    // 是否加入cokie
    // joinCookie: true,
    // 忽略重复请求
    cancelToken: true,
    // 是否携带token
    withToken: true,
    // 消息提示类型
    errorMessageMode: 'message',
    // 接口地址
    apiUrl: '',
    uploadUrl: '',
    // 接口拼接地址
    urlPrefix: 'api'
}
export const defaultHeader = {
    'Content-Type': gContentTypeEnum.JSON
}

export const transform = (data?: any): UseFetchOptions<any>=> {
    return {
        onRequest: ({options}) => {
            const _options = options as IHttpOptions
            const params: Record<string, any> = {}
            if (_options.requestOptions?.joinTime) {
                params.t = new Date().getTime()
            }
            if (_options.requestOptions?.env && js_is_function(_options.requestOptions.env)) {
                params.env = _options.requestOptions.env()
            }
            if (options.method === 'POST') {
                options.body = { ...data };
                options.query = params;
            } else {
                options.query = Object.assign(params, { ...data });
            }
        },
        onRequestError: (ctx) => {
            const { error, response, options} = ctx
            const _options = options as IHttpOptions
            if (error && response) {
                check_status(response.status+ '', '连接错误', _options.requestOptions?.errorMessageMode || 'message');
            } else {
                check_status('400', '连接到服务器失败', _options.requestOptions?.errorMessageMode || 'message');
            }
            return Promise.reject(response);
        },
        onResponse(ctx) {
            const { error, response, options} = ctx
            const _options = options as IHttpOptions
            if (response._data.code == gResultEnum.NOTFOUND){
                location.replace('/backend/error');
            } else if (response._data.code == gResultEnum.ERROR){
                check_status('400', response._data.msg, _options.requestOptions?.errorMessageMode || 'message');
            } else if (response._data.code == gResultEnum.SERVERERROR){
                check_status('400', response._data.msg, _options.requestOptions?.errorMessageMode || 'message');
            } else if (response._data.code == gResultEnum.RELOAD){
                // setTokenToLs(options.requestOptions?.withToken || true, res);
                // window.location.reload();
            } else if (response._data.code == gResultEnum.LOGIN){
                // window.location.href = response._data.data?.url;
            } else if (response._data.code == gResultEnum.TIMEOUT) {
                check_status('408', '', _options.requestOptions?.errorMessageMode || 'message');
            }
        },
        onResponseError(ctx) {
            const { error, response, options} = ctx
            const _options = options as IHttpOptions
            if (error && response) {
                check_status(response?.status + '', '连接错误', _options.requestOptions?.errorMessageMode || 'message');
            } else if (error && (error as any)?.code === 'ERR_CANCELED') {
                // 如果手动取消, 不予受理
                console.log('请求重复, 手动取消请求');
            } else {
                check_status('400', '连接到服务器失败', _options.requestOptions?.errorMessageMode || 'message');
            }
        }
    }
}



export const defaultHttp: IHttpOptions = {
    headers: defaultHeader,
    timeout: 60 * 1000, 
    requestOptions: defaultRequestOptions
}