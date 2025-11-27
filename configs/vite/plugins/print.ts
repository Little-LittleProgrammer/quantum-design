import type { PluginOption } from 'vite';

import type { PrintPluginOptions } from '../types';

import { green, bold, cyan } from 'kolorist';

export const vite_plugin_print = (options: PrintPluginOptions = {}): PluginOption => {
    const { infoMap = {} } = options;

    return {
        configureServer(server) {
            const _printUrls = server.printUrls;
            server.printUrls = () => {
                _printUrls();

                for (const [key, value] of Object.entries(infoMap)) {
                    console.info(`  ${green('➜')}  ${bold(key)}: ${cyan(value || '')}`);
                }
            };
        },
        enforce: 'pre',
        name: 'vite:print-info',
    };
};
