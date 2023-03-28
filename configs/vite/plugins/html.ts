import type { PluginOption } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import { ViteEnv } from '../utils';

export function configHtmlPlugin(env: ViteEnv, isBuild:boolean) {
    const { VITE_GLOB_APP_TITLE, VITE_BASE_PATH } = env;

    const _path = VITE_BASE_PATH.endsWith('/') ? VITE_BASE_PATH : `${VITE_BASE_PATH}/`;

    // const getAppConfigSrc = () => {
    //     return `${_path || '/'}app.config.js?v=${pkg.version}-${new Date().getTime()}`;
    // };

    const htmlPlugin:PluginOption[] = createHtmlPlugin({
        minify: isBuild,
        inject: {
            data: {
                title: VITE_GLOB_APP_TITLE
            }
            // 生成 app.config.js, 为了在生产时可以不用重新打包就配置全局变量
            // tags: isBuild
            //     ? [
            //         {
            //             tag: 'script',
            //             attrs: {
            //                 src: getAppConfigSrc()
            //             }
            //         }
            //     ]
            //     : []
        }
    });
    return htmlPlugin;
}
