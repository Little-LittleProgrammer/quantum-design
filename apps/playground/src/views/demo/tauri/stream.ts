// stream_fetch 的前端封装，基于 @tauri-apps/api 的 invoke 与 listen
// 1) invoke('stream_fetch', { method, url, headers, body }) -> 得到首包响应（含状态码和响应头）
// 2) 监听事件 'stream-response'，同 request_id 的 chunk 依次写入 ReadableStream，EndPayload 代表结束

import { invoke } from '@tauri-apps/api/core';
import { listen, type UnlistenFn } from '@tauri-apps/api/event';

type ChunkPayload = { request_id: number; chunk: number[] };
type EndPayload = { request_id: number; status: number };

type StreamResponse = {
    request_id: number;
    status: number;
    status_text: string;
    headers: Record<string, string>;
};

export type StreamFetchOptions = {
    method?: string;
    headers?: HeadersInit;
    body?: string | Uint8Array | ArrayBuffer | null;
    signal?: AbortSignal | null;
};

function toHeaderRecord(init?: HeadersInit): Record<string, string> {
    const record: Record<string, string> = {};
    if (!init) return record;
    const h = new Headers(init);
    for (const [k, v] of h) record[k] = v;
    return record;
}

function toBodyArray(body?: string | Uint8Array | ArrayBuffer | null): number[] {
    if (!body) return [];
    if (typeof body === 'string') {
        return Array.from(new TextEncoder().encode(body));
    }
    if (body instanceof Uint8Array) {
        return Array.from(body);
    }
    if (body instanceof ArrayBuffer) {
        return Array.from(new Uint8Array(body));
    }
    return [];
}

export async function streamFetch(url: string, options: StreamFetchOptions = {}): Promise<Response> {
    const { method = 'POST', headers, body, signal } = options;

    const ts = new TransformStream();
    const writer = ts.writable.getWriter();

    let unlisten: UnlistenFn | null = null;
    let closed = false;
    let requestId: number | null = null;

    const close = () => {
        if (closed) return;
        closed = true;
        if (unlisten) {
            unlisten();
            unlisten = null;
        }
        writer.ready.then(() => writer.close()).catch(() => void 0);
    };

    if (signal) {
        signal.addEventListener('abort', () => close(), { once: true });
    }

    // 预先注册事件监听，避免极端情况下首个 chunk 早于 JS 取到 request_id
    unlisten = await listen('stream-response', (event) => {
        const payload = event.payload as ChunkPayload | EndPayload;
        const rid = (payload as any).request_id as number;
        if (requestId === null) {
            // 尚未拿到 request_id，忽略（或抢占）。为了安全，仍然只在匹配后处理
        }
        if (requestId !== null && rid !== requestId) return;

        if ((payload as ChunkPayload).chunk !== undefined) {
            const chunk = (payload as ChunkPayload).chunk;
            writer.ready.then(() => writer.write(new Uint8Array(chunk)));
        } else {
            // EndPayload：结束
            close();
        }
    });

    try {
        const headerRecord = toHeaderRecord(headers);
        const bodyArray = toBodyArray(body ?? null);

        const res = (await invoke('stream_fetch', {
            method: method.toUpperCase(),
            url,
            headers: headerRecord,
            body: bodyArray,
        })) as StreamResponse;

        requestId = res.request_id;
        const { status, status_text: statusText, headers: responseHeaders } = res;
        return new Response(ts.readable, { status, statusText, headers: responseHeaders });
    } catch (e: unknown) {
        // 出错时关闭写端，返回 599 响应
        close();
        console.error('stream_fetch error', e);
        return new Response('', { status: 599 });
    }
}
