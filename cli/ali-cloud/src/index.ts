import { executeCodeup } from './command/codeup';
import { executeAppStack } from './command/app-stack';
import { need_update } from './utils/package';
import { get_argv, get_branch, get_diff } from './utils/command';
import fs from 'fs-extra';
import path from 'path';
import { cliOptions } from './enums/default-options';
import { getParams } from './utils/get-params';
import { consoleInfo } from './utils/question';
import pkg from '../package.json';

async function main() {
    const _needUpdate = await need_update();
    if (!_needUpdate) {
        // 读取本地文件夹，获取基本信息；
        const configPath = path.resolve(process.cwd(), './qm-ali.json');
        try {
            const baseStr = fs.readFileSync(configPath, 'utf-8');
            if (!baseStr) {
                throw new Error('没有找到本地配置文件');
            }
            const baseInfo = JSON.parse(baseStr);
            baseInfo.token = baseInfo.TOKEN;
            baseInfo.apiKey = baseInfo.API_KEY;
            consoleInfo('读取本地配置文件成功');
            // 获取当前 git 分支
            const params = getParams();
            const source = params.getCurrentSourceWithMr();
            Object.assign(cliOptions, baseInfo);
            if (params.apiKey) {
                Object.assign(cliOptions, {
                    apiKey: params.apiKey,
                });
            }
            if (params.modelName) {
                Object.assign(cliOptions, {
                    modelName: params.modelName,
                });
            }
            if (params.token) {
                Object.assign(cliOptions, {
                    token: params.token,
                });
            }
            if (params.pipelineID && source) {
                Object.assign(cliOptions, source.data);
            } else {
                const sourceBranch = await get_branch();
                consoleInfo('获取当前 git 分支成功', sourceBranch);
                const sourceDiff = await get_diff();
                consoleInfo('获取当前 git 分支差异成功');
                Object.assign(cliOptions, { sourceBranch, sourceDiff });
            }
            // 首先判断是否带参数
            const _argv = get_argv();
            // 判断参数类型
            if (_argv.c) {
                // 执行创建 MR 逻辑
                await executeCodeup();
                return;
            } else if (_argv.a) {
                // 执行应用栈逻辑
                await executeAppStack();
                return;
            } else if (_argv.v) {
                // 输出当前版本
                console.log(pkg.version);
                return;
            } else if (_argv.h) {
                // 输出帮助文档
                console.log(pkg.description);
                return;
            }
        } catch (error) {
            console.log('❌ 步骤出错: ' + error);
        }
    }
}
main();
