import { ViteEnv } from '../utils';

export function configSentryEnv(env: ViteEnv) {
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
    }
}
