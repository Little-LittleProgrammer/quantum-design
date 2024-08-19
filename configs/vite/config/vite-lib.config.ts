import { UserConfig } from 'vite';
import type {OutputOptions} from 'rollup';
import vue from '@vitejs/plugin-vue';
import VueJsx from '@vitejs/plugin-vue-jsx';
import dts from 'vite-plugin-dts';
import { CommonOptions } from '../types';
import { vite_plugin_component } from '../plugins/component';
// 定义 build 和 plugin
const vite_common_lib_config = (options: Omit<CommonOptions, 'entry'> & Record<'entry', string>):UserConfig => {
    const {entry, name, formats = ['es', 'umd'], outDir = 'dist', buildOptions = {}, rollupOptions = {}, dtsOptions = {}} = options;
    let plugin = [
        vue(),
        VueJsx(),
        vite_plugin_component()
    ];
    if (options.isComponentsBuild) {
        plugin.push({
            name: 'css-all',
            resolveFileUrl({ fileName }) {
                return `new URL('${fileName}', document.baseURI).href`;
            },
            generateBundle(options, bundle) {
                //这里可以获取打包后的文件目录以及代码code
                const _keys = Object.keys(bundle);
                let _source = '';
                for (const key of _keys) {
                    const source:any = bundle[key];
                    if (source.fileName && source.fileName.includes('.css')) {
                        if (_source.includes('@charset')) {
                            const _codeArr = source.source.split(';').slice(1);
                            _source += _codeArr.join(';');
                        } else {
                            _source += source.source;
                        }
                    }
                }
                this.emitFile({
                    type: 'asset',
                    fileName: 'style/index.css',
                    source: _source
                });
            }
        });
    }
    if (options.customPlugins) {
        plugin = plugin.concat(options.customPlugins);
    }
    const isDeclaration = !(process.env.PIPELINE_NAME?.includes('生产') || process.env.PIPELINE_TAGS?.includes('生产') || process.env.PIPELINE_NAME?.includes('测试') || process.env.PIPELINE_TAGS?.includes('测试'));
    if (isDeclaration) {
        plugin.push(dts({
            outDir: 'dist',
            ...dtsOptions
        }));
    }
    const _output:OutputOptions[] = options.isComponentsBuild ? [{
        format: 'es',
        exports: 'named',
        entryFileNames: '[name].js',
        assetFileNames: (assetInfo) => {
            if (assetInfo.name?.includes('css')) {
                const _realName = assetInfo.name.split('.')[0];
                return `style/${_realName}[extname]`;
            }
            return `[name][extname]`;
        },
        dir: './dist/es',
        //让打包目录和我们目录对应
        preserveModules: true,
        preserveModulesRoot: 'src'
    }, {
        format: 'cjs',
        exports: 'named',
        entryFileNames: '[name].js',
        assetFileNames: (assetInfo) => {
            console.log(assetInfo)
            if (assetInfo.name?.includes('css')) {
                const _realName = assetInfo.name.split('.')[0];
                return `style/${_realName}[extname]`;
            }
            return `[name][extname]`;
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
        esbuild: {
            pure: ['console.log', 'debugger']
        },
        build: {
            target: options.target || 'es2015',
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
