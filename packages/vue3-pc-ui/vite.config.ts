/// <reference types="vitest" />
import { ConfigEnv } from 'vite';
import { UserConfig } from 'vite';
import {vite_common_lib_config} from '@wuefront-configs/vite';
import {resolve} from 'path';

export default ({ command, mode }: ConfigEnv):UserConfig => {
    const _common = vite_common_lib_config({
        entry: './index.ts',
        name: 'qmComponents',
        outDir: 'dist',
        isComponentsBuild: true,
        target: 'modules',
        rollupOptions: {
            external: ['vue', 'vue-router', '@wuefront/shared', '@wuefront/utils']
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
        test: {
            environment: 'jsdom'
        }
    };
};
