import type { ConfigFragment } from '../types';

/**
 * TypeScript 规则，对应原 `configs/eslint/src/configs/typescript.ts`。
 * 需要类型信息的规则未开启（依赖 `oxlint-tsgolint` 的 type-aware 模式）。
 */
export const typescript: ConfigFragment = {
    plugins: ['typescript'],
    rules: {
        'typescript/ban-ts-comment': [
            'warn',
            {
                'ts-check': false,
                'ts-expect-error': 'allow-with-description',
                'ts-ignore': 'allow-with-description',
                'ts-nocheck': 'allow-with-description',
            },
        ],
        'typescript/consistent-type-definitions': 'off',
        'typescript/explicit-function-return-type': 'off',
        'typescript/explicit-module-boundary-types': 'off',
        'typescript/no-duplicate-enum-values': 'warn',
        'typescript/no-dynamic-delete': 'warn',
        'typescript/no-explicit-any': 'off',
        'typescript/no-extra-non-null-assertion': 'warn',
        'typescript/no-extraneous-class': 'warn',
        'typescript/no-invalid-void-type': 'warn',
        'typescript/no-misused-new': 'warn',
        'typescript/no-namespace': 'off',
        'typescript/no-non-null-asserted-optional-chain': 'warn',
        // 原 ESLint 配置中虽声明为 error，但被 eslint-plugin-oxlint 的 recommended 覆盖，实际未生效
        'typescript/no-non-null-assertion': 'off',
        'typescript/no-this-alias': 'warn',
        'typescript/no-unnecessary-type-constraint': 'warn',
        'typescript/no-unsafe-declaration-merging': 'warn',
        'typescript/no-useless-empty-export': 'warn',
        'typescript/no-var-requires': 'warn',
        'typescript/no-wrapper-object-types': 'warn',
        'typescript/prefer-as-const': 'warn',
        'typescript/prefer-namespace-keyword': 'warn',
        'typescript/triple-slash-reference': 'warn',
        'typescript/unified-signatures': 'warn',
    },
};
