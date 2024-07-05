import type {App} from 'vue';
import * as Sentry from '@sentry/vue';
export function register_sentry_vue(app: App, options: Parameters<typeof Sentry.init>[0]): void {
    Sentry.init({
        app,
        sampleRate: 1.0,
        ...options
    });
}
