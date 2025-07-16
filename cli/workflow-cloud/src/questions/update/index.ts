import type { PromptObject } from "prompts";
import { create_question } from "../../utils/question";


export async function cli_update(version: string, oldVersion: string) {
    const cliUpdateQuestion:PromptObject = {
        type: 'confirm',
        name: 'isUpdate',
        message: `当前cli工具线上版本为${version}, 本地版本为${oldVersion}, 是否升级`,
        
    }
    return await create_question(cliUpdateQuestion)
}
