import { EventType } from '@quantum-design/ai-core';

import type { AguiPlugin, AguiPluginContext } from '@quantum-design/ai-core';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LoggerPluginOptions {
    /** 日志级别，默认 'info' */
    level?: LogLevel;
    /** 是否记录流式事件 */
    logStreamEvents?: boolean;
    /** 是否记录工具调用事件 */
    logToolCalls?: boolean;
    /** 是否记录文本消息内容 */
    logTextContent?: boolean;
    /** 自定义日志输出函数 */
    logger?: (level: LogLevel, message: string, context?: Record<string, unknown>) => void;
    /** 插件名称 */
    name?: string;
}

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
};

function formatEvent(eventType: string, data?: Record<string, unknown>): string {
    if (!data || Object.keys(data).length === 0) {
        return eventType;
    }
    const safeData = { ...data };
    // 移除可能过大的数据字段
    if (safeData.delta && typeof safeData.delta === 'string' && safeData.delta.length > 100) {
        safeData.delta = safeData.delta.slice(0, 100) + '...';
    }
    if (safeData.content && typeof safeData.content === 'string' && safeData.content.length > 100) {
        safeData.content = safeData.content.slice(0, 100) + '...';
    }
    return `${eventType}: ${JSON.stringify(safeData)}`;
}

function getEventLogData(event: Record<string, unknown>): Record<string, unknown> {
    const { type, timestamp, rawEvent, ...rest } = event;
    return rest;
}

export function createLoggerPlugin(options: LoggerPluginOptions = {}): AguiPlugin {
    const { level = 'info', logStreamEvents = false, logToolCalls = true, logTextContent = false, logger = defaultLogger, name = 'built-in:logger' } = options;

    const minLevel = LOG_LEVEL_PRIORITY[level];

    function shouldLog(logLevel: LogLevel): boolean {
        return LOG_LEVEL_PRIORITY[logLevel] >= minLevel;
    }

    // 默认日志输出函数
    function defaultLogger(logLevel: LogLevel, message: string, context?: Record<string, unknown>) {
        const timestamp = new Date().toISOString();
        const contextStr = context ? ` ${JSON.stringify(context)}` : '';
        console[logLevel === 'debug' ? 'log' : logLevel](`[${timestamp}] [${logLevel.toUpperCase()}] ${message}${contextStr}`);
    }

    let runStartTime: number = 0;
    let runId: string = '';
    let threadId: string = '';

    return {
        name,
        onRunStart(context: AguiPluginContext) {
            runStartTime = Date.now();
            runId = context.runId;
            threadId = context.threadId;
            if (shouldLog('info')) {
                logger('info', 'Run started', {
                    runId: context.runId,
                    threadId: context.threadId,
                });
            }
        },
        onRunEnd(context: AguiPluginContext, result) {
            const duration = Date.now() - runStartTime;
            if (shouldLog('info')) {
                logger('info', 'Run finished', {
                    runId: context.runId,
                    status: result.status,
                    duration: `${duration}ms`,
                });
            }
        },
        onError(error: Error, context: AguiPluginContext) {
            if (shouldLog('error')) {
                logger('error', 'Run error', {
                    runId: context.runId,
                    threadId: context.threadId,
                    error: error.message,
                    stack: error.stack,
                });
            }
        },
        transformStream(event, context) {
            if (!logStreamEvents) {
                return event;
            }

            const eventType = event.type;

            // 记录工具调用相关事件
            if (logToolCalls) {
                if (eventType === EventType.TOOL_CALL_START) {
                    if (shouldLog('debug')) {
                        logger('debug', formatEvent('TOOL_CALL_START', getEventLogData(event as unknown as Record<string, unknown>)), {
                            runId: context.runId,
                        });
                    }
                } else if (eventType === EventType.TOOL_CALL_ARGS) {
                    if (shouldLog('debug')) {
                        logger('debug', formatEvent('TOOL_CALL_ARGS', getEventLogData(event as unknown as Record<string, unknown>)), {
                            runId: context.runId,
                        });
                    }
                } else if (eventType === EventType.TOOL_CALL_END) {
                    if (shouldLog('info')) {
                        logger('info', formatEvent('TOOL_CALL_END', getEventLogData(event as unknown as Record<string, unknown>)), {
                            runId: context.runId,
                        });
                    }
                } else if (eventType === EventType.TOOL_CALL_RESULT) {
                    if (shouldLog('info')) {
                        const data = getEventLogData(event as unknown as Record<string, unknown>);
                        // 简化结果内容
                        if (data.content && typeof data.content === 'string' && data.content.length > 200) {
                            data.content = data.content.slice(0, 200) + '...';
                        }
                        logger('info', formatEvent('TOOL_CALL_RESULT', data), {
                            runId: context.runId,
                        });
                    }
                }
            }

            // 记录文本消息内容
            if (logTextContent && eventType === EventType.TEXT_MESSAGE_CONTENT) {
                if (shouldLog('debug')) {
                    logger('debug', formatEvent('TEXT_MESSAGE_CONTENT', getEventLogData(event as unknown as Record<string, unknown>)), {
                        runId: context.runId,
                    });
                }
            }

            // 记录运行开始/结束事件
            if (eventType === EventType.RUN_STARTED) {
                if (shouldLog('info')) {
                    logger('info', formatEvent('RUN_STARTED', getEventLogData(event as unknown as Record<string, unknown>)), {
                        runId: context.runId,
                    });
                }
            } else if (eventType === EventType.RUN_FINISHED) {
                if (shouldLog('info')) {
                    logger('info', formatEvent('RUN_FINISHED', getEventLogData(event as unknown as Record<string, unknown>)), {
                        runId: context.runId,
                    });
                }
            } else if (eventType === EventType.RUN_ERROR) {
                if (shouldLog('error')) {
                    logger('error', formatEvent('RUN_ERROR', getEventLogData(event as unknown as Record<string, unknown>)), {
                        runId: context.runId,
                    });
                }
            }

            return event;
        },
    };
}
