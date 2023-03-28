# 服务端接口

## 建议目录格式

```
├── [project]  # 具体服务
│   ├── interface.ts # 接口文件
│   ├── index.ts # api文件
```
1. 将 接口文件 和 http请求文件分离, 可以更加的清晰
2. 将所有的请求和响应结果声明类型, 和服务端类型保持一致
3. 注意相同接口可以提出来, 用extends继承实现

## 例子

```js
// interface.ts
export interface IDashboardSelect {
    /**
     * 渠道-图表维度
     * ISelectOption为全局类型, 不需要再次声明
     */
    channel_chart_field_list?: ISelectOption[];
    /**
     * 媒体
     */
    media_list?: ISelectOption[];
}
```

```js
// index.ts
import { defHttp } from '@/http/axios';
import { IDashboardSelect } from './interface';


export function api_get_dashboard_select() {
    /**
     * Result<T = any> {
        code: number;
        data: T;
        msg: string;
    }
     */
    return defHttp.get<Result<IDashboardSelect>>({
        url: Api.dashboardSelect
    });
}
```