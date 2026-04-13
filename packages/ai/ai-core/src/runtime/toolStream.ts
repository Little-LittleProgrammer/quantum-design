import { EventType } from '../constant';

import type { AgUiEvent, ToolCallAccumulatorState, ToolCallEvent } from '../types';

function tryParseJson(text: string): unknown {
    try {
        return JSON.parse(text);
    } catch {
        return undefined;
    }
}

export class ToolStreamAccumulator {
    private readonly states = new Map<string, ToolCallAccumulatorState>();

    private ensureState(event: ToolCallEvent): ToolCallAccumulatorState | null {
        const toolCallId = event.toolCallId;
        if (!toolCallId) return null;

        const existed = this.states.get(toolCallId);
        if (existed) return existed;

        const state: ToolCallAccumulatorState = {
            toolCallId,
            toolCallName: event.toolCallName ?? 'unknown-tool',
            parentMessageId: event.parentMessageId,
            argsText: '',
            status: 'started',
        };
        this.states.set(toolCallId, state);
        return state;
    }

    process(event: AgUiEvent): ToolCallAccumulatorState | null {
        switch (event.type) {
            case EventType.TOOL_CALL_START: {
                const state = this.ensureState(event);
                if (!state) return null;
                state.status = 'started';
                state.toolCallName = event.toolCallName ?? state.toolCallName;
                return { ...state };
            }
            case EventType.TOOL_CALL_ARGS: {
                const state = this.ensureState(event);
                if (!state) return null;
                const delta = event.delta ?? '';
                state.argsText += delta;
                state.argsJson = tryParseJson(state.argsText);
                state.status = 'args';
                return { ...state };
            }
            case EventType.TOOL_CALL_END: {
                const state = this.ensureState(event);
                if (!state) return null;
                state.status = 'ended';
                return { ...state };
            }
            case EventType.TOOL_CALL_RESULT: {
                const state = this.ensureState(event);
                if (!state) return null;
                state.status = 'result';
                state.messageId = event.messageId ?? state.messageId;
                state.result = event.content;
                return { ...state };
            }
            default:
                return null;
        }
    }
}
