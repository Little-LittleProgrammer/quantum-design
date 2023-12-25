import * as Sentry from '@sentry/vue';
import { Integrations } from '@sentry/tracing';
import Vue from 'vue';
import packageConfig from '/package.json';

process.env.NODE_ENV === 'production' && Sentry.init({
    Vue,
    dsn: 'https://7820fa6dbbe6441cae80129589699e44@qm-front-sentry.wtzw.com/19',
    release: `${packageConfig.name}-${packageConfig.version}`,
    autoSessionTracking: true,
    integrations: [
        new Integrations.BrowserTracing()
    ],
    logErrors: true,
    tracingOptions: {
        trackComponents: true
    },
    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    // tracesSampleRate: 1.0,
    sampleRate: 0.1
});
