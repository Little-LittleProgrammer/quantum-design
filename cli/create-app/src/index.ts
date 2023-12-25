import { install } from "./command";
import { copy_project, delete_overwrite_dir } from "./compile";
import { cliOptions } from "./enums/default-options";
import { create_app_questions } from "./questions/creator";
import { otherQuestion } from "./questions/creator/other";
import { has_template } from "./utils/template";
import { get_argv } from "./utils/command";
import { need_update } from "./utils/package";
import { create_question } from "./utils/question";


async function create_app() {
    const _needUpdate = await need_update();
    if (!_needUpdate) {
        // 首先判断是否带参数
        const _argv = get_argv();
        const _paramTarget = _argv._;
        if (_paramTarget.length ) {
            if (_paramTarget.length === 2) {
                cliOptions.template = _paramTarget[1] as any;
                cliOptions.projectName = _paramTarget[0] as any;
                has_template()
                await create_question(otherQuestion) // 输入其他信息 
            } else {
                throw new Error('参数不合法，格式为 `cap 项目名称 项目模板`')
            }
        } else {
            await create_app_questions();
            await delete_overwrite_dir()
        }
        copy_project();
        install()
    }
}

create_app()