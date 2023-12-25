import { cliOptions } from "../enums/default-options";
import { templateEnums } from "../enums/template";

export function has_template() {
    if (!(cliOptions.template && ~templateEnums.indexOf(cliOptions.template))) {
        throw new Error('模板输入有误')
    }
    return true
}