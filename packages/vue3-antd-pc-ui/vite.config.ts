/// <reference types="vitest" />
import { ConfigEnv } from 'vite';
import { UserConfig } from 'vite';
import {vite_common_lib_config} from '@wuefront-configs/vite';
import {resolve} from 'path';

function path_resolve(dir: string) {
    return resolve(process.cwd(), '.', dir);
}

export default ({ command, mode }: ConfigEnv):UserConfig => {
    const _common = vite_common_lib_config({
        entry: './index.ts',
        name: 'qmComponents',
        outDir: 'dist',
        isComponentsBuild: true,
        target: 'modules',
        rollupOptions: {
            external: [
                'vue',
                'vue-router',
                'ant-design-vue',
                '@ant-design/icons-vue',
                'vue-types',
                '@wuefront/shared',
                '@wuefront/utils',
                '@wuefront/shared/enums',
                '@wuefront/types',
                '@wuefront/types/vue',
                '@wuefront/types/vue/types',
                '@wuefront/hooks',
                '@wuefront/hooks/base',
                '@wuefront/hooks/vue',
                '@wuefront/vue3-pc-ui',
                'lodash-es',
                'pinia'
            ]
        },
        buildOptions: {
            cssCodeSplit: true,
            minify: true
        },
        dtsOptions: {
            entryRoot: resolve(__dirname)
        }
    });
    return {
        ..._common,
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: "@use 'sass:math'; @import '@wuefront/shared/style/base/base.scss'; @import '@wuefront/shared/style/base/mixin.scss';"
                }
            }
        },
        resolve: {
            alias: {
                '@/': path_resolve('src') + '/'
            }
        },
        test: {
            environment: 'jsdom'
        }
    };
};
