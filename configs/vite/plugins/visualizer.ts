import {visualizer} from 'rollup-plugin-visualizer';
import { PluginOption } from 'vite';
import { ViteEnv } from '../utils';

export function configVisualizerConfig(env: ViteEnv) {
    if (env.VITE_USE_VISUALIZER) {
        const vitePlugins: PluginOption = visualizer({
            filename: 'dist/stats.html'
        });
        return vitePlugins;
    }
    return [];
}
