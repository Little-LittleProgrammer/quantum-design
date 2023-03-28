/**
 * Zero-config PWA for Vite
 * https://github.com/antfu/vite-plugin-pwa
 */

import { VitePWA } from 'vite-plugin-pwa';
import { ViteEnv } from '../utils';

export function configPwaConfig(env: ViteEnv) {
    const { VITE_USE_PWA, VITE_GLOB_APP_TITLE } = env;

    if (VITE_USE_PWA) {
        // vite-plugin-pwa
        const pwaPlugin = VitePWA({
            registerType: 'prompt', // 手动更新
            injectRegister: 'auto', // 自动注册
            workbox: {
                swDest: `dist/sw.js?${new Date().getTime()}`,
                cleanupOutdatedCaches: true, // 自动清理过期缓存
                globPatterns: [], // 要预先缓存的资源
                navigateFallback: null,
                runtimeCaching: [ // 运行时缓存
                    {
                        urlPattern: ({url}) => url.pathname.includes('/api') || url.pathname.includes('/backend') ,
                        handler: 'NetworkFirst', // 网络优先
                        options: {
                            cacheName: 'api-cache', // 缓存get请求
                            cacheableResponse: {
                                statuses: [200]
                            },
                            matchOptions: {
                                ignoreSearch: true
                            }
                        },
                    },
                    {
                        urlPattern: /\.(?:png|jpg|jpeg|svg)$/,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'assets-images-cache',
                            expiration: {
                                // 最多30个图
                                maxEntries: 30
                            }
                        }
                    },
                    {
                        urlPattern: /.*\.js.*/,
                        handler: 'CacheFirst', // 因为 资源 hash总会变, 所以这种方式即可
                        options: {
                            cacheName: 'project-js-cache',
                            expiration: {
                                maxEntries: 30, // 最多缓存30个，超过的按照LRU原则删除
                                maxAgeSeconds: 7 * 24 * 60 * 60
                            },
                            cacheableResponse: {
                                statuses: [200]
                            }
                        }
                    },
                    {
                        urlPattern: /.*\.css.*/,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'project-css-cache',
                            expiration: {
                                maxEntries: 20,
                                maxAgeSeconds: 7 * 24 * 60 * 60
                            },
                            cacheableResponse: {
                                statuses: [200]
                            }
                        }
                    },
                    {
                        urlPattern: /.*\.html.*/,
                        handler: 'NetworkFirst', // 网络优先
                        options: {
                            cacheName: 'main-html-cache',
                            cacheableResponse: {
                                statuses: [200]
                            }
                        }
                    }
                ]
            },
            manifest: {
                name: VITE_GLOB_APP_TITLE,
                short_name: '七猫',
                description: VITE_GLOB_APP_TITLE,
                theme_color: '#E6A817',
                icons: [
                    {
                        src: 'img/logo.png',
                        sizes: '192x192',
                        type: 'image/png'
                    }
                ]
            }
        });
        return pwaPlugin;
    }
    return [];
}
