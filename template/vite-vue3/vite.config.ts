import { ConfigEnv, UserConfig } from 'vite';
import { resolve } from 'path';
import { wrapperEnv } from './build/utils';
import { loadEnv } from 'vite';
import { OUTPUT_DIR, _antdCssData, _baseScssFile } from './build/vite/config';
import { create_proxy } from './build/vite/proxy';
import { createVitePlugins } from './build/vite/plugin';
import {name, author, version} from './package.json';

function pathResolve(dir: string) {
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
    const { VITE_PORT, VITE_PROXY, VITE_DROP_CONSOLE, VITE_BASE_PATH } = viteEnv;
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
                }
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
                '@/': pathResolve('src') + '/',
                '#/': pathResolve('types') + '/'
            }
        },
        plugins: createVitePlugins(viteEnv, isBuild)
    };
};
