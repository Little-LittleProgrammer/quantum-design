module.exports = {
    extends: [require.resolve('@quantum-design-configs/eslint/eslint-tslib')],
    rules: {
        'comma-dangle': [
            'error',
            'never'
        ]
    }
};
