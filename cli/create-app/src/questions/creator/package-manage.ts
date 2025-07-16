import { PromptObject } from 'prompts';
import { has_pnpm, has_yarn } from '../../utils/package';

const isPnpmInstalled = has_pnpm()
const isYarnInstalled = has_yarn()

export const pkgManageQuestion: PromptObject = {
    name: 'packageManage',
    type: 'select',
    message: '选择你的包管理器',
    choices: [
        { title: 'Not Install (Manual installation)', value: 'none' },
        {
          title: isPnpmInstalled ? 'Pnpm' : 'Pnpm (pnpm not install)',
          value: 'pnpm'
        },
        {
          title: isYarnInstalled ? 'Yarn' : 'Yarn (yarn not install)',
          value: 'yarn'
        },
        { title: 'Npm', value: 'npm' }
      ]
  }

  export const communicationQuestion: PromptObject = {
    name: 'communication',
    type: 'select',
    message: '选择通讯方式',
    choices: [
        { title: '不进行通讯', value: 'only_interface' },
        {
          title: 'JSON协议',
          value: 'only_http'
        },
        {
          title: 'Protobuf协议',
          value: ''
        },
      ]
  }