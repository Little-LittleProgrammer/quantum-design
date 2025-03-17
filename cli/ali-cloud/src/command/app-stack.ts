import { type PromptObject } from 'prompts';
import AppStackClient from '../client/app-stack';
import { create_question } from '../utils/question';
import { cliOptions } from '../enums/default-options';
import { get_change_apps, get_diff_files } from '../utils/command';
import type { TypeAppStackWorkflow } from '../types/client';

const questions: PromptObject[] = [];

export async function executeAppStack() {
    try {
        const appStackInstance = new AppStackClient(cliOptions.token, {
            type: 'appstack',
            name: '云效应用',
            data: {
                appName: cliOptions.appStackName!,
            },
        });
        await appStackInstance.getAppStack();
        const res = appStackInstance.getWorkflows();
        // 根据当前分支来处理，如果当前分支名包括 测试，test，1关键字，我们则在post commit阶段自动执行
        if (cliOptions.sourceBranch?.includes('测试') || cliOptions.sourceBranch?.includes('test')) {
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
                        })
                    })
                })
                // 通过正则匹配到分支里的数字
                const env = cliOptions.sourceBranch?.match(/\d+/)?.[0];
                if (env) {
                    // 根据 sourceBranch 来推断要发布哪个环境
                    const result = await appStackInstance.ExecuteAppStack(`test${env}`, workflowList, cliOptions.sourceBranch);
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
            Object.assign(cliOptions, cliOptions.selection);
            await create_question({
                name: 'APP_ENV',
                type: 'select',
                message: '请选择应用环境',
                choices: [
                    { title: '测试环境1', value: 'test1' },
                    { title: '测试环境2', value: 'test2' },
                    { title: '测试环境3', value: 'test3' },
                    { title: '测试环境4', value: 'test4' },
                    { title: '测试环境5', value: 'test5' },
                ],
            });
            cliOptions.pipelineEnv = cliOptions.APP_ENV;
            // 执行应用栈
            const result = await appStackInstance.ExecuteAppStack(cliOptions.pipelineEnv!, cliOptions.selection!, cliOptions.sourceBranch);

            console.log('应用栈执行成功！');
            return result;
        }
    } catch (error) {
        console.log(error);
    }
}
