import axios from 'axios';
import type { AxiosResponse } from 'axios';
import {AliClient} from './base-client';
import type {AppStackSource, TypeAppStackWorkflow, ReleaseStage} from '../types/client';

class CodeupClient extends AliClient {
    private appName: string;
    private workflows: TypeAppStackWorkflow = [];
    private workflowList: {workflowSn: string, stageSn: string}[] = [];
    private source: string = '';

    constructor(token: string, source: AppStackSource) {
        super(token);
        this.appName = source.data.appName;
    }

    // 获取应用栈
    public async getAppStack() {
        const url = `${this.baseUrl}/appstack/organizations/${this.orgId}/apps/${this.appName}/releaseWorkflows`;
        try {
            const response: AxiosResponse = await axios.get(url, {
                headers: this.getHeaders,
            }); 
            this.workflows = response.data
            
        } catch (error) {
            console.error('Error creating merge request:', error);
        }

    }

    public getWorkflows() {
        return this.workflows;
    }

    // 执行应用栈
    public async ExecuteAppStack(env: string, workflowList: {workflowSn: string, stageSn: string}[], source?: string) {
        if (source) {
            this.source = source;
        }
        console.log('branch', {
            FLOW_INST_RUNNING_COMMENT: '自动执行',
            APP_ENV: env,
            pipelineEnv: env,
            my_source_1: this.source,
            nodejs: this.source,
            CI_COMMIT_REF_NAME: this.source,
            CI_COMMIT_REF_NAME_1: this.source,
        });
        for (let workflow of workflowList) {
            const url = `${this.baseUrl}/appstack/organizations/${this.orgId}/apps/${this.appName}/releaseWorkflows/${workflow.workflowSn}/releaseStages/${workflow.stageSn}:execute`;
            try {
                const response: AxiosResponse = await axios.post(url, {
                    releaseWorkflowSn: workflow.workflowSn,
                    releaseStageSn: workflow.stageSn,
                    appName: this.appName,
                    params: {
                        FLOW_INST_RUNNING_COMMENT: '自动执行',
                        APP_ENV: env,
                        pipelineEnv: env,
                        my_source_1: this.source,
                        CI_COMMIT_REF_NAME: this.source,
                        CI_COMMIT_REF_NAME_1: this.source,
                    }
                }, {
                    headers: this.getHeaders,
                }); 
                return response.data; // 返回响应数据
            } catch (error) {
            }
        }
       
    }

  
}

export default CodeupClient
