
export interface RequestOptions {
    // 是否返回原生的response
    isReturnNativeResponse?: boolean;
    // 接口前缀
    joinPrefix?: boolean;
    // 接口地址
    apiUrl?: string;
    urlPrefix?: string;
    // 错误提示回调方法, 可用于错误时自定义弹框
    errorMessageCb?: (errCode: number, errMes: string) => void;
    // 是否携带时间戳
    joinTime?: boolean;
    cancelToken?: boolean;
    joinCookie?:boolean;
    uploadUrl?:string;
    env?: () =>string;
    [key: string]: any
    // 是否在header中携带token
    withToken?: boolean;
    // 请求重试机制
    retryRequest?: RetryRequest;
    useServiceMsg?: boolean;
    errorPage?: string
}

export interface RetryRequest {
    isOpenRetry: boolean;
    count: number;
    waitTime: number;
}
