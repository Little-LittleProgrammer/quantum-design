/**
 * 阿里云 AI 模型定义
 */

export enum AliyunModels {
    // 通义千问系列
    QWenTurbo = 'qwen-turbo-latest',
    QWenPlus = 'qwen-plus-latest',
    QWenMax = 'qwen-max-latest',
    QWen3_235B_Instruct = 'qwen3-235b-a22b',
    QWen3_32B_Instruct = 'qwen3-32b',
    QWen3_30B_Instruct = 'qwen3-30b-a3b',

    // DeepSeek 系列
    DeepSeekV3 = 'deepseek-v3',
    DeepSeekR1 = 'deepseek-r1',

    // 图片理解
    QvqMax = 'qvq-max-latest',

    // 其他模型
    Baichuan2_13B = 'baichuan2-13b-chat-v1',
    ChatGLM3_6B = 'chatglm3-6b',
    Yi_34B_Chat = 'yi-34b-chat',
}

export interface AliyunConfig {
    apiKey: string;
    modelName?: AliyunModels | string;
    baseURL?: string;
    timeout?: number;
    maxRetries?: number;
    // 百炼应用 ID（可选）
    bailianAppId?: string;
    // 会话 ID（可选，用于多轮对话）
    sessionId?: string;
}

// 模型参数配置
export interface AliyunModelConfig {
    // 生成时的核采样方法概率阈值
    top_p?: number;
    // 生成时采样候选集的大小
    top_k?: number;
    // 控制生成的随机性程度
    temperature?: number;
    // 最大生成长度
    max_tokens?: number;
    // 停止词
    stop?: string[];
    // 是否开启增量输出
    incremental_output?: boolean;
    // 响应格式，默认 text，支持 json_object
    result_format?: 'text' | 'message';
}

// 阿里云 API 请求格式
export interface AliyunRequest {
    model: string;
    input: {
        messages: Array<{
            role: 'user' | 'assistant' | 'system';
            content: string;
        }>;
    };
    parameters?: AliyunModelConfig;
}

// 百炼应用请求格式
export interface BailianRequest {
    input: {
        prompt: string;
        session_id?: string;
    };
}

// 阿里云 API 响应格式
export interface AliyunResponse {
    status_code?: number;
    request_id: string;
    code?: string;
    message?: string;
    output: {
        text?: string | null;
        finish_reason?: string | null;
        choices?: Array<{
            finish_reason: string;
            message: {
                role: string;
                content: string;
            };
        }>;
    };
    usage: {
        input_tokens: number;
        output_tokens: number;
        total_tokens: number;
    };
}

// 百炼应用响应格式
export interface BailianResponse {
    output: {
        text: string;
        session_id: string;
    };
    usage: {
        models: Array<{
            input_tokens: number;
            output_tokens: number;
            model_name: string;
        }>;
    };
    request_id: string;
}

// 流式响应格式
export interface AliyunStreamChunk {
    output: {
        text?: string;
        finish_reason?: string;
        choices?: Array<{
            finish_reason: string;
            message: {
                role: string;
                content: string;
            };
        }>;
    };
    usage?: {
        input_tokens: number;
        output_tokens: number;
        total_tokens: number;
    };
}

// 百炼应用流式响应格式
export interface BailianStreamChunk {
    output: {
        text: string;
        session_id?: string;
        finish_reason?: string;
    };
    usage?: {
        models: Array<{
            input_tokens: number;
            output_tokens: number;
            model_name: string;
        }>;
    };
}

export const AliyunBaseURL = 'https://dashscope.aliyuncs.com/api/v1';
