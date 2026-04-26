/**
 * AI Hub 基础类型定义和接口
 */

/**
 * Function Call 工具定义
 */
export interface AITool {
    type: 'function';
    function: {
        name: string;
        description: string;
        parameters?: Record<string, unknown>;
    };
}

/**
 * Function Call 结果
 */
export interface AIToolCall {
    id: string;
    type: 'function';
    function: {
        name: string;
        arguments: string; // JSON string
    };
}

/**
 * Function Call 执行结果
 */
export interface AIToolResult {
    toolCallId: string;
    name: string;
    content: string; // 工具执行结果
}

export interface AIMessage {
    role: 'user' | 'assistant' | 'system' | 'tool';
    content: string;
    reasoning_content?: string;
    toolCalls?: AIToolCall[];
    toolCallId?: string; // 用于 role: 'tool' 消息
}

export interface AIResponse {
    content: string;
    reasoning_content?: string;
    usage?: {
        promptTokens?: number;
        completionTokens?: number;
        totalTokens?: number;
    };
    model?: string;
    finishReason?: string;
    toolCalls?: AIToolCall[];
}

export interface AIStreamResponse {
    content: string;
    reasoning_content?: string;
    done: boolean;
    usage?: {
        promptTokens?: number;
        completionTokens?: number;
        totalTokens?: number;
    };
    toolCalls?: AIToolCall[];
    toolCallDelta?: {
        id?: string;
        name?: string;
        arguments?: string;
    };
}

export interface AIGenerateOptions {
    messages: AIMessage[];
    temperature?: number;
    maxTokens?: number;
    stream?: boolean;
    stop?: string[];
    resultFormat?: 'text' | 'message';
    tools?: AITool[];
    toolChoice?: 'auto' | 'none' | { type: 'function'; function: { name: string } };
}

export interface AIConfig {
    apiKey: string;
    modelName?: string;
    baseURL?: string;
    timeout?: number;
    maxRetries?: number;
}

/**
 * AI 供应商基础抽象类
 */
export abstract class BaseAIProvider {
    protected config: AIConfig;

    constructor(config: AIConfig) {
        this.config = config;
    }

    /**
     * 生成文本回复
     */
    abstract generate(options: AIGenerateOptions): Promise<AIResponse>;

    /**
     * 流式生成文本回复
     */
    abstract generateStream(options: AIGenerateOptions): AsyncGenerator<AIStreamResponse>;

    /**
     * 验证配置
     */
    protected validateConfig(): void {
        if (!this.config.apiKey) {
            throw new Error('API Key is required');
        }
    }

    /**
     * 获取模型列表
     */
    abstract getModels(): Promise<string[]>;

    abstract clear(): void;
}

/**
 * AI Hub 管理器
 */
export class AIHub {
    private providers: Map<string, BaseAIProvider> = new Map();

    /**
     * 注册 AI 供应商
     */
    register(name: string, provider: BaseAIProvider): void {
        this.providers.set(name, provider);
    }

    /**
     * 获取指定供应商
     */
    getProvider(name: string): BaseAIProvider | undefined {
        return this.providers.get(name);
    }

    /**
     * 获取所有供应商名称
     */
    getProviderNames(): string[] {
        return Array.from(this.providers.keys());
    }

    /**
     * 使用指定供应商生成回复
     */
    async generate(providerName: string, options: AIGenerateOptions): Promise<AIResponse> {
        const provider = this.getProvider(providerName);
        if (!provider) {
            throw new Error(`Provider "${providerName}" not found`);
        }
        return provider.generate(options);
    }

    /**
     * 使用指定供应商流式生成回复
     */
    async *generateStream(providerName: string, options: AIGenerateOptions): AsyncGenerator<AIStreamResponse> {
        const provider = this.getProvider(providerName);
        if (!provider) {
            throw new Error(`Provider "${providerName}" not found`);
        }
        yield* provider.generateStream(options);
    }

    clear(name?: string) {
        if (name && this.providers.has(name)) {
            this.providers.get(name)?.clear();
        } else {
            for (const provider of this.providers.values()) {
                provider.clear();
            }
        }
    }

    delete(name: string) {
        if (this.providers.has(name)) {
            this.providers.delete(name);
        }
    }
}

// 导出默认实例
export const aiHub = new AIHub();
