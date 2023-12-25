import { cliOptions } from "../enums/default-options";
import path from 'node:path'
import { copy } from "../utils/fs";
import { bin_run_ignore, bin_run_inherit } from "../utils/command";
import { has_template } from "../utils/template";
import { writeFileSync } from "fs-extra";
import { fileURLToPath } from 'node:url'
import { green, red, yellow } from "kolorist";

export function copy_template(targetDir: string, template?: string) {
    if (!has_template()) {
        return
    }

    console.log(yellow(`正在复制文件到${targetDir}`))
    const templatePath = path.resolve(fileURLToPath(import.meta.url), `../../template/${template || cliOptions.template}`);
    copy(templatePath, targetDir);
    // 处理 npmrc;
    const _code = `auto-install-peers = true\n
    registry=https://packages.aliyun.com/5f6426fcdb0493ecef9118ab/npm/npm-registry/\n
    //packages.aliyun.com/5f6426fcdb0493ecef9118ab/npm/npm-registry/:_authToken=${!!cliOptions.npmToken ? cliOptions.npmToken: '8189340c-e582-4d1d-9f9f-1cb14eb832ee'}\n
    SENTRYCLI_CDNURL=https://cdn.npmmirror.com/binaries/sentry-cli\n
    sharp_libvips_binary_host=https://npmmirror.com/mirrors/sharp-libvips\n
    sharp_binary_host=https://npmmirror.com/mirrors/sharp\n
    home=https://www.npmjs.org\n
    `;
    writeFileSync(`${targetDir}/.npmrc`, _code)
    console.log(green(`复制文件成功`))
}

export async function install() {
    const _name = cliOptions.infrastructureMode === 'monorepo' ? `${cliOptions.projectName}-monorepo`: cliOptions.projectName
    const _cwd = path.resolve(process.cwd(), _name)
    // 初始化 git
    if (cliOptions.gitUrl) {
        try {
            console.log(yellow(`正在推送到${cliOptions.gitUrl}`))
            await bin_run_ignore('git init', {
                cwd: _cwd
            });
            await bin_run_ignore('git add .', {
                cwd: _cwd
            });
            await bin_run_ignore('git commit -m "init project"', {
                cwd: _cwd
            });
            await bin_run_ignore(`git remote add origin ${cliOptions.gitUrl}`, {
                cwd: _cwd
            })
            console.log(green(`项目推送成功`))
        } catch (error) {
            console.log(red('git地址有误，跳过此步骤'))
        }
    };
    // 安装依赖
    if (cliOptions.packageManage !== 'none') {
        console.log(yellow(`正在安装依赖`))
        bin_run_inherit(`${cliOptions.packageManage} install`, {
            cwd: _cwd
        });
        console.log(green(`依赖安装成功`))
    }

}
