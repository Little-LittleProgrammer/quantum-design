import { ConfigEnv, UserConfig, loadEnv } from 'vite';
import { vite_common_lib_config, wrapperEnv } from '@quantum-design-configs/vite';
import { antdCssData, baseScssFile } from './config/antd';
import { resolve } from 'path';

function path_resolve(dir: string) {
    return resolve(process.cwd(), '.', dir);
}

export default ({ command, mode }: ConfigEnv):UserConfig => {
    const root = process.cwd();
    const env = loadEnv(mode, root);
    const viteEnv = wrapperEnv(env);
    const { VITE_BASE_PATH } = viteEnv;
    const _common = vite_common_lib_config({
        entry: resolve(__dirname, 'src/components/index.ts'),
        name: 'components-lib',
        outDir: 'dist-components',
        rollupOptions: {
            external: ['vue', 'ant-design-vue', '@quantum-design/vue3-antd-ui', '@quantum-design/vue3-ui', '@quantum-design/utils', '@quantum-design/shared', '@ant-design/icons-vue', 'pinia']
        }
    });
    return {
        base: VITE_BASE_PATH,
        ..._common,
        css: {
            preprocessorOptions: {
                less: {
                    modifyVars: antdCssData,
                    javascriptEnabled: true
                },
                scss: {
                    additionalData: baseScssFile
                }
            }
        },
        resolve: {
            alias: {
                '@/': path_resolve('src') + '/',
                '#/': path_resolve('types') + '/'
            }
        }
    };
};
