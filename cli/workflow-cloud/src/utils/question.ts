import prompts from 'prompts';
import type {PromptObject} from 'prompts';
import { aliConfigKeys, cliOptions, feishuConfigKeys, gitConfigKeys, openaiConfigKeys, type ICliOptions } from '../enums/default-options';
import { merge } from 'lodash-es';

export async function create_question(question: PromptObject | PromptObject[]) {
    const _res = await prompts(question, {
        onCancel: (error) => {
            if (error.choices?.length === 0) {
                throw new Error('❌' + error.name + ': 当前步骤选项为空');
            }
            throw new Error('❌' + ' 操作取消');
        },
    });
    const _finConfig: Partial<ICliOptions> = {};
    console.log('question', _res);
    for (const key of Object.keys(_res)) {
        if (aliConfigKeys.includes(key)) {
            _finConfig.aliConfig = {
                [key]: _res[key],
            };
        } else if (gitConfigKeys.includes(key)) {
            _finConfig.gitConfig = {
                [key]: _res[key],
            };
        } else if (openaiConfigKeys.includes(key)) {
            _finConfig.openaiConfig = {
                [key]: _res[key],
            };
        } else if (feishuConfigKeys.includes(key)) {
            _finConfig.feishuConfig = {
                [key]: _res[key],
            };
        } else {
            _finConfig[key as keyof ICliOptions] = _res[key];
        }
    }
    setGlobalOptions(_finConfig);
    return Promise.resolve(_finConfig);
}

export function consoleInfo(...args: any[]) {
    console.log('🔍 提示 ====>', ...args);
}

export function setGlobalOptions(options: Partial<ICliOptions>) {
    merge(cliOptions, options);
}

export function getGlobalOptions() {
    return cliOptions;
}
