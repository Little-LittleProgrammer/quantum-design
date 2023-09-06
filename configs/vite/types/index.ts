import { RollupOptions } from 'rollup';
import type { BuildOptions, ProxyOptions } from 'vite';
import { PluginOptions } from 'vite-plugin-dts';
import type { SentryVitePluginOptions } from '@sentry/vite-plugin';
import type { VitePWAOptions } from 'vite-plugin-pwa';

export interface ViteEnv {
    VITE_PORT: number; // 端口
    VITE_GLOB_APP_PROJECT: string; // 项目名称
    VITE_APP_RELEASE_VERSION: string; // 项目版本
    // VITE_USE_MOCK: boolean;
    VITE_USE_PWA: boolean; // 使用pwa
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

export type ProxyItem = [string, string];

export type ProxyList = ProxyItem[];

export type ProxyTargetList = Record<string, ProxyOptions & { rewrite: (path: string) => string }>;

export const httpsRE = /^https:\/\//;

export interface CommonOptions {
    entry?: string;
    name?: string;
    target?: string;
    formats?: ('es' | 'cjs' | 'umd' | 'iife')[],
    outDir?: string,
    rollupOptions?: RollupOptions;
    buildOptions?: Omit<BuildOptions, 'rollupOptions'>;
    isComponentsBuild?: boolean;
    customPlugins?: any[];
    dtsOptions?: PluginOptions;
    pluginsOption?: IPluginsCommonOptions
}

export interface IPluginsCommonOptions {
    sentry?:SentryVitePluginOptions;
    pwa?:Partial<VitePWAOptions>;
    compress?: any; // pelease see；
}
