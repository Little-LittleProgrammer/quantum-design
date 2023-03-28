import { ConfigEnv, UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import VueJsx from '@vitejs/plugin-vue-jsx';
import {resolve} from 'path';
import dts from 'vite-plugin-dts';

export default ({ command, mode }: ConfigEnv):UserConfig => {
    console.log('*********************', mode);
    const plugin = [
        vue(),
        VueJsx(),
        {
            name: 'css-deal',
            generateBundle(options, bundle) {
                //这里可以获取打包后的文件目录以及代码code
                const keys = Object.keys(bundle);
                for (const key of keys) {
                    const source:any = bundle[key];
                    if (source.fileName && source.fileName.includes('vue_type')) {
                        const _code = source.code.replace(/style\/index.js/g, 'style/index.css');
                        this.emitFile({
                            type: 'asset',
                            fileName: key, //文件名名不变
                            source: _code
                        });
                    }
                }
            }
        }
    ];
    const isDeclaration = !(process.env.PIPELINE_NAME?.includes('生产') || process.env.PIPELINE_TAGS?.includes('生产') || process.env.PIPELINE_NAME?.includes('测试') || process.env.PIPELINE_TAGS?.includes('测试'));
    if (isDeclaration) {
        plugin.push(dts({
            outputDir: 'dist',
            skipDiagnostics: true
        }));
    }
    return {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: "@use 'sass:math'; @import '@wuefront/shared/style/base/base.scss'; @import '@wuefront/shared/style/base/mixin.scss';"
                }
            }
        },
        build: {
            target: 'modules',
            outDir: 'es',
            minify: true,
            cssCodeSplit: true,
            rollupOptions: {
                external: ['vue', 'vue-router', '@wuefront/shared', '@wuefront/utils'],
                input: ['index.ts'],
                output: [{
                    format: 'es',
                    entryFileNames: '[name].js',
                    assetFileNames: (assetInfo) => {
                        const _componentName = assetInfo.name?.split('/')[1];
                        return `${_componentName}/src/style/[name][extname]`;
                    },
                    dir: resolve(__dirname, './dist/es'),
                    //让打包目录和我们目录对应
                    preserveModules: true,
                    preserveModulesRoot: resolve(__dirname, 'src')
                }, {
                    format: 'cjs',
                    entryFileNames: '[name].js',
                    assetFileNames: (assetInfo) => {
                        const _componentName = assetInfo.name?.split('/')[1];
                        return `${_componentName}/src/style/[name][extname]`;
                    },
                    dir: resolve(__dirname, './dist/lib'),
                    //让打包目录和我们目录对应
                    preserveModules: true,
                    preserveModulesRoot: resolve(__dirname, 'src')
                }]
            },
            lib: {
                entry: './index.ts',
                name: 'qmComponents'
            }
        },
        plugins: plugin
    };
};
