import {
    blue,
    cyan,
    magenta,
    yellow,
    green
  } from 'kolorist'
import { PromptObject } from 'prompts';
import { cliOptions } from '../../enums/default-options';
import { non_exist_dir_name } from '../../utils/fs';

let name = cliOptions.projectName + '-monorepo'

export const frameQuestion: PromptObject = {
    name: 'frame',
    type: 'select',
    message: '选择你的框架',
    choices: () => {
        if (cliOptions.infrastructureMode==='monorepo') {
            return [
                { title: blue('Vue3') , value: 'vue3'},
                { title: yellow('Nuxt3'), value: 'nuxt3'}
            ] 
        }
        return [
            { title: magenta('Vue2'), value: 'vue2' },
            { title: blue('Vue3') , value: 'vue3'},
            { title: cyan('Nuxt2'), value: 'nuxt2'},
            { title: yellow('Nuxt3'), value: 'nuxt3'}
        ]
    }
}

export const infrastructureMode:PromptObject[] = [{
    name: 'infrastructureMode',
    type: 'select',
    message: '选择你的基础框架',
    choices: [{
        title: 'monorepo', value: 'monorepo'
    }, {
        title: 'polyrepo', value: 'polyrepo'
    }],
    onState: (state) => {
        name = `${cliOptions.projectName}-${state.value}`
    }
},{
    name: 'overwriteMonorepo',
    type: () => (non_exist_dir_name(name) ? null : 'confirm'),
    message: () => {
        return `🚨🚨 文件夹 "${name}" 不为空，是否要覆盖此文件夹?`
    }
}, {
  name: 'overwriteMonorepo',
  type: (prev, values) => {
    if (values.overwriteMonorepo === false) {
      throw new Error('取消操作')
    }
    return null
  }
}]