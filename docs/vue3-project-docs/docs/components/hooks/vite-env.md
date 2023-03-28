# vite-env
获取全局env配置文件的hooks,目前只代理了 `VITE_GLOB_APP_TITLE,
        VITE_GLOB_API_URL,
        VITE_GLOB_API_URL_PREFIX,
        VITE_GLOB_UPLOAD_URL`

## 使用方式
```js
const env = useViteEnv();
env.apiUrl
```