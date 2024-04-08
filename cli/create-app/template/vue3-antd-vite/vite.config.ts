import { ConfigEnv, UserConfig } from 'vite';
import { vite_common_vue_config } from '@quantum-design-configs/vite';
import { antdCssData, baseScssFile } from './config/antd';
import { resolve } from 'path';

function pathResolve(dir: string) {
    return resolve(process.cwd(), '.', dir);
}

export default ({ command, mode }: ConfigEnv):UserConfig => {
    const _common = vite_common_vue_config({ command, mode });
    return {
        ..._common,
        define: {
            cssData: antdCssData
        },
        css: {
            preprocessorOptions: {
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
