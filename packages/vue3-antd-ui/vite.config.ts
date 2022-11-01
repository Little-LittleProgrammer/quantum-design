import { UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import VueJsx from '@vitejs/plugin-vue-jsx';
import {resolve} from 'path';
import dts from 'vite-plugin-dts';

function pathResolve(dir: string) {
    return resolve(process.cwd(), '.', dir);
}

export default ():UserConfig => {
    return {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: "@use 'sass:math'; @import '@qmfront/shared/style/base/base.scss'; @import '@qmfront/shared/style/base/mixin.scss';"
                }
            }
        },
        build: {
            target: 'modules',
            outDir: 'es',
            minify: true,
            cssCodeSplit: true,
            rollupOptions: {
                external: [
                    'vue',
                    'vue-router',
                    'ant-design-vue',
                    '@ant-design/icons-vue',
                    'vue-types',
                    '@qmfront/shared',
                    '@qmfront/utils',
                    '@qmfront/shared/enums',
                    '@qmfront/types',
                    '@qmfront/types/vue',
                    '@qmfront/types/vue/types',
                    '@qmfront/hooks',
                    '@qmfront/hooks/base',
                    '@qmfront/hooks/vue',
                    '@qmfront/vue3-ui',
                    'lodash-es',
                    'pinia'
                ],
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
                name: 'qmComponentsAntd'
            }
        },
        resolve: {
            alias: {
                '@/': pathResolve('src') + '/'
            }
        },
        plugins: [
            vue(),
            VueJsx(),
            dts({
                outputDir: 'dist'
            }),
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
        ]
    };
};
