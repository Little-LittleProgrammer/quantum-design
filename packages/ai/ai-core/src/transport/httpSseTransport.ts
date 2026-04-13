import type { AgUiEvent, AguiRequestHeaders, AgUiRunInput } from '../types';

export interface HttpSseTransportConfig {
    url: string;
    headers?: AguiRequestHeaders;
    fetch?: typeof globalThis.fetch;
}

export interface StreamEventsOptions {
    input: AgUiRunInput;
    signal?: AbortSignal;
    headers?: AguiRequestHeaders;
    timeoutMs?: number;
    onEvent: (event: AgUiEvent) => void | Promise<void>;
}

export class HttpSseTransport {
    private readonly fetchImpl: typeof globalThis.fetch;

    constructor(private config: HttpSseTransportConfig) {
        const rawFetch = config.fetch ?? globalThis.fetch;
        if (typeof rawFetch !== 'function') {
            throw new Error('Fetch API is not available in current environment. Please provide config.fetch.');
        }
        this.fetchImpl = rawFetch.bind(globalThis);
    }

    /**
     * 创建事件流处理管道
     * 处理流程: Uint8Array → string → SSE帧 → AgUiEvent
     */
    private createEventStream(body: ReadableStream<Uint8Array>): ReadableStream<AgUiEvent> {
        const decoder = new TextDecoder();

        // 第一步: 将字节流 (Uint8Array) 解码为字符串
        // 使用 stream: true 支持不完整的 UTF-8 字符（跨字节边界）
        const decodeStream = new TransformStream<Uint8Array, string>({
            transform(chunk, controller) {
                controller.enqueue(decoder.decode(chunk, { stream: true }));
            },
            flush(controller) {
                const tail = decoder.decode();
                if (tail) controller.enqueue(tail);
            },
        });

        // 第二步: 将连续字符串按 SSE 帧分隔符分割
        // SSE 协议中每个事件以双换行符 \n\n 结尾
        let frameBuffer = '';
        const frameStream = new TransformStream<string, string>({
            transform(chunk, controller) {
                frameBuffer += chunk;
                while (true) {
                    const idx = frameBuffer.indexOf('\n\n');
                    if (idx === -1) break;
                    const frame = frameBuffer.slice(0, idx);
                    frameBuffer = frameBuffer.slice(idx + 2);
                    if (frame.trim()) {
                        controller.enqueue(frame);
                    }
                }
            },
            flush(controller) {
                // 流结束时处理剩余的帧数据
                if (frameBuffer.trim()) {
                    controller.enqueue(frameBuffer);
                }
            },
        });

        // 第三步: 解析 SSE 帧数据，转换为 AgUiEvent 对象
        const eventStream = new TransformStream<string, AgUiEvent>({
            transform(frame, controller) {
                const dataLines: string[] = [];
                for (const line of frame.split(/\r?\n/)) {
                    if (line.startsWith('data:')) {
                        dataLines.push(line.slice(5).trimStart());
                    }
                }
                if (dataLines.length === 0) return;
                const payload = dataLines.join('\n');
                if (!payload || payload === '[DONE]') return;

                try {
                    const parsed = JSON.parse(payload) as AgUiEvent;
                    if (parsed && typeof parsed === 'object' && 'type' in parsed) {
                        controller.enqueue(parsed);
                    }
                } catch {
                    // Skip malformed frames to keep stream resilient.
                }
            },
        });

        return body.pipeThrough(decodeStream).pipeThrough(frameStream).pipeThrough(eventStream);
    }

    async streamEvents(options: StreamEventsOptions): Promise<void> {
        const controller = new AbortController();
        const timeoutHandle = options.timeoutMs && options.timeoutMs > 0 ? setTimeout(() => controller.abort(), options.timeoutMs) : undefined;

        const cancelOnExternalAbort = () => controller.abort();
        options.signal?.addEventListener('abort', cancelOnExternalAbort, { once: true });

        try {
            const response = await this.fetchImpl(this.config.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'text/event-stream',
                    ...this.config.headers,
                    ...options.headers,
                },
                body: JSON.stringify(options.input),
                signal: controller.signal,
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`AG-UI HTTP request failed: ${response.status} ${response.statusText}`);
            }
            if (!response.body) {
                throw new Error('AG-UI HTTP response body is empty');
            }

            const reader = this.createEventStream(response.body).getReader();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                await options.onEvent(value);
            }
        } finally {
            if (timeoutHandle) clearTimeout(timeoutHandle);
            options.signal?.removeEventListener('abort', cancelOnExternalAbort);
        }
    }
}
