import type { AguiClientConfig, AgUiEvent, AgUiRunInput, AguiToolExecute, EventStreamSession, ExecutorBaseOptions, ExecutorRunOptions, GenerateTextParams, GenerateTextResult, InputSchemaTool, SerializableInputSchemaTool, StreamSubscriber, StreamTextParams, ToolCallAccumulatorState } from '../types';
import { createAguiClient } from './client';
import { ToolStreamAccumulator } from './toolStream';

function createRunId(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    return `run-${Date.now()}`;
}

export class AguiExecutor {
    constructor(
        private readonly clientConfig: AguiClientConfig,
        private readonly baseOptions: ExecutorBaseOptions,
    ) {}

    private resolveTools(params: StreamTextParams): InputSchemaTool[] {
        return params.tools ?? this.baseOptions?.tools ?? [];
    }

    private toSerializableTools(tools: InputSchemaTool[]): SerializableInputSchemaTool[] {
        return tools.map((tool) => ({
            name: tool.name,
            description: tool.description,
            parameters: tool.parameters,
        }));
    }

    private createToolExecutorRegistry(tools: InputSchemaTool[]): Record<string, AguiToolExecute> {
        const registry: Record<string, AguiToolExecute> = {};
        for (const tool of tools) {
            registry[tool.name] = tool.execute;
        }
        return registry;
    }

    private buildRunInput(params: StreamTextParams): AgUiRunInput {
        const tools = this.resolveTools(params);
        return {
            threadId: params.threadId ?? this.baseOptions.threadId ?? '',
            runId: params.runId ?? createRunId(),
            parentRunId: params.parentRunId,
            state: params.state ?? this.baseOptions.state ?? {},
            messages: params.messages,
            tools: this.toSerializableTools(tools) as AgUiRunInput['tools'],
            context: (params.context ?? this.baseOptions.context ?? []) as AgUiRunInput['context'],
            forwardedProps: {
                ...this.baseOptions.forwardedProps,
                ...params.forwardedProps,
            },
        };
    }

    private composeSubscriber(internal: StreamSubscriber, external?: StreamSubscriber): StreamSubscriber {
        if (!external) return internal;
        return {
            ...external,
            onEvent: async (event) => {
                await internal.onEvent?.(event);
                await external.onEvent?.(event);
            },
            onError: async (error) => {
                await internal.onError?.(error);
                await external.onError?.(error);
            },
        };
    }

    streamText(params: StreamTextParams, options: ExecutorRunOptions = {}): EventStreamSession {
        /**
         * 流式事件处理机制：
         * 情况	       | 处理方式
         * 生产快于消费	| 事件堆积在 queue，等消费者来取
         * 消费快于生产	| 消费者在 waiters 中等待新事件
         * 避免丢失事件 - 不会因为消费者还没准备好就丢弃事件
         * 避免死锁 - 不会因为生产者还没发事件就卡住消费者
         * 零拷贝 - 生产快于消费时，直接从 queue 取，不需要重新创建 Promise
         * 这和 Go 的 channel、Node.js 的 Stream 都是同样的设计思想。
         *
         */
        const queue: AgUiEvent[] = [];
        let completed = false;
        const waiters: Array<(value: IteratorResult<AgUiEvent>) => void> = [];

        const pushEvent = (event: AgUiEvent) => {
            if (waiters.length > 0) {
                const resolve = waiters.shift();
                resolve?.({ value: event, done: false });
                return;
            }
            queue.push(event);
        };

        const complete = () => {
            if (completed) return;
            completed = true;
            while (waiters.length > 0) {
                const resolve = waiters.shift();
                resolve?.({ value: undefined as never, done: true });
            }
        };

        const events: AsyncIterable<AgUiEvent> = {
            [Symbol.asyncIterator]() {
                return {
                    next: () => {
                        if (queue.length > 0) {
                            const value = queue.shift() as AgUiEvent;
                            return Promise.resolve({ value, done: false });
                        }
                        if (completed) {
                            return Promise.resolve({ value: undefined as never, done: true });
                        }
                        return new Promise<IteratorResult<AgUiEvent>>((resolve) => {
                            waiters.push(resolve);
                        });
                    },
                };
            },
        };

        const client = createAguiClient(this.clientConfig);
        const mergedTools = this.resolveTools(params);
        const runInput = this.buildRunInput(params);
        const subscriber: StreamSubscriber = {
            onEvent: (event) => {
                pushEvent(event);
            },
        };

        const session = client.runStream(runInput, {
            signal: options.signal,
            headers: options.headers,
            timeoutMs: options.timeoutMs,
            subscriber: this.composeSubscriber(subscriber, options.subscriber),
            toolExecutorRegistry: this.createToolExecutorRegistry(mergedTools),
        });

        const finished = session.finished.finally(() => {
            complete();
        });

        return {
            runId: session.runId,
            abort: session.abort,
            events,
            finished,
        };
    }

    async generateText(params: GenerateTextParams, options: ExecutorRunOptions = {}): Promise<GenerateTextResult> {
        const stream = this.streamText(params, options);
        const textParts: string[] = [];
        const reasoningParts: string[] = [];
        const toolCallMap = new Map<string, ToolCallAccumulatorState>();
        const toolAccumulator = new ToolStreamAccumulator();

        for await (const event of stream.events) {
            if (event.type === 'TEXT_MESSAGE_CONTENT') {
                textParts.push(String(event.delta ?? ''));
            }
            if (event.type === 'REASONING_MESSAGE_CONTENT' || event.type === 'REASONING_MESSAGE_CHUNK') {
                reasoningParts.push(String(event.delta ?? ''));
            }
            const toolState = toolAccumulator.process(event);
            if (toolState) {
                toolCallMap.set(toolState.toolCallId, toolState);
            }
        }

        const run = await stream.finished;
        return {
            run,
            text: textParts.join(''),
            reasoning: reasoningParts.join(''),
            toolCalls: [...toolCallMap.values()],
        };
    }
}

export function createExecutor(config: AguiClientConfig, baseOptions?: ExecutorBaseOptions): AguiExecutor {
    return new AguiExecutor(
        config,
        baseOptions ?? {
            threadId: '',
            state: {},
            tools: [],
            context: [],
            forwardedProps: {},
        },
    );
}
