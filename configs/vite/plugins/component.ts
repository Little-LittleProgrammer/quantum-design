import Components from 'unplugin-vue-components/vite';
import { PixiuResolver } from '@quantum-design/shared/plugins';

export function vite_plugin_component(resolvers: any[] = []) {
    const componentPlugin = Components({
        resolvers: [PixiuResolver(), ...resolvers]
    });
    return componentPlugin;
}
