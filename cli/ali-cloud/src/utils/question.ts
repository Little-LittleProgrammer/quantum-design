import prompts from 'prompts'
import type {PromptObject} from 'prompts'
import { cliOptions } from '../enums/default-options';

export async function create_question(question: PromptObject | PromptObject[]) {
    const _res = await prompts(question, {
        onCancel: (error) => {
          if (error.choices?.length === 0) {
            throw new Error('❌' + error.name + ': 当前步骤选项为空')
          } 
          throw new Error('❌' + ' 操作取消')
        }
    });
    const _options = Object.assign(cliOptions, _res)
    return Promise.resolve(_options)
}

export function consoleInfo(...args: any[]) {
    console.log('🔍 提示 ====>', ...args)
}
