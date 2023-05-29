import type {App} from 'vue';
import * as Sentry from '@sentry/vue';
import { Options, TracingOptions } from '@sentry/vue/types/types';

export function register_sentry_vue(app: App, options: Partial<Omit<Options, 'tracingOptions'> & {
    tracingOptions: Partial<TracingOptions>;
}>): void {
    Sentry.init({
        app,
        sampleRate: 1.0,
        ...options
    });
}
