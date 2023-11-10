module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true
    },
    extends: ['plugin:vue/vue3-essential', 'eslint:recommended', require.resolve('./eslint-base')],
    plugins: [
        'vue'
    ],
    rules: {
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
