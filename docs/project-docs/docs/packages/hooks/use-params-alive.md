# 刷新页面时记录页面参数

当开启 页面缓存, tab栏时, 会启动此hooks;

## Usage

### layout
请在 `layout` 中使用 `useParamsAliveRoot` 注册hooks
```js
import { useParamsAliveRoot } from '@quantum-design/hooks/vue';

const {getSearchButton, getShowThemeSwitch, getShowReloadButton, getShowTransition, getShowCacheTabsSetting, getBreadCrumb, getBackTop, getShowPageLoading, getOpenKeepAlive, getCacheCanCache, getCacheCanDrag, getShowQuick} = useProjectSetting(); // 项目全局动态配置, 如没有, 直接使用 enums/project-enum.ts 也可


useParamsAliveRoot({
    aliveTabs: cacheList, // 绑定开启的tabs
    projectSetting: { // 绑定项目全局配置
        cache: getCacheCanCache, // 开启时, 会缓存已经开启的所有tab
        keepalive: getOpenKeepAlive, // 开启时, 会缓存当前页面状态
        show: getShowCacheTabsSetting // 开启时, 会打开 tab 
    }
});
```

### page

::: tip 注意
入参 出参 都为方法, 为了保证 刷新时获取以及保存的是最新的参数
```js
useParamsAlive(params: Fn) => {
    get_params: Fn
}
```
::: 
在需要保存参数的页面使用 `useParamsAlive`
```js

import { useParamsAlive } from '@quantum-design/hooks/vue';

function getFieldsValue() {
    return {
        platform: 1
    }
}
const {get_params} = useParamsAlive(getFieldsValue);
```

### api

```js
function useParamsAliveRoot(props: IRootProps): void

interface IRootProps {
    aliveTabs: stirng[];
    projectSetting: IRootProjectSetting
}

interface IRootProjectSetting {
    cache: boolean | Ref<boolean>, // 开启时, 会缓存已经开启的所有tab, 关闭则只缓存当前页面
    keepalive: boolean | Ref<boolean>, // 开启时功能才会启动
    show: boolean | Ref<boolean> // 开启时功能才会启动
}
```