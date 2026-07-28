import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
    test: {
        environment: 'happy-dom',
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: ['node_modules/', '__tests__/', 'dist/', '*.config.*'],
        },
        include: ['**/__tests__/**/*.test.ts'],
    },
    resolve: {
        alias: [
            { find: '@quantum-design/shared/enums', replacement: path.resolve(__dirname, '../shared/enums/enums.ts') },
            { find: '@quantum-design/shared', replacement: path.resolve(__dirname, '../shared') },
            { find: '@quantum-design/utils/extra', replacement: path.resolve(__dirname, '../utils/extra.ts') },
            { find: '@quantum-design/utils', replacement: path.resolve(__dirname, '../utils/index.ts') },
        ],
    },
});
