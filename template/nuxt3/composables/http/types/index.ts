import { AsyncData, UseFetchOptions } from "nuxt/app";

export type ErrorMessageMode = 'none' | 'modal' | 'message' | undefined;

export interface RequestOptions {
    // 是否返回原生的response
    isReturnNativeResponse?: boolean;
    // 接口前缀
    joinPrefix?: boolean;
    // 接口地址
    apiUrl?: string;
    urlPrefix?: string;
    // 错误提示方式 default: 'message'
    errorMessageMode?: ErrorMessageMode;
    // 是否携带时间戳
    joinTime?: boolean;
    cancelToken?: boolean;
    joinCookie?:boolean;
    uploadUrl?:string;
    env?: () =>string;
    // 是否在header中携带token
    withToken?: boolean;
    [key: string]: any
}

export interface IHttpOptions<T = any> extends UseFetchOptions<T> {
    requestOptions?: RequestOptions
}

export interface IFetchRequest<Req extends UseFetchOptions<any>['params']> {
    url: string | (() => string);
    params?: Req
}

export type IFetchRes = <Req extends UseFetchOptions<any>['params'] , Res = any>(config: IFetchRequest<Req>) => Promise<AsyncData<Result<Res>, Error | null>>
export type IUploadFetchRes = <Req extends UseFetchOptions<any>['params']>(config: IFetchRequest<Req>, params: UploadFileParams) => Promise<AsyncData<any, Error | null>>

// 
export type IUseCustomFetch = (options?: IHttpOptions<any>) => {
    get: IFetchRes,
    post: IFetchRes,
    upload: IUploadFetchRes
}