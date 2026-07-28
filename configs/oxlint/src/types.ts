import type { OxlintConfig } from 'oxlint';

export type OxlintRules = NonNullable<OxlintConfig['rules']>;

export type OxlintPlugins = NonNullable<OxlintConfig['plugins']>;

export type OxlintOverrides = NonNullable<OxlintConfig['overrides']>;

/**
 * 单个规则片段，用于按领域拆分配置后在入口合并。
 */
export interface ConfigFragment {
    plugins?: OxlintPlugins;
    rules?: OxlintRules;
    overrides?: OxlintOverrides;
}

export type { OxlintConfig };
