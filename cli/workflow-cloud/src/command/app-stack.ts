import { type PromptObject } from 'prompts';
import AppStackClient from '../client/ali-client/app-stack';
import { create_question, setGlobalOptions } from '../utils/question';
import { get_change_apps, get_diff_files } from '../utils/command';
import type { TypeAppStackWorkflow } from '../types/client';
import { getGlobalOptions } from '../utils/question';

const questions: PromptObject[] = [];

export async function executeAppStack() {
    try {
        const options = getGlobalOptions();
        const appStackInstance = new AppStackClient(options.aliConfig);
        await appStackInstance.getAppStack();
        const res = appStackInstance.getWorkflows();
        // 根据当前分支来处理，如果当前分支名包括 测试，test，1关键字，我们则在post commit阶段自动执行
        if (options.gitConfig.sourceBranch?.includes('测试') || options.gitConfig.sourceBranch?.includes('test')) {
            // 在post commit阶段自动执行
            console.log('在post commit阶段自动执行');
            // 根据 diff文件来推断要发布哪个项目
            const needApps = get_change_apps(res) as TypeAppStackWorkflow;
            if (needApps.length === 0) {
                console.log('没有需要发布的项目');
            } else {
                const workflowList: {workflowSn: string, stageSn: string, stageName: string}[] = [];
                needApps.forEach(workflow => {
                    workflow.releaseStages.forEach(stage => {
                        workflowList.push({
                            workflowSn: workflow.sn,
                            stageSn: stage.sn,
                            stageName: stage.name,
                        });
                    });
                });
                // 通过正则匹配到分支里的数字
                const env = options.gitConfig.sourceBranch?.match(/\d+/)?.[0];
                if (env) {
                    // 根据 sourceBranch 来推断要发布哪个环境
                    console.log('workflowList', workflowList, env, options.gitConfig.sourceBranch);
                    const result = await appStackInstance.ExecuteAppStack(`test${env}`, workflowList, options.gitConfig.sourceBranch);
                    console.log('应用栈执行成功！');
                    return result;
                }
            }
        } else {
            // 平铺所有工作流和阶段用于选择
            const choices: PromptObject['choices'] = [];
            res.forEach((workflow) => {
                workflow.releaseStages.forEach((release) => {
                    choices.push({
                        title: `${workflow.name} - ${release.name}`,
                        value: {
                            workflowSn: workflow.sn,
                            stageSn: release.sn,
                            stageName: release.name,
                        },
                    });
                });
            });
            questions.push({
                name: 'selection',
                type: 'multiselect',
                message: '请选择要执行的项目和环境',
                choices,
            });
            await create_question(questions);
            await create_question({
                name: 'APP_ENV',
                type: 'select',
                message: '请选择应用环境',
                choices: [
                    { title: '测试环境1', value: 'test1', },
                    { title: '测试环境2', value: 'test2', },
                    { title: '测试环境3', value: 'test3', },
                    { title: '测试环境4', value: 'test4', },
                    { title: '测试环境5', value: 'test5', }
                ],
            });
            setGlobalOptions({
                aliConfig: {
                    pipelineEnv: options.aliConfig.APP_ENV,
                },
            });
            console.log('options.aliConfig.pipelineEnv!', options.aliConfig.pipelineEnv!, options.aliConfig.selection!, options.gitConfig.sourceBranch!);
            // 执行应用栈
            const result = await appStackInstance.ExecuteAppStack(options.aliConfig.pipelineEnv!, options.aliConfig.selection!, options.gitConfig.sourceBranch!);

            console.log('应用栈执行成功！');
            return result;
        }
    } catch (error) {
        console.log(error);
    }
}
