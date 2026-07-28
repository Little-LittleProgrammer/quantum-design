import type { ConfigFragment, OxlintConfig, OxlintOverrides, OxlintPlugins, OxlintRules } from './types';

import { base } from './configs/base';
import { jsdoc } from './configs/jsdoc';
import { node } from './configs/node';
import { test } from './configs/test';
import { typescript } from './configs/typescript';
import { vue } from './configs/vue';

const fragments: ConfigFragment[] = [base, typescript, vue, node, jsdoc, test];

/**
 * 组装 quantum-design 统一的 oxlint 配置。
 *
 * @param config 需要覆盖或追加的配置，`plugins`/`rules`/`overrides`/`ignorePatterns`
 *               与内置配置合并，其余字段直接覆盖。
 * @returns 完整的 oxlint 配置对象
 */
function defineOxlintConfig(config: OxlintConfig = {}): OxlintConfig {
    const { plugins: extraPlugins = [], rules: extraRules = {}, overrides: extraOverrides = [], ignorePatterns: extraIgnorePatterns = [], ...rest } = config;

    const plugins = new Set<OxlintPlugins[number]>();
    let rules: OxlintRules = {};
    let overrides: OxlintOverrides = [];

    for (const fragment of fragments) {
        for (const plugin of fragment.plugins ?? []) {
            plugins.add(plugin);
        }
        rules = { ...rules, ...fragment.rules };
        overrides = [...overrides, ...(fragment.overrides ?? [])];
    }

    for (const plugin of extraPlugins) {
        plugins.add(plugin);
    }

    return {
        plugins: [...plugins],
        env: {
            browser: true,
            es2024: true,
            node: true,
        },
        ignorePatterns: ['**/dist/**', '**/node_modules/**', ...extraIgnorePatterns],
        rules: { ...rules, ...extraRules },
        overrides: [...overrides, ...extraOverrides],
        ...rest,
    };
}

export { defineOxlintConfig };
export type { ConfigFragment, OxlintConfig };
