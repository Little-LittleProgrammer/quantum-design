import { PromptObject } from "prompts";
import { cliOptions } from "../../enums/default-options";
import { non_exist_dir_name } from "../../utils/fs";

let name = cliOptions.projectName

export const projectName: PromptObject[] = [{
    name: 'projectName',
    type: 'text',
    message: '请输入项目名称',
    initial: cliOptions.projectName,
    onState: (state) => {
        name = state.value
    }
}, {
    name: 'overwrite',
    type: () => (non_exist_dir_name(name) ? null : 'confirm'),
    message: () => {
        return `🚨🚨 文件夹 "${name}" 不为空，是否要覆盖此文件夹?`
    }
}, {
  name: 'overwrite',
  type: (prev, values) => {
    if (values.overwrite === false) {
      throw new Error('取消操作')
    }
    return null
  }
}]