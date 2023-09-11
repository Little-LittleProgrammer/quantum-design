# plugin

## sentry

### Usage

```js
import { register_sentry_vue } from '@quantum-design/shared/plugins';

if (import.meta.env.VITE_USE_SENTRY === 'true') {
    register_sentry_vue(app, {
        dsn: 'xxxxxxx',
        ignoreErrors: [
            'ResizeObserver loop limit exceeded', // ant 官方建议
            'validate error'
        ],
        environment: import.meta.env.VITE_GLOB_ENV
    });
}
```

### APi

|  参数      |   说明   |   可选参数    |
|:---------:|---------|---------|
|  app   | vueapp实例 | - |
|  options    | sentry的配置项 | 详情请看sentry官网 | 

## auto-import-resolver

按需引入组件的 resolver

### usage

```ts
// vite.config.ts

import { defineConfig } from 'vite';
import Components from 'unplugin-vue-components/vite';
import { QResolver } from '@quantum-design/shared/plugins/vue/auto-import-resolver.ts';
export default defineConfig({
    plugins: [
        // ...
        Components({
            resolvers: [
                QResolver()
            ],
        }),
    ],
});


```

### APi

|  参数      |   说明   |   可选参数    |
|:---------:|---------|---------|
|  options    | QResolverOptions | QResolverOptions | 

```ts
export interface QResolverOptions {
    importStyle: boolean | 'css' | 'scss';

    prefix: string; // package 的默认开头

    packageName: string // package名称

    moduleType: 'es' | 'lib'
}
```