import { ConfigEnv, UserConfig } from 'vite';
import { loadEnv } from 'vite';
import { outputDir, vite_utils_create_proxy, vite_utils_wrapper_env } from '../utils';
import { vite_create_plugins } from '../plugins';
import { CommonOptions } from '../types';

// https://vitejs.dev/config/
export function vite_common_vue_config({ command, mode }: ConfigEnv, options?: CommonOptions): UserConfig {
    const getOptions = {
        outDir: outputDir,
        rollupOptions: {},
        buildOptions: {},
        ...(options || {})
    };
    const root = process.cwd();
    const env = loadEnv(mode, root);
    const viteEnv = vite_utils_wrapper_env(env);
    const isBuild = command === 'build';
    const { VITE_PORT, VITE_PROXY, VITE_DROP_CONSOLE, VITE_BASE_PATH, VITE_USE_PWA } = viteEnv;
    let plugin = vite_create_plugins(viteEnv, isBuild, options?.pluginsOption);
    if (options && options.customPlugins) {
        plugin = plugin.concat(options.customPlugins);
    }
    return {
        base: VITE_BASE_PATH,
        server: {
            host: true,
            port: VITE_PORT,
            open: true,
            proxy: vite_utils_create_proxy(VITE_PROXY)
        },
        esbuild: {
            pure: VITE_DROP_CONSOLE ? ['console.log', 'debugger'] : []
        },
        build: {
            target: 'es2015',
            outDir: getOptions.outDir,
            rollupOptions: {
                output: {
                    footer: '/**! license by QM Front-end team */'
                },
                external: VITE_USE_PWA ? [] : ['virtual:pwa-register/vue'],
                ...getOptions.rollupOptions
            },
            reportCompressedSize: false,
            chunkSizeWarningLimit: 2000,
            sourcemap: viteEnv.VITE_USE_SENTRY && viteEnv.VITE_USE_SOURCEMAP,
            ...getOptions.buildOptions
        },
        plugins: plugin
    };
}
