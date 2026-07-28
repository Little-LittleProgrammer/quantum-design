import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'happy-dom',
        include: ['**/__tests__/**/*.test.{ts,js,tsx,jsx}'],
        setupFiles: ['./vitest.setup.ts'],
    },
});
