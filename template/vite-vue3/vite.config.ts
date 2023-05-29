import { ConfigEnv, UserConfig, loadEnv } from 'vite';
import { resolve } from 'path';
import {name, author, version} from './package.json';
import {wrapperEnv, create_proxy, createVitePlugins, OUTPUT_DIR, _antdCssData, _baseScssFile } from '@wuefront-configs/vite';

function path_resolve(dir: string) {
    return resolve(process.cwd(), '.', dir);
}

const QM = 'qimao';

const _banner = `/**! ${QM}/${name} version: ${version} \n author: ${author} */`;

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfig => {
    const root = process.cwd();
    const env = loadEnv(mode, root);
    const viteEnv = wrapperEnv(env);
    const isBuild = command === 'build';
    const { VITE_PORT, VITE_PROXY, VITE_DROP_CONSOLE, VITE_BASE_PATH, VITE_USE_PWA } = viteEnv;
    return {
        base: VITE_BASE_PATH,
        css: {
            preprocessorOptions: {
                less: {
                    modifyVars: _antdCssData,
                    javascriptEnabled: true
                },
                scss: {
                    additionalData: _baseScssFile
                }
            }
        },
        server: {
            host: true,
            port: VITE_PORT,
            open: true,
            proxy: create_proxy(VITE_PROXY)
        },
        esbuild: {
            pure: VITE_DROP_CONSOLE ? ['console.log', 'debugger'] : []
        },
        build: {
            target: 'es2015',
            outDir: OUTPUT_DIR,
            rollupOptions: {
                output: {
                    banner: _banner,
                    footer: '/**! license by QM Front-end team */'
                },
                external: VITE_USE_PWA ? [] : ['virtual:pwa-register/vue']
            },
            // minify: 'terser',
            // terserOptions: {
            //     compress: {
            //         keep_infinity: true,
            //         // Used to delete console in production environment
            //         drop_console: VITE_DROP_CONSOLE, // 注释console
            //         drop_debugger: VITE_DROP_CONSOLE,
            //         pure_funcs: ['console.log'] // 移除console
            //     },
            //     mangle: false,
            //     output: {
            //         beautify: true // 压缩注释
            //     }
            // },
            reportCompressedSize: false,
            chunkSizeWarningLimit: 2000
        },
        resolve: {
            alias: {
                '@/': path_resolve('src') + '/',
                '#/': path_resolve('types') + '/'
            }
        },
        plugins: createVitePlugins(viteEnv, isBuild)
    };
};
