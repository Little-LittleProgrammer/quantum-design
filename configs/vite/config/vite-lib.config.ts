import type { UserConfig } from 'vite';
import type { OutputOptions } from 'rolldown';
import vue from '@vitejs/plugin-vue';
import VueJsx from '@vitejs/plugin-vue-jsx';
import type { CommonOptions } from '../types';
import { vite_plugin_component } from '../plugins/component';
import type { Plugin } from 'vite';

// 定义 build 和 plugin
const vite_common_lib_config = (options: Omit<CommonOptions, 'entry'> & Record<'entry', string>): UserConfig => {
    const { entry, name, formats = ['es', 'umd'], outDir = 'dist', buildOptions = {}, rolldownOptions = {} } = options;
    let plugin: Plugin[] = [vue(), VueJsx(), vite_plugin_component()];
    if (options.isComponentsBuild) {
        plugin.push({
            name: 'css-all',
            generateBundle(_options, bundle) {
                //这里可以获取打包后的文件目录以及代码code
                const _keys = Object.keys(bundle);
                let _source = '';
                for (const key of _keys) {
                    const source: any = bundle[key];
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
                    source: _source,
                });
            },
        });
    }
    if (options.customPlugins) {
        plugin = plugin.concat(options.customPlugins);
    }
    const _output: OutputOptions[] = options.isComponentsBuild
        ? [
              {
                  format: 'es',
                  exports: 'named',
                  entryFileNames: '[name].js',
                  assetFileNames: (assetInfo) => {
                      if (assetInfo.name?.includes('css')) {
                          const cacheName = assetInfo.name.split('.')[0] || '';
                          const nameArr = cacheName.split('/');
                          const realName = `${nameArr[0]}/${nameArr[nameArr.length - 1]}`;
                          return `style/${realName}[extname]`;
                      }
                      return `[name][extname]`;
                  },
                  dir: './dist/es',
                  //让打包目录和我们目录对应
                  preserveModules: true,
                  preserveModulesRoot: 'src',
              },
              {
                  format: 'cjs',
                  exports: 'named',
                  entryFileNames: '[name].cjs',
                  assetFileNames: (assetInfo) => {
                      console.log(assetInfo);
                      if (assetInfo.name?.includes('css')) {
                          const cacheName = assetInfo.name.split('.')[0] || '';
                          const nameArr = cacheName.split('/');
                          const realName = `${nameArr[0]}/${nameArr[nameArr.length - 1]}`;
                          return `style/${realName}[extname]`;
                      }
                      return `[name][extname]`;
                  },
                  dir: './dist/lib',
                  //让打包目录和我们目录对应
                  preserveModules: true,
                  preserveModulesRoot: 'src',
              },
          ]
        : [
              {
                  globals: {
                      vue: 'Vue',
                  },
              },
          ];
    return {
        build: {
            target: options.target || 'baseline-widely-available',
            outDir: outDir,
            rolldownOptions: {
                external: rolldownOptions?.external,
                output: rolldownOptions?.output ? rolldownOptions.output : (_output as any),
            },
            lib: {
                formats: formats,
                entry: entry,
                name: name,
                // the proper extensions will be added
                fileName: name,
            },
            ...(buildOptions || {}),
        },
        plugins: plugin,
    };
};

export { vite_common_lib_config };
