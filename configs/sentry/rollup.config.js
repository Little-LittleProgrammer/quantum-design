import { rollup_commpn_lib_config } from '@quantum-design-configs/rollup';
const result = rollup_commpn_lib_config([
    {name: 'sentry-cli', input: './src/vite-plugin.ts', },
    {name: 'sentry-inner', input: './src/project-inner.ts', },
    {name: 'sentry-nuxt', input: './src/project-nuxt.ts', }
], {
    external: [
        '@sentry/tracing',
        '@sentry/vue',
        '@sentry/cli',
        '@sentry/browser',
        '@sentry/vite-plugin'
    ],
});

export default [...Object.values(result)];
