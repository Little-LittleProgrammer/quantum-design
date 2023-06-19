
import defineOptionsPlugin from 'unplugin-vue-define-options';

export function vite_plugin_options() {
    const plugin = defineOptionsPlugin.vite();
    return plugin;
}
