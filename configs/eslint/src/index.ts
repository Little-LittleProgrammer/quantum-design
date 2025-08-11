import type { Linter } from 'eslint';
import oxlint from 'eslint-plugin-oxlint';
import { javascript } from './configs/javascript';
import { prettier } from './configs/prettier';
import { turbo } from './configs/turbo';
import { typescript } from './configs/typescript';
import { vue } from './configs/vue';
import { test } from './configs/test';
import { regexp } from './configs/regexp';
import { jsdoc } from './configs/jsdoc';
import { node } from './configs/node';
import { jsonc } from './configs/jsonc';

type FlatConfig = Linter.Config;

type FlatConfigPromise = FlatConfig | FlatConfig[] | Promise<FlatConfig> | Promise<FlatConfig[]>;

async function defineEslintConfig(config: FlatConfig[] = []) {
    const baseIgnores: FlatConfig = {
        ignores: ['**/dist/**', '**/node_modules/**'],
    };
    const configs: FlatConfigPromise[] = [baseIgnores, vue(), javascript(), prettier(), typescript(), jsonc(), node(), jsdoc(), test(), regexp(), turbo(), ...config];
    const resolved = await Promise.all(configs);

    const extra = (oxlint.configs['flat/recommended'] ?? []) as FlatConfig[];
    return [...resolved.flat(), ...extra]; // oxlint should be the last one
}

export { defineEslintConfig };
