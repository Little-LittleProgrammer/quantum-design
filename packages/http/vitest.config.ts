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
        alias: {
            '@quantum-design/shared': path.resolve(__dirname, '../shared'),
            '@quantum-design/utils': path.resolve(__dirname, '../utils'),
        },
    },
});
