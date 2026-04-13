import { EventType } from '../constant';
import { describe, expect, it, vi } from 'vitest';
import { createExecutor } from '../runtime/executor';
import type { AguiPlugin } from '../types';

function createSseResponse(events: Array<Record<string, unknown>>): Response {
    const encoder = new TextEncoder();
    const payload = events.map((event) => `data: ${JSON.stringify(event)}\n\n`).join('');
    const stream = new ReadableStream({
        start(controller) {
            controller.enqueue(encoder.encode(payload));
            controller.close();
        },
    });
    return new Response(stream, {
        status: 200,
        headers: {
            'Content-Type': 'text/event-stream',
        },
    });
}

function createChunkedSseResponse(chunks: string[]): Response {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        start(controller) {
            for (const chunk of chunks) {
                controller.enqueue(encoder.encode(chunk));
            }
            controller.close();
        },
    });
    return new Response(stream, {
        status: 200,
        headers: { 'Content-Type': 'text/event-stream' },
    });
}

describe('aguiExecutor', () => {
    it('通过 generateText 返回聚合结果', async () => {
        const fetchMock = vi.fn(async () =>
            createSseResponse([
                { type: EventType.RUN_STARTED, runId: 'run-1', threadId: 'thread-1' },
                { type: EventType.TEXT_MESSAGE_START, messageId: 'm-1', role: 'assistant' },
                { type: EventType.TEXT_MESSAGE_CONTENT, messageId: 'm-1', delta: 'Hello' },
                { type: EventType.TEXT_MESSAGE_END, messageId: 'm-1' },
                { type: EventType.TOOL_CALL_START, toolCallId: 't1', toolCallName: 'search_web' },
                { type: EventType.TOOL_CALL_ARGS, toolCallId: 't1', delta: '{"q":"hi"}' },
                { type: EventType.TOOL_CALL_END, toolCallId: 't1' },
                { type: EventType.TOOL_CALL_RESULT, toolCallId: 't1', messageId: 'm-2', content: '{"ok":true}' },
                { type: EventType.RUN_FINISHED, runId: 'run-1', threadId: 'thread-1', result: { ok: true } },
            ]),
        );

        const executor = createExecutor(
            {
                url: 'https://example.com/agui',
                fetch: fetchMock as any,
            },
            {
                threadId: 'thread-1',
            },
        );

        const result = await executor.generateText({
            runId: 'run-1',
            messages: [{ id: 'u1', role: 'user', content: 'Hello' }],
        });

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(result.text).toBe('Hello');
        expect(result.run.status).toBe('finished');
        expect(result.run.result).toEqual({ ok: true });
        expect(result.toolCalls).toHaveLength(1);
        expect(result.toolCalls[0].argsJson).toEqual({ q: 'hi' });
    });

    it('sSE 分片场景下可正确解析事件（无 eventsource-parser）', async () => {
        const fetchMock = vi.fn(async () => createChunkedSseResponse(['data: {"type":"RUN_STARTED","runId":"run-2","threadId":"thread-1"}\n', '\n', 'data: {"type":"TEXT_MESSAGE_START","messageId":"m-1","role":"assistant"}\n\n', 'data: {"type":"TEXT_MESSAGE_CONTENT","messageId":"m-1","delta":"He', 'llo"}\n\n', 'data: {"type":"TEXT_MESSAGE_END","messageId":"m-1"}\n\n', 'data: {"type":"RUN_FINISHED","runId":"run-2","threadId":"thread-1","result":{"ok":true}}\n\n']));

        const executor = createExecutor(
            {
                url: 'https://example.com/agui',
                fetch: fetchMock as any,
            },
            {
                threadId: 'thread-1',
            },
        );

        const result = await executor.generateText({
            runId: 'run-2',
            messages: [{ id: 'u2', role: 'user', content: 'Hello' }],
        });

        expect(result.text).toBe('Hello');
        expect(result.run.status).toBe('finished');
    });

    it('按 pre -> normal -> post 执行 transformParams', async () => {
        const seen: string[] = [];
        const plugins: AguiPlugin[] = [
            {
                name: 'normal',
                transformParams(input) {
                    seen.push('normal');
                    return {
                        forwardedProps: {
                            ...input.forwardedProps,
                            normal: true,
                        },
                    };
                },
            },
            {
                name: 'post',
                enforce: 'post',
                transformParams(input) {
                    seen.push('post');
                    return {
                        forwardedProps: {
                            ...input.forwardedProps,
                            post: true,
                        },
                    };
                },
            },
            {
                name: 'pre',
                enforce: 'pre',
                transformParams(input) {
                    seen.push('pre');
                    return {
                        forwardedProps: {
                            ...input.forwardedProps,
                            pre: true,
                        },
                    };
                },
            },
        ];

        let capturedBody: Record<string, unknown> | null = null;
        const fetchMock = vi.fn(async (_url: string, init?: RequestInit) => {
            capturedBody = JSON.parse(String(init?.body)) as Record<string, unknown>;
            return createSseResponse([{ type: EventType.RUN_FINISHED, runId: 'run-3', threadId: 'thread-1' }]);
        });

        const executor = createExecutor(
            {
                url: 'https://example.com/agui',
                fetch: fetchMock as any,
                plugins,
            },
            {
                threadId: 'thread-1',
            },
        );

        const stream = executor.streamText({
            runId: 'run-3',
            messages: [{ id: 'u3', role: 'user', content: 'Hello' }],
        });
        await stream.finished;

        expect(seen).toEqual(['pre', 'normal', 'post']);
        const forwardedProps = (capturedBody as { forwardedProps?: Record<string, unknown> } | null)?.forwardedProps ?? {};
        expect(forwardedProps).toEqual({
            pre: true,
            normal: true,
            post: true,
        });
    });

    it('streamText 支持 for-await 逐事件消费', async () => {
        const fetchMock = vi.fn(async () =>
            createSseResponse([
                { type: EventType.RUN_STARTED, runId: 'run-5', threadId: 'thread-1' },
                { type: EventType.TEXT_MESSAGE_START, messageId: 'm-5', role: 'assistant' },
                { type: EventType.TEXT_MESSAGE_CONTENT, messageId: 'm-5', delta: 'Hel' },
                { type: EventType.TEXT_MESSAGE_CONTENT, messageId: 'm-5', delta: 'lo' },
                { type: EventType.RUN_FINISHED, runId: 'run-5', threadId: 'thread-1', result: { ok: true } },
            ]),
        );

        const executor = createExecutor(
            {
                url: 'https://example.com/agui',
                fetch: fetchMock as any,
            },
            {
                threadId: 'thread-1',
            },
        );

        const stream = executor.streamText({
            runId: 'run-5',
            messages: [{ id: 'u5', role: 'user', content: 'Hello' }],
        });

        const deltas: string[] = [];
        let finishedSeen = false;

        for await (const event of stream.events) {
            if (event.type === EventType.TEXT_MESSAGE_CONTENT) {
                deltas.push(String(event.delta ?? ''));
            }
            if (event.type === EventType.RUN_FINISHED) {
                finishedSeen = true;
            }
        }

        const run = await stream.finished;
        expect(deltas.join('')).toBe('Hello');
        expect(finishedSeen).toBe(true);
        expect(run.status).toBe('finished');
    });

    it('tools 传 execute 时由 SDK 自动执行并递归发起下一轮请求', async () => {
        let capturedBody: Record<string, unknown> | null = null;
        let callCount = 0;
        const fetchMock = vi.fn(async (_url: string, init?: RequestInit) => {
            callCount += 1;
            capturedBody = JSON.parse(String(init?.body)) as Record<string, unknown>;
            if (callCount === 1) {
                return createSseResponse([
                    { type: EventType.RUN_STARTED, runId: 'run-6', threadId: 'thread-1' },
                    { type: EventType.TOOL_CALL_START, toolCallId: 'tool-6', toolCallName: 'sum' },
                    { type: EventType.TOOL_CALL_ARGS, toolCallId: 'tool-6', delta: '{"a":1,"b":2}' },
                    { type: EventType.TOOL_CALL_END, toolCallId: 'tool-6' },
                    { type: EventType.RUN_FINISHED, runId: 'run-6', threadId: 'thread-1', result: { phase: 1 } },
                ]);
            }

            return createSseResponse([
                { type: EventType.RUN_STARTED, runId: 'run-6b', threadId: 'thread-1' },
                { type: EventType.TEXT_MESSAGE_START, messageId: 'm-6', role: 'assistant' },
                { type: EventType.TEXT_MESSAGE_CONTENT, messageId: 'm-6', delta: 'tool done' },
                { type: EventType.TEXT_MESSAGE_END, messageId: 'm-6' },
                { type: EventType.RUN_FINISHED, runId: 'run-6b', threadId: 'thread-1', result: { phase: 2 } },
            ]);
        });

        const executeMock = vi.fn((input: unknown) => {
            const args = (input ?? {}) as { a?: number; b?: number };
            return (args.a ?? 0) + (args.b ?? 0);
        });

        const executor = createExecutor(
            {
                url: 'https://example.com/agui',
                fetch: fetchMock as any,
            },
            {
                threadId: 'thread-1',
            },
        );

        const stream = executor.streamText({
            runId: 'run-6',
            messages: [{ id: 'u6', role: 'user', content: 'calc' }],
            tools: [
                {
                    name: 'sum',
                    description: 'sum two numbers',
                    parameters: { type: 'object' },
                    execute: executeMock,
                },
            ],
        });

        const events: Array<Record<string, unknown>> = [];
        for await (const event of stream.events) {
            console.log('event', event);
            events.push(event as Record<string, unknown>);
        }
        await stream.finished;

        expect(fetchMock).toHaveBeenCalledTimes(2);
        expect(executeMock).toHaveBeenCalledTimes(1);
        expect(executeMock).toHaveBeenCalledWith({ a: 1, b: 2 }, expect.objectContaining({ toolCallId: 'tool-6' }));

        const requestTools = (capturedBody as { tools?: Array<Record<string, unknown>> } | null)?.tools ?? [];
        expect(requestTools).toEqual([
            {
                name: 'sum',
                description: 'sum two numbers',
                parameters: { type: 'object' },
            },
        ]);

        const toolResultEvent = events.find((event) => event.type === EventType.TOOL_CALL_RESULT);
        expect(toolResultEvent?.content).toBe(3);
        expect(events.some((event) => event.type === EventType.TEXT_MESSAGE_CONTENT && event.delta === 'tool done')).toBe(true);
    });
});
