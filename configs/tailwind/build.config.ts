import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
    clean: true,
    declaration: true,
    entries: ['src/index', './src/postcss.config'],
    rollup: {
        emitCJS: true,
    },
    externals: ['@manypkg/get-packages', 'autoprefixer', 'cssnano', 'postcss', 'postcss-antd-fixes', 'postcss-import', 'postcss-preset-env', 'tailwindcss', 'tailwindcss-animate'],
});
