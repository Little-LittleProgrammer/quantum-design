/**
 * Data processing class, can be configured according to the project
 */
import type { InternalAxiosRequestConfig, AxiosResponse, AxiosInstance, AxiosHeaders } from 'axios';
import type { RequestOptions } from './interface';

export interface CreateAxiosOptions extends InternalAxiosRequestConfig {
    authenticationScheme?: string;
    customTransform?: CustomAxiosTransform;
    defaultTransform?: AxiosTransform;
    requestOptions?: RequestOptions;
}

export interface AxiosResponseAgent<T=any> extends AxiosResponse<T> {
    config: SelectPartial<InternalAxiosRequestConfig, 'url'> & {
        headers: AxiosHeaders
    }
}

export abstract class CustomAxiosTransform {
    // 自定义拦截器
    customRequest?: (config:InternalAxiosRequestConfig) => InternalAxiosRequestConfig; // 自定义请求拦截
    customResponse?: (config:AxiosResponse<any>) => AxiosResponse<any>; // 自定义错误响应拦截
    customRequestError?: (error:Error) => void; // 自定义错误请求拦截
    customResponseError?: (error:Error) => void; // 自定义错误响应拦截
}

export abstract class AxiosTransform {
    // /**
    //  * @description: Process configuration before request
    //  * @description: Process configuration before request
    //  */
    beforeRequestHook?: (config: InternalAxiosRequestConfig, options: RequestOptions) => InternalAxiosRequestConfig;

    // /**
    //  * @description: Request successfully processed
    //  */
    // transformRequestHook?: (res: AxiosResponse<Result>, options: RequestOptions) => any;

    // /**
    //  * @description: 请求失败处理
    //  */
    // requestCatchHook?: (e: Error, options: RequestOptions) => Promise<any>;

    /**
     * @description: 请求之前的拦截器
     */
    requestInterceptors?: (
        config: InternalAxiosRequestConfig,
        options: CreateAxiosOptions
    ) => InternalAxiosRequestConfig;

    /**
     * @description: 请求之后的拦截器
     */
    responseInterceptors?: (res: AxiosResponseAgent<any>, options: CreateAxiosOptions) => AxiosResponse<any>;

    /**
     * @description: 请求之前的拦截器错误处理
     */
    requestInterceptorsCatch?: (error: Error, options: CreateAxiosOptions) => void;

    /**
     * @description: 请求之后的拦截器错误处理
     */
    responseInterceptorsCatch?: (error: Error, options: CreateAxiosOptions, axiosInstance: AxiosInstance) => void;
}
