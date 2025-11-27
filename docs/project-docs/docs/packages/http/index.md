# axios 配置

## 版本

本目录主要是提供公共的 http 方法

- npm 包名称 `@quantum-design/http`
- 当前版本: **3.0.0** (基于Axios 1.11.0)

## 方法

二次封装的 `axios` 暴露出了增强的 API 支持

### 核心接口

```ts
export interface CustomAxiosTransform {
    customRequest?: (config: AxiosRequestConfig) => AxiosRequestConfig; // 自定义请求拦截
    customResponse?: (config: AxiosResponse<any>) => AxiosResponse<any>; // 自定义响应拦截
    customRequestError?: (error: Error) => void; // 自定义请求错误拦截
    customResponseError?: (error: Error) => void; // 自定义响应错误拦截
}

// v3.0.0 新增
export interface HttpConfigOptions {
    // 缓存配置
    cache?: {
        enabled: boolean;
        ttl: number; // 缓存生存时间（毫秒）
        keyGenerator?: (config: AxiosRequestConfig) => string;
    };

    // 重试配置
    retry?: {
        attempts: number; // 重试次数
        delay: number; // 重试延迟（毫秒）
        backoff: 'linear' | 'exponential'; // 退避策略
        retryCondition?: (error: AxiosError) => boolean;
    };

    // 超时配置
    timeout?: {
        connect: number; // 连接超时
        read: number; // 读取超时
    };

    // 熔断器配置
    circuitBreaker?: {
        failureThreshold: number; // 失败阈值
        resetTimeout: number; // 重置超时
    };
}
```

### v3.0.0 新增功能

#### 🚀 智能缓存

```ts
// 启用缓存配置
const http = createAxios({
    cache: {
        enabled: true,
        ttl: 5 * 60 * 1000, // 5分钟
        keyGenerator: (config) => `${config.method}-${config.url}-${JSON.stringify(config.params)}`,
    },
});
```

#### 🔄 增强重试机制

```ts
// 智能重试配置
const http = createAxios({
    retry: {
        attempts: 3,
        delay: 1000,
        backoff: 'exponential',
        retryCondition: (error) => {
            // 只在网络错误或5xx错误时重试
            return !error.response || error.response.status >= 500;
        },
    },
});
```

#### ⚡ 超时控制

```ts
// 精细化超时配置
const http = createAxios({
    timeout: {
        connect: 5000, // 5秒连接超时
        read: 10000, // 10秒读取超时
    },
});
```

#### 🛡️ 熔断器保护

```ts
// 熔断器配置
const http = createAxios({
    circuitBreaker: {
        failureThreshold: 5, // 连续5次失败后开启熔断
        resetTimeout: 30000, // 30秒后尝试恢复
    },
});
```

除 `index.ts` 文件内容需要根据项目自行修改外，其余文件无需修改

```js

├── index.ts // 引用二次封装的axios

```

### 使用案例

```ts
enum Api {
    roleList = '/manage/role/index',
}
export interface IRoleAuths {
    id: string;
    init_auth_id: string;
    init_auth_name: string;
    remark: string;
    role_name: string;
}

// 角色-列表 (v3.0.0 支持缓存)
export function api_manage_role_list(params?: { page?: number; size?: number }) {
    return defHttp.get<Result<Record<'table_list', IRoleAuths[]>>>({
        url: Api.roleList,
        params,
        cache: {
            enabled: true,
            ttl: 2 * 60 * 1000, // 2分钟缓存
        },
    });
}

// 带重试的API调用
export function api_with_retry() {
    return defHttp.post('/api/data', {
        retry: {
            attempts: 3,
            delay: 1000,
        },
    });
}
```

### 增强的配置说明

::: details 点击展开完整配置

```ts
// v3.0.0 完整配置示例
export const defHttp = createAxios({
    timeout: 10 * 1000,
    customTransform: {
        customRequest: custom_request,
        customRequestError: custom_request_error,
        customResponse: custom_response,
        customResponseError: custom_response_error,
    },
    headers: { 'Content-Type': ContentTypeEnum.JSON },
    requestOptions: {
        // 默认将prefix 添加到url
        joinPrefix: true,
        // 是否返回原生响应头 比如：需要获取响应头时使用该属性
        isReturnNativeResponse: false,
        //  是否加入时间戳
        joinTime: true,
        // 是否在请求中加入环境参数
        env: () => '',
        // 是否加入cookie
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
        urlPrefix: 'api',
    },
    // v3.0.0 新增配置
    cache: {
        enabled: true,
        ttl: 5 * 60 * 1000,
    },
    retry: {
        attempts: 3,
        delay: 1000,
        backoff: 'exponential',
    },
    timeout: {
        connect: 5000,
        read: 10000,
    },
    circuitBreaker: {
        failureThreshold: 5,
        resetTimeout: 30000,
    },
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
    cache: {
        enabled: true,
        ttl: 2 * 60 * 1000,
    },
});

// AI服务接口 (v3.0.0 新增)
export const aiHttp = createAxios({
    requestOptions: {
        apiUrl: 'https://ai-api.example.com',
    },
    timeout: {
        connect: 10000,
        read: 30000, // AI接口通常响应较慢
    },
    retry: {
        attempts: 2,
        delay: 2000,
    },
});
```

## 依赖升级

- **Axios**: 升级到 1.11.0，支持最新特性
- **TypeScript**: 完整类型支持，改进的类型推断
- **Performance**: 优化请求性能和内存使用
