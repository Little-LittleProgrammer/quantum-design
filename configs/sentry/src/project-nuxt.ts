// import { Integrations } from '@sentry/tracing';
import type { SentryNuxtOptions } from './types';

export function init_sentry_nuxt(obj: SentryNuxtOptions) {
    const { config = {}, clientConfig = {}, serverConfig = {}, publishRelease = {}, dsn = '',} = obj;
    const baseOption:SentryNuxtOptions = {
        dsn,
        clientConfig: {
            // integrations: [
            //     new Integrations.BrowserTracing()
            // ],
            ...clientConfig,
        },
        config: {
            release: process.env.VITE_GLOB_APP_PROJECT + '@' + process.env.VITE_APP_RELEASE_VERSION,
            environment: process.env.VUE_APP_ENV,
            autoSessionTracking: true,
            tracingOptions: {
                trackComponents: true,
                ...(config.tracingOptions || {}),
            },
            logErrors: true,
            sampleRate: 1.0,
            ignoreErrors: [
                'ResizeObserver loop limit exceeded',
                'ResizeObserver loop completed with undelivered notifications',
                'Network Error',
                /NetworkError/,
                'Script error',
                'timeout',
                'Failed to update a ServiceWorker for scope',
                'Non-Error exception captured',
                /Failed to fetch/,
                'Non-Error promise rejection captured with keys: message',
                'Non-Error promise rejection captured with value: cancel',
                /Non-Error promise rejection captured with value/,
                // /undefined is not an object/,
                ...(config.ignoreErrors as [] || [])
            ],
            ...config,
        },
        serverConfig: {
            ...serverConfig,
        },
        publishRelease: {
            // url = https://qm-front-sentry.wtzw.com/
            // org = sentry
            url: 'https://qm-front-sentry.wtzw.com/',
            org: 'sentry',
            release: process.env.VITE_GLOB_APP_PROJECT + '@' + process.env.VITE_APP_RELEASE_VERSION,
            ...publishRelease,
        },
    };
    return baseOption;
}
