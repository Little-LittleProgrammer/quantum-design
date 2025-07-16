import { type PromptObject } from 'prompts';
import AppStackClient from '../client/ali-client/app-stack';
import { create_question, setGlobalOptions } from '../utils/question';
import { get_change_apps, get_diff_files } from '../utils/command';
import type { TypeAppStackWorkflow } from '../types/client';
import { getGlobalOptions } from '../utils/question';

const questions: PromptObject[] = [];

export async function executeAppStack(paramTarget: string[]) {
    try {
        const finParams: Record<string, string> = {};
        if (paramTarget.length > 0) {
            for (const item of paramTarget) {
                const [key, value] = item.split('=');
                if (key && value) {
                    finParams[key] = value;
                }
            }
        }

        const options = getGlobalOptions();
        const appStackInstance = new AppStackClient(options.aliConfig);
        await appStackInstance.getAppStack();
        const res = appStackInstance.getWorkflows();
        // 根据当前分支来处理，如果当前分支名包括 测试，test，1关键字，我们则在post commit阶段自动执行
        if (finParams.runEnv) {
            const sourceBranch = finParams.branch || options.gitConfig.sourceBranch;
            if (!sourceBranch) {
                console.error('sourceBranch 未配置');
                return;
            }
            let needApps: TypeAppStackWorkflow = [];
            if (!finParams.project) {
                needApps = res.length === 1 ? res : get_change_apps(res) as TypeAppStackWorkflow;
            } else {
                needApps = res.filter(item => item.name.includes(finParams.project!));
            }
            if (needApps.length === 0) {
                console.error('没有需要发布的项目');
                return;
            }
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
            const result = await appStackInstance.ExecuteAppStack(finParams.runEnv, workflowList, sourceBranch);
            console.log('应用栈执行成功！');
            return result;
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
            // 执行应用栈
            const result = await appStackInstance.ExecuteAppStack(options.aliConfig.pipelineEnv!, options.aliConfig.selection!, options.gitConfig.sourceBranch!);

            console.log('应用栈执行成功！');
            return result;
        }
    } catch (error) {
        console.log(error);
    }
}
