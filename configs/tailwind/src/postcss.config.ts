/**
 * Tailwind CSS v4 的 PostCSS 配置。
 *
 * 与 v3 的差异：
 * - PostCSS 插件由独立包 `@tailwindcss/postcss` 提供（v3 由 tailwindcss 本体提供）；
 * - 主题不再通过 JS config 对象传入，改为在 CSS 入口 `@import` 主题文件；
 * - `postcss-import` 与 `autoprefixer` 的能力已内置，无需再挂载。
 */
export default {
    plugins: {
        ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {}),
        // 修复 element-plus 和 ant-design-vue 的样式和tailwindcss冲突问题
        'postcss-antd-fixes': { prefixes: ['ant', 'el'] },
        'postcss-preset-env': {},
        '@tailwindcss/postcss': {},
    },
};
