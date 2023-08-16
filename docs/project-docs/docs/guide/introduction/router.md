# 路由

项目路由配置存放于 [src/router] 下面。 [src/router/modules]用于存放路由模块，在该目录下的文件会自动注册。

## 初始化

目录: [src/router/setup-router.ts]()

### 说明:
用于配置初始化时使用的功能
1. cancel_page_loading() : 页面切换时清楚loading
2. set_progress() : 设置进度条
3. create_http_guard() : 页面切换时, 取消已发送的但未成功的请求
4. flatten() : 格式化路由, 用于面包屑
5. create_permission_route 用于前端设置菜单

## 配置

### 模块说明

在 [src/router/modules]() 内的 `.ts` 文件会被视为一个路由模块。

一个路由模块包含以下结构

::: warning 注意事项

- 整个项目所有路由 `name` 不能重复, 且`name`必须和页面设置的`name`一直
- 所有路由格式必须带有以下属性, 方便面包屑与tab识别
```js
  interface IRoute{
    path: string;
    name: string;
    meta: {
        title: string;
        pid: string;
        id: string
    }
  }
```

:::

```ts
import type { RouteRecordRaw } from 'vue-router';
import { LAYOUT } from '@/router/base';

// 系统管理
const _router:RouteRecordRaw[] = [
    {
        path: '/backend/system-management',
        name: 'SystemManage',
        component: LAYOUT,
        meta: {
            title: '系统管理',
            pid: '0',
            id: 'system-management'
        },
        redirect: '/backend/system-management/permission',
        children: [
            {
                path: 'permission',
                name: 'Permission',
                component: () => import('@/views/system-management/permission/index.vue'),
                meta: {
                    title: '系统管理-权限管理',
                    pid: 'system-management',
                    id: 'permission'
                },
                redirect: '/backend/system-management/permission/menu-config',
                children: [
                    {
                        path: 'menu-config',
                        name: 'MenuConfig',
                        component: () => import('@/views/system-management/permission/menu-config.vue'),
                        meta: {
                            title: '系统管理-权限管理-菜单配置',
                            pid: 'permission',
                            id: 'menu-config'
                        }
                    }
                ]
            }
        ]
    }
];

export default _router;

```

### Meta 配置说明

```ts
export interface RouteMeta {
    pid: string,
    id: string,
    title: string,
    pathName?: string
}
```

<!-- ### 外部页面嵌套

只需要将 `frameSrc` 设置为需要跳转的地址即可

```ts
const IFrame = () => import('/@/views/sys/iframe/FrameBlank.vue');
{
  path: 'doc',
  name: 'Doc',
  component: IFrame,
  meta: {
    frameSrc: 'https://vvbin.cn/doc-next/',
    title: t('routes.demo.iframe.doc'),
  },
},
``` -->

<!-- ### 外链

只需要将 `path` 设置为需要跳转的**HTTP 地址**即可

```ts
{
  path: 'https://www.baidu.com',
  name: 'DocExternal',
  component: IFrame,
  meta: {
    title: '百度',
  },
}
``` -->

## 路由刷新

项目中采用的是**重定向**方式 与 **时间戳**方式

### 实现

```ts
import { useRedo } from '@wuefront/hooks/vue';
import { defineComponent } from 'vue';
export default defineComponent({
  setup() {
    const redo = useRedo();
    // 执行刷新
    redo();
    return {};
  },
});
```

### Redirect

[src/views/redirect/index.vue]()

```ts
import { defineComponent, unref } from 'vue';
import { useRouter } from 'vue-router';
export default defineComponent({
  name: 'Redirect',
  setup() {
    const { currentRoute, replace } = useRouter();
    const { params, query } = unref(currentRoute);
    const { path } = params;
    const _path = Array.isArray(path) ? path.join('/') : path;
    replace({
      path: '/' + _path,
      query,
    });
    return {};
  },
});
```

## 页面跳转

页面跳转建议采用项目提供的 `useGo`
- 原因: 项目全局配置了**左侧菜单栏是否可以重复点击**的功能 ,而此功能的实现是在`useGo`中

### 方式

```ts
import { useGo } from '@wuefront/hooks/vue';
import { defineComponent } from 'vue';
export default defineComponent({
  setup() {
    const go = useGo();

    // 执行刷新
    go();
    go({
      path: '',
      query: {}
    });
    return {};
  },
});
```

## 多标签页

标签页使用的是 `keep-alive` 和 `router-view` 实现，实现切换 tab 后还能保存切换之前的状态。

### 如何开启页面缓存

开启缓存有 3 个条件

1. 在 [src/enums/projectEnum.ts]() 内将`openKeepAlive` 设置为 `true`
2. 路由设置 `name`，且**不能重复**
3. 路由对应的组件加上 `name`，与路由设置的 `name` 保持一致
4. 使用keepalive

```ts
 {
   ...,
    // name
    name: 'System',
    // 对应组件组件的name
    component: () => import('@/views/system/index.vue'),
    ...
  },

  // /@/views/sys/login/index.vue
  export default defineComponent({
    // 需要和路由的name一致
    name:"System"
  });
```

:::warning 注意

keep-alive 生效的前提是：需要将路由的 `name` 属性及对应的页面的 `name` 设置成一样。因为：

**include - 字符串或正则表达式，只有名称匹配的组件会被缓存**
:::

