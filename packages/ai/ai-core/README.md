# @quantum-design/ai-core

基于 `@ag-ui/core` 的 aiCore SDK 封装，使用 HTTP + SSE 与服务端通信，支持：

- 标准 AG-UI 事件流消费
- 工具调用流式参数聚合（`TOOL_CALL_START/ARGS/END/RESULT`）
- 可扩展插件系统（`pre -> normal -> post`）
- 可中断流式运行（`AbortController`）
- 本地工具调用自动执行与多轮递归

## 安装

```bash
pnpm add @quantum-design/ai-core @ag-ui/core
```

## 快速开始（现代 API）

```ts
import { createExecutor } from '@quantum-design/ai-core';

const executor = createExecutor({
    url: 'https://your-server/agui/runs',
    headers: {
        Authorization: 'Bearer token',
    },
});

const stream = executor.streamText({
    messages: [{ id: 'u1', role: 'user', content: 'Hello!' }],
});

for await (const event of stream.events) {
    if (event.type === 'TEXT_MESSAGE_CONTENT') {
        process.stdout.write(String(event.delta ?? ''));
    }
}
await stream.finished;

const response = await executor.generateText({
    messages: [{ id: 'u2', role: 'user', content: 'Hello again!' }],
});
console.log(response.text);
```

## Tools（InputSchema + execute）

`tools` 统一使用以下结构：

```ts
{
  name: string
  description?: string
  parameters?: unknown
  execute: (input, context) => unknown | Promise<unknown>
}
```

- SDK 发送到服务端时只会透传 `name/description/parameters`
- `execute` 不会被序列化到请求体
- 当流中出现 `TOOL_CALL_*` 事件时，SDK 会在内部自动执行 `execute`，业务方无需自行管理工具调用状态机

```ts
const stream = executor.streamText({
    messages: [{ id: 'u1', role: 'user', content: '1 + 2 = ?' }],
    tools: [
        {
            name: 'sum',
            description: 'sum two numbers',
            parameters: {
                type: 'object',
                properties: { a: { type: 'number' }, b: { type: 'number' } },
                required: ['a', 'b'],
            },
            execute: ({ a, b }: any) => a + b,
        },
    ],
});
```

## 插件示例

```ts
import { createAguiClient } from '@quantum-design/ai-core';

const client = createAguiClient({
    url: 'https://your-server/agui/runs',
    plugins: [
        {
            name: 'inject-user-id',
            enforce: 'pre',
            transformParams(input) {
                return {
                    forwardedProps: {
                        ...input.forwardedProps,
                        userId: 'u-001',
                    },
                };
            },
        },
        {
            name: 'drop-empty-delta',
            transformStream(event) {
                if (event.type === 'TEXT_MESSAGE_CONTENT' && !event.delta) {
                    return null;
                }
                return event;
            },
        },
    ],
});
```

## 需要低层控制时（可选）

`createExecutor` 是对 `AguiClient` 的高层封装。如果需要更细粒度的控制（如自定义事件订阅、手动 abort 等），可以直接使用 `AguiClient`：

```ts
import { createAguiClient } from '@quantum-design/ai-core';

const client = createAguiClient({
    url: 'https://your-server/agui/runs',
    headers: { Authorization: 'Bearer token' },
});

// 订阅全局事件流
const { unsubscribe } = client.subscribe((event) => {
    console.log('[event]', event.type, event);
});

// 启动流式运行
const session = client.runStream(
    {
        runId: 'run-001',
        threadId: 'thread-001',
        messages: [{ id: 'u1', role: 'user', content: 'Hello!' }],
    },
    {
        signal: new AbortController().signal, // 可选：用于中断
        maxToolRoundTrips: 5, // 可选：工具调用最大递归轮次，默认 3
    },
);

// 等待完成
const result = await session.finished;
console.log(result.status); // 'finished' | 'error' | 'aborted'

// 手动中断
// session.abort();

// 取消订阅
// unsubscribe();
```

## API 参考

### `createExecutor(config)`

高层执行器，适合简单的文本生成和工具调用场景。

| 参数         | 类型                     | 说明                      |
| ------------ | ------------------------ | ------------------------- |
| `url`        | `string`                 | AG-UI 服务端 SSE 端点 URL |
| `headers?`   | `Record<string, string>` | 请求头                    |
| `fetch?`     | `typeof fetch`           | 自定义 fetch 实现         |
| `timeoutMs?` | `number`                 | 请求超时（毫秒）          |
| `plugins?`   | `AguiPlugin[]`           | 插件列表                  |

**返回值方法：**

- `streamText(params)`: 流式文本输出，返回 `StreamTextResult`（包含 `events` 异步迭代器和 `finished` Promise）
- `generateText(params)`: 一次性获取完整响应，返回 `GenerateTextResult`（包含 `text` 等字段）

### `createAguiClient(config)`

低层客户端，适合需要自定义事件订阅和运行控制的场景。

**主要方法：**

- `subscribe(subscriber)`: 订阅全局事件流，返回 `{ unsubscribe }`
- `runStream(input, options?)`: 启动流式运行，返回 `RunSession`（包含 `runId`、`abort()`、`finished`）
- `abort(runId)`: 中断指定运行

### `AguiPlugin` 接口

插件可以在事件流的不同阶段介入：

| 钩子              | 阶段     | 说明                                    |
| ----------------- | -------- | --------------------------------------- |
| `transformParams` | 请求前   | 转换/修改请求参数                       |
| `transformStream` | 事件流中 | 转换/过滤事件，返回 `null` 则丢弃该事件 |
| `transformResult` | 完成后   | 转换/修改最终结果                       |
| `onError`         | 错误时   | 错误处理钩子                            |
