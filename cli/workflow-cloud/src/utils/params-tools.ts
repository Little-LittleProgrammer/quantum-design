import process from 'process';
import type { CodeSource } from '../types/client';
import { type IAliConfig, type IFeishuConfig, type IOpenaiConfig } from '../enums/default-options';
import { setGlobalOptions } from './question';

export class IParams {
    // 通用配置
    port: number = 8989;

    // 阿里云 配置
    aliConfig: IAliConfig = {
        token: '',
        orgId: '',
        targetBranch: 'master',
    };
    feishuConfig: IFeishuConfig = {
        appId: '',
        appSecret: '',
        appUserToken: '',
        projectId: '',
        projectSecret: '',
    };
    openaiConfig: IOpenaiConfig = {
        apiKey: '',
        modelName: '',
        bailianAppId: '',
    };

    getCurrentSourceWithMr(): CodeSource | null {
        // return {
        //     data: {
        //         branch: 'feature/作家中心支持异步导出',
        //         branchMode: false,
        //         cloneDepth: 0,
        //         codeupMrLocalId: 410,
        //         commitId: 'e77d22beccd89911878399e4ff905e8631680d1b',
        //         connection: 394291,
        //         displayName: '吴忠',
        //         displayUserEmail: 'wuzhong@qimao.com',
        //         isTrigger: true,
        //         method: 'http',
        //         password: '2451770757283c0e54156275bd29e9c5',
        //         projectId: '2835855',
        //         repo: 'https://codeup.aliyun.com/qimao/front/guanli-platform.qimao.com.git',
        //         repoUrl: 'https://packages.aliyun.com',
        //         submodule: false,
        //         userName: '5fb61742e1cf498f37f6a344',
        //         webhook: 'http://flow-openapi.aliyun.com/scm/webhook/VwzJ0mP0yJU3NgRVlaoJ',
        //     },
        //     name: 'guanli_platform_qimao_com',
        //     order: 1,
        //     sign: 'guanli_platform_qimao_com',
        //     type: 'codeup',
        // }
        if (!this.aliConfig.sources) {
            return null;
        }
        const sources: CodeSource[] = JSON.parse(this.aliConfig.sources! || '[]');
        const currentSource = sources.filter(source => source.type === 'codeup' && source.name === this.aliConfig.source!);
        if (currentSource.length === 1 && !!currentSource[0]?.data?.codeupMrLocalId) {
            return currentSource[0];
        }
        return null;
    }
}

export function getParams(): IParams {
    const params = new IParams();
    // 通用配置
    params.port = Number(process.env.PORT || 8989);
    // 阿里云 配置
    params.aliConfig.pipelineID = Number(process.env.PIPELINE_ID || 0);
    params.aliConfig.orgId = process.env.ORGANIZATION_ID as string;
    params.aliConfig.source = process.env.source as string;
    params.aliConfig.sources = process.env.SOURCES as string;
    params.aliConfig.token = process.env.ALI_TOKEN as string;
    params.aliConfig.repo = process.env.REPO as string;
    params.aliConfig.repoName = process.env.REPO_NAME as string;
    params.aliConfig.targetBranch = process.env.TARGET_BRANCH as string;
    params.aliConfig.appStackName = process.env.APP_STACK_NAME as string;
    params.aliConfig.appNameSn = process.env.APP_NAME_SN as string;
    params.aliConfig.APP_ENV = process.env.APP_ENV as string;
    params.aliConfig.pipelineEnv = process.env.PIPELINE_ENV as string;
    params.aliConfig.reviewerUsers = process.env.REVIEWER_USERS?.split(',') || [];

    // 百炼 api 配置
    params.openaiConfig.modelName = process.env.BAILIAN_MODELNAME as string;
    params.openaiConfig.apiKey = process.env.BAILIAN_API_KEY as string;
    params.openaiConfig.bailianAppId = process.env.BAILIAN_APP_ID as string;

    // 飞书 api 配置
    params.feishuConfig.appId = process.env.FEISHU_APP_ID as string;
    params.feishuConfig.appSecret = process.env.FEISHU_APP_SECRET as string;
    params.feishuConfig.projectId = process.env.FEISHU_PROJECT_APP_ID as string;
    params.feishuConfig.projectSecret = process.env.FEISHU_PROJECT_APP_SECRET as string;
    params.feishuConfig.spaceName = process.env.FEISHU_APP_SPACE_NAME as string;
    params.feishuConfig.appUserToken = process.env.FEISHU_APP_USER_TOKEN as string; // 测试用
    return params;
}

export function setParams(params: IParams) {
    setGlobalOptions(params);
}
