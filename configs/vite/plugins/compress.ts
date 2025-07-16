import type { Plugin } from 'vite';

import compressPlugin from 'vite-plugin-compression2';

// 开启gzip、br压缩
export function vite_plugin_compress(
    compress: 'gzip' | 'brotli' | 'none' = 'none',
    deleteOriginalAssets = false,
    options: any
): Plugin | Plugin[] {
    const compressList = compress.split(',');

    const plugins: Plugin[] = [];

    if (compressList.includes('gzip')) {
        plugins.push(
            compressPlugin({
                exclude: [/\.(br)$/, /\.(gz)$/],
                algorithm: 'gzip',
                deleteOriginalAssets,
                ...options,
            })
        );
    }
    if (compressList.includes('brotli')) {
        plugins.push(
            compressPlugin({
                exclude: [/\.(br)$/, /\.(gz)$/],
                algorithm: 'brotliCompress',
                deleteOriginalAssets,
                ...options,
            })
        );
    }
    return plugins;
}
