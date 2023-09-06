import { App } from 'vue';
import * as components from './src/components';
export * from './src/components';

export default {
    install: (app: App) => {
        Object.keys(components).forEach(key => {
            const component = components[key as keyof typeof components];
            if (component.install) {
                app.use(component);
            }
        });
        return app;
    }
};

