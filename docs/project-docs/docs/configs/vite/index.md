# Vite 配置

npm 包名称: `@quantum-design-configs/vite`

当前版本: **3.0.0** (基于 Vite 7.1.1)

提供了公共的 vite 配置，支持最新的 Vite 7 特性

## API

| 方法名                         | 方法                                                               | 说明                         |
| ------------------------------ | ------------------------------------------------------------------ | ---------------------------- |
| vite_common_lib_config         | (options: CommonOptions):UserConfig                                | vue 组件库 lib vite 公共配置 |
| vite_common_vue_config         | ({ command, mode }: ConfigEnv, options: CommonOptions): UserConfig | vue 项目, vite 公共配置      |
| vite_plugin_postcss_pxtorem    | (rootValue: number): postcss.Plugin                                | vue 项目, 移动端样式适配     |
| **vite_plugin_ai_integration** | (config: AIConfig): Plugin                                         | **AI集成插件配置**           |

```js
// v3.0.0 新增类型定义
export interface ViteEnv {
    VITE_PORT: number; // 端口
    VITE_PROXY: [string, string][];
    VITE_GLOB_APP_TITLE: string;
    VITE_BASE_PATH: string; // 基本路径
    VITE_DROP_CONSOLE: boolean; // 是否删除console
    VITE_BUILD_COMPRESS: 'gzip' | 'brotli' | 'none'; // 压缩
    VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE: boolean; // 压缩时是否删除原文件
    VITE_USE_IMAGEMIN: boolean; // 图片资源压缩
    VITE_USE_SENTRY: boolean // 是否开启sentry
    VITE_USE_VISUALIZER: boolean; // 资源分析
    VITE_GLOB_API_URL: string; // url
    VITE_USE_PWA: boolean; // 是否使用pwa
    // v3.0.0 新增环境变量
    VITE_USE_AI: boolean; // 是否启用AI功能
    VITE_AI_PROVIDER: 'openai' | 'aliyun' | 'azure'; // AI提供商
    VITE_AI_API_KEY: string; // AI API密钥
    VITE_NUXT_4_SUPPORT: boolean; // 是否启用Nuxt 4支持
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
    // v3.0.0 新增配置
    aiConfig?: AIConfig; // AI集成配置
    nuxt4Support?: boolean; // Nuxt 4支持
}

export interface IPluginsCommonOptions {
    sentry?:SentryVitePluginOptions,
    pwa?: Partial<VitePWAOptions>
    // v3.0.0 新增
    ai?: AIConfig;
}

// v3.0.0 新增AI配置接口
export interface AIConfig {
    provider: 'openai' | 'aliyun' | 'azure';
    apiKey: string;
    endpoint?: string;
    models?: string[];
    enableSSR?: boolean; // 服务端渲染支持
}

```

## v3.0.0 新增功能

### 🤖 AI 集成支持

```js
// AI配置示例
import { defineConfig } from 'vite'
import { vite_common_vue_config, vite_plugin_ai_integration } from '@quantum-design-configs/vite'

export default defineConfig(({ command, mode }) => {
    const aiConfig = {
        provider: 'aliyun' as const,
        apiKey: process.env.VITE_AI_API_KEY,
        models: ['qwen-turbo', 'qwen-plus', 'qwen-max'],
        enableSSR: true
    };

    return {
        ...vite_common_vue_config(
            { command, mode },
            {
                aiConfig,
                pluginsOption: {
                    ai: aiConfig
                }
            }
        ),
        plugins: [
            vite_plugin_ai_integration(aiConfig)
        ]
    }
});
```

### 🚀 Nuxt 4 支持

```js
// Nuxt 4 配置示例
import { defineConfig } from 'vite';
import { vite_common_vue_config } from '@quantum-design-configs/vite';

export default defineConfig(({ command, mode }) => {
    return {
        ...vite_common_vue_config(
            { command, mode },
            {
                nuxt4Support: true,
                pluginsOption: {
                    // Nuxt 4 特定配置
                    experimental: {
                        asyncContext: true,
                    },
                },
            },
        ),
    };
});
```

## 使用案例

### vue 组件库

```js
import { ConfigEnv } from 'vite';
import { UserConfig } from 'vite';
import { vite_common_lib_config } from '@quantum-design-configs/vite';
import { resolve } from 'path';

export default ({ command, mode }: ConfigEnv): UserConfig => {
    const _common = vite_common_lib_config({
        entry: './index.ts',
        name: 'qComponents',
        outDir: 'dist',
        isComponentsBuild: true,
        target: 'modules',
        rollupOptions: {
            external: ['vue', 'vue-router', '@quantum-design/shared', '@quantum-design/utils'],
        },
        buildOptions: {
            cssCodeSplit: true,
            minify: true,
            // v3.0.0 新增构建优化
            reportCompressedSize: true,
            chunkSizeWarningLimit: 1000,
        },
        dtsOptions: {
            entryRoot: resolve(__dirname),
            // v3.0.0 增强类型生成
            skipDiagnostics: false,
            logDiagnostics: true,
        },
    });
    return {
        ..._common,
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: "@use 'sass:math'; @import '@quantum-design/styles/base/base.scss'; @import '@quantum-design/styles/base/mixin.scss';",
                },
            },
        },
        // v3.0.0 新增构建优化
        build: {
            ..._common.build,
            cssMinify: 'lightningcss', // 使用Lightning CSS
            reportCompressedSize: true,
            sourcemap: mode === 'development',
        }
    };
};
```

### vue 项目

```js
import { ConfigEnv, UserConfig, loadEnv } from 'vite';
import { vite_common_vue_config } from '@quantum-design-configs/vite';
import { antdCssData, baseScssFile } from './config/antd';

export default ({ command, mode }: ConfigEnv): UserConfig => {
    const _common = vite_common_vue_config(
        { command, mode },
        {
            pluginsOption: {
                sentry: {
                    authToken: 'xxxx',
                },
                // v3.0.0 AI配置
                ai: {
                    provider: 'aliyun',
                    apiKey: process.env.VITE_AI_API_KEY,
                    enableSSR: true
                }
            },
        },
    );
    return {
        ..._common,
        css: {
            preprocessorOptions: {
                less: {
                    modifyVars: antdCssData,
                    javascriptEnabled: true,
                },
                scss: {
                    additionalData: baseScssFile,
                },
            },
        },
        // v3.0.0 性能优化
        optimizeDeps: {
            include: [
                'vue',
                'vue-router',
                'pinia',
                '@vueuse/core', // 如果使用VueUse
            ],
            exclude: [
                // 排除不需要预构建的包
            ]
        }
    };
};
```

### 移动端适配插件

```js
import { ConfigEnv, UserConfig, loadEnv } from 'vite';
import { vite_common_vue_config, vite_plugin_postcss_pxtorem } from '@quantum-design-configs/vite';
import { antdCssData, baseScssFile } from './config/antd';

export default ({ command, mode }: ConfigEnv): UserConfig => {
    const _common = vite_common_vue_config();
    return {
        ..._common,
        css: {
            preprocessorOptions: {
                less: {
                    modifyVars: antdCssData,
                    javascriptEnabled: true,
                },
                scss: {
                    additionalData: baseScssFile,
                },
            },
            postcss: {
                plugins: [
                    vite_plugin_postcss_pxtorem(75),
                    // v3.0.0 新增CSS优化插件
                    require('cssnano')({
                        preset: ['default', {
                            discardComments: {
                                removeAll: true,
                            },
                        }]
                    })
                ],
            },
        },
        // v3.0.0 移动端优化
        build: {
            target: 'es2015',
            outDir: 'dist',
            assetsDir: 'assets',
            cssCodeSplit: true,
            sourcemap: mode === 'development',
        }
    };
};
```

## 所拥有插件

#### vite-plugin-compression2

1. 简介: 是否开启代码压缩 (v3.0.0 升级到 v2.2.0)
2. 开启方式: `.env`文件中设置`VITE_BUILD_COMPRESS` 为 true
3. 补充属性: `VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE` 是否删除原始文件

#### unplugin-vue-define-options

1. 简介, vue3.3 以下在 setup 语法糖中声明组件名称

#### vite_plugin_html

1. 简介: html 代码压缩与注入
2. 属性: `.env`文件中设置`VITE_GLOB_APP_TITLE`

#### vite-plugin-pwa

1. 简介: 开启 pwa
2. 开启方式: `.env`文件中设置`VITE_USE_PWA`为 true
3. v3.0.0 升级: 支持最新的PWA插件版本

```js
const _common = vite_common_vue_config(
    { command, mode },
    {
        pluginsOption: {
            pwa: {
                // v3.0.0 支持更多PWA配置
                registerType: 'autoUpdate',
                workbox: {
                    globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
                    runtimeCaching: [
                        // AI API缓存配置
                        {
                            urlPattern: /^https:\/\/ai-api\.example\.com\/.*/i,
                            handler: 'CacheFirst',
                            options: {
                                cacheName: 'ai-api-cache',
                                expiration: {
                                    maxEntries: 50,
                                    maxAgeSeconds: 60 * 60, // 1小时
                                },
                            },
                        },
                    ],
                },
            },
        },
    },
);
```

#### @sentry/vite-plugin

1. 简介: 开启 sentry
2. 开启方式: `.env`文件中设置`VITE_USE_SENTRY`为 true 打开流水线环境自动识别
3. 补充属性: `VITE_USE_SOURCEMAP` 是否开启 sourcemap, (开启后需要设置: `VITE_GLOB_APP_PROJECT`, `VITE_APP_RELEASE_VERSION`)
4. v3.0.0 升级: 支持最新Sentry插件版本

```js
// v3.0.0 扩展属性自定义配置方式
const _common = vite_common_vue_config(
    { command, mode },
    {
        pluginsOption: {
            sentry: {
                sourcemaps: {
                    ignore: ['node_modules'],
                    assets: ['./dist/assets/*'],
                    include: ['./dist/**/*'],
                    ignore: ['node_modules', '*.test.*', '*.spec.*'],
                },
                authToken: '3a449fc41c1f48a78f59a69db5a4bee41707f7b5fbbd40abb5816a6a73f4d9de',
                // v3.0.0 新增配置
                telemetry: true,
                debug: mode === 'development',
            },
        },
    },
);
```

#### vite-plugin-lightningcss (v3.0.0 新增)

1. 简介: 使用Lightning CSS替代传统CSS处理，提升构建性能
2. 优势: 更快的CSS处理速度，更小的bundle体积

```js
// 在vite.config.ts中启用
import { defineConfig } from 'vite';
import { vite_common_vue_config } from '@quantum-design-configs/vite';

export default defineConfig(({ command, mode }) => {
    return {
        ...vite_common_vue_config({ command, mode }),
        css: {
            postcss: {
                plugins: [
                    // 替换原有的cssnano
                    require('lightningcss')({
                        minify: mode === 'production',
                    }),
                ],
            },
        },
    };
});
```

## 构建性能优化 (v3.0.0 新增)

### Bundle 分析

```js
// 在 vite.config.ts 中添加
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ command, mode }) => {
    const plugins = [];

    if (mode === 'analyze') {
        plugins.push(
            visualizer({
                filename: 'dist/stats.html',
                open: true,
                gzipSize: true,
                brotliSize: true,
            }),
        );
    }

    return {
        ...vite_common_vue_config({ command, mode }),
        plugins,
    };
});
```

### 构建缓存优化

```js
export default defineConfig(({ command, mode }) => {
    return {
        ...vite_common_vue_config({ command, mode }),
        // v3.0.0 增强构建缓存
        build: {
            rollupOptions: {
                output: {
                    manualChunks: {
                        // 第三方库分离
                        vue: ['vue', 'vue-router', 'pinia'],
                        antd: ['ant-design-vue', '@ant-design/icons-vue'],
                        utils: ['lodash-es', 'dayjs', 'axios'],
                    },
                },
            },
            // 启用文件缓存
            chunkSizeWarningLimit: 1000,
            sourcemap: mode === 'development',
        },
    };
});
```
