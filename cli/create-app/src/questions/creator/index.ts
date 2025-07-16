import { cliOptions } from "../../enums/default-options"
import { ICliOptions } from "../../type/options"
import { create_question } from "../../utils/question"
import { nuxt2TemplateQuestion, vue2TemplateQuestion } from "../vue2"
import { nuxt3TemplateQuestion, vue3TemplateQuestion } from "../vue3"
import { frameQuestion, infrastructureMode } from "./frame"
import { otherQuestion } from "./other"
import { communicationQuestion, pkgManageQuestion } from "./package-manage"
import { projectName } from "./project-name"

export async function create_app_questions() {
    try {
        await create_question(projectName) // 输入名称
        await create_question(pkgManageQuestion) // 选择包管理器
        await create_question(infrastructureMode) // 选择基础框架
        await create_question(frameQuestion) // 选择框架
        await choose_template(cliOptions.frame); // 选择模板
        await create_question(otherQuestion) // 输入其他信息
    } catch (error) {
        process.exit(1)
    }
}

export async function create_api_questions() {
    try {
        await create_question(projectName) // 输入项目名称
        await create_question(communicationQuestion) // 选择通讯方式
        await create_question(otherQuestion) // 输入其他信息
    } catch (error) {
        process.exit(1)
    }
}

async function choose_template(frame: ICliOptions['frame']) {
    const templateObj = {
        vue3: vue3TemplateQuestion,
        nuxt3: nuxt3TemplateQuestion,
        vue2: vue2TemplateQuestion,
        nuxt2: nuxt2TemplateQuestion
    };
    await create_question(templateObj[frame])
}