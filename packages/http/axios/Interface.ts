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
    [key: string]: any
    // 是否在header中携带token
    withToken?: boolean;
    // 请求重试机制, 暂未实现
    retryRequest?: RetryRequest;
}

export interface RetryRequest {
    isOpenRetry: boolean;
    count: number;
    waitTime: number;
}
