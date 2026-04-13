import { EventType } from '../constant';

import { PluginPipeline } from '../plugins/pipeline';
import { HttpSseTransport } from '../transport/httpSseTransport';
import type { AguiClientConfig, AguiPluginContext, AgUiRunInput, RunResult, RunSession, RunStreamOptions, StreamSubscriber } from '../types';
import { EventRouter } from './eventRouter';
import { ToolStreamAccumulator } from './toolStream';

function toError(error: unknown): Error {
    if (error instanceof Error) return error;
    return new Error(typeof error === 'string' ? error : 'Unknown AG-UI error');
}

function createRunResultFromError(input: AgUiRunInput, error: Error): RunResult {
    const isAbort = error.name === 'AbortError' || /abort/i.test(error.message);
    return {
        runId: input.runId,
        threadId: input.threadId,
        status: isAbort ? 'aborted' : 'error',
        error,
    };
}

function createDerivedRunId(baseRunId: string, round: number): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    return `${baseRunId}-tool-round-${round}-${Date.now()}`;
}

function safeStringify(value: unknown): string {
    if (typeof value === 'string') return value;
    try {
        return JSON.stringify(value);
    } catch {
        return String(value);
    }
}

export class AguiClient {
    private readonly transport: HttpSseTransport;
    private readonly pipeline: PluginPipeline;
    private readonly subscribers = new Set<StreamSubscriber>();
    private readonly sessionAbort = new Map<string, AbortController>();

    constructor(private readonly config: AguiClientConfig) {
        this.transport = new HttpSseTransport({
            url: config.url,
            headers: config.headers,
            fetch: config.fetch,
        });
        this.pipeline = new PluginPipeline(config.plugins ?? []);
    }

    subscribe(subscriber: StreamSubscriber): { unsubscribe: () => void } {
        this.subscribers.add(subscriber);
        return {
            unsubscribe: () => {
                this.subscribers.delete(subscriber);
            },
        };
    }

    abort(runId: string): void {
        this.sessionAbort.get(runId)?.abort();
    }

    runStream(input: AgUiRunInput, options: RunStreamOptions = {}): RunSession {
        const controller = new AbortController();
        const removeExternalAbort = this.bindAbortSignal(options.signal, controller);
        this.sessionAbort.set(input.runId, controller);

        const run = this.runInternal(input, options, controller.signal).finally(() => {
            removeExternalAbort?.();
            this.sessionAbort.delete(input.runId);
        });

        return {
            runId: input.runId,
            abort: () => controller.abort(),
            finished: run,
        };
    }

    private bindAbortSignal(signal: AbortSignal | undefined, controller: AbortController): (() => void) | undefined {
        if (!signal) return undefined;
        const onAbort = () => controller.abort();
        signal.addEventListener('abort', onAbort, { once: true });
        return () => signal.removeEventListener('abort', onAbort);
    }

    private async runInternal(input: AgUiRunInput, options: RunStreamOptions, signal: AbortSignal): Promise<RunResult> {
        const subscribers = new Set(this.subscribers);
        if (options.subscriber) subscribers.add(options.subscriber);
        const router = new EventRouter(subscribers);
        const executedToolCalls = new Set<string>();

        const context: AguiPluginContext = {
            runInput: input,
            runId: input.runId,
            threadId: input.threadId,
            requestHeaders: {
                ...this.config.headers,
                ...options.headers,
            },
            metadata: {},
        };

        let lastRunFinishedResult: unknown;

        try {
            await this.pipeline.executeConfigureContext(context);
            await this.pipeline.executeOnRunStart(context);

            const executeRound = async (roundInput: AgUiRunInput): Promise<AgUiRunInput['messages']> => {
                const toolAccumulator = new ToolStreamAccumulator();
                const generatedToolMessages: AgUiRunInput['messages'] = [];

                await this.transport.streamEvents({
                    input: roundInput,
                    signal,
                    headers: context.requestHeaders,
                    timeoutMs: options.timeoutMs ?? this.config.timeoutMs,
                    onEvent: async (event) => {
                        // 1. 事件流转换与过滤
                        const transformedEvent = await this.pipeline.executeTransformStream(event, context);
                        if (!transformedEvent) return;

                        // 2. 结果事件特殊处理
                        if (transformedEvent.type === EventType.RUN_FINISHED) {
                            lastRunFinishedResult = (transformedEvent as { result?: unknown }).result;
                        }

                        // 3. 全部事件都需要路由分发（如用于 UI 展示、日志、插件等分支）
                        await router.route(transformedEvent);

                        // 4. 工具调用解析与本地执行关键流程（只处理 type 为 TOOL_CALL_END 的事件）
                        const toolState = toolAccumulator.process(transformedEvent);
                        if (transformedEvent.type !== EventType.TOOL_CALL_END || !toolState) {
                            return;
                        }
                        // 跳过已执行过的 toolCallId，防止重复处理
                        if (executedToolCalls.has(toolState.toolCallId)) {
                            return;
                        }

                        // 找出注册表中对应工具执行器
                        const toolExecutor = options.toolExecutorRegistry?.[toolState.toolCallName];
                        if (!toolExecutor) {
                            // 工具未注册/未实现，直接跳过
                            return;
                        }
                        executedToolCalls.add(toolState.toolCallId);

                        try {
                            // 真正执行本地工具逻辑
                            const toolResult = await toolExecutor(toolState.argsJson ?? toolState.argsText, {
                                runId: roundInput.runId,
                                threadId: roundInput.threadId,
                                toolCallId: toolState.toolCallId,
                            });
                            // 工具调用成功，推送 TOOL_CALL_RESULT 事件，并积累“tool 消息”以便下一步合成
                            await router.route({
                                type: EventType.TOOL_CALL_RESULT,
                                toolCallId: toolState.toolCallId,
                                toolCallName: toolState.toolCallName,
                                content: toolResult,
                            });
                            generatedToolMessages.push({
                                id: `${toolState.toolCallId}-result`,
                                role: 'tool',
                                toolCallId: toolState.toolCallId,
                                content: safeStringify(toolResult),
                            } as AgUiRunInput['messages'][number]);
                        } catch (error) {
                            // 工具调用失败时的兜底逻辑
                            const toolError = toError(error);
                            await router.notifyError(toolError);
                            await router.route({
                                type: EventType.TOOL_CALL_RESULT,
                                toolCallId: toolState.toolCallId,
                                toolCallName: toolState.toolCallName,
                                content: { error: toolError.message },
                            });
                            generatedToolMessages.push({
                                id: `${toolState.toolCallId}-result`,
                                role: 'tool',
                                toolCallId: toolState.toolCallId,
                                content: toolError.message,
                                error: toolError.message,
                            } as AgUiRunInput['messages'][number]);
                        }
                    },
                });
                return generatedToolMessages;
            };

            let transformedInput = await this.pipeline.executeFirstResolveInput(input, context);
            transformedInput = await this.pipeline.executeTransformParams(transformedInput, context);
            context.runInput = transformedInput;
            context.runId = transformedInput.runId;
            context.threadId = transformedInput.threadId;

            const maxToolRoundTrips = options.maxToolRoundTrips ?? 3;
            let toolRoundTrips = 0;

            while (true) {
                const toolMessages = await executeRound(transformedInput);
                if (signal.aborted || toolMessages.length === 0 || toolRoundTrips >= maxToolRoundTrips) {
                    break;
                }

                toolRoundTrips += 1;
                const recursiveInput: AgUiRunInput = {
                    ...transformedInput,
                    runId: createDerivedRunId(transformedInput.runId, toolRoundTrips),
                    parentRunId: transformedInput.runId,
                    messages: [...transformedInput.messages, ...toolMessages] as AgUiRunInput['messages'],
                };

                transformedInput = await this.pipeline.executeTransformParams(recursiveInput, context);
                context.runInput = transformedInput;
                context.runId = transformedInput.runId;
                context.threadId = transformedInput.threadId;
            }

            const result: RunResult = {
                runId: transformedInput.runId,
                threadId: transformedInput.threadId,
                status: 'finished',
                result: lastRunFinishedResult,
            };
            const transformedResult = await this.pipeline.executeTransformResult(result, context);
            await this.pipeline.executeOnRunEnd(context, transformedResult);
            return transformedResult;
        } catch (error) {
            const err = toError(error);
            await router.notifyError(err);
            await this.pipeline.executeOnError(err, context);

            const result = createRunResultFromError(input, err);
            const transformedResult = await this.pipeline.executeTransformResult(result, context);
            if (transformedResult.status !== 'error' && transformedResult.status !== 'aborted') {
                transformedResult.status = 'error';
            }
            await this.pipeline.executeOnRunEnd(context, transformedResult);
            return transformedResult;
        }
    }
}

export function createAguiClient(config: AguiClientConfig): AguiClient {
    return new AguiClient(config);
}
