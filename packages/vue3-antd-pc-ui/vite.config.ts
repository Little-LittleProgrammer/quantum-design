/// <reference types="vitest" />
import { ConfigEnv } from 'vite';
import { UserConfig } from 'vite';
import {vite_common_lib_config} from '@q-front-npm-configs/vite';
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
                '@q-front-npm/shared',
                '@q-front-npm/utils',
                '@q-front-npm/shared/enums',
                '@q-front-npm/types',
                '@q-front-npm/types/vue',
                '@q-front-npm/types/vue/types',
                '@q-front-npm/hooks',
                '@q-front-npm/hooks/base',
                '@q-front-npm/hooks/vue',
                '@q-front-npm/vue3-pc-ui',
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
                    additionalData: "@use 'sass:math'; @import '@q-front-npm/shared/style/base/base.scss'; @import '@q-front-npm/shared/style/base/mixin.scss';"
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
