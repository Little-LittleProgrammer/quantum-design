/**
 * AI Hub 基础类型定义和接口
 */

export interface AIConfig {
    apiKey: string;
    modelName?: string;
    baseURL?: string;
    timeout?: number;
    maxRetries?: number;
}

export interface AIMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export interface AIResponse {
    content: string;
    usage?: {
        promptTokens?: number;
        completionTokens?: number;
        totalTokens?: number;
    };
    model?: string;
    finishReason?: string;
}

export interface AIStreamResponse {
    content: string;
    done: boolean;
    usage?: {
        promptTokens?: number;
        completionTokens?: number;
        totalTokens?: number;
    };
}

export interface AIGenerateOptions {
    messages: AIMessage[];
    temperature?: number;
    maxTokens?: number;
    stream?: boolean;
    stop?: string[];
    resultFormat?: 'text' | 'message';
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
        yield * provider.generateStream(options);
    }

    clear(name?: string) {
        if (name && this.providers.has(name)) {
            this.providers.get(name)!.clear();
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
