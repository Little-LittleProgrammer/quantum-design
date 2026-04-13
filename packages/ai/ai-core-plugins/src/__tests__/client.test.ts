import { EventType } from '@ag-ui/core';
import { describe, expect, it, vi } from 'vitest';

import { createCodeBlockParserPlugin, createMarkdownToHtmlPlugin } from '../index';
import { createExecutor } from '@quantum-design/ai-core';

function createSseResponse(events: Array<Record<string, unknown>>): Response {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        async start(controller) {
            for (let index = 0; index < events.length; index += 1) {
                const payload = `data: ${JSON.stringify(events[index])}\n\n`;
                controller.enqueue(encoder.encode(payload));
                if (index < events.length - 1) {
                    await new Promise((resolve) => setTimeout(resolve, 200));
                }
            }
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

describe('aguiExecutor', () => {
    it('codeBlockParser 插件支持通过 codeBlockHandlers 解析 fenced code block', async () => {
        const fetchMock = vi.fn(async () =>
            createSseResponse([
                { type: EventType.RUN_STARTED, runId: 'run-cb-1', threadId: 'thread-1' },
                { type: EventType.TEXT_MESSAGE_START, messageId: 'm-cb-1', role: 'assistant' },
                {
                    type: EventType.TEXT_MESSAGE_CONTENT,
                    messageId: 'm-cb-1',
                    delta: '```json\n{"title":"Hello","count":2}\n```\n',
                },
                {
                    type: EventType.TEXT_MESSAGE_CONTENT,
                    messageId: 'm-cb-1',
                    delta: '```next_rec_query\n  武侠小说推荐  \n```',
                },
                { type: EventType.RUN_FINISHED, runId: 'run-cb-1', threadId: 'thread-1', result: { ok: true } },
            ]),
        );

        const executor = createExecutor(
            {
                url: 'https://example.com/agui',
                fetch: fetchMock as any,
                plugins: [
                    createCodeBlockParserPlugin({
                        codeBlockHandlers: [
                            {
                                type: 'json',
                                parse: (content: string) => JSON.parse(content) as { title: string; count: number },
                            },
                            {
                                type: 'next_rec_query',
                                parse: (content: string) => content.trim(),
                            },
                        ],
                    }),
                ],
            },
            {
                threadId: 'thread-1',
            },
        );

        const stream = executor.streamText({
            runId: 'run-cb-1',
            messages: [{ id: 'u-cb-1', role: 'user', content: 'test' }],
        });

        const events: Array<Record<string, unknown>> = [];
        for await (const event of stream.events) {
            events.push(event as Record<string, unknown>);
        }
        await stream.finished;

        const contentEvents = events.filter((event) => event.type === EventType.TEXT_MESSAGE_CONTENT);
        expect(contentEvents).toHaveLength(2);
        expect(contentEvents[1].delta).toBe('```next_rec_query\n  武侠小说推荐  \n```');

        const data = contentEvents[1].codeBlockData as Record<string, unknown>;
        expect(data.json).toEqual({ title: 'Hello', count: 2 });
        expect(data.next_rec_query).toBe('武侠小说推荐');
    });

    it(
        'markdownToHtml 插件在每个流事件附加当前 html 且不改 delta',
        async () => {
            const fetchMock = vi.fn(async () =>
                createSseResponse([
                    { type: EventType.RUN_STARTED, runId: 'run-4', threadId: 'thread-1' },
                    { type: EventType.TEXT_MESSAGE_START, messageId: 'm-4', role: 'assistant' },
                    { type: EventType.TEXT_MESSAGE_CONTENT, messageId: 'm-4', delta: 'hello\n```json\n' },
                    { type: EventType.TEXT_MESSAGE_CONTENT, messageId: 'm-4', delta: '{"k":1}\n```\n' },
                    { type: EventType.TEXT_MESSAGE_CONTENT, messageId: 'm-4', delta: '```aaa\nbbb\n```\n' },
                    { type: EventType.TEXT_MESSAGE_END, messageId: 'm-4' },
                    { type: EventType.RUN_FINISHED, runId: 'run-4', threadId: 'thread-1', result: { ok: true } },
                ]),
            );

            const executor = createExecutor({
                url: 'https://api-ai-t.qmniu.com/api/v1/chat',
                fetch: fetchMock as any,
                headers: {
                    'X-API-Key': 'ak_887766b1e2f3',
                    'X-API-Secret': 'sk_778899c4d5e6f7a8b9c0d1e2f3a4b5c6',
                },
                plugins: [createMarkdownToHtmlPlugin({ mode: ['html', 'block'] })],
            });

            const stream = executor.streamText({
                forwardedProps: {
                    app_id: 8,
                    inputs: {},
                    role_id: 1,
                    user_id: 'partner-user-001',
                },
                messages: [{ content: '推荐5本剑来相关的小说', id: 'msg-001', role: 'user' }],
                threadId: '',
            });

            const events: Array<Record<string, unknown>> = [];
            for await (const event of stream.events) {
                console.log(event);
                events.push(event as Record<string, unknown>);
            }
            await stream.finished;

            expect(events).toHaveLength(7);
            const contentEvents = events.filter((event) => event.type === EventType.TEXT_MESSAGE_CONTENT);
            expect(contentEvents).toHaveLength(3);
            expect(contentEvents[0].delta).toBe('hello\n```json\n');
            expect(contentEvents[1].delta).toBe('{"k":1}\n```\n');
            expect(contentEvents[2].delta).toBe('```aaa\nbbb\n```\n');
            expect(String(contentEvents[2].markdownHtml)).toContain('language-json');
            expect(String(contentEvents[2].markdownHtml)).toContain('language-aaa');

            const firstEventBlocks = contentEvents[0].markdownBlock as Array<Record<string, unknown>>;
            expect(firstEventBlocks).toHaveLength(2);
            expect(firstEventBlocks[0]).toMatchObject({
                type: 'text',
                rawContent: 'hello\n',
            });
            expect(firstEventBlocks[1]).toMatchObject({
                type: 'codeBlock',
                subtype: 'json',
                rawContent: '```json\n',
            });
            expect(String(firstEventBlocks[1].htmlContent)).toContain('language-json');

            const markdownBlock = contentEvents[2].markdownBlock as Array<Record<string, unknown>>;
            expect(markdownBlock).toHaveLength(5);
            expect(markdownBlock[0]).toMatchObject({
                type: 'text',
                rawContent: 'hello\n',
            });
            expect(String(markdownBlock[0].htmlContent)).toContain('<p>hello</p>');

            expect(markdownBlock[1]).toMatchObject({
                type: 'codeBlock',
                subtype: 'json',
                rawContent: '```json\n{"k":1}\n```',
            });
            expect(String(markdownBlock[1].htmlContent)).toContain('language-json');

            expect(markdownBlock[2]).toMatchObject({
                type: 'text',
                rawContent: '\n',
            });
            expect(String(markdownBlock[2].htmlContent)).toBe('');

            expect(markdownBlock[3]).toMatchObject({
                type: 'codeBlock',
                subtype: 'aaa',
                rawContent: '```aaa\nbbb\n```',
            });
            expect(String(markdownBlock[3].htmlContent)).toContain('language-aaa');

            expect(markdownBlock[4]).toMatchObject({
                type: 'text',
                rawContent: '\n',
            });
        },
        60 * 60 * 1000,
    );
});
