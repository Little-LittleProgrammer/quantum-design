import Components from 'unplugin-vue-components/vite';
import { QResolver } from '@q-front-npm/shared/plugins';

export function vite_plugin_component(resolvers: any[] = []) {
    const componentPlugin = Components({
        resolvers: [QResolver(), ...resolvers]
    });
    return componentPlugin;
}
