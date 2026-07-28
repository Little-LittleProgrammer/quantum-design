import { defineRolldownLibraryConfig } from '@quantum-design-configs/rolldown';
import pkg from './package.json' with { type: 'json' };

const externalTypeDependency = (id) => id.startsWith('node:') || id.includes('/node_modules/') || (!id.startsWith('.') && !id.startsWith('/'));

export default defineRolldownLibraryConfig({
    entries: [
        { name: 'sentry-cli', input: './src/vite-plugin.ts', dtsName: 'vite-plugin' },
        { name: 'sentry-inner', input: './src/project-inner.ts', dtsName: 'project-inner' },
        { name: 'sentry-nuxt', input: './src/project-nuxt.ts', dtsName: 'project-nuxt' },
    ],
    external: ['@sentry/tracing', '@sentry/vue', '@sentry/cli', '@sentry/browser', '@sentry/vite-plugin'],
    version: pkg.version,
    dts: {
        tsconfig: './tsconfig.build.json',
        external: externalTypeDependency,
    },
});
