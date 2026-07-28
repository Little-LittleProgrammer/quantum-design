import * as components from './src/components';
export * from './src/components';
import type { App } from 'vue';
export default {
    install: (app: App) => {
        Object.keys(components).forEach((key) => {
            const component = components[key as keyof typeof components];
            app.use(component);
        });
        return app;
    },
};
