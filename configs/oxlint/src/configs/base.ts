import type { ConfigFragment } from '../types';

/**
 * ESLint 核心规则，对应原 `configs/eslint/src/configs/javascript.ts`。
 * 纯格式化类规则不再声明，统一由 prettier 接管。
 *
 * 严重级别统一为 `warn`：原 ESLint 配置虽声明为 `error`，但 `eslint-plugin-oxlint`
 * 会关闭与 oxlint 重叠的规则，实际从未阻断 CI。保持 `warn` 以确保迁移行为等价，
 * 后续可通过 `defineOxlintConfig({ categories: { correctness: 'error' } })` 收紧。
 */
export const base: ConfigFragment = {
    plugins: ['eslint'],
    rules: {
        'accessor-pairs': 'warn',
        'constructor-super': 'warn', // constructor 中继承其他 class 时必须调用 super
        'getter-return': 'warn',
        'new-cap': ['warn', { newIsCap: true, capIsNew: false }], // 构造函数首字母大写
        'no-array-constructor': 'warn',
        'no-caller': 'warn', // 禁止 arguments.caller / arguments.callee
        'no-class-assign': 'warn',
        'no-cond-assign': 'warn',
        'no-control-regex': 'off',
        'no-delete-var': 'warn',
        'no-dupe-class-members': 'warn',
        'no-dupe-keys': 'warn',
        'no-duplicate-case': 'warn',
        'no-empty-character-class': 'warn',
        'no-empty-function': ['warn', { allow: ['arrowFunctions', 'functions', 'methods'] }],
        'no-empty-pattern': 'warn',
        'no-empty-static-block': 'warn',
        'no-eval': 'warn',
        'no-ex-assign': 'warn',
        'no-extend-native': 'warn',
        'no-extra-bind': 'warn',
        'no-extra-boolean-cast': 'warn',
        'no-fallthrough': 'warn',
        'no-func-assign': 'warn',
        'no-global-assign': 'warn', // 原 no-native-reassign
        'no-implied-eval': 'warn',
        'no-inner-declarations': 'warn',
        'no-invalid-regexp': 'warn',
        'no-irregular-whitespace': 'warn',
        'no-iterator': 'warn',
        'no-label-var': 'warn',
        'no-labels': 'warn',
        'no-lone-blocks': 'warn',
        'no-multi-str': 'warn',
        'no-new-native-nonconstructor': 'warn', // 原 no-new-symbol
        'no-new-wrappers': 'warn',
        'no-obj-calls': 'warn',
        'no-object-constructor': 'warn', // 原 no-new-object
        'no-proto': 'warn',
        'no-redeclare': 'warn',
        'no-return-assign': ['warn', 'except-parens'],
        'no-self-assign': 'warn',
        'no-self-compare': 'warn',
        'no-sequences': 'warn',
        'no-shadow-restricted-names': 'warn',
        'no-sparse-arrays': 'warn',
        'no-this-before-super': 'warn',
        'no-throw-literal': 'warn',
        'no-undef': 'off',
        'no-unexpected-multiline': 'warn',
        'no-unmodified-loop-condition': 'warn',
        'no-unneeded-ternary': 'warn',
        'no-unreachable': 'warn',
        'no-unsafe-finally': 'warn',
        'no-unsafe-negation': 'warn', // 原 no-negated-in-lhs
        'no-unused-expressions': 'off',
        'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
        'no-use-before-define': 'off',
        'no-useless-call': 'warn',
        'no-useless-computed-key': 'warn',
        'no-useless-constructor': 'warn',
        'no-useless-escape': 'off',
        'no-var': 'warn',
        'no-with': 'warn',
        'prefer-const': 'warn',
        'require-yield': 'warn',
        'use-isnan': 'warn',
        'valid-typeof': 'warn',
        yoda: ['warn', 'never'], // 条件中变量在左，字面量在右
    },
};
