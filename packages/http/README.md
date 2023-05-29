# @wuefront/shared

目的: 为所有项目提供通讯工具


## 使用方法

```js
import {createAxios} from '@wuefront/http';

export const defHttp = createAxios(option: CreateAxiosOptions);
```

## config
可配置参数, 
```js
interface CreateAxiosOptions {
    authenticationScheme: string, // token前缀, 例子: Bearer token
    timeout: number, // 超时时间
    headers: Record<string, any>, // 自定义header
    customTransform: {
        // 自定义拦截器
        customRequest?: (config:AxiosRequestConfig) => AxiosRequestConfig; // 自定义请求拦截
        customResponse?: (config:AxiosResponse<any>) => AxiosResponse<any>; // 自定义错误响应拦截
        customRequestError?: (error:Error) => void; // 自定义错误请求拦截
        customResponseError?: (error:Error) => void; // 自定义错误响应拦截
    },
    requestOptions :{
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
}
```