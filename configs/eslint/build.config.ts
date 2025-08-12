import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
    clean: true,
    declaration: true,
    failOnWarn: false,
    entries: ['src/index'],
    externals: [
        // dependencies
        'globals',
        // peerDependencies
        'eslint',
        '@eslint/js',
        '@typescript-eslint/eslint-plugin',
        '@typescript-eslint/parser',
        'eslint-config-turbo',
        'eslint-plugin-jsdoc',
        'eslint-plugin-jsonc',
        'jsonc-eslint-parser',
        'eslint-plugin-n',
        'eslint-plugin-no-only-tests',
        'eslint-plugin-prettier',
        'eslint-plugin-regexp',
        'eslint-plugin-unused-imports',
        'eslint-plugin-vitest',
        'eslint-plugin-vue',
        'vue-eslint-parser',
        'eslint-plugin-oxlint',
    ],
});
