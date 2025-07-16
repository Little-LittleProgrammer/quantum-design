import type { ViteEnv } from './types';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import type { SentryVitePluginOptions } from '@sentry/vite-plugin';


export function vite_plugin_sentry(env: ViteEnv, options?: SentryVitePluginOptions) {
    if (env.VITE_USE_SENTRY) {
        if (
            process.env.PIPELINE_NAME?.includes('生产') ||
            process.env.PIPELINE_TAGS?.includes('生产')
        ) {
            process.env.VITE_GLOB_ENV = 'production';
        } else if (
            process.env.PIPELINE_NAME?.includes('测试') ||
            process.env.PIPELINE_TAGS?.includes('测试')
        ) {
            process.env.VITE_GLOB_ENV = 'development';
        }

        if (env.VITE_USE_SOURCEMAP) {
            const _options: SentryVitePluginOptions = {
                org: 'sentry',
                url: 'https://qm-front-sentry.wtzw.com/',
                release: {
                    name: env.VITE_GLOB_APP_PROJECT + '@' + env.VITE_APP_RELEASE_VERSION
                },
                project: env.VITE_GLOB_APP_PROJECT,
                ...(options || {})
            };
            const _plugins = sentryVitePlugin(_options);
            return _plugins;
        }
    }
    return [];
}
