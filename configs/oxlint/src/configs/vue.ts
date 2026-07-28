import type { ConfigFragment } from '../types';

/**
 * Vue 规则，对应原 `configs/eslint/src/configs/vue.ts`。
 * oxlint 只检查 `.vue` 的 `<script>` 块，模板相关规则不再生效。
 */
export const vue: ConfigFragment = {
    plugins: ['vue'],
    rules: {
        'vue/no-reserved-component-names': 'off',
        'vue/prefer-import-from-vue': 'warn',
        'vue/prop-name-casing': 'off',
        'vue/require-default-prop': 'off',
        'vue/require-prop-types': 'off',
    },
};
