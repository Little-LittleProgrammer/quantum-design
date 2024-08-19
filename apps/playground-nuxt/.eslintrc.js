module.exports = {
    // This tells ESLint to load the config from the package `eslint-config-custom`
    extends: [require.resolve('@quantum-design-configs/eslint/eslint-tslib'), require.resolve('@quantum-design-configs/eslint/eslint-vue')]
};
