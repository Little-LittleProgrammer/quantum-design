import Components from 'unplugin-vue-components/vite';
import { QResolver } from '@quantum-design/shared/plugins';

export function vite_plugin_component(resolvers: any[] = []) {
    const componentPlugin = Components({
        resolvers: [QResolver(), ...resolvers]
    });
    return componentPlugin;
}
