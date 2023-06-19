# plugin

## sentry

### Usage

```js
import { register_sentry_vue } from '@q-front-npm/shared/plugins';

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