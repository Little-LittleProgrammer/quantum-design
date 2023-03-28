module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true
    },
    extends: ['plugin:vue/vue3-essential', 'eslint:recommended', require.resolve('./eslint-base')],
    parserOptions: {
        ecmaVersion: 12,
        parser: '@typescript-eslint/parser',
        sourceType: 'module',
        jsxPragma: 'React',
        ecmaFeatures: {
            jsx: true
        }
    },
    plugins: [
        'vue',
        '@typescript-eslint'
    ],
    rules: {
        '@typescript-eslint/indent': [2, 4, { SwitchCase: 1 }], // 缩进 SwitchCase
        'vue/max-attributes-per-line': [2, {
            singleline: {
                'max': 10
            },
            multiline: {
                'max': 1
            }
        }],
        'vue/multi-word-component-names': 0,
        'vue/no-v-model-argument': 'off',
        'vue/no-v-for-template-key': 'off' // vue规定 key 必须使用在template上
    }
};
