
# axios 配置

## 版本
 本目录主要是提供公共的http方法
- npm包名称 `@quantum-design/http`
- 当前版本: 1.0.2

## 方法

二次封装的 `axios` 暴露出了 4个方法

```js
export declare abstract class CustomAxiosTransform {
    customRequest?: (config: AxiosRequestConfig) => AxiosRequestConfig; // 自定义请求拦截
    customResponse?: (config: AxiosResponse<any>) => AxiosResponse<any>; // 自定义相应拦截
    customRequestError?: (error: Error) => void; // 自定义请求错误拦截
    customResponseError?: (error: Error) => void; // 自定义相应错误拦截
}
```

除 `index.ts` 文件内容需要根据项目自行修改外，其余文件无需修改

```js

├── index.ts // 引用二次封装的asiox

```

### 使用案例
```js

enum Api {
    roleList = '/manage/role/index'
}
export interface IRoleAuths {
    id:string;
    init_auth_id: string;
    init_auth_name: string;
    remark: string;
    role_name: string
}

// 角色-列表
export function api_manage_role_list() {
    return defHttp.get<Result<Record<'table_list', IRoleAuths[]>>>({url: Api.roleList});
}
```

### index.ts 配置说明

::: details 点击展开代码
```ts
// 以下是默认配置
export const defHttp = createAxios({
    timeout: 10 * 1000,
    customTransform: {
        customRequest: custom_request,
        customRequestError: custom_request_error,
        customResponse: custom_response,
        customResponseError: custom_response_error
    },
    headers: {'Content-Type': ContentTypeEnum.JSON},
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
        // 消息提示类型
        errorMessageMode: 'message',
        // 接口地址
        apiUrl: '',
        uploadUrl: '',
        // 接口拼接地址
        urlPrefix: 'api'
    }
});
```
:::

### 多个接口地址

当项目中需要用到多个接口地址时, 可以在 [src/utils/http/axios/index.ts](https://github.com/anncwb/vite-project/tree/main/src/utils/http/axios/index.ts) 导出多个 axios 实例

```ts
// 目前只导出一个默认实例，接口地址对应的是环境变量中的 VITE_GLOB_API_URL 接口地址
export const defHttp = createAxios();

// 需要有其他接口地址的可以在后面添加

// other api url
export const otherHttp = createAxios({
  requestOptions: {
    apiUrl: 'xxx',
  },
});
```

