import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { BaseClient } from '../base-client';
import type { TypeAppStackWorkflow } from '../../types/client';
import type { IAliConfig } from '../../enums/default-options';
import { formatRepoName } from '../../utils/tools';

class AppStackClient extends BaseClient {
    private appStackName: string;
    private workflows: TypeAppStackWorkflow = [];
    private workflowList: { workflowSn: string; stageSn: string }[] = [];
    private source: string = '';
    private repoName: string;

    constructor(aliConfig: Partial<IAliConfig>) {
        if (!aliConfig.token) {
            throw new Error('阿里云 token 未配置');
        }
        super({
            aliToken: aliConfig.token,
        });
        this.appStackName = aliConfig.appStackName || '';
        this.repoName = aliConfig.repoName || '';
    }

    // 获取应用栈
    public async getAppStack() {
        const url = `${this.baseUrl}/appstack/organizations/${this.aliOrgId}/apps/${this.appStackName}/releaseWorkflows`;
        try {
            const response: AxiosResponse = await axios.get(url, {
                headers: this.getAliHeaders,
            });
            this.workflows = response.data;
        } catch (error) {
            console.error('Error creating merge request:', error);
        }
    }

    public getWorkflows() {
        return this.workflows;
    }

    // 执行应用栈
    public async ExecuteAppStack(env: string, workflowList: { workflowSn: string; stageSn: string }[], source?: string) {
        if (source) {
            this.source = source;
        }
        const promiseList: Promise<any>[] = [];
        for (const workflow of workflowList) {
            const url = `${this.baseUrl}/appstack/organizations/${this.aliOrgId}/apps/${this.appStackName}/releaseWorkflows/${workflow.workflowSn}/releaseStages/${workflow.stageSn}:execute`;
            try {
                promiseList.push(axios.post(
                    url,
                    {
                        releaseWorkflowSn: workflow.workflowSn,
                        releaseStageSn: workflow.stageSn,
                        appStackName: this.appStackName,
                        params: {
                            FLOW_INST_RUNNING_COMMENT: '自动执行',
                            APP_ENV: env,
                            pipelineEnv: env,
                            [formatRepoName(this.repoName)]: this.source,
                        },
                    },
                    {
                        headers: this.getAliHeaders,
                    }
                ));
            } catch (error) {
                console.error('Error executing app stack:', error);
            }
        }
        const results = await Promise.all(promiseList);
        return results;
    }
}

export default AppStackClient;
