import { readFileSync, writeFileSync } from "fs-extra";
import { cliOptions } from "../enums/default-options";
import { get_root, rm_dir, rm_file } from "../utils/fs";
import { copy_template } from "../command";
import { monorepoNotNeed } from "../enums/template";

export function copy_project() {
    const _projectName = cliOptions.projectName
    const _templateName = cliOptions.template || ''
    if (cliOptions.infrastructureMode === 'monorepo') {
        if ( ['vue3', 'nuxt3'].includes(cliOptions.frame)) {
            // 复制 monorepo
            const _rootDir = get_root(`${_projectName}-monorepo`)
            copy_template(_rootDir, 'monorepo');
            // 复制子项目
            const _subDir = `${_rootDir}/${_templateName.includes('lib') ? 'packages': _templateName.includes('docs') ? 'docs' : 'apps'}/${_projectName}`;
            copy_template(_subDir);
            const _dirsList = [_subDir]
            if (!_templateName.includes('docs')) {
                // 复制文档
                const _docsDir = `${_rootDir}/docs/project-docs`;
                copy_template(_docsDir, 'vitepress-docs');
                _dirsList.push(_docsDir)
            }
            // 处理package.json
            for (let dir of _dirsList) {
                const pkgContent = readFileSync(`${dir}/package.json`, 'utf8');
                if (pkgContent) {
                    const _text = JSON.parse(pkgContent);
                    _text.name = dir.includes('docs') ? 'project-docs' : _projectName;
                    if (_text.devDependencies){
                        for (let key of monorepoNotNeed) {
                            _text.devDependencies[key] && Reflect.deleteProperty(_text.devDependencies, key)
                        }
                    }
                    writeFileSync(`${dir}/package.json`, JSON.stringify(_text))
                }
                // 删除内部的npmrc，以及gitignore;
                rm_file(`${dir}/.npmrc`)
                rm_file(`${dir}/.gitignore`)  
            }
        }
    } else {
        const _rootDir = get_root(`${_projectName}`);
        copy_template(_rootDir);
        // 更改 packagename;
        const pkgContent = readFileSync(`${_rootDir}/package.json`, 'utf8');
        if (pkgContent) {
            const _text = JSON.parse(pkgContent);
            _text.name = _projectName;
            writeFileSync(`${_rootDir}/package.json`, JSON.stringify(_text))
        }
    }
}


export function delete_overwrite_dir() {
    const _projectName = cliOptions.projectName
    if (cliOptions.overwrite) {
        const _rootDir = get_root(`${_projectName}`);
        rm_dir(_rootDir)
    }
    if (cliOptions.overwriteMonorepo) {
        const _rootDir = get_root(`${_projectName}-monorepo`);
        rm_dir(_rootDir)
    }
}