import { defineNuxtModule } from '@nuxt/kit';
import { defaults, libraryName } from './config';
import { Options } from './types';
import { resolve_components, resolve_options, resolve_styles } from './core';
import { transformPlugin } from './core/transform-plugin';

export default defineNuxtModule<Partial<Options>>({
    meta: {
        name: libraryName,
        configKey: 'vueAntdPcUi'
    },
    defaults,
    setup(_options, nuxt) {
        const options = _options as Options;

        resolve_options();
        nuxt.options.components !== false && resolve_components(options);

        nuxt.hook('vite:extendConfig', (config, { isClient }) => {
            const _mode = isClient ? 'client' : 'server';

            config.plugins = config.plugins || [];
            config.plugins.push(transformPlugin.vite({
                include: options.include,
                exclude: options.exclude,
                sourcemap: nuxt.options.sourcemap[_mode],
                transformStyles: name => resolve_styles(options, name)
            }));
        });
    }
});
