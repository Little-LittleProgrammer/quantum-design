import { PromptObject } from "prompts";
import { cliOptions } from "../../enums/default-options";

export const otherQuestion:PromptObject[] = [{
    type: 'text',
    name: 'gitUrl',
    message: '输入你的git仓库地址'
}]
