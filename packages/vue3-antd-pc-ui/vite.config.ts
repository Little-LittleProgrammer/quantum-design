/// <reference types="vitest" />
import { ConfigEnv } from 'vite';
import { UserConfig } from 'vite';
import {vite_common_lib_config} from '@quantum-design-configs/vite';
import {resolve} from 'path';

function path_resolve(dir: string) {
    return resolve(process.cwd(), '.', dir);
}

export default ({ command, mode }: ConfigEnv):UserConfig => {
    const _common = vite_common_lib_config({
        entry: './index.ts',
        name: 'qComponents',
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
                '@quantum-design/shared',
                '@quantum-design/utils',
                '@quantum-design/utils/extra',
                '@quantum-design/shared/enums',
                '@quantum-design/types',
                '@quantum-design/types/vue',
                '@quantum-design/types/vue/types',
                '@quantum-design/hooks',
                '@quantum-design/hooks/base',
                '@quantum-design/hooks/base/use-sortable',
                '@quantum-design/hooks/vue',
                '@quantum-design/hooks/vue/use-message',
                '@quantum-design/hooks/vue/use-page',
                '@quantum-design/hooks/vue/use-pagination',
                '@quantum-design/hooks/vue/use-slots',
                '@quantum-design/vue3-pc-ui',
                'dayjs',
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
    _common.plugins?.splice(2, 1);
    return {
        ..._common,
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: "@use 'sass:math'; @import '@quantum-design/shared/style/base/base.scss'; @import '@quantum-design/shared/style/base/mixin.scss';"
                }
            }
        },
        resolve: {
            alias: {
                '@vue3-antd/': path_resolve('src') + '/'
            }
        },
        test: {
            environment: 'jsdom'
        }
    };
};
