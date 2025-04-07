export interface IAliConfig {
    pipelineID?: number;
    token: string;
    orgId: string;
    repo?: string;
    repoName?: string;
    appStackName?: string;
    appNameSn?: string;
    APP_ENV?: string;
    pipelineEnv?: string;
    stageName?: string;
    reviewerUsers?: string[];
    sourceDiff?: string;
    selection?: {
        workflowSn: string;
        stageSn: string;
        stageName: string;
    }[];
    source?: any;
    sources?: any;
    codeupMrLocalId?: number;
    projectId?: number;
}

export interface IOpenaiConfig {
    apiKey: string;
    modelName: string;
}

export interface IFeishuConfig {
    // https://open.feishu.cn/app/cli_a751437852b01013/baseinfo
    appId: string; // 飞书 appId
    appSecret: string; // 飞书 appSecret
    spaceName?: string; // 飞书 知识库名称

    // https://project.feishu.cn/openapp/MII_67E261FCCF000013#app_key
    projectId?: string; // 飞书项目 projectId
    projectSecret?: string; // 飞书项目 projectSecret
    appUserToken?: string; // 飞书 appUserToken
}

export interface IGitConfig {
    sourceBranch: string;
    sourceDiff: string;
    targetBranch: string;
}

export interface ICliOptions {
    port: number;
    isUpdate: boolean;
    gitConfig: Partial<IGitConfig>;
    openaiConfig: Partial<IOpenaiConfig>;
    aliConfig: Partial<IAliConfig>;
    feishuConfig: Partial<IFeishuConfig>
}

export const cliOptions: ICliOptions = {
    port: 8989,
    isUpdate: false,
    gitConfig: {
        sourceBranch: '',
        sourceDiff: '',
        targetBranch: 'master',
    },
    openaiConfig: {
        apiKey: '',
        modelName: '',
    },
    aliConfig: {
        repo: '',
        token: '',
        orgId: '',
        repoName: '',
        appStackName: '',
        appNameSn: '',
        APP_ENV: '',
        pipelineEnv: '',
        stageName: '',
        reviewerUsers: [],
        sourceDiff: '',
        selection: [],
        codeupMrLocalId: 0,
        projectId: 0,
    },
    feishuConfig: {
        appId: '',
        appSecret: '',
        appUserToken: '',
        spaceName: '',
        projectId: '',
        projectSecret: '',
    },
};

export const aliConfigKeys = Object.keys(cliOptions.aliConfig);
export const gitConfigKeys = Object.keys(cliOptions.gitConfig);
export const openaiConfigKeys = Object.keys(cliOptions.openaiConfig);
export const feishuConfigKeys = Object.keys(cliOptions.feishuConfig);
