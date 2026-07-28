import type { ConfigFragment } from '../types';

/**
 * JSDoc 规则，对应原 `configs/eslint/src/configs/jsdoc.ts`。
 * oxlint 未实现的规则（check-param-names / check-types / no-multi-asterisks /
 * require-returns-check / require-yields-check）已移除。
 */
export const jsdoc: ConfigFragment = {
    plugins: ['jsdoc'],
    rules: {
        'jsdoc/check-access': 'warn',
        // 会把文件头注释里的 `@quantum-design/xxx` 包名误判为非法 JSDoc 标签，原 ESLint 配置未启用
        'jsdoc/check-tag-names': 'off',
        'jsdoc/check-property-names': 'warn',
        'jsdoc/empty-tags': 'warn',
        'jsdoc/implements-on-classes': 'warn',
        'jsdoc/no-defaults': 'warn',
        'jsdoc/require-param-name': 'warn',
        'jsdoc/require-property': 'warn',
        'jsdoc/require-property-description': 'warn',
        'jsdoc/require-property-name': 'warn',
        'jsdoc/require-returns-description': 'warn',
    },
};
