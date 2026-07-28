import { defineRolldownLibraryConfig } from '@quantum-design-configs/rolldown';
import pkg from './package.json' with { type: 'json' };

export default defineRolldownLibraryConfig({
    entries: { name: 'vite', input: './index.ts', dtsName: 'index' },
    formats: ['esm'],
    platform: 'node',
    external: [
        'vite',
        'vue',
        'rolldown',
        'rolldown-plugin-dts',
        '@quantum-design/utils',
        '@sentry/vite-plugin',
        '@vitejs/plugin-vue',
        '@vitejs/plugin-vue-jsx',
        'postcss-pxtorem',
        'unplugin-vue-components',
        'unplugin-vue-components/vite',
        'vite-plugin-compression2',
        'vite-plugin-pwa',
        '@quantum-design/shared',
    ],
    version: pkg.version,
    dts: { tsconfig: './tsconfig.build.json' },
});
