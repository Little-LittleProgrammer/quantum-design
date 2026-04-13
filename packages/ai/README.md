# @quantum-design/ai

基于 `@ag-ui/core` 的 AI Core SDK 封装，提供标准 AG-UI 事件流消费、工具调用流式参数聚合、可扩展插件系统。

## 目录

- [架构概览](#架构概览)
- [AG-UI 事件规范](#ag-ui-事件规范)
- [aiCore SDK 接入规范](#aicore-sdk-接入规范)
- [插件封装规范](#插件封装规范)

---

## 架构概览

```
packages/ai
├── ai-core/           # 核心 SDK，提供 AG-UI 事件流处理、工具调用、插件系统
├── ai-core-plugins/   # 官方插件集合
```

### 核心能力

| 能力                     | 描述                                       |
| ------------------------ | ------------------------------------------ |
| 标准 AG-UI 事件流消费    | 支持完整的 AG-UI 事件类型                  |
| 工具调用流式参数聚合     | `TOOL_CALL_START/ARGS/END/RESULT` 自动处理 |
| 可扩展插件系统           | `pre -> normal -> post` 三阶段执行         |
| 可中断流式运行           | 支持 `AbortController`                     |
| 可选 Cherry Chunk 适配器 | 支持自定义 chunk 处理                      |

---

## AG-UI 事件规范

### 事件类型定义

所有事件类型定义在 `ai-core/src/constant.ts`：

```typescript
export enum EventType {
    // 文本消息
    TEXT_MESSAGE_START = 'TEXT_MESSAGE_START',
    TEXT_MESSAGE_CONTENT = 'TEXT_MESSAGE_CONTENT',
    TEXT_MESSAGE_END = 'TEXT_MESSAGE_END',

    // 工具调用
    TOOL_CALL_START = 'TOOL_CALL_START',
    TOOL_CALL_ARGS = 'TOOL_CALL_ARGS',
    TOOL_CALL_END = 'TOOL_CALL_END',
    TOOL_CALL_RESULT = 'TOOL_CALL_RESULT',

    // 状态管理
    STATE_SNAPSHOT = 'STATE_SNAPSHOT',
    STATE_DELTA = 'STATE_DELTA',
    MESSAGES_SNAPSHOT = 'MESSAGES_SNAPSHOT',

    // 运行生命周期
    RUN_STARTED = 'RUN_STARTED',
    RUN_FINISHED = 'RUN_FINISHED',
    RUN_ERROR = 'RUN_ERROR',

    // 推理
    REASONING_START = 'REASONING_START',
    REASONING_MESSAGE_START = 'REASONING_MESSAGE_START',
    REASONING_MESSAGE_CONTENT = 'REASONING_MESSAGE_CONTENT',
    REASONING_MESSAGE_END = 'REASONING_MESSAGE_END',
    REASONING_END = 'REASONING_END',
}
```

### 事件结构

```typescript
interface AgUiEvent<T extends EventType = EventType> {
    type: T;
    timestamp?: number;
    rawEvent?: unknown;
    code?: T extends EventType.RUN_ERROR ? string : undefined;
    message?: T extends EventType.RUN_ERROR ? string : undefined;
    [key: string]: unknown;
}
```

### 事件字段详解

#### 通用字段

| 字段        | 类型        | 描述                              |
| ----------- | ----------- | --------------------------------- |
| `type`      | `EventType` | 事件类型                          |
| `timestamp` | `number`    | 事件时间戳                        |
| `rawEvent`  | `unknown`   | 原始事件数据                      |
| `code`      | `string`    | 错误码（仅 `RUN_ERROR` 时有效）   |
| `message`   | `string`    | 错误消息（仅 `RUN_ERROR` 时有效） |

#### 文本消息事件 (`TEXT_MESSAGE_*`)

| 字段        | 类型     | 描述         |
| ----------- | -------- | ------------ |
| `delta`     | `string` | 文本增量内容 |
| `messageId` | `string` | 消息唯一标识 |
| `content`   | `string` | 完整文本内容 |

#### 推理消息事件 (`REASONING_*`)

| 字段                  | 类型     | 描述             |
| --------------------- | -------- | ---------------- |
| `delta`               | `string` | 推理内容增量     |
| `messageId`           | `string` | 消息唯一标识     |
| `content`             | `string` | 完整推理内容     |
| `encryptionPublicKey` | `string` | 加密公钥（可选） |

#### 工具调用事件 (`TOOL_CALL_*`)

| 字段              | 类型      | 描述             |
| ----------------- | --------- | ---------------- |
| `toolCallId`      | `string`  | 工具调用唯一标识 |
| `toolCallName`    | `string`  | 工具名称         |
| `parentMessageId` | `string`  | 父消息 ID        |
| `delta`           | `string`  | 参数增量文本     |
| `messageId`       | `string`  | 消息 ID          |
| `content`         | `unknown` | 工具执行结果内容 |

#### 运行事件 (`RUN_*`)

| 字段       | 类型      | 描述         |
| ---------- | --------- | ------------ |
| `runId`    | `string`  | 运行唯一标识 |
| `threadId` | `string`  | 线程唯一标识 |
| `status`   | `string`  | 运行状态     |
| `result`   | `unknown` | 运行结果数据 |

#### 状态事件 (`STATE_*`, `MESSAGES_SNAPSHOT`, `ACTIVITY_*`)

| 字段       | 类型        | 描述         |
| ---------- | ----------- | ------------ |
| `snapshot` | `unknown`   | 状态快照数据 |
| `delta`    | `unknown`   | 状态增量更新 |
| `messages` | `unknown[]` | 消息列表快照 |

---

## aiCore SDK 接入规范

### 安装

```bash
pnpm add @quantum-design/ai-core @ag-ui/core
```

### 基础用法

```typescript
import { createExecutor } from '@quantum-design/ai-core';

const executor = createExecutor({
    url: 'https://your-server/agui/runs',
    headers: {
        Authorization: 'Bearer token',
    },
});

// 流式输出
const stream = executor.streamText({
    messages: [{ id: 'u1', role: 'user', content: 'Hello!' }],
});

for await (const event of stream.events) {
    if (event.type === 'TEXT_MESSAGE_CONTENT') {
        process.stdout.write(String(event.delta ?? ''));
    }
}
await stream.finished;

// 非流式输出
const response = await executor.generateText({
    messages: [{ id: 'u2', role: 'user', content: 'Hello again!' }],
});
console.log(response.text);
```

### 工具调用规范

`tools` 统一使用 InputSchema 格式：

```typescript
interface InputSchemaTool {
    name: string;
    description?: string;
    parameters?: unknown; // JSON Schema
    execute: (input: unknown, context: AguiToolExecutionContext) => unknown | Promise<unknown>;
}
```

**关键点：**

- SDK 发送到服务端时只透传 `name/description/parameters`
- `execute` 不会被序列化到请求体
- 当流中出现 `TOOL_CALL_*` 事件时，SDK 自动执行 `execute`

```typescript
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

### 核心接口

#### Executor 配置

```typescript
interface AguiClientConfig {
    url: string; // 服务端 URL
    headers?: Record<string, string>;
    fetch?: typeof globalThis.fetch;
    timeoutMs?: number;
    plugins?: AguiPlugin[]; // 插件列表
}
```

#### 流式参数

```typescript
interface StreamTextParams {
    threadId?: string;
    messages: AgUiRunInput['messages'];
    runId?: string;
    parentRunId?: string;
    state?: unknown;
    tools?: InputSchemaTool[];
    context?: unknown[];
    forwardedProps?: Record<string, unknown>; // 转发到服务端的额外参数
}
```

#### forwardedProps

`forwardedProps` 用于传递自定义参数到服务端，会被透传到请求体中：

```typescript
const stream = executor.streamText({
    messages: [{ id: 'u1', role: 'user', content: 'Hello' }],
    forwardedProps: {
        userId: 'u-001',
        sessionId: 'sess-abc',
        customField: 'value',
    },
});
```

---

## 插件封装规范

### 插件接口定义

所有插件实现 `AguiPlugin` 接口：

```typescript
interface AguiPlugin {
    /** 插件名称，用于唯一标识 */
    name: string;

    /** 执行顺序：pre 在主流程之前执行，post 在主流程之后执行 */
    enforce?: 'pre' | 'post';

    /** 在输入进入插件系统前处理/转换输入，可返回 null 跳过本次运行 */
    resolveInput?: (input: AgUiRunInput, context: AguiPluginContext) => AgUiRunInput | null;

    /** 初始化插件上下文 */
    configureContext?: (context: AguiPluginContext) => void | Promise<void>;

    /** 转换/增强输入参数 */
    transformParams?: (input: AgUiRunInput, context: AguiPluginContext) => Partial<AgUiRunInput>;

    /** 处理最终结果 */
    transformResult?: (result: RunResult, context: AguiPluginContext) => RunResult;

    /** 运行开始时的钩子 */
    onRunStart?: (context: AguiPluginContext) => void | Promise<void>;

    /** 运行结束时的钩子 */
    onRunEnd?: (context: AguiPluginContext, result: RunResult) => void | Promise<void>;

    /** 错误处理钩子 */
    onError?: (error: Error, context: AguiPluginContext) => void | Promise<void>;

    /** 流式事件转换 */
    transformStream?: (event: AgUiEvent, context: AguiPluginContext) => AgUiEvent | null;
}
```

### 执行流程

```
resolveInput → configureContext → onRunStart → transformParams → [主逻辑] → transformResult → onRunEnd
                                      ↓
                              transformStream (穿插于流式响应中)
```

### 插件执行顺序

- `enforce: 'pre'` 的插件先执行（预处理）
- 未指定 `enforce` 的插件中间执行
- `enforce: 'post'` 的插件最后执行（后处理）

### 插件示例

#### 1. 预处理插件（注入用户信息）

```typescript
const injectUserPlugin: AguiPlugin = {
    name: 'inject-user',
    enforce: 'pre',
    transformParams(input) {
        return {
            forwardedProps: {
                ...input.forwardedProps,
                userId: 'u-001',
                userName: 'Test User',
            },
        };
    },
};
```

#### 2. 流式事件转换插件（过滤空 delta）

```typescript
const dropEmptyDeltaPlugin: AguiPlugin = {
    name: 'drop-empty-delta',
    transformStream(event) {
        if (event.type === 'TEXT_MESSAGE_CONTENT' && !event.delta) {
            return null; // 返回 null 跳过该事件
        }
        return event;
    },
};
```

#### 3. 工厂函数模式（推荐）

```typescript
interface KeywordHighlightPluginOptions {
    keywords: string[];
    highlightClass?: string;
}

export function createKeywordHighlightPlugin(options: KeywordHighlightPluginOptions): AguiPlugin {
    const { keywords, highlightClass = 'highlight' } = options;
    let textBuffer = '';

    return {
        name: 'keyword-highlight',
        transformStream(event) {
            if (event.type === 'TEXT_MESSAGE_START') {
                textBuffer = '';
            } else if (event.type === 'TEXT_MESSAGE_CONTENT') {
                textBuffer += String(event.delta ?? '');
                const matchedKeywords = keywords.filter((kw) => textBuffer.includes(kw));
                return { ...event, matchedKeywords, highlightClass };
            }
            return event;
        },
    };
}
```

### 插件开发最佳实践

1. **错误处理**：插件内部错误应被捕获，不应中断流

    ```typescript
    transformStream(event) {
        try {
            return doSomething(event);
        } catch (error) {
            console.error('Plugin error:', error);
            return event; // 返回原始事件，保持流继续
        }
    }
    ```

2. **状态管理**：需要状态的插件应在 `RUN_STARTED` 时重置

    ```typescript
    transformStream(event) {
        if (event.type === 'RUN_STARTED') {
            this.state = { count: 0, buffer: '' };
        }
        // ...
    }
    ```

3. **插件组合**：多个插件按顺序执行
    ```typescript
    const executor = createExecutor(
        { url: 'https://your-server/agui/runs' },
        {
            plugins: [
                { name: 'inject-context', enforce: 'pre', transformParams: ... },
                createMarkdownToHtmlPlugin(),
                createCodeBlockParserPlugin({ ... }),
                { name: 'logger', enforce: 'post', onRunEnd: ... }
            ]
        }
    );
    ```

### 内置插件

官方提供以下插件（详见 `ai-core-plugins/README.md`）：

| 插件                    | 描述                                       |
| ----------------------- | ------------------------------------------ |
| `MarkdownToHtmlPlugin`  | Markdown 实时转 HTML，支持代码块自定义渲染 |
| `CodeBlockParserPlugin` | 从流式文本中解析代码块内容                 |

---

## 依赖

| 包            | 用途               |
| ------------- | ------------------ |
| `@ag-ui/core` | AG-UI 事件类型定义 |
| `eventsource` | SSE 客户端         |

## License

ISC
