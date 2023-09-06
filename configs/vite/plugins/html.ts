import type { PluginOption } from 'vite';
import { ViteEnv } from '../types';

export function vite_plugin_html(env: ViteEnv) {
    const { VITE_GLOB_APP_TITLE } = env;

    const _replaceObj = {
        title: VITE_GLOB_APP_TITLE
    };

    const htmlPlugin:PluginOption[] = [{
        name: 'html-transform',
        enforce: 'pre',
        transformIndexHtml(html) {
            for (const [key, val] of Object.entries(_replaceObj)) {
                const _reg = new RegExp(`/<%=${key}%>/g`);
                html.replace(_reg, val);
            }
            return html;
        }
    }];
    return htmlPlugin;
}
