export class CodeSource {
    type!: string;
    name!: string;
    data!: {
        repoName?: string;
        sourceBranch?: string;
        targetBranch?: string;
        reviewerUsers?: string[];
        codeupMrLocalId: number
        projectId: number
        repo: string
    };
}

export class AppStackSource {
    type!: string;
    name!: string;
    data!: {
        appName: string;
    };
}

interface Label {
    namespace: string;
    name: string;
    value: string;
    displayName: string;
    displayValue: string;
    extraMap: Record<string, any>;
}

interface PipelineConfig {
    settings: string; // 这里是 JSON 字符串
    creator: string;
    gmtModified: number;
    webhook: string;
    sources: string; // 这里是 JSON 字符串
}

interface Pipeline {
    pipeline: {
        pipelineConfigVo: PipelineConfig;
    };
}

export interface ReleaseStage {
    appName: string;
    name: string;
    sn: string;
    releaseWorkflowSn: string;
    order: string;
    labels: Label[];
    pipeline: Pipeline;
}

export interface AppRelease {
    appName: string;
    sn: string;
    name: string;
    order: string;
    type: string;
    releaseStages: ReleaseStage[];
}

export type TypeAppStackWorkflow = AppRelease[];

export type FeishuDocType = 'doc' | 'docx' | 'sheet' | 'mindnote' | 'bitable' | 'file' | 'slides' | 'wiki';

export type FeishuParentType = 'doc_image' | 'docx_image' | 'sheet_image' | 'doc_file' | 'docx_file' | 'sheet_file' | 'vc_virtual_background' | 'bitable_image' | 'bitable_file' | 'moments' | 'ccm_import_open' | 'calendar' | 'base_global' | 'lark_ai_media_analysis';
