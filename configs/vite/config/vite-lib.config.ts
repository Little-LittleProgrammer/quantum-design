import { ConfigEnv, UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import VueJsx from '@vitejs/plugin-vue-jsx';

interface CommonOptions {
    entry: string;
    name: string;
    formats?: ('es' | 'cjs' | 'umd' | 'iife')[],
    external?: string[],
    outDir?: string
}

const common_vite_config = (options: CommonOptions):UserConfig => {
    const {entry, name, formats = ['es', 'umd'], external = ['vue'], outDir = 'dist-components'} = options;
    const plugin = [
        vue(),
        VueJsx()
    ];
    return {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: "@use 'sass:math'; @import '@wuefront/shared/style/base/base.scss'; @import '@wuefront/shared/style/base/mixin.scss';"
                }
            }
        },
        build: {
            outDir: outDir,
            rollupOptions: {
                external: external,
                output: {
                    // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
                    globals: {
                        vue: 'Vue'
                    }
                }
            },
            lib: {
                formats: formats,
                entry: entry,
                name: name,
                // the proper extensions will be added
                fileName: name
            }
        },
        plugins: plugin
    };
};

export {common_vite_config};
