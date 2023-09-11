# 基本配置
## .env配置

```shell
# port
VITE_GLOB_APP_PROJECT = 'ad-qmniu'
VITE_APP_RELEASE_VERSION = '1.0.0'
VITE_GLOB_APP_TITLE = '七猫广告'
VITE_BASE_PATH = ''

VITE_PORT = 9100

VITE_DROP_CONSOLE = false

# 开发环境的接口
VITE_GLOB_API_URL = '' 

# 开发环境的接口前缀
VITE_GLOB_API_URL_PREFIX= '/api'

# 本地上传前缀, 主要用于设置代理
VITE_GLOB_UPLOAD_URL= '/local'

# 代理地址，可以设置多个， dev 下生效
VITE_PROXY = [["/api","https://adx-api.qimao.com"], ["/local","http://127.0.0.1:8999/local"]]

# 是否使用 sourcemap
VITE_USE_SOURCEMAP = false

# 是否使用 sentry
VITE_USE_SENTRY = false

# 是否使用 pwa
VITE_USE_PWA = false

#baseUrl
NUXT_APP_BASE_URL = '/'

#  使用cdn 地址
NUXT_APP_CDN_URL = '' 
```

## 模块配置
已经预制 6 个模块：`pwa`, `pinia`, `dev-proxy`，`dev-tools`, `ant-design-vue3`, `'@quantum-design/vue3-pc-ui-nuxt'`, `'@quantum-design/vue3-antd-pc-ui-nuxt'`

扩展模块请在`config/modules/index.ts`下扩展

## 样式 及项目配置
由于`ant-design-vue@4.x.x`采用 `cssinjs`的方式,不在具有 css文件，所以样式更改请先了解官网，然后在此文件夹下配置`config/project-setting.ts`