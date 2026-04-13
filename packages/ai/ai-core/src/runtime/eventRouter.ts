import { EventType } from '../constant';

import type { AgUiEvent, StreamSubscriber } from '../types';

export class EventRouter {
    constructor(private readonly subscribers: Set<StreamSubscriber>) {}

    private async notify<K extends keyof StreamSubscriber>(hook: K, ...args: Parameters<NonNullable<StreamSubscriber[K]>>): Promise<void> {
        for (const sub of this.subscribers) {
            const handler = sub[hook] as ((...innerArgs: Parameters<NonNullable<StreamSubscriber[K]>>) => void | Promise<void>) | undefined;
            await handler?.(...args);
        }
    }

    async route(event: AgUiEvent): Promise<void> {
        await this.notify('onEvent', event);
        switch (event.type) {
            case EventType.RUN_STARTED:
                await this.notify('onRunStarted', event);
                break;
            case EventType.RUN_FINISHED:
                await this.notify('onRunFinished', event);
                break;
            case EventType.RUN_ERROR:
                await this.notify('onRunError', event);
                break;
            case EventType.RAW:
                await this.notify('onRaw', event);
                break;
            case EventType.TEXT_MESSAGE_START:
                await this.notify('onTextMessageStart', event);
                break;
            case EventType.TEXT_MESSAGE_CONTENT:
                await this.notify('onTextMessageContent', event);
                break;
            case EventType.TEXT_MESSAGE_END:
                await this.notify('onTextMessageEnd', event);
                break;
            case EventType.REASONING_START:
                await this.notify('onReasoningStart', event);
                break;
            case EventType.REASONING_END:
                await this.notify('onReasoningEnd', event);
                break;
            case EventType.REASONING_MESSAGE_START:
                await this.notify('onReasoningMessageStart', event);
                break;
            case EventType.REASONING_MESSAGE_CONTENT:
                await this.notify('onReasoningMessageContent', event);
                break;
            case EventType.REASONING_MESSAGE_CHUNK:
                await this.notify('onReasoningMessageChunk', event);
                break;
            case EventType.REASONING_MESSAGE_END:
                await this.notify('onReasoningMessageEnd', event);
                break;
            case EventType.TOOL_CALL_START:
                await this.notify('onToolCallStart', event);
                break;
            case EventType.TOOL_CALL_ARGS:
                await this.notify('onToolCallArgs', event);
                break;
            case EventType.TOOL_CALL_END:
                await this.notify('onToolCallEnd', event);
                break;
            case EventType.TOOL_CALL_RESULT:
                await this.notify('onToolCallResult', event);
                break;
            default:
                break;
        }
    }

    async notifyError(error: Error): Promise<void> {
        await this.notify('onError', error);
    }
}
