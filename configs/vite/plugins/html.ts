import type { PluginOption } from 'vite';
import type { ViteEnv } from '../types';

export function vite_plugin_html(env: ViteEnv) {
    const { VITE_GLOB_APP_TITLE, } = env;

    const _replaceObj: Record<string, any> = {
        title: VITE_GLOB_APP_TITLE,
    };
    const htmlPlugin:PluginOption = {
        name: 'transform-html',
        transformIndexHtml: {
            order: 'pre',
            transform(html) {
                return html.replace(
                    /<%=\s*(\w+)\s*%>/gi,
                    (match, p1) => _replaceObj[p1] || ''
                );
            },
        },
    };
    return htmlPlugin;
}
