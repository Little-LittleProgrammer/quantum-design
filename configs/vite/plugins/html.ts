import type { PluginOption } from 'vite';
import { ViteEnv } from '../types';

export function vite_plugin_html(env: ViteEnv) {
    const { VITE_GLOB_APP_TITLE } = env;

    const _replaceObj = {
        title: VITE_GLOB_APP_TITLE
    };

    const htmlPlugin:PluginOption[] = [{
        name: 'html-transform',
        transformIndexHtml: {
            enforce: 'pre',
            transform(html) {
                return html.replace(
                    /<%=\s*(\w+)\s*%>/gi,
                    (match, p1) => _replaceObj[p1] || ''
                );
            }
        }
    }];
    return htmlPlugin;
}
