import type { RunAgentInput } from '@ag-ui/core';
import { EventType } from './constant';

export type AgUiRunInput = RunAgentInput;

// ==================== 事件 Payload 类型定义 ====================

/** 基础事件字段 */
interface BaseEventPayload {
    timestamp?: number;
    rawEvent?: unknown;
}

/** 运行开始事件 */
export interface RunStartedEvent extends BaseEventPayload {
    type: EventType.RUN_STARTED;
    runId: string;
    threadId: string;
}

/** 运行完成事件 */
export interface RunFinishedEvent extends BaseEventPayload {
    type: EventType.RUN_FINISHED;
    runId: string;
    threadId: string;
    result?: unknown;
}

/** 运行错误事件 */
export interface RunErrorEvent extends BaseEventPayload {
    type: EventType.RUN_ERROR;
    runId?: string;
    threadId?: string;
    code: string;
    message: string;
}

/** 步骤开始事件 */
export interface StepStartedEvent extends BaseEventPayload {
    type: EventType.STEP_STARTED;
    stepId?: string;
    stepName?: string;
}

/** 步骤完成事件 */
export interface StepFinishedEvent extends BaseEventPayload {
    type: EventType.STEP_FINISHED;
    stepId?: string;
    stepName?: string;
}

/** 文本消息开始事件 */
export interface TextMessageStartEvent extends BaseEventPayload {
    type: EventType.TEXT_MESSAGE_START;
    messageId: string;
    role?: string;
}

/** 文本消息内容事件 */
export interface TextMessageContentEvent extends BaseEventPayload {
    type: EventType.TEXT_MESSAGE_CONTENT;
    messageId: string;
    delta?: string;
    content?: string;
}

/** 文本消息结束事件 */
export interface TextMessageEndEvent extends BaseEventPayload {
    type: EventType.TEXT_MESSAGE_END;
    messageId: string;
}

/** 文本消息分块事件 */
export interface TextMessageChunkEvent extends BaseEventPayload {
    type: EventType.TEXT_MESSAGE_CHUNK;
    messageId?: string;
    delta?: string;
    content?: string;
}

/** 工具调用开始事件 */
export interface ToolCallStartEvent extends BaseEventPayload {
    type: EventType.TOOL_CALL_START;
    toolCallId: string;
    toolCallName: string;
    parentMessageId?: string;
}

/** 工具调用参数事件 */
export interface ToolCallArgsEvent extends BaseEventPayload {
    type: EventType.TOOL_CALL_ARGS;
    toolCallId: string;
    toolCallName?: string;
    parentMessageId?: string;
    delta: string;
}

/** 工具调用结束事件 */
export interface ToolCallEndEvent extends BaseEventPayload {
    type: EventType.TOOL_CALL_END;
    toolCallId: string;
    toolCallName?: string;
    parentMessageId?: string;
}

/** 工具调用分块事件 */
export interface ToolCallChunkEvent extends BaseEventPayload {
    type: EventType.TOOL_CALL_CHUNK;
    toolCallId: string;
    toolCallName?: string;
    parentMessageId?: string;
    delta?: string;
}

/** 工具调用结果事件 */
export interface ToolCallResultEvent extends BaseEventPayload {
    type: EventType.TOOL_CALL_RESULT;
    toolCallId: string;
    toolCallName?: string;
    parentMessageId?: string;
    messageId?: string;
    content?: unknown;
}

/** 推理开始事件 */
export interface ReasoningStartEvent extends BaseEventPayload {
    type: EventType.REASONING_START;
    messageId?: string;
}

/** 推理结束事件 */
export interface ReasoningEndEvent extends BaseEventPayload {
    type: EventType.REASONING_END;
    messageId?: string;
}

/** 推理消息开始事件 */
export interface ReasoningMessageStartEvent extends BaseEventPayload {
    type: EventType.REASONING_MESSAGE_START;
    messageId: string;
}

/** 推理消息内容事件 */
export interface ReasoningMessageContentEvent extends BaseEventPayload {
    type: EventType.REASONING_MESSAGE_CONTENT;
    messageId: string;
    delta?: string;
    content?: string;
}

/** 推理消息分块事件 */
export interface ReasoningMessageChunkEvent extends BaseEventPayload {
    type: EventType.REASONING_MESSAGE_CHUNK;
    messageId?: string;
    delta?: string;
}

/** 推理消息结束事件 */
export interface ReasoningMessageEndEvent extends BaseEventPayload {
    type: EventType.REASONING_MESSAGE_END;
    messageId: string;
}

/** 推理加密值事件 */
export interface ReasoningEncryptedValueEvent extends BaseEventPayload {
    type: EventType.REASONING_ENCRYPTED_VALUE;
    messageId?: string;
    encryptedValue?: unknown;
}

/** 状态快照事件 */
export interface StateSnapshotEvent extends BaseEventPayload {
    type: EventType.STATE_SNAPSHOT;
    snapshot?: unknown;
}

/** 状态增量更新事件 */
export interface StateDeltaEvent extends BaseEventPayload {
    type: EventType.STATE_DELTA;
    delta?: unknown;
}

/** 消息快照事件 */
export interface MessagesSnapshotEvent extends BaseEventPayload {
    type: EventType.MESSAGES_SNAPSHOT;
    messages?: unknown[];
}

/** 活动快照事件 */
export interface ActivitySnapshotEvent extends BaseEventPayload {
    type: EventType.ACTIVITY_SNAPSHOT;
    activities?: unknown[];
}

/** 活动增量更新事件 */
export interface ActivityDeltaEvent extends BaseEventPayload {
    type: EventType.ACTIVITY_DELTA;
    delta?: unknown;
}

/** 原始事件 */
export interface RawEvent extends BaseEventPayload {
    type: EventType.RAW;
    rawEvent?: unknown;
    [key: string]: unknown;
}

/** 自定义事件 */
export interface CustomEvent extends BaseEventPayload {
    type: EventType.CUSTOM;
    name?: string;
    [key: string]: unknown;
}

/** 事件类型映射表 */
export interface EventTypeMap {
    [EventType.RUN_STARTED]: RunStartedEvent;
    [EventType.RUN_FINISHED]: RunFinishedEvent;
    [EventType.RUN_ERROR]: RunErrorEvent;
    [EventType.STEP_STARTED]: StepStartedEvent;
    [EventType.STEP_FINISHED]: StepFinishedEvent;
    [EventType.TEXT_MESSAGE_START]: TextMessageStartEvent;
    [EventType.TEXT_MESSAGE_CONTENT]: TextMessageContentEvent;
    [EventType.TEXT_MESSAGE_END]: TextMessageEndEvent;
    [EventType.TEXT_MESSAGE_CHUNK]: TextMessageChunkEvent;
    [EventType.TOOL_CALL_START]: ToolCallStartEvent;
    [EventType.TOOL_CALL_ARGS]: ToolCallArgsEvent;
    [EventType.TOOL_CALL_END]: ToolCallEndEvent;
    [EventType.TOOL_CALL_CHUNK]: ToolCallChunkEvent;
    [EventType.TOOL_CALL_RESULT]: ToolCallResultEvent;
    [EventType.REASONING_START]: ReasoningStartEvent;
    [EventType.REASONING_END]: ReasoningEndEvent;
    [EventType.REASONING_MESSAGE_START]: ReasoningMessageStartEvent;
    [EventType.REASONING_MESSAGE_CONTENT]: ReasoningMessageContentEvent;
    [EventType.REASONING_MESSAGE_CHUNK]: ReasoningMessageChunkEvent;
    [EventType.REASONING_MESSAGE_END]: ReasoningMessageEndEvent;
    [EventType.REASONING_ENCRYPTED_VALUE]: ReasoningEncryptedValueEvent;
    [EventType.STATE_SNAPSHOT]: StateSnapshotEvent;
    [EventType.STATE_DELTA]: StateDeltaEvent;
    [EventType.MESSAGES_SNAPSHOT]: MessagesSnapshotEvent;
    [EventType.ACTIVITY_SNAPSHOT]: ActivitySnapshotEvent;
    [EventType.ACTIVITY_DELTA]: ActivityDeltaEvent;
    [EventType.RAW]: RawEvent;
    [EventType.CUSTOM]: CustomEvent;
}

/** 联合类型：所有已知事件类型 */
export type AgUiEventType = EventTypeMap[keyof EventTypeMap];

/** 工具调用相关事件联合类型 */
export type ToolCallEvent = ToolCallStartEvent | ToolCallArgsEvent | ToolCallEndEvent | ToolCallChunkEvent | ToolCallResultEvent;

/**
 * AgUI 事件类型
 * - 泛型 T 用于缩小到特定事件类型，提供精确的类型推断
 * - 默认为联合类型 AgUiEventType
 */
export type AgUiEvent<T extends EventType = EventType> = T extends keyof EventTypeMap ? EventTypeMap[T] : AgUiEventType;

export type AguiRequestHeaders = Record<string, string>;

export interface AguiToolExecutionContext {
    runId: string;
    threadId: string;
    toolCallId: string;
}

export type AguiToolExecute = (input: unknown, context: AguiToolExecutionContext) => unknown | Promise<unknown>;

export interface InputSchemaTool {
    name: string;
    description?: string;
    parameters?: unknown;
    execute: AguiToolExecute;
}

export interface SerializableInputSchemaTool {
    name: string;
    description?: string;
    parameters?: unknown;
}

export interface AguiClientConfig {
    url: string;
    headers?: AguiRequestHeaders;
    fetch?: typeof globalThis.fetch;
    timeoutMs?: number;
    plugins?: AguiPlugin[];
}

/**
 * RunStreamOptions
 * - 控制事件流式运行的选项配置。
 *
 * @property signal                AbortSignal 实例，用于取消当前的流式请求（如用户手动中止）。
 * @property headers               可选的请求头，用于定制化 HTTP 请求（如添加鉴权信息）。
 * @property timeoutMs             超时时间（毫秒）；超时后当前流式请求将自动终止。
 * @property maxToolRoundTrips     工具调用最大往返次数，防止工具循环调用造成死循环。
 * @property subscriber            流式事件订阅器（回调），用于接收流式事件数据。
 * @property toolExecutorRegistry  工具执行器注册表，按工具名动态查找对应的执行函数。
 */
export interface RunStreamOptions {
    signal?: AbortSignal; // 可选：用于中止流
    headers?: AguiRequestHeaders; // 可选：自定义请求头
    timeoutMs?: number; // 可选：请求超时时间（单位：ms）
    maxToolRoundTrips?: number; // 可选：工具调用最大往返次数
    subscriber?: StreamSubscriber; // 可选：事件流订阅回调
    toolExecutorRegistry?: Record<string, AguiToolExecute>; // 可选：工具执行器注册表，按工具名匹配
}

export interface ExecutorBaseOptions {
    threadId?: string;
    state?: unknown;
    tools?: InputSchemaTool[];
    context?: unknown[];
    forwardedProps?: Record<string, unknown>;
}

export interface StreamTextParams {
    threadId?: string;
    messages: AgUiRunInput['messages'];
    runId?: string;
    parentRunId?: string;
    state?: unknown;
    tools?: InputSchemaTool[];
    context?: unknown[];
    forwardedProps?: Record<string, unknown>;
}

export type GenerateTextParams = StreamTextParams;

export interface ExecutorRunOptions {
    signal?: AbortSignal;
    headers?: AguiRequestHeaders;
    timeoutMs?: number;
    subscriber?: StreamSubscriber;
}

export interface RunResult {
    runId: string;
    threadId: string;
    status: 'finished' | 'error' | 'aborted';
    result?: unknown;
    error?: Error;
}

export interface StreamTextResult {
    run: RunResult;
    text: string;
    reasoning: string;
    events: AgUiEvent[];
    toolCalls: ToolCallAccumulatorState[];
}

export interface GenerateTextResult {
    run: RunResult;
    text: string;
    reasoning: string;
    toolCalls: ToolCallAccumulatorState[];
}

export interface RunSession {
    runId: string;
    abort: () => void;
    finished: Promise<RunResult>;
}

export interface EventStreamSession {
    runId: string;
    abort: () => void;
    events: AsyncIterable<AgUiEvent>;
    finished: Promise<RunResult>;
}

export interface ToolCallAccumulatorState {
    toolCallId: string;
    toolCallName: string;
    parentMessageId?: string;
    argsText: string;
    argsJson?: unknown;
    messageId?: string;
    result?: unknown;
    status: 'started' | 'args' | 'ended' | 'result';
}

export interface StreamSubscriber {
    onEvent?: (event: AgUiEvent) => void | Promise<void>;
    onRunStarted?: (event: AgUiEvent<EventType.RUN_STARTED>) => void | Promise<void>;
    onRunFinished?: (event: AgUiEvent<EventType.RUN_FINISHED>) => void | Promise<void>;
    onRunError?: (event: AgUiEvent<EventType.RUN_ERROR>) => void | Promise<void>;
    onRaw?: (event: RawEvent) => void | Promise<void>;
    onTextMessageStart?: (event: AgUiEvent<EventType.TEXT_MESSAGE_START>) => void | Promise<void>;
    onTextMessageContent?: (event: AgUiEvent<EventType.TEXT_MESSAGE_CONTENT>) => void | Promise<void>;
    onTextMessageEnd?: (event: AgUiEvent<EventType.TEXT_MESSAGE_END>) => void | Promise<void>;
    onReasoningStart?: (event: AgUiEvent<EventType.REASONING_START>) => void | Promise<void>;
    onReasoningEnd?: (event: AgUiEvent<EventType.REASONING_END>) => void | Promise<void>;
    onReasoningMessageStart?: (event: AgUiEvent<EventType.REASONING_MESSAGE_START>) => void | Promise<void>;
    onReasoningMessageContent?: (event: AgUiEvent<EventType.REASONING_MESSAGE_CONTENT>) => void | Promise<void>;
    onReasoningMessageChunk?: (event: AgUiEvent<EventType.REASONING_MESSAGE_CHUNK>) => void | Promise<void>;
    onReasoningMessageEnd?: (event: AgUiEvent<EventType.REASONING_MESSAGE_END>) => void | Promise<void>;
    onToolCallStart?: (event: AgUiEvent<EventType.TOOL_CALL_START>) => void | Promise<void>;
    onToolCallArgs?: (event: AgUiEvent<EventType.TOOL_CALL_ARGS>) => void | Promise<void>;
    onToolCallEnd?: (event: AgUiEvent<EventType.TOOL_CALL_END>) => void | Promise<void>;
    onToolCallResult?: (event: AgUiEvent<EventType.TOOL_CALL_RESULT>) => void | Promise<void>;
    onError?: (error: Error) => void | Promise<void>;
}

export interface AguiPluginContext {
    runInput: AgUiRunInput;
    runId: string;
    threadId: string;
    requestHeaders: AguiRequestHeaders;
    metadata: Record<string, unknown>;
}

/**
 *
    name	插件名称，用于唯一标识
    enforce	执行顺序：pre 在主流程之前执行，post 在主流程之后执行
    resolveInput	在输入进入插件系统前处理/转换输入，可返回 null 跳过本次运行
    configureContext	初始化插件上下文，可在此时设置插件所需的配置或资源
    transformParams	转换/增强输入参数，返回部分字段的更新
    transformResult	处理最终结果，可修改或增强返回数据
    onRunStart	运行开始时的钩子，常用于日志记录、初始化等
    onRunEnd	运行结束时的钩子，可用于清理、资源释放
    onError	错误处理钩子，可用于错误上报、容错处理
    transformStream	流式事件转换，处理 SSE 流中的每个事件，可返回 null 跳过该事件
 * resolveInput → configureContext → onRunStart → transformParams → [主逻辑] → transformResult → onRunEnd → (transformStream 穿插于流式响应中)
 */
export interface AguiPlugin {
    name: string;
    enforce?: 'pre' | 'post';
    resolveInput?: (input: AgUiRunInput, context: AguiPluginContext) => Promise<AgUiRunInput | null> | AgUiRunInput | null;
    configureContext?: (context: AguiPluginContext) => void | Promise<void>;
    transformParams?: (input: AgUiRunInput, context: AguiPluginContext) => Partial<AgUiRunInput> | Promise<Partial<AgUiRunInput>>;
    transformResult?: (result: RunResult, context: AguiPluginContext) => RunResult | Promise<RunResult>;
    onRunStart?: (context: AguiPluginContext) => void | Promise<void>;
    onRunEnd?: (context: AguiPluginContext, result: RunResult) => void | Promise<void>;
    onError?: (error: Error, context: AguiPluginContext) => void | Promise<void>;
    transformStream?: (event: AgUiEvent, context: AguiPluginContext) => AgUiEvent | null | Promise<AgUiEvent | null>;
}
