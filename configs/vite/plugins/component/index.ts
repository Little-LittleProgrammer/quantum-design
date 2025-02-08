import Components from 'unplugin-vue-components/vite';
import { QResolver } from './auto-import-resolver';
import type { ComponentResolver } from 'unplugin-vue-components';
import type { Plugin } from 'vite';

export function vite_plugin_component(resolvers: ComponentResolver[] = []){
    const componentPlugin = Components({
        resolvers: [QResolver(), ...resolvers],
    });
    return componentPlugin as Plugin;
}
