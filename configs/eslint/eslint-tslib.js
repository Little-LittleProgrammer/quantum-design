module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true
    },
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', require.resolve('./eslint-base')],
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
        '@typescript-eslint'
    ],
    rules: {
        '@typescript-eslint/indent': [2, 4, { SwitchCase: 1 }], // 缩进 SwitchCase,
        '@typescript-eslint/explicit-module-boundary-types': 'off'
    }
};

