/**
 * 业务方流式输出使用示例
 *
 * 本示例展示如何流式使用 AguiExecutor，包括：
 * 1. 基础流式调用
 * 2. 实时处理流式数据（回调模式）
 * 3. 支持取消操作
 * 4. 错误处理
 */

import { EventType } from '../constant';

import { createExecutor } from '../runtime/executor';
import { ToolStreamAccumulator } from '../runtime/toolStream';
import type { ExecutorRunOptions, StreamSubscriber, ToolCallAccumulatorState } from '../types';
import process from 'process';

// ============================================================
// 示例 1: 基础流式调用（for-await 事件流）
// ============================================================
async function basicStreamingExample() {
    const executor = createExecutor(
        {
            url: 'https://your-agui-server.com',
            headers: { Authorization: 'Bearer your-token' },
        },
        {
            threadId: 'thread-123',
        },
    );

    const stream = executor.streamText({
        messages: [{ id: '1', role: 'user', content: '你好，请介绍一下自己' }],
    });

    for await (const event of stream.events) {
        if (event.type === EventType.TEXT_MESSAGE_CONTENT) {
            process.stdout.write(String(event.delta ?? ''));
        }
    }
    const run = await stream.finished;
    console.log('\n运行状态:', run.status);
}

// ============================================================
// 示例 2: 实时流式处理（边接收边处理）
// ============================================================
async function realTimeStreamingExample() {
    const executor = createExecutor(
        {
            url: 'https://your-agui-server.com',
            headers: { Authorization: 'Bearer your-token' },
        },
        {
            threadId: 'thread-123',
        },
    );

    // 收集实时数据
    let realTimeText = '';
    let realTimeReasoning = '';
    const realTimeToolCalls: ToolCallAccumulatorState[] = [];
    const toolAccumulator = new ToolStreamAccumulator();

    // 自定义订阅者 - 实时处理每个数据块
    const customSubscriber: StreamSubscriber = {
        onTextMessageStart: () => {
            console.log('[文本] 开始生成');
        },
        onTextMessageContent: (event) => {
            const delta = String(event.delta ?? '');
            realTimeText += delta;
            // 实时输出（比如用于打字机效果）
            process.stdout.write(`[文本增量] ${delta}`);
        },
        onTextMessageEnd: () => {
            console.log('\n[文本] 生成完成');
        },
        onReasoningStart: () => {
            console.log('[推理] 开始思考');
        },
        onReasoningMessageStart: () => {
            console.log('[推理] 开始思考');
        },
        onReasoningMessageContent: (event) => {
            const delta = String(event.delta ?? '');
            realTimeReasoning += delta;
            // 实时显示推理过程
            console.log(`[推理增量] ${delta}`);
        },
        onReasoningMessageChunk: (event) => {
            const delta = String(event.delta ?? '');
            realTimeReasoning += delta;
            // 实时显示推理过程
            console.log(`[推理增量] ${delta}`);
        },
        onReasoningEnd: () => {
            console.log('[推理] 思考完成');
        },
        onReasoningMessageEnd: () => {
            console.log('[推理] 思考完成');
        },
        onToolCallStart: (event) => {
            const state = toolAccumulator.process(event);
            if (!state) return;
            realTimeToolCalls.push(state);
            console.log(`[工具] 开始调用: ${state.toolCallName}`);
        },
        onToolCallArgs: (event) => {
            const state = toolAccumulator.process(event);
            if (!state) return;
            const existingIndex = realTimeToolCalls.findIndex((tc) => tc.toolCallId === state.toolCallId);
            if (existingIndex >= 0) realTimeToolCalls[existingIndex] = state;
            console.log(`[工具] 参数: ${state.argsText}`);
        },
        onToolCallEnd: (event) => {
            const state = toolAccumulator.process(event);
            if (!state) return;
            const existingIndex = realTimeToolCalls.findIndex((tc) => tc.toolCallId === state.toolCallId);
            if (existingIndex >= 0) realTimeToolCalls[existingIndex] = state;
            console.log(`[工具] 调用完成: ${state.toolCallName}`);
        },
        onToolCallResult: (event) => {
            const state = toolAccumulator.process(event);
            if (!state) return;
            const existingIndex = realTimeToolCalls.findIndex((tc) => tc.toolCallId === state.toolCallId);
            if (existingIndex >= 0) realTimeToolCalls[existingIndex] = state;
            console.log('[工具] 结果:', state.result);
        },
        onRunFinished: () => {
            console.log('[运行] 完成');
        },
        onRunError: (event) => {
            console.error('[运行] 错误:', event);
        },
        onError: (error) => {
            console.error('[错误]', error);
        },
    };

    const result = await executor.generateText(
        {
            messages: [{ id: '1', role: 'user', content: '你好' }],
        },
        {
            subscriber: customSubscriber,
        } as ExecutorRunOptions,
    );

    console.log('\n--- 最终结果 ---');
    console.log('实时收集的文本:', realTimeText);
    console.log('实时收集的推理:', realTimeReasoning);
    console.log('实时收集的工具调用:', realTimeToolCalls);
}

// ============================================================
// 示例 3: 支持取消的流式调用
// ============================================================
async function cancellableStreamingExample() {
    const executor = createExecutor(
        {
            url: 'https://your-agui-server.com',
            headers: { Authorization: 'Bearer your-token' },
        },
        {
            threadId: 'thread-123',
        },
    );

    // 创建 AbortController 用于取消
    const controller = new AbortController();

    // 5 秒后自动取消
    setTimeout(() => {
        console.log('触发取消...');
        controller.abort();
    }, 5000);

    try {
        const result = await executor.generateText(
            {
                messages: [{ id: '1', role: 'user', content: '写一篇长篇小说' }],
            },
            {
                signal: controller.signal,
            },
        );
        console.log('完成:', result.text);
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            console.log('请求已被取消');
        } else {
            throw error;
        }
    }
}

// ============================================================
// 示例 4: 在 React 中使用（结合 UI 更新）
// ============================================================
function reactUsageExample() {
    // 这是一个 React 组件中的使用示例
    // import { useState, useCallback } from 'react'
    // import { createExecutor } from '@cherry/aiCore-agui-sdk'
    //
    // function ChatComponent() {
    //   const [messages, setMessages] = useState<string[]>([])
    //   const [isStreaming, setIsStreaming] = useState(false)
    //   const [reasoning, setReasoning] = useState('')
    //   const abortRef = useRef<AbortController | null>(null)
    //
    //   const executor = createExecutor(
    //     { url: 'https://your-agui-server.com', headers: { 'Authorization': 'Bearer token' }},
    //     { threadId: 'thread-123' }
    //   )
    //
    //   const sendMessage = useCallback(async (content: string) => {
    //     // 取消之前的请求
    //     abortRef.current?.abort()
    //     abortRef.current = new AbortController()
    //
    //     setIsStreaming(true)
    //     setMessages(prev => [...prev, '']) // 添加空消息用于追加
    //     setReasoning('')
    //
    //     try {
    //       const result = await executor.streamText(
    //         { messages: [{ id: Date.now().toString(), role: 'user', content }] },
    //         { signal: abortRef.current.signal }
    //       )
    //
    //       // 更新最终消息
    //       setMessages(prev => {
    //         const newMessages = [...prev]
    //         newMessages[newMessages.length - 1] = result.text
    //         return newMessages
    //       })
    //     } catch (error) {
    //       if (error instanceof Error && error.name !== 'AbortError') {
    //         console.error('Error:', error)
    //       }
    //     } finally {
    //       setIsStreaming(false)
    //     }
    //   }, [executor])
    //
    //   return (
    //     <div>
    //       {reasoning && <div className="reasoning">思考中: {reasoning}</div>}
    //       {messages.map((msg, i) => <div key={i}>{msg}</div>)}
    //       {isStreaming && <div className="loading">正在输入...</div>}
    //     </div>
    //   )
    // }
}

// ============================================================
// 示例 5: 处理完整的事件流
// ============================================================
async function fullEventStreamExample() {
    const executor = createExecutor(
        {
            url: 'https://your-agui-server.com',
            headers: { Authorization: 'Bearer your-token' },
        },
        {
            threadId: 'thread-123',
        },
    );

    const allEvents: any[] = [];

    // 监听所有事件
    const subscriber: StreamSubscriber = {
        onEvent: (event) => {
            allEvents.push(event);

            // 打印事件类型（用于调试）
            const eventType = EventType[event.type as keyof typeof EventType] || event.type;
            console.log(`[事件] ${eventType}`, event);
        },
    };

    const stream = executor.streamText(
        {
            messages: [{ id: '1', role: 'user', content: '你好' }],
        },
        { subscriber },
    );

    for await (const event of stream.events) {
        allEvents.push(event);
    }
    await stream.finished;

    console.log(`共收到 ${allEvents.length} 个事件`);
    console.log('完整事件列表:', allEvents);
}

// ============================================================
// 运行示例
// ============================================================
async function main() {
    console.log('=== 示例 1: 基础流式调用 ===');
    // await basicStreamingExample()

    console.log('\n=== 示例 2: 实时流式处理 ===');
    // await realTimeStreamingExample()

    console.log('\n=== 示例 3: 支持取消 ===');
    // await cancellableStreamingExample()

    console.log('\n=== 示例 4: 完整事件流 ===');
    // await fullEventStreamExample()

    console.log('\n示例运行完成');
}

main();
