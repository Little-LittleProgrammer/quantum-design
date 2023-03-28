import type { PluginOption } from 'vite';

import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
// import ViteComponents, { AntDesignVueResolver } from 'vite-plugin-components';
import { configCompressPlugin } from './compress';
import { configPwaConfig } from './pwa';
import { configHtmlPlugin } from './html';
import { ViteEnv } from '../utils';
import { configDefinePlugin } from './define-options';

export function createVitePlugins(viteEnv: ViteEnv, isBuild: boolean) {
    const {
        VITE_USE_IMAGEMIN,
        VITE_BUILD_COMPRESS,
        VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE
    } = viteEnv;

    const vitePlugins: (PluginOption | PluginOption[])[] = [
        // have to
        vue(),
        // have to
        vueJsx()
        // 按需引入antd组件和样式, 特别好用,
        // 因为本项目是使用scss的, 并且使用了主题切换功能, 所以使用此功能, 会导致样式重复添加
        // ViteComponents({
        //     customComponentResolvers: [AntDesignVueResolver()]
        // })
    ];

    vitePlugins.push(configDefinePlugin());

    // vite-plugin-html
    vitePlugins.push(configHtmlPlugin(viteEnv, isBuild));

    // vite-plugin-theme
    // vitePlugins.push(configThemePlugin(isBuild));
    if (isBuild) {
        // rollup-plugin-gzip
        vitePlugins.push(
            configCompressPlugin(VITE_BUILD_COMPRESS, VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE)
        );

        // vite-plugin-pwa
        vitePlugins.push(configPwaConfig(viteEnv));
    }

    return vitePlugins;
}
