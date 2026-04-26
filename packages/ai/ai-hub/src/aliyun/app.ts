/**
 * 阿里云 AI 供应商实现
 * 使用 fetch + TransformStream + ReadableStream 实现流式响应
 * 支持 Function Call
 */
import { BaseAIProvider, type AIGenerateOptions, type AIResponse, type AIStreamResponse, type AIToolCall } from '../base';
import { type AliyunConfig, type AliyunRequest, type BailianRequest, type AliyunResponse, type BailianResponse, type AliyunStreamChunk, type BailianStreamChunk, type AliyunTool, AliyunModels, AliyunBaseURL } from './model';

/**
 * 流式事件类型
 */
interface StreamEvent {
    type: 'content' | 'tool_call' | 'usage' | 'done' | 'error';
    data?: unknown;
}

/**
 * 流式解析器状态
 */
interface StreamParserState {
    toolCalls: Map<number, { id: string; name: string; arguments: string }>;
    currentToolCallIndex: number;
}

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
            maxRetries: config.maxRetries || 3,
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
        this.rawBaseURL = this.aliyunConfig.bailianAppId ? `${this.aliyunBaseURL}/apps/${this.aliyunConfig.bailianAppId}/completion` : `${this.aliyunBaseURL}/services/aigc/text-generation/generation`;
    }

    /**
     * 带重试的 fetch 请求
     */
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
                        ...options.headers,
                    },
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

    private shouldRetryError(error: unknown): boolean {
        if (error instanceof Error) {
            return error.name === 'AbortError' || (error as Error & { code?: string }).code === 'ECONNABORTED';
        }
        return false;
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

    /**
     * 转换工具定义为阿里云格式
     */
    private transformTools(tools: AIGenerateOptions['tools']): AliyunTool[] | undefined {
        if (!tools || tools.length === 0) return undefined;

        return tools.map((tool) => ({
            type: 'function' as const,
            function: {
                name: tool.function.name,
                description: tool.function.description,
                parameters: tool.function.parameters,
            },
        }));
    }

    /**
     * 非流式生成
     */
    async generate(options: AIGenerateOptions): Promise<AIResponse> {
        try {
            let response: Response;

            if (this.aliyunConfig.bailianAppId) {
                // 使用百炼应用接口
                const prompt = this.messagesToPrompt(options.messages);
                const requestData: BailianRequest = {
                    input: { prompt, session_id: this.aliyunConfig.sessionId },
                };

                response = await this.fetchWithRetry(this.rawBaseURL, {
                    method: 'POST',
                    body: JSON.stringify(requestData),
                });
            } else {
                // 使用通义千问接口
                const requestData: AliyunRequest = {
                    model: this.config.modelName || AliyunModels.QWenTurbo,
                    input: {
                        messages: this.transformMessages(options.messages),
                    },
                    parameters: {
                        temperature: options.temperature,
                        max_tokens: options.maxTokens,
                        stop: options.stop,
                        result_format: options.resultFormat || 'message',
                    },
                    tools: this.transformTools(options.tools),
                    tool_choice: options.toolChoice,
                };

                response = await this.fetchWithRetry(this.rawBaseURL, {
                    method: 'POST',
                    body: JSON.stringify(requestData),
                });
            }

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const data: AliyunResponse | BailianResponse = await response.json();
            return this.transformResponse(data);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * 流式生成 - 使用 TransformStream
     */
    async *generateStream(options: AIGenerateOptions): AsyncGenerator<AIStreamResponse> {
        try {
            const response = await this.createStreamRequest(options);
            yield* this.processStreamWithTransformStream(response);
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
                input: { prompt, session_id: this.aliyunConfig.sessionId },
                parameters: {
                    incremental_output: true,
                    result_format: 'text',
                },
            };
        } else {
            // 使用通义千问流式接口
            requestData = {
                model: this.config.modelName || AliyunModels.QWenTurbo,
                input: {
                    messages: this.transformMessages(options.messages),
                },
                parameters: {
                    temperature: options.temperature,
                    max_tokens: options.maxTokens,
                    stop: options.stop,
                    result_format: options.resultFormat || 'message',
                    incremental_output: true,
                },
                tools: this.transformTools(options.tools),
                tool_choice: options.toolChoice,
            };
        }

        const response = await this.fetchWithRetry(this.rawBaseURL, {
            method: 'POST',
            body: JSON.stringify(requestData),
            headers: {
                'X-DashScope-SSE': 'enable',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        return response;
    }

    /**
     * 转换消息格式
     */
    private transformMessages(messages: AIGenerateOptions['messages']): AliyunRequest['input']['messages'] {
        return messages.map((msg) => {
            if (msg.role === 'tool' && msg.toolCallId) {
                return {
                    role: 'tool' as const,
                    content: msg.content,
                    tool_call_id: msg.toolCallId,
                };
            }
            if (msg.role === 'assistant' && msg.toolCalls) {
                return {
                    role: 'assistant' as const,
                    content: msg.content,
                    tool_calls: msg.toolCalls,
                };
            }
            return {
                role: msg.role as 'user' | 'assistant' | 'system',
                content: msg.content,
            };
        });
    }

    /**
     * 使用 TransformStream 处理流式响应
     */
    private async *processStreamWithTransformStream(response: Response): AsyncGenerator<AIStreamResponse> {
        if (!response.body) {
            throw new Error('No response body available');
        }

        const decoder = new TextDecoder();
        const parserState: StreamParserState = {
            toolCalls: new Map(),
            currentToolCallIndex: -1,
        };

        // 创建 TransformStream 来处理 SSE 数据
        const { readable, writable } = new TransformStream<Uint8Array, StreamEvent>({
            transform(chunk, controller) {
                const text = decoder.decode(chunk, { stream: true });
                const lines = text.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data:')) {
                        const data = line.slice(5).trim();
                        if (data === '[DONE]') {
                            controller.enqueue({ type: 'done' });
                            continue;
                        }

                        try {
                            const parsed = JSON.parse(data);
                            controller.enqueue({ type: 'content', data: parsed });
                        } catch {
                            // 忽略解析错误
                        }
                    }
                }
            },
        });

        // 启动管道
        response.body.pipeTo(writable).catch(() => {
            // 忽略管道错误
        });

        // 从 readable 读取事件
        const reader = readable.getReader();

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                if (value.type === 'done') {
                    // 返回最终响应
                    const finalResponse = this.buildFinalStreamResponse(parserState);
                    if (finalResponse) {
                        yield finalResponse;
                    }
                    break;
                }

                if (value.type === 'content' && value.data) {
                    const streamResponse = this.parseStreamChunk(value.data as AliyunStreamChunk | BailianStreamChunk, parserState);
                    if (streamResponse) {
                        yield streamResponse;
                    }
                }
            }
        } finally {
            reader.releaseLock();
        }
    }

    /**
     * 构建最终的流式响应（包含完整的 tool calls）
     */
    private buildFinalStreamResponse(parserState: StreamParserState): AIStreamResponse | null {
        if (parserState.toolCalls.size === 0) {
            return null;
        }

        const toolCalls: AIToolCall[] = [];
        parserState.toolCalls.forEach((toolCall, index) => {
            toolCalls.push({
                id: toolCall.id || `tool_call_${index}`,
                type: 'function',
                function: {
                    name: toolCall.name,
                    arguments: toolCall.arguments,
                },
            });
        });

        return {
            content: '',
            done: true,
            toolCalls,
        };
    }

    /**
     * 解析流式数据块
     */
    private parseStreamChunk(data: AliyunStreamChunk | BailianStreamChunk, parserState: StreamParserState): AIStreamResponse | null {
        if (this.aliyunConfig.bailianAppId) {
            return this.parseBailianStreamChunk(data as BailianStreamChunk);
        }
        return this.parseAliyunStreamChunk(data as AliyunStreamChunk, parserState);
    }

    /**
     * 解析百炼应用流式响应
     */
    private parseBailianStreamChunk(parsed: BailianStreamChunk): AIStreamResponse | null {
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
                      totalTokens: usage.input_tokens + usage.output_tokens,
                  }
                : undefined,
        };
    }

    /**
     * 解析通义千问流式响应（支持 function call）
     */
    private parseAliyunStreamChunk(parsed: AliyunStreamChunk, parserState: StreamParserState): AIStreamResponse | null {
        // 处理两种可能的流式响应格式
        let content = '';
        let reasoningContent: string | undefined;
        let finishReason: string | undefined;
        let toolCallDelta: { id?: string; name?: string; arguments?: string } | undefined;

        if (parsed.output.choices && parsed.output.choices.length > 0) {
            // 新版本格式：有 choices 数组
            const choice = parsed.output.choices[0];
            content = choice?.message?.content || '';
            reasoningContent = choice?.message?.reasoning_content;
            finishReason = choice?.finish_reason || '';

            // 处理 tool calls（流式增量）
            if (choice?.message?.tool_calls && choice.message.tool_calls.length > 0) {
                for (const toolCall of choice.message.tool_calls) {
                    const index = choice.index ?? 0;

                    if (!parserState.toolCalls.has(index)) {
                        parserState.toolCalls.set(index, {
                            id: toolCall.id || '',
                            name: toolCall.function?.name || '',
                            arguments: toolCall.function?.arguments || '',
                        });
                    } else {
                        // 增量更新
                        const existing = parserState.toolCalls.get(index)!;
                        if (toolCall.id) existing.id = toolCall.id;
                        if (toolCall.function?.name) existing.name = toolCall.function.name;
                        if (toolCall.function?.arguments) existing.arguments += toolCall.function.arguments;
                    }

                    // 返回增量信息
                    toolCallDelta = {
                        id: toolCall.id || undefined,
                        name: toolCall.function?.name || undefined,
                        arguments: toolCall.function?.arguments || undefined,
                    };
                }
            }
        } else if (parsed.output.text) {
            // 旧版本格式：直接的 text 字段
            content = parsed.output.text;
            finishReason = parsed.output.finish_reason;
        }

        const isDone = finishReason !== 'null' && finishReason !== null && finishReason !== '';

        return {
            content,
            reasoning_content: reasoningContent,
            done: isDone,
            usage: parsed.usage
                ? {
                      promptTokens: parsed.usage.input_tokens,
                      completionTokens: parsed.usage.output_tokens,
                      totalTokens: parsed.usage.total_tokens,
                  }
                : undefined,
            toolCallDelta,
        };
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
                    case 'tool':
                        return `Tool Result (${msg.toolCallId}): ${msg.content}`;
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
            let toolCalls: AIToolCall[] | undefined;

            if (response.output.choices && response.output.choices.length > 0) {
                // 新版本格式：有 choices 数组
                const choice = response.output.choices[0];
                content = choice?.message?.content || '';
                reasoningContent = choice?.message?.reasoning_content;
                finishReason = choice?.finish_reason || '';

                // 处理 function call
                if (choice?.message?.tool_calls && choice.message.tool_calls.length > 0) {
                    toolCalls = choice.message.tool_calls.map((tc) => ({
                        id: tc.id,
                        type: 'function' as const,
                        function: {
                            name: tc.function.name,
                            arguments: tc.function.arguments,
                        },
                    }));
                }
            } else if (response.output.text) {
                // 旧版本格式：直接的 text 字段
                content = response.output.text;
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
                    totalTokens: response.usage.total_tokens,
                },
                model: this.config.modelName,
                finishReason,
                toolCalls,
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
                          totalTokens: usage.input_tokens + usage.output_tokens,
                      }
                    : undefined,
                model: usage?.model_name || this.config.modelName,
                finishReason: 'stop',
            };
        }
    }

    /**
     * 处理错误
     */
    private handleError(error: unknown): Error {
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                return new Error('Aliyun AI API request timeout');
            } else if (error.message?.includes('HTTP')) {
                return new Error(`Aliyun AI API error: ${error.message}`);
            }
            return new Error(`Aliyun AI API error: ${error.message}`);
        }
        return new Error('Unknown error occurred');
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
