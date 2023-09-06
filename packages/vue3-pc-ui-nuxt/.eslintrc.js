module.exports = {
    extends: [require.resolve('@q-front-npm-configs/eslint/eslint-vue')],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
    }
};
