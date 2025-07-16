import { readFileSync, writeFileSync } from "fs-extra";
import { copy_template } from "../command";
import { cliOptions } from "../enums/default-options";
import { get_root } from "../utils/fs";

export function copy_api_project() {
    const _projectName = cliOptions.projectName
    const _communication = cliOptions.communication || 'only_http'
    const _rootDir = get_root(`${_projectName}-api`);
    const _tsDir = get_root(`${_projectName}-api/ts`);
    copy_template(_rootDir, 'api');
    // 更改 makefile 配置
    const makefileContent = readFileSync(`${_tsDir}/Makefile`, 'utf-8');
    if (makefileContent) {
        const _text = makefileContent.replace('{NEED_REPLACE}', _communication);
        writeFileSync(`${_tsDir}/Makefile`, _text, 'utf-8')
    }
    // 更改 packagename;
    const pkgContent = readFileSync(`${_tsDir}/package.json`, 'utf8');
    if (pkgContent) {
        const _text = JSON.parse(pkgContent);
        _text.name = _projectName;
        _text.main = `dist/${_projectName}.cjs.min.js`;
        _text.module = `dist/${_projectName}.esm.min.js`;
        writeFileSync(`${_tsDir}/package.json`, JSON.stringify(_text), 'utf-8')
    }
}