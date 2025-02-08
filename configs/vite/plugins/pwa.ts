/**
 * Zero-config PWA for Vite
 * https://github.com/antfu/vite-plugin-pwa
 */

import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa';
import { ViteEnv } from '../types';
import {js_utils_deep_merge} from '@quantum-design/utils';

export function vite_plugin_pwa(env: ViteEnv, options?: Partial<VitePWAOptions>) {
    const { VITE_USE_PWA, VITE_UPDATE_NOTIFY, VITE_GLOB_APP_TITLE, } = env;
    const time = VITE_UPDATE_NOTIFY ? new Date().getTime() : '';

    if (VITE_USE_PWA) {
        // vite-plugin-pwa
        const pwaPlugin = VitePWA(js_utils_deep_merge({
            registerType: 'prompt', // 手动更新
            injectRegister: 'auto', // 自动注册
            workbox: {
                swDest: `dist/sw.js`,
                cleanupOutdatedCaches: true, // 自动清理过期缓存
                globPatterns: [], // 要预先缓存的资源
                navigateFallback: null,
                runtimeCaching: [ // 运行时缓存
                    {
                        urlPattern: /\.(?:png|jpg|jpeg|svg)$/,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'assets-images-cache',
                            expiration: {
                                // 最多30个图
                                maxEntries: 30,
                            },
                        },
                    },
                    {
                        urlPattern: /.*\.js$/,
                        handler: 'CacheFirst', // 因为 资源 hash总会变, 所以这种方式即可
                        options: {
                            cacheName: 'project-js-cache',
                            expiration: {
                                maxEntries: 30, // 最多缓存30个，超过的按照LRU原则删除
                                maxAgeSeconds: 7 * 24 * 60 * 60,
                            },
                            cacheableResponse: {
                                statuses: [200],
                            },
                        },
                    },
                    {
                        urlPattern: /.*\.css.*/,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'project-css-cache',
                            expiration: {
                                maxEntries: 20,
                                maxAgeSeconds: 7 * 24 * 60 * 60,
                            },
                            cacheableResponse: {
                                statuses: [200],
                            },
                        },
                    },
                    {
                        urlPattern: /.*/,
                        handler: 'NetworkFirst', // 网络优先
                        options: {
                            cacheName: 'project-html-cache',
                            cacheableResponse: {
                                statuses: [200],
                                headers: {
                                    'Content-Type': 'text/html; charset=UTF-8',
                                },
                            },
                        },
                    }
                ],
            },
            manifest: {
                name: VITE_GLOB_APP_TITLE,
                short_name: '七猫',
                description: VITE_GLOB_APP_TITLE,
                theme_color: '#E6A817',
                time_stamp: time,
                icons: [
                    {
                        src: 'img/logo.png',
                        sizes: '192x192',
                        type: 'image/png',
                    }
                ],
            },
        }, options));
        return pwaPlugin;
    }
    return [];
}
