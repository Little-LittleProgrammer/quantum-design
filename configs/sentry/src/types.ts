import type { BrowserOptions } from '@sentry/vue';
import type { SentryVitePluginOptions } from '@sentry/vite-plugin';

export interface SentryInnerOptions extends BrowserOptions {
    Vue: any,
    /**
     * 是否开启sentry
     */
    enable?: boolean;
    [key: string]: any
}

export interface SentryCliOptions extends SentryVitePluginOptions {
    outputDir?: string,
    [key: string]: any
}

export interface SentryNuxtOptions {
    dsn: string,
    config: BrowserOptions,
    clientConfig: BrowserOptions,
    serverConfig: BrowserOptions,
    publishRelease: Record<string, any>,
    [key: string]: any
}
export interface ViteEnv {
    VITE_PORT: number; // 端口
    VITE_GLOB_APP_PROJECT: string; // 项目名称
    VITE_APP_RELEASE_VERSION: string; // 项目版本
    // VITE_USE_MOCK: boolean;
    VITE_USE_PWA: boolean; // 使用pwa
    VITE_UPDATE_NOTIFY?: boolean // pwa下是否提示更新
    VITE_PROXY: [string, string][];
    VITE_GLOB_APP_TITLE: string;
    VITE_BASE_PATH: string;
    // VITE_USE_CDN: boolean;
    VITE_DROP_CONSOLE: boolean; // 是否删除console
    VITE_BUILD_COMPRESS: 'gzip' | 'brotli' | 'none'; // 压缩
    VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE: boolean;
    VITE_USE_IMAGEMIN: boolean; // 图片资源压缩
    VITE_USE_SENTRY: boolean;
    VITE_USE_SOURCEMAP: boolean;
    VITE_USE_VISUALIZER: boolean; // 资源分析
    VITE_GLOB_API_URL: string; // url
    VITE_GLOB_API_URL_PREFIX: string; // url前缀
    // VITE_GENERATE_UI: string;
}
