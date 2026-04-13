/**
 * AI 流式响应事件类型枚举
 */
export enum EventType {
    // ==================== 文本消息相关事件 ====================
    /** 文本消息开始 */
    TEXT_MESSAGE_START = 'TEXT_MESSAGE_START',
    /** 文本消息内容 */
    TEXT_MESSAGE_CONTENT = 'TEXT_MESSAGE_CONTENT',
    /** 文本消息结束 */
    TEXT_MESSAGE_END = 'TEXT_MESSAGE_END',
    /** 文本消息分块 */
    TEXT_MESSAGE_CHUNK = 'TEXT_MESSAGE_CHUNK',

    // ==================== 工具调用相关事件 ====================
    /** 工具调用开始 */
    TOOL_CALL_START = 'TOOL_CALL_START',
    /** 工具调用参数 */
    TOOL_CALL_ARGS = 'TOOL_CALL_ARGS',
    /** 工具调用结束 */
    TOOL_CALL_END = 'TOOL_CALL_END',
    /** 工具调用分块 */
    TOOL_CALL_CHUNK = 'TOOL_CALL_CHUNK',
    /** 工具调用结果 */
    TOOL_CALL_RESULT = 'TOOL_CALL_RESULT',

    // ==================== 状态管理相关事件 ====================
    /** 状态快照 */
    STATE_SNAPSHOT = 'STATE_SNAPSHOT',
    /** 状态增量更新 */
    STATE_DELTA = 'STATE_DELTA',
    /** 消息快照 */
    MESSAGES_SNAPSHOT = 'MESSAGES_SNAPSHOT',
    /** 活动快照 */
    ACTIVITY_SNAPSHOT = 'ACTIVITY_SNAPSHOT',
    /** 活动增量更新 */
    ACTIVITY_DELTA = 'ACTIVITY_DELTA',

    // ==================== 原始/自定义事件 ====================
    /** 原始事件 */
    RAW = 'RAW',
    /** 自定义事件 */
    CUSTOM = 'CUSTOM',

    // ==================== 运行生命周期事件 ====================
    /** 运行开始 */
    RUN_STARTED = 'RUN_STARTED',
    /** 运行完成 */
    RUN_FINISHED = 'RUN_FINISHED',
    /** 运行错误 */
    RUN_ERROR = 'RUN_ERROR',
    /** 步骤开始 */
    STEP_STARTED = 'STEP_STARTED',
    /** 步骤完成 */
    STEP_FINISHED = 'STEP_FINISHED',

    // ==================== 推理相关事件 ====================
    /** 推理开始 */
    REASONING_START = 'REASONING_START',
    /** 推理消息开始 */
    REASONING_MESSAGE_START = 'REASONING_MESSAGE_START',
    /** 推理消息内容 */
    REASONING_MESSAGE_CONTENT = 'REASONING_MESSAGE_CONTENT',
    /** 推理消息结束 */
    REASONING_MESSAGE_END = 'REASONING_MESSAGE_END',
    /** 推理消息分块 */
    REASONING_MESSAGE_CHUNK = 'REASONING_MESSAGE_CHUNK',
    /** 推理结束 */
    REASONING_END = 'REASONING_END',
    /** 推理加密值 */
    REASONING_ENCRYPTED_VALUE = 'REASONING_ENCRYPTED_VALUE',
}
