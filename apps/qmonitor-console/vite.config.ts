import { ConfigEnv, UserConfig, loadEnv } from 'vite';
import { vite_common_vue_config } from '@wuefront-configs/vite';
import { antdCssData, baseScssFile } from './config/antd';
import { resolve } from 'path';

function pathResolve(dir: string) {
    return resolve(process.cwd(), '.', dir);
}

export default ({ command, mode }: ConfigEnv):UserConfig => {
    const _common = vite_common_vue_config({ command, mode });
    return {
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
                '@/': pathResolve('src') + '/',
                '#/': pathResolve('types') + '/'
            }
        }
    };
};
