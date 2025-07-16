import { install } from "./command";
import { delete_overwrite_dir } from "./compile";
import { copy_api_project  } from "./compile/api";
import { cliOptions } from "./enums/default-options";
import { create_api_questions } from "./questions/creator";
import { otherQuestion } from "./questions/creator/other";
import { get_argv } from "./utils/command";
import { need_update } from "./utils/package";
import { create_question } from "./utils/question";


async function create_api() {
    const _needUpdate = await need_update();
    if (!_needUpdate) {
        // 首先判断是否带参数
        const _argv = get_argv();
        const _paramTarget = _argv._;
        if (_paramTarget.length ) {
            if (_paramTarget.length === 1) {
                cliOptions.projectName = _paramTarget[0] as any;
                await create_question(otherQuestion) // 输入其他信息 
            } else {
                throw new Error('参数不合法，格式为 `qmca 项目名称 项目模板`')
            }
        } else {
            await create_api_questions();
            await delete_overwrite_dir()
        }
        copy_api_project();
        install('-api/ts')
    }
}

create_api()