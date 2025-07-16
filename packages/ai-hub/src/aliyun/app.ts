/**
 * 阿里云 AI 供应商实现
 */
import { BaseAIProvider, type AIGenerateOptions, type AIResponse, type AIStreamResponse } from '../base';
import {
    type AliyunConfig,
    type AliyunRequest,
    type BailianRequest,
    type AliyunResponse,
    type BailianResponse,
    type AliyunStreamChunk,
    type BailianStreamChunk,
    AliyunModels,
    AliyunBaseURL
} from './model';

export class AliyunProvider extends BaseAIProvider {
    private rawBaseURL: string;
    private aliyunConfig: AliyunConfig;
    private aliyunBaseURL = AliyunBaseURL;

    constructor(config: AliyunConfig) {
        // 转换为基础配置
        const baseConfig = {
            apiKey: config.apiKey,
            modelName: config.modelName || AliyunModels.QWen3_32B_Instruct,
            baseURL: config.baseURL,
            timeout: config.timeout || 60000,
            maxRetries: config.maxRetries || 3
        };

        super(baseConfig);
        if (config.baseURL !== undefined) {
            this.aliyunBaseURL = config.baseURL;
        }
        this.aliyunConfig = config;
        this.rawBaseURL = this.aliyunBaseURL;
        this.validateConfig();
        this.initClient();
    }

    private initClient(): void {
        this.rawBaseURL = this.aliyunConfig.bailianAppId
            ? `${this.aliyunBaseURL}/apps/${this.aliyunConfig.bailianAppId}/completion`
            : `${this.aliyunBaseURL}/services/aigc/text-generation/generation`;
    }

    private async fetchWithRetry(url: string, options: RequestInit): Promise<Response> {
        let lastError: Error = new Error('Request failed after all retries');

        for (let attempt = 0; attempt <= (this.config.maxRetries || 3); attempt++) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

                const response = await fetch(url, {
                    ...options,
                    signal: controller.signal,
                    headers: {
                        Authorization: `Bearer ${this.config.apiKey}`,
                        'Content-Type': 'application/json',
                        ...options.headers
                    }
                });

                clearTimeout(timeoutId);

                if (response.ok || !this.shouldRetry(response.status)) {
                    return response;
                }

                if (attempt < (this.config.maxRetries || 3)) {
                    await this.delay(Math.pow(2, attempt + 1) * 1000); // 指数退避
                }

                lastError = new Error(`HTTP ${response.status}: ${response.statusText}`);
            } catch (error) {
                lastError = error as Error;

                if (attempt < (this.config.maxRetries || 3) && this.shouldRetryError(error)) {
                    await this.delay(Math.pow(2, attempt + 1) * 1000); // 指数退避
                    continue;
                }

                throw error;
            }
        }

        throw lastError;
    }

    private shouldRetry(status: number): boolean {
        return status >= 500;
    }

    private shouldRetryError(error: any): boolean {
        return error.name === 'AbortError' || error.code === 'ECONNABORTED';
    }

    private delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    protected override validateConfig(): void {
        super.validateConfig();
        if (this.aliyunConfig.bailianAppId && !this.aliyunConfig.sessionId) {
            // 为百炼应用生成默认 sessionId
            this.aliyunConfig.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }
    }

    clear(): void {
        this.aliyunConfig.sessionId = undefined;
    }

    async generate(options: AIGenerateOptions): Promise<AIResponse> {
        try {
            let response: Response;

            if (this.aliyunConfig.bailianAppId) {
                // 使用百炼应用接口
                const prompt = this.messagesToPrompt(options.messages);
                const requestData: BailianRequest = {
                    input: { prompt, session_id: this.aliyunConfig.sessionId}

                };

                response = await this.fetchWithRetry(this.rawBaseURL, {
                    method: 'POST',
                    body: JSON.stringify(requestData)
                });
            } else {
                // 使用通义千问接口
                const requestData: AliyunRequest = {
                    model: this.config.modelName || AliyunModels.QWenTurbo,
                    input: {
                        messages: options.messages.map((msg) => ({
                            role: msg.role,
                            content: msg.content
                        }))
                    },
                    parameters: {
                        temperature: options.temperature,
                        max_tokens: options.maxTokens,
                        stop: options.stop,
                        result_format: options.resultFormat || 'message'
                    }
                };

                response = await this.fetchWithRetry(this.rawBaseURL, {
                    method: 'POST',
                    body: JSON.stringify(requestData)
                });
            }

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data: AliyunResponse | BailianResponse = await response.json();
            return this.transformResponse(data);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async* generateStream(options: AIGenerateOptions): AsyncGenerator<AIStreamResponse> {
        try {
            const response = await this.createStreamRequest(options);
            yield * this.processStreamResponse(response);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * 创建流式请求
     */
    private async createStreamRequest(options: AIGenerateOptions): Promise<Response> {
        let requestData: AliyunRequest | BailianRequest;

        if (this.aliyunConfig.bailianAppId) {
            // 使用百炼应用流式接口
            const prompt = this.messagesToPrompt(options.messages);
            requestData = {
                input: { prompt, session_id: this.aliyunConfig.sessionId},
                parameters: {
                    incremental_output: true,
                    result_format: 'text'
                }
            };
        } else {
            // 使用通义千问流式接口
            requestData = {
                model: this.config.modelName || AliyunModels.QWenTurbo,
                input: {
                    messages: options.messages.map((msg) => ({
                        role: msg.role,
                        content: msg.content
                    }))
                },
                parameters: {
                    temperature: options.temperature,
                    max_tokens: options.maxTokens,
                    stop: options.stop,
                    result_format: options.resultFormat || 'message',
                    incremental_output: true
                }
            };
        }

        const response = await this.fetchWithRetry(this.rawBaseURL, {
            method: 'POST',
            body: JSON.stringify(requestData),
            headers: {
                'X-DashScope-SSE': 'enable'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return response;
    }

    /**
     * 处理流式响应
     */
    private async* processStreamResponse(response: Response): AsyncGenerator<AIStreamResponse> {
        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error('No response body reader available');
        }

        const decoder = new TextDecoder();
        let buffer = '';

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.startsWith('data:')) {
                        const data = line.slice(5);
                        if (data === '[DONE]') {
                            return;
                        }

                        try {
                            const streamResponse = this.parseStreamChunk(data);
                            if (streamResponse) {
                                yield streamResponse;
                            }
                        } catch (error) {
                            console.warn('Failed to parse stream chunk:', data, error);
                        }
                    }
                }
            }
        } finally {
            reader.releaseLock();
        }
    }

    /**
     * 解析流式数据块
     */
    private parseStreamChunk(data: string): AIStreamResponse | null {
        if (this.aliyunConfig.bailianAppId) {
            // 百炼应用响应解析
            const parsed: BailianStreamChunk = JSON.parse(data);

            // 更新 sessionId
            if (parsed.output.session_id) {
                this.aliyunConfig.sessionId = parsed.output.session_id;
            }

            const usage = parsed.usage?.models?.[0];
            return {
                content: parsed.output.text,
                reasoning_content: parsed.output.reasoning_content,
                done: parsed.output.finish_reason !== 'null',
                usage: usage
                    ? {
                        promptTokens: usage.input_tokens,
                        completionTokens: usage.output_tokens,
                        totalTokens: usage.input_tokens + usage.output_tokens
                    }
                    : undefined
            };
        } else {
            // 通义千问响应解析
            const parsed: AliyunStreamChunk = JSON.parse(data);

            // 处理两种可能的流式响应格式
            let content: string;
            let reasoningContent: string | undefined;
            let finishReason: string | undefined;

            if (parsed.output.choices && parsed.output.choices.length > 0) {
                // 新版本格式：有 choices 数组
                const choice = parsed.output.choices[0];
                content = choice?.message?.content || '';
                reasoningContent = choice?.message?.reasoning_content;
                finishReason = choice?.finish_reason || '';
            } else if (parsed.output.text) {
                // 旧版本格式：直接的 text 字段
                content = parsed.output.text;
                reasoningContent = undefined; // 旧格式不支持推理内容
                finishReason = parsed.output.finish_reason;
            } else {
                // 没有内容的情况
                content = '';
                reasoningContent = undefined;
                finishReason = parsed.output.finish_reason;
            }

            return {
                content,
                reasoning_content: reasoningContent,
                done: finishReason !== 'null' && finishReason !== null,
                usage: parsed.usage
                    ? {
                        promptTokens: parsed.usage.input_tokens,
                        completionTokens: parsed.usage.output_tokens,
                        totalTokens: parsed.usage.total_tokens
                    }
                    : undefined
            };
        }
    }

    async getModels(): Promise<string[]> {
        return Object.values(AliyunModels);
    }

    /**
     * 将消息数组转换为单个提示文本（用于百炼应用）
     */
    private messagesToPrompt(messages: AIGenerateOptions['messages']): string {
        return messages
            .map((msg) => {
                switch (msg.role) {
                    case 'system':
                        return `System: ${msg.content}`;
                    case 'user':
                        return `User: ${msg.content}`;
                    case 'assistant':
                        return `Assistant: ${msg.content}`;
                    default:
                        return msg.content;
                }
            })
            .join('\n\n');
    }

    /**
     * 转换响应格式
     */
    private transformResponse(data: AliyunResponse | BailianResponse): AIResponse {
        if ('output' in data && ('text' in data.output || 'choices' in data.output)) {
            // 通义千问响应
            const response = data as AliyunResponse;

            // 处理两种可能的响应格式
            let content: string;
            let reasoningContent: string | undefined;
            let finishReason: string;

            if (response.output.choices && response.output.choices.length > 0) {
                // 新版本格式：有 choices 数组
                const choice = response.output.choices[0];
                content = choice?.message?.content || '';
                reasoningContent = choice?.message?.reasoning_content;
                finishReason = choice?.finish_reason || '';
            } else if (response.output.text) {
                // 旧版本格式：直接的 text 字段
                content = response.output.text;
                reasoningContent = undefined; // 旧格式不支持推理内容
                finishReason = response.output.finish_reason || 'stop';
            } else {
                throw new Error('Invalid response format: no content found');
            }

            return {
                content,
                reasoning_content: reasoningContent,
                usage: {
                    promptTokens: response.usage.input_tokens,
                    completionTokens: response.usage.output_tokens,
                    totalTokens: response.usage.total_tokens
                },
                model: this.config.modelName,
                finishReason
            };
        } else {
            // 百炼应用响应
            const response = data as BailianResponse;
            const usage = response.usage.models[0];

            // 更新 sessionId
            if (response.output.session_id) {
                this.aliyunConfig.sessionId = response.output.session_id;
            }

            return {
                content: response.output.text,
                reasoning_content: response.output.reasoning_content,
                usage: usage
                    ? {
                        promptTokens: usage.input_tokens,
                        completionTokens: usage.output_tokens,
                        totalTokens: usage.input_tokens + usage.output_tokens
                    }
                    : undefined,
                model: usage?.model_name || this.config.modelName,
                finishReason: 'stop'
            };
        }
    }

    /**
     * 处理错误
     */
    private handleError(error: any): Error {
        if (error.name === 'AbortError') {
            return new Error('Aliyun AI API request timeout');
        } else if (error.message?.includes('HTTP')) {
            return new Error(`Aliyun AI API error: ${error.message}`);
        } else {
            return new Error(`Aliyun AI API error: ${error.message}`);
        }
    }

    /**
     * 获取当前会话 ID（用于百炼应用）
     */
    getSessionId(): string | undefined {
        return this.aliyunConfig.sessionId;
    }

    /**
     * 设置会话 ID（用于百炼应用）
     */
    setSessionId(sessionId: string): void {
        this.aliyunConfig.sessionId = sessionId;
    }
}
