import type { ConfigFragment } from '../types';

/**
 * Vitest 规则，对应原 `configs/eslint/src/configs/test.ts`。
 * `test/no-only-tests` 由 `vitest/no-focused-tests` 承担。
 */
export const test: ConfigFragment = {
    plugins: ['vitest'],
    overrides: [
        {
            // oxlint 的 glob 不支持 ESLint 的 extglob（`?(...)`）语法，改用 brace 展开
            files: ['**/__tests__/**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}', '**/*.spec.{js,mjs,cjs,jsx,ts,mts,cts,tsx}', '**/*.test.{js,mjs,cjs,jsx,ts,mts,cts,tsx}', '**/*.bench.{js,mjs,cjs,jsx,ts,mts,cts,tsx}', '**/*.benchmark.{js,mjs,cjs,jsx,ts,mts,cts,tsx}'],
            env: { vitest: true },
            rules: {
                'no-console': 'off',
                'vitest/consistent-test-it': ['warn', { fn: 'it', withinDescribe: 'it' }],
                // 以下两条为 oxlint 默认开启、原 ESLint 配置未启用的规则，保持迁移前行为
                'vitest/require-mock-type-parameters': 'off',
                'vitest/no-conditional-expect': 'off',
                'vitest/no-focused-tests': 'warn',
                'vitest/no-identical-title': 'warn',
                'vitest/no-import-node-test': 'warn',
                'vitest/prefer-hooks-in-order': 'warn',
                'vitest/prefer-lowercase-title': 'warn',
            },
        },
    ],
};
