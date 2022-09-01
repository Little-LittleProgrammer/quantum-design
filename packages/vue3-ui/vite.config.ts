import { UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import VueJsx from '@vitejs/plugin-vue-jsx';
import {resolve} from 'path';

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
                external: ['vue', '@qmfront/shared', '@qmfront/shared/utils'],
                input: ['index.ts'],
                output: [{
                    format: 'es',
                    entryFileNames: '[name].js',
                    assetFileNames: (assetInfo) => {
                        console.log(assetInfo.name);
                        const _componentName = assetInfo.name?.split('/')[1];
                        return `${_componentName}/style/[name][extname]`;
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
                        return `${_componentName}/style/[name][extname]`;
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
        plugins: [
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
                            const _code = source.code.replace('/style/index.js', '/style/index.css');
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
