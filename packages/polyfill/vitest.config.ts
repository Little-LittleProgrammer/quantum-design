import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
    test: {
        environment: 'happy-dom',
        include: ['**/__tests__/**/*.spec.{ts,js,tsx,jsx}'],
    },
    resolve: {
        alias: [
            { find: '../src/cipher', replacement: path.resolve(__dirname, '../utils/src/cipher.ts') },
            { find: '../src/dom-util', replacement: path.resolve(__dirname, '../utils/src/dom-util.ts') },
            { find: '../src/is', replacement: path.resolve(__dirname, '../utils/src/is.ts') },
            { find: '../src/storage', replacement: path.resolve(__dirname, '../utils/src/storage.ts') },
            { find: '../src/utils', replacement: path.resolve(__dirname, '../utils/src/utils.ts') },
        ],
    },
});
