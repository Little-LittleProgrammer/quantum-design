# vite 
npm包名称: `@quantum-design/vite`

当前版本: 1.0.2

提供了公共的vite配置

## API
| 方法名    |                                 方法                          | 说明              |
| -------- | ------------------------------------------------------------ | ---------------- |
| vite_common_lib_config   | (options: CommonOptions):UserConfig | vue组件库lib vite公共配置   |
| vite_common_vue_config  |  ({ command, mode }: ConfigEnv, options: CommonOptions): UserConfig   | vue项目, vite公共配置 |
| vite_plugin_postcss_pxtorem  |  (rootValue: number): postcss.Plugin   | vue项目, m版样式适配 |

```js
// type 类型
export interface ViteEnv {
    VITE_PORT: number; // 端口
    // VITE_USE_MOCK: boolean;
    VITE_PROXY: [string, string][];
    VITE_GLOB_APP_TITLE: string;
    VITE_BASE_PATH: string; // 基本路径
    // VITE_USE_CDN: boolean;
    VITE_DROP_CONSOLE: boolean; // 是否删除console
    VITE_BUILD_COMPRESS: 'gzip' | 'brotli' | 'none'; // 压缩
    VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE: boolean; // 压缩时是否删除原文件
    VITE_USE_IMAGEMIN: boolean; // 图片资源压缩
    VITE_USE_SENTRY: boolean // 是否开启sentry
    VITE_USE_VISUALIZER: boolean; // 资源分析
    VITE_GLOB_API_URL: string; // url
    VITE_USE_PWA: boolean; // 是否使用pwa
    // VITE_GENERATE_UI: string;
}

export interface CommonOptions {
    entry: string;
    name?: string;
    target?: string;
    formats?: ('es' | 'cjs' | 'umd' | 'iife')[],
    outDir?: string,
    rollupOptions?: RollupOptions;
    buildOptions?: Omit<BuildOptions, 'rollupOptions'>;
    isComponentsBuild?: boolean;
    customPlugins?: any[];
    dtsOptions?: PluginOptions;
    pluginsOption?: IPluginsCommonOptions // 增加部分, 配置sentry
}

export interface IPluginsCommonOptions {
    sentry?:SentryVitePluginOptions,
    pwa?: Partial<VitePWAOptions>
}

```


## 使用案例

### vue 组件库
```js
import { ConfigEnv } from 'vite';
import { UserConfig } from 'vite';
import {vite_common_lib_config} from '@quantum-design-configs/vite';
import {resolve} from 'path';

export default ({ command, mode }: ConfigEnv):UserConfig => {
    const _common = vite_common_lib_config({
        entry: './index.ts',
        name: 'qComponents',
        outDir: 'dist',
        isComponentsBuild: true,
        target: 'modules',
        rollupOptions: {
            external: ['vue', 'vue-router', '@quantum-design/shared', '@quantum-design/utils']
        },
        buildOptions: {
            cssCodeSplit: true,
            minify: true
        },
        dtsOptions: {
            entryRoot: resolve(__dirname)
        }
    });
    return {
        ..._common,
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: "@use 'sass:math'; @import '@quantum-design/styles/base/base.scss'; @import '@quantum-design/styles/base/mixin.scss';"
                }
            }
        }
    };
};

```

### vue项目
```js
import { ConfigEnv, UserConfig, loadEnv } from 'vite';
import { vite_common_vue_config } from '@quantum-design-configs/vite';
import { antdCssData, baseScssFile } from './config/antd';

export default ({ command, mode }: ConfigEnv):UserConfig => {
    const _common = vite_common_vue_config({ command, mode }, {
        pluginsOption: {
            sentry: {
                authToken: 'xxxx'
            }
        }
    });
    return {
        ..._common,
        css: {
            preprocessorOptions: {
                less: {
                    modifyVars: antdCssData,
                    javascriptEnabled: true
                },
                scss: {
                    additionalData: baseScssFile
                }
            }
        }
    };
};

```

### 移动端适配插件
```js
import { ConfigEnv, UserConfig, loadEnv } from 'vite';
import { vite_common_vue_config, vite_plugin_postcss_pxtorem } from '@quantum-design-configs/vite';
import { antdCssData, baseScssFile } from './config/antd';

export default ({ command, mode }: ConfigEnv):UserConfig => {
    const _common = vite_common_vue_config();
    return {
        ..._common,
        css: {
            preprocessorOptions: {
                less: {
                    modifyVars: antdCssData,
                    javascriptEnabled: true
                },
                scss: {
                    additionalData: baseScssFile
                }
            },
            postcss: {
                plugins: [vite_plugin_postcss_pxtorem(75)]
            }
        }
    };
};

```


## 所拥有插件

#### vite-plugin-compression

1. 简介: 是否开启代码压缩
2. 开启方式: `.env`文件中设置`VITE_BUILD_COMPRESS` 为true
3. 补充属性: `VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE` 是否删除原始文件

#### unplugin-vue-define-options
1. 简介, vue3.3以下在setup语法糖中声明组件名称

#### vite_plugin_html
1. 简介: html代码压缩与注入
2. 属性: `.env`文件中设置`VITE_GLOB_APP_TITLE` 

#### vite-plugin-pwa
1. 简介: 开启pwa
2. 开启方式: `.env`文件中设置`VITE_USE_PWA`为true
```js
const _common = vite_common_vue_config({ command, mode }, {
    pluginsOption: {
        pwa: {
            // ...
        }
    }
});
```

#### @sentry/vite-plugin
1. 简介: 开启sentry
2. 开启方式: `.env`文件中设置`VITE_USE_SENTRY`为true 打开流水线环境自动识别
3. 补充属性: `VITE_USE_SOURCEMAP` 是否开启sourcemap, (开启后需要设置: `VITE_GLOB_APP_PROJECT`, `VITE_APP_RELEASE_VERSION`)
```js
// 扩展属性自定义配置方式
const _common = vite_common_vue_config({ command, mode }, {
    pluginsOption: {
        sentry: {
            sourcemaps: {
                ignore: ['node_modules'],
                assets: ['./dist/assets/*']
            },
            authToken: '3a449fc41c1f48a78f59a69db5a4bee41707f7b5fbbd40abb5816a6a73f4d9de'
        }
    }
});
```

