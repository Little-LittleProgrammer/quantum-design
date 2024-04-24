# 数据联调

## 开发环境

如果前端应用和后端接口服务器没有运行在同一个主机上，你需要在开发环境下将接口请求代理到接口服务器。

如果是同一个主机，可以直接请求具体的接口地址。

### 配置

开发环境时候，接口地址在项目根目录下

[.env.development](https://github.com/anncwb/vite-project/tree/main/.env.development) 文件配置

```bash
# vite 本地跨域代理
VITE_PROXY=[["/api","https://xxx.test.com"]]
# 接口地址通用前缀
VITE_GLOB_API_URL=/manage
```

::: tip

- .env 文件中的字段如果是字符串，则无需加引号，默认全部为字符串
- VITE_PROXY 不能换行

:::

### 跨域处理

如果你在 `src/api/` 下面的接口为下方代码，且 **.env.development** 文件配置如下注释，则在控制台看到的地址为 `https://xxx.test.com/api/manage/auth/index`。

由于 `/api` 匹配到了设置的 `VITE_PROXY`，所以上方实际是请求 **https://xxx.test.com/manage//auth/index**，这样同时也解决了跨域问题。

### 跨域原理解析

在 `vite.config.ts` 配置文件中，提供了 server 的 proxy 功能，用于代理 API 请求。

```ts
server: {
  proxy: {
    "/api":{
      target: 'https://xxx.test.com',
      changeOrigin: true,
      ws: true,
      rewrite: (path) => path.replace(new RegExp(`^/api`), ''),
    }
  },
},
```

::: tip 注意

从浏览器控制台的 Network 看，请求是 `https://xxx.test.com/api/xxx`，这是因为 proxy 配置不会改变本地请求的 url。

:::

## 生产环境

生产环境接口地址在项目根目录下 [.env.production]() 文件配置。


生产环境接口地址值需要修改 **VITE_GLOB_API_URL**

如果出现跨域问题，可以使用 nginx 或者后台开启 cors 进行处理, 或者前段处理

::: tip 打包后如何进行地址修改?

**VITE_GLOB\_\*** 开头的变量会在打包的时候注入 **\_app.config.js** 文件内。

在 **dist/\_app.config.js** 修改相应的接口地址后刷新页面即可，不需要在根据不同环境打包多次，一次打包可以用于多个不同接口环境的部署。

:::

## 接口请求

> 进行了特别复杂的封装, 使代码更加模块化, 参考了vben项目

在 vite-project 中:

1. 页面交互操作；
2. 调用统一管理的 api 请求函数；
3. 使用封装的 axios.ts 发送请求；
4. 获取服务端返回数据
5. 更新 data；

接口统一存放于 [src/api/](https://github.com/anncwb/vite-project/tree/main/src/api) 下面管理

以菜单为例:

在 **src/api/** 内新建模块文件，其中参数与返回值最好定义一下类型，方便校验。虽然麻烦，但是后续维护字段很方便。

::: tip

类型定义文件可以抽取出去统一管理，具体参考项目

:::

```ts
import { IMenuData } from '#/router';
import { defHttp } from '@/http/axios';

enum Api {
    authList = '/auth/index',
}

// 角色-列表
export function api_manage_auth_list() {
    return defHttp.get<Result<Record<'table_list', IMenuData[]>>>({url: Api.authList});
}
```

## axios 配置

**axios** 请求封装存放于 [src/http/axios]() 文件夹内部

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

```ts
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
        // 消息提示类型
        errorMessageMode: 'message',
        // 接口地址
        apiUrl: import.meta.env.VITE_GLOB_API_URL,
        //  是否加入时间戳
        joinTime: true,
        // 是否在请求中加入环境参数
        joinEnv: true,
        // 忽略重复请求
        cancelToken: true
    }
});
```

**transform 数据处理说明**

类型定义，见 **axiosTransform.ts** 文件

```js
export abstract class AxiosTransform {
  /**
   * @description: 请求之前处理配置
   */
  beforeRequestHook?: (config: AxiosRequestConfig, options: RequestOptions) => AxiosRequestConfig;
  /**
   * @description: 请求之前的拦截器
   */
  requestInterceptors?: (config: AxiosRequestConfig) => AxiosRequestConfig;

  /**
   * @description: 请求之后的拦截器
   */
  responseInterceptors?: (res: AxiosResponse<any>) => AxiosResponse<any>;

  /**
   * @description: 请求之前的拦截器错误处理
   */
  requestInterceptorsCatch?: (error: Error) => void;

  /**
   * @description: 请求之后的拦截器错误处理
   */
  responseInterceptorsCatch?: (error: Error) => void;
}
```

### 更改参数格式

项目接口默认为 Json 参数格式，即 `headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED }`,

如果需要更改为 `json` 格式，更改 headers 的 `'Content-Type` 为 `ContentTypeEnum.JSON` 即可

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

### 删除请求 URL 携带的时间戳参数

如果不需要 url 上面默认携带的时间戳参数 `?t=xxx`

```ts
export const defHttp = createAxios({
  requestOptions: {
    // 是否加入时间戳
    joinTime: false,
  },
});
```

### 删除请求 URL 携带的环境参数

如果不需要 url 上面默认携带的环境参数 `?env=xxx`

```ts
export const defHttp = createAxios({
  requestOptions: {
    // 是否加入时间戳
    joinEnv: false,
  },
});
```

## Mock 服务

开发中

<!-- Mock 数据是前端开发过程中必不可少的一环，是分离前后端开发的关键链路。通过预先跟服务器端约定好的接口，模拟请求数据甚至逻辑，能够让前端开发独立自主，不会被服务端的开发进程所阻塞。

本项目使用 [vite-plugin-mock](https://github.com/anncwb/vite-plugin-mock) 来进行 mock 数据处理。**项目内 mock 服务分本地和线上**。

### 本地 Mock

本地 mock 采用 Node.js 中间件进行参数拦截（不采用 mock.js 的原因是本地开发看不到请求参数和响应结果）。

#### 如何新增 mock 接口

如果你想添加 mock 数据，只要在根目录下找到 mock 文件，添加对应的接口，对其进行拦截和模拟数据。

在 mock 文件夹内新建文件

::: tip

文件新增后会自动更新，不需要手动重启，可以在代码控制台查看日志信息 mock 文件夹内会自动注册，排除以\_开头的文件夹及文件

:::

例:

```ts
import { MockMethod } from 'vite-plugin-mock';
import { resultPageSuccess } from '../_util';

const demoList = (() => {
  const result: any[] = [];
  for (let index = 0; index < 60; index++) {
    result.push({
      id: `${index}`,
      beginTime: '@datetime',
      endTime: '@datetime',
      address: '@city()',
      name: '@cname()',
      'no|100000-10000000': 100000,
      'status|1': ['正常', '启用', '停用'],
    });
  }
  return result;
})();

export default [
  {
    url: '/api/table/getDemoList',
    timeout: 1000,
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 20 } = query;
      return resultPageSuccess(page, pageSize, demoList);
    },
  },
] as MockMethod[];
```

::: tip

mock 的值可以直接使用 [mockjs](https://github.com/nuysoft/Mock/wiki) 的语法。

:::

#### 接口格式

```ts
{
  url: string; // mock 接口地址
  method?: MethodType; // 请求方式
  timeout?: number; // 延时时间
  statusCode: number; // 响应状态码
  response: ((opt: { // 响应结果
      body: any;
      query: any;
  }) => any) | object;
}
```

#### 参数获取

**GET 接口：**` ({ query }) => { }`

**POST 接口：**` ({ body }) => { }`

#### util 说明

可在 [代码](https://github.com/anncwb/vite-project/tree/main/mock/_util.ts) 中查看

::: tip

util 只作为服务处理结果数据使用。可以不用，如需使用可自行封装，需要将对应的字段改为接口的返回结构

:::

#### 匹配

在 `src/api` 下面，如果接口匹配到 mock，则会优先使用 mock 进行响应

```ts
import { defHttp } from '/@/utils/http/axios';
import { LoginParams, LoginResultModel } from './model/userModel';

enum Api {
  Login = '/login',
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams) {
  return defHttp.request<LoginResultModel>(
    {
      url: Api.Login,
      method: 'POST',
      params,
    },
    {
      errorMessageMode: 'modal',
    }
  );
}
// 会匹配到上方的
export default [
  {
    url: '/api/login',
    timeout: 1000,
    method: 'POST',
    response: ({ body }) => {
      return resultPageSuccess({});
    },
  },
] as MockMethod[];
```

#### 接口有了，如何去掉 mock

当后台接口已经开发完成，只需要将相应的 mock 函数去掉即可。

以上方接口为例，假如后台接口 login 已经开发完成，则只需要删除/注释掉下方代码即可

```ts
export default [
  {
    url: '/api/login',
    timeout: 1000,
    method: 'POST',
    response: ({ body }) => {
      return resultPageSuccess({});
    },
  },
] as MockMethod[];
```

### 线上 mock

由于该项目是一个展示类项目，线上也是用 mock 数据，所以在打包后同时也集成了 mock。通常项目线上一般为正式接口。

项目线上 mock 采用的是 [mockjs](https://github.com/nuysoft/Mock/wiki) 进行 mock 数据模拟。

#### 线上如何开启 mock

::: warning 注意

线上开启 mock 只适用于一些简单的示例网站及预览网站。**一定不要在正式的生产环境开启！！！**

:::

1. 修改 .env.production 文件内的 `VITE_USE_MOCK` 的值为 true

```ts
VITE_USE_MOCK = true;
```

2. 在 [mock/\_createProductionServer.ts](https://github.com/anncwb/vite-project/tree/main/mock/_createProductionServer.ts) 文件中引入需要的 mock 文件

```ts
import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer';

const modules = import.meta.globEager('./**/*.ts');

const mockModules: any[] = [];
Object.keys(modules).forEach((key) => {
  if (key.includes('/_')) {
    return;
  }
  mockModules.push(...modules[key].default);
});

export function setupProdMockServer() {
  createProdMockServer(mockModules);
}
```

3. 在 [build/vite/plugin/mock.ts](https://github.com/anncwb/vite-project/tree/main/build/vite/plugin/mock.ts) 里面引入

```ts
import { viteMockServe } from 'vite-plugin-mock';

export function configMockPlugin(isBuild: boolean) {
  return viteMockServe({
    injectCode: `
      import { setupProdMockServer } from '../mock/_createProductionServer';

      setupProdMockServer();
      `,
  });
}
```

::: tip 为什么通过插件注入代码而不是直接在 main.ts 内插入

在插件内通过 `injectCode` 插入代码，方便控制 mockjs 是否被打包到最终代码内。如果在 main.ts 内判断，如果关闭了 mock 功能，mockjs 也会打包到构建文件内，这样会增加打包体积。

:::

到这里线上 mock 就配置完成了。线上与本地差异不大，比较大的区别是线上在控制台内看不到接口请求日志。 -->
