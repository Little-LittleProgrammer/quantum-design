import type { ConfigFragment } from '../types';

/**
 * Node 规则，对应原 `configs/eslint/src/configs/node.ts`。
 * oxlint 未实现的规则（no-deprecated-api / no-extraneous-import /
 * no-unsupported-features/es-syntax / prefer-global/* / process-exit-as-throw）已移除。
 */
export const node: ConfigFragment = {
    plugins: ['node'],
    rules: {
        'node/handle-callback-err': 'warn',
        'node/no-exports-assign': 'warn',
        'node/no-new-require': 'warn',
        'node/no-path-concat': 'warn',
    },
};
