import { EventType } from '../constant';
import { describe, expect, it } from 'vitest';

import { ToolStreamAccumulator } from '../runtime/toolStream';

describe('toolStreamAccumulator', () => {
    it('聚合参数流并保留最终结果', () => {
        const acc = new ToolStreamAccumulator();

        const start = acc.process({
            type: EventType.TOOL_CALL_START,
            toolCallId: 'tool-1',
            toolCallName: 'search_web',
        } as any);
        expect(start?.status).toBe('started');

        const args1 = acc.process({
            type: EventType.TOOL_CALL_ARGS,
            toolCallId: 'tool-1',
            delta: '{"q":"cherry',
        } as any);
        expect(args1?.argsText).toContain('cherry');
        expect(args1?.status).toBe('args');

        const args2 = acc.process({
            type: EventType.TOOL_CALL_ARGS,
            toolCallId: 'tool-1',
            delta: ' studio"}',
        } as any);
        expect(args2?.argsJson).toEqual({ q: 'cherry studio' });

        const end = acc.process({
            type: EventType.TOOL_CALL_END,
            toolCallId: 'tool-1',
        } as any);
        expect(end?.status).toBe('ended');

        const result = acc.process({
            type: EventType.TOOL_CALL_RESULT,
            toolCallId: 'tool-1',
            messageId: 'msg-1',
            content: '{"ok":true}',
        } as any);
        expect(result?.status).toBe('result');
        expect(result?.result).toBe('{"ok":true}');
    });
});
