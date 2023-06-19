# vite 
npm包名称: `@q-front-npm/vite`

当前版本: 1.0.0


提供了公共的vite配置

## API
| 方法名    |                                 方法                          | 说明              |
| -------- | ------------------------------------------------------------ | ---------------- |
| vite_common_lib_config   | (options: CommonOptions):UserConfig | vue组件库lib vite公共配置   |
| vite_common_vue_config  |  ({ command, mode }: ConfigEnv, options: CommonOptions): UserConfig   | vue项目, vite公共配置 |

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
    dtsOptions?: PluginOptions
}

```


## 使用案例

### vue 组件库
```js
import { ConfigEnv } from 'vite';
import { UserConfig } from 'vite';
import {vite_common_lib_config} from '@wuefront-config/vite';
import {resolve} from 'path';

export default ({ command, mode }: ConfigEnv):UserConfig => {
    const _common = vite_common_lib_config({
        entry: './index.ts',
        name: 'qmComponents',
        outDir: 'dist',
        isComponentsBuild: true,
        target: 'modules',
        rollupOptions: {
            external: ['vue', 'vue-router', '@q-front-npm/shared', '@q-front-npm/utils']
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
                    additionalData: "@use 'sass:math'; @import '@q-front-npm/shared/style/base/base.scss'; @import '@q-front-npm/shared/style/base/mixin.scss';"
                }
            }
        }
    };
};

```

### vue项目
```js
import { ConfigEnv, UserConfig, loadEnv } from 'vite';
import { vite_common_vue_config } from '@wuefront-config/vite';
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
            }
        }
    };
};

```