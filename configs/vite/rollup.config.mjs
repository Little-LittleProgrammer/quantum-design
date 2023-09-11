import { rollup_commpn_lib_config } from '@quantum-design-configs/rollup';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const pkg = require('./package.json');

const result = rollup_commpn_lib_config('vite', {
    external: [
        'vite',
        'vue',
        '@quantum-design/utils',
        '@sentry/vite-plugin',
        '@vitejs/plugin-vue',
        '@vitejs/plugin-vue-jsx',
        'postcss-pxtorem',
        'unplugin-vue-components',
        'unplugin-vue-components/vite',
        'vite-plugin-compression2',
        'vite-plugin-dts',
        'vite-plugin-html',
        'vite-plugin-pwa',
        '@quantum-design/shared'
    ]
}, pkg.version);

export default [...Object.values(result)];
