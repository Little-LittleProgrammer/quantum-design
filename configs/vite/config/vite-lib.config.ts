import { UserConfig } from 'vite';
import type {OutputOptions} from 'rollup';
import vue from '@vitejs/plugin-vue';
import VueJsx from '@vitejs/plugin-vue-jsx';
import dts from 'vite-plugin-dts';
import { CommonOptions } from '../types';

// 定义 build 和 plugin
const vite_common_lib_config = (options: CommonOptions):UserConfig => {
    const {entry, name, formats = ['es', 'umd'], outDir = 'dist', buildOptions = {}, rollupOptions = {}, dtsOptions = {}} = options;
    let plugin = [
        vue(),
        VueJsx()
    ];
    if (options.isComponentsBuild) {
        plugin.push({
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
        });
    }
    if (options.customPlugins) {
        plugin = plugin.concat(options.customPlugins);
    }
    const isDeclaration = !(process.env.PIPELINE_NAME?.includes('生产') || process.env.PIPELINE_TAGS?.includes('生产') || process.env.PIPELINE_NAME?.includes('测试') || process.env.PIPELINE_TAGS?.includes('测试'));
    if (isDeclaration) {
        plugin.push(dts({
            outputDir: 'dist',
            skipDiagnostics: true,
            ...dtsOptions
        }));
    }
    const _output:OutputOptions[] = options.isComponentsBuild ? [{
        format: 'es',
        entryFileNames: '[name].js',
        assetFileNames: (assetInfo) => {
            const _componentName = assetInfo.name?.split('/')[1];
            return `${_componentName}/src/style/[name][extname]`;
        },
        dir: './dist/es',
        //让打包目录和我们目录对应
        preserveModules: true,
        preserveModulesRoot: 'src'
    }, {
        format: 'cjs',
        entryFileNames: '[name].js',
        assetFileNames: (assetInfo) => {
            const _componentName = assetInfo.name?.split('/')[1];
            return `${_componentName}/src/style/[name][extname]`;
        },
        dir: './dist/lib',
        //让打包目录和我们目录对应
        preserveModules: true,
        preserveModulesRoot: 'src'
    }] : [{
        globals: {
            vue: 'Vue'
        }
    }];
    return {
        build: {
            target: options.target || 'es',
            outDir: outDir,
            rollupOptions: {
                external: rollupOptions?.external,
                output: rollupOptions?.output ? rollupOptions.output : _output
            },
            lib: {
                formats: formats,
                entry: entry,
                name: name,
                // the proper extensions will be added
                fileName: name
            },
            ...(buildOptions || {})
        },
        plugins: plugin
    };
};

export {vite_common_lib_config};
