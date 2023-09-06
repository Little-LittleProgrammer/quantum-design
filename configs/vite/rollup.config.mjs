import { rollup_commpn_lib_config } from '@q-front-npm-configs/rollup';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const pkg = require('./package.json');

const result = rollup_commpn_lib_config('vite', {
    external: [
        'vite',
        'vue',
        '@q-front-npm/utils',
        '@sentry/vite-plugin',
        '@vitejs/plugin-vue',
        '@vitejs/plugin-vue-jsx',
        'postcss-pxtorem',
        'unplugin-vue-define-options',
        'vite-plugin-compression',
        'vite-plugin-dts',
        'vite-plugin-html',
        'vite-plugin-pwa'
    ]
}, pkg.version);

export default [...Object.values(result)];
