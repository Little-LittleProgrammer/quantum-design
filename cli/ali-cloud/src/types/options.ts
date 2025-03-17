export interface ICliOptions {
    isUpdate: boolean;
    token: string;
    orgId: string;
    sourceBranch?: string;
    targetBranch?: string;
    repoName?: string;
    appStackName?: string;
    appNameSn?: string;
    APP_ENV?: string;
    pipelineEnv?: string;
    stageName?: string;
    reviewerUsers?: string[];
    sourceDiff?: string;
    apiKey?: string;
    selection?: {
        workflowSn: string;
        stageSn: string;
        stageName: string;
    }[];
    codeupMrLocalId?: number;
    projectId?: number;
    repo?: string;
    modelName?: string;
}
