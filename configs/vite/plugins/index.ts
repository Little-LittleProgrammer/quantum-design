import type { PluginOption } from 'vite';
import { ViteEnv } from '../types';

import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { vite_plugin_options } from './define-options';
import { vite_plugin_html } from './html';
import { vite_plugin_compress } from './compress';
import { vite_plugin_pwa } from './pwa';

export function vite_create_plugins(viteEnv: ViteEnv, isBuild: boolean) {
    const {
        VITE_BUILD_COMPRESS,
        VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE
    } = viteEnv;
    const _vitePlugins: (PluginOption | PluginOption[])[] = [
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
    _vitePlugins.push(vite_plugin_options());
    // vite-plugin-html
    _vitePlugins.push(vite_plugin_html(viteEnv, isBuild));

    if (isBuild) {
        _vitePlugins.push(vite_plugin_compress(VITE_BUILD_COMPRESS, VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE));

        // vite-plugin-pwa
        _vitePlugins.push(vite_plugin_pwa(viteEnv));
    }
    return _vitePlugins;
}
