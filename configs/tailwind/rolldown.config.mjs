import { defineRolldownLibraryConfig } from '@quantum-design-configs/rolldown';
import pkg from './package.json' with { type: 'json' };

// v4 起主题以 CSS-first 方式定义在 theme.css 中（由使用方直接 @import），
// 不再需要按环境生成 content globs，故此处只构建 PostCSS 配置。
export default defineRolldownLibraryConfig({
    entries: [{ name: 'postcss.config', input: './src/postcss.config.ts', dtsName: 'postcss.config' }],
    formats: ['esm', 'cjs'],
    fileName: ({ entry, format }) => `${entry.name}.${format === 'esm' ? 'mjs' : 'cjs'}`,
    platform: 'node',
    minify: false,
    version: pkg.version,
    dts: {
        outDir: 'dist/types',
        tsconfig: './tsconfig.build.json',
        external: ['postcss', '@tailwindcss/postcss', 'cssnano', 'postcss-antd-fixes', 'postcss-preset-env'],
    },
});
