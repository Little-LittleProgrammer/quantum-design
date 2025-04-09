import { executeCodeup } from './command/codeup';
import { executeAppStack } from './command/app-stack';
import { need_update } from './utils/package';
import { get_argv, get_branch, get_diff } from './utils/command';
import fs from 'fs-extra';
import path from 'path';
import { getParams } from './utils/params-tools';
import { consoleInfo, setGlobalOptions } from './utils/question';
import pkg from '../package.json';
import { config } from 'dotenv';

config();

async function main() {
    // 首先判断是否带参数
    const _argv = get_argv();
    const _paramTarget = _argv._;
    if (_argv.v) {
        // 版本号
        console.log(pkg.version);
        return;
    }
    const _needUpdate = await need_update();
    if (!_needUpdate) {
        // 读取本地文件夹，获取基本信息；
        const configPath = path.resolve(process.cwd(), './qm-workflow.json');
        try {
            const baseStr = fs.readFileSync(configPath, 'utf-8');
            if (!baseStr) {
                throw new Error('没有找到本地配置文件');
            }
            const baseInfo = JSON.parse(baseStr);
            consoleInfo('读取本地配置文件成功');
            // 获取当前 git 分支
            const params = getParams();
            const source = params.getCurrentSourceWithMr();
            // 设置基础信息
            setGlobalOptions(baseInfo);
            // 设置环境变量
            setGlobalOptions(params);
            // 判断参数类型
            // 阿里云工作流
            if (_argv.a) {
                if (params.aliConfig.pipelineID && source) {
                    setGlobalOptions({
                        aliConfig: {
                            ...source.data,
                            pipelineID: params.aliConfig.pipelineID,
                        },
                    });
                } else {
                    const sourceBranch = await get_branch();
                    consoleInfo('获取当前 git 分支成功', sourceBranch);
                    const sourceDiff = await get_diff();
                    consoleInfo('获取当前 git 分支差异成功');
                    setGlobalOptions({
                        gitConfig: {
                            sourceBranch,
                            sourceDiff,
                        },
                    });
                }
                if (_paramTarget.includes('appstack') || _argv.a === 'appstack') {
                    // 执行应用栈逻辑
                    await executeAppStack(_paramTarget);
                } else {
                    // 执行创建 MR 逻辑
                    await executeCodeup();
                }
                return;
            } else if (_argv.f) {
                // 飞书工作流
                await executeFeishu();
            }
        } catch (error) {
            console.log('❌ 步骤出错: ' + error);
        }
    }
}
main();
