// import * as Sentry from '@sentry/vue';

export default defineNuxtPlugin(nuxtApp => {
    const _config = useRuntimeConfig();
    if (_config.public.sentry.enable && _config.public.sentry.dsn) {
        let _environment = '';
        if (
            process.env.PIPELINE_NAME?.includes('生产') ||
            process.env.PIPELINE_TAGS?.includes('生产')
        ) {
            _environment = 'production';
        } else if (
            process.env.PIPELINE_NAME?.includes('测试') ||
            process.env.PIPELINE_TAGS?.includes('测试')
        ) {
            _environment = 'development';
        }
        // Sentry.init({
        //     ..._config.public.sentry,
        //     app: nuxtApp.vueApp,
        //     environment: _environment
        // });
    }
});
