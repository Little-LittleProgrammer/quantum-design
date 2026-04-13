# @quantum-design/ai-core-plugins

基于 `@quantum-design/ai-core` 的插件集合，提供流式事件处理、Markdown 渲染、代码块解析等常用功能。

## 目录

- [安装](#安装)
- [插件系统架构](#插件系统架构)
- [内置插件](#内置插件)
    - [MarkdownToHtmlPlugin](#markdowntohtmlplugin)
    - [CodeBlockParserPlugin](#codeblockparserplugin)
- [自定义插件开发](#自定义插件开发)
- [最佳实践](#最佳实践)

---

## 安装

```bash
pnpm add @quantum-design/ai-core-plugins @quantum-design/ai-core
```

---

## 插件系统架构

### 插件接口定义

所有插件都实现 `AguiPlugin` 接口：

```typescript
interface AguiPlugin {
    // 插件名称，用于唯一标识
    name: string;

    // 执行顺序：'pre' 在主流程之前执行，'post' 在主流程之后执行
    enforce?: 'pre' | 'post';

    // 在输入进入插件系统前处理/转换输入，可返回 null 跳过本次运行
    resolveInput?: (input: AgUiRunInput, context: AguiPluginContext) => Promise<AgUiRunInput | null> | AgUiRunInput | null;

    // 初始化插件上下文，可在此时设置插件所需的配置或资源
    configureContext?: (context: AguiPluginContext) => void | Promise<void>;

    // 转换/增强输入参数，返回部分字段的更新
    transformParams?: (input: AgUiRunInput, context: AguiPluginContext) => Partial<AgUiRunInput> | Promise<Partial<AgUiRunInput>>;

    // 处理最终结果，可修改或增强返回数据
    transformResult?: (result: RunResult, context: AguiPluginContext) => RunResult | Promise<RunResult>;

    // 运行开始时的钩子
    onRunStart?: (context: AguiPluginContext) => void | Promise<void>;

    // 运行结束时的钩子
    onRunEnd?: (context: AguiPluginContext, result: RunResult) => void | Promise<void>;

    // 错误处理钩子
    onError?: (error: Error, context: AguiPluginContext) => void | Promise<void>;

    // 流式事件转换，处理 SSE 流中的每个事件，可返回 null 跳过该事件
    transformStream?: (event: AgUiEvent, context: AguiPluginContext) => AgUiEvent | null | Promise<AgUiEvent | null>;
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

---

## 内置插件

### MarkdownToHtmlPlugin

将流式输出的 Markdown 文本实时转换为 HTML，支持代码块的自定义渲染。

#### 功能特性

- 非侵入式：不修改原始 `delta`/`content` 字段
- 实时转换：每次文本增量更新时自动重新渲染
- 代码块插槽：支持将代码块替换为自定义渲染组件
- 异步渲染：支持异步的 `transformRender` 函数

#### 基础用法

```typescript
import { createExecutor } from '@quantum-design/ai-core';
import { createMarkdownToHtmlPlugin } from '@quantum-design/ai-core-plugins';

const executor = createExecutor(
    { url: 'https://your-server/agui/runs' },
    {
        plugins: [createMarkdownToHtmlPlugin()],
    },
);

const stream = executor.streamText({
    messages: [{ id: 'u1', role: 'user', content: '用 Markdown 格式介绍自己' }],
});

for await (const event of stream.events) {
    if (event.type === 'TEXT_MESSAGE_CONTENT') {
        // event.markdownHtml 包含当前累积的 HTML
        console.log(event.markdownHtml);

        // event.renderTokens 包含代码块渲染信息
        console.log(event.renderTokens);
    }
}
```

#### 配置选项

```typescript
interface MarkdownToHtmlPluginOptions {
    // HTML 输出字段名，默认 'markdownHtml'
    fieldName?: string;

    // 渲染令牌字段名，默认 'renderTokens'
    tokenFieldName?: string;

    // 代码块转换处理器
    transformHandlers?: TransformHandler[];
}
```

#### 自定义代码块渲染

```typescript
import { createMarkdownToHtmlPlugin } from '@quantum-design/ai-core-plugins';

const plugin = createMarkdownToHtmlPlugin({
    transformHandlers: [
        {
            type: 'codeBlock',
            subtype: 'mermaid',
            // 暂停流式输出，等待渲染完成
            pause: true,
            // 自定义渲染逻辑
            transformRender: async (content, event) => {
                const mermaid = await import('mermaid');
                const { svg } = await mermaid.render('mermaid-svg', content);
                return { svg };
            },
        },
        {
            type: 'codeBlock',
            subtype: 'chart',
            transformRender: (content) => {
                // 解析图表配置并返回
                return JSON.parse(content);
            },
        },
    ],
});
```

#### RenderToken 结构

每个代码块会生成一个 `RenderToken`，用于追踪渲染状态：

```typescript
interface RenderToken {
    id: string; // 令牌唯一标识
    slotId: string; // 插槽 ID，用于 DOM 定位
    type: 'codeBlock'; // 类型
    subtype: string; // 子类型（如 'mermaid', 'chart'）
    pause: boolean; // 是否暂停流
    status: 'pending' | 'ready' | 'error'; // 渲染状态
    content: string; // 原始内容
    payload?: unknown; // transformRender 返回的结果
    error?: string; // 错误信息
}
```

#### HTML 输出示例

当配置了 `transformHandlers` 时，代码块会被替换为插槽占位符：

```html
<div data-agui-slot="agui_slot_1" data-agui-type="codeBlock" data-agui-subtype="mermaid" data-agui-status="pending" data-agui-pause="true"></div>
```

---

### CodeBlockParserPlugin

从流式文本中解析代码块内容，适用于需要实时提取代码块数据的场景。

#### 功能特性

- 自动提取最新代码块
- 支持多种代码块类型
- 可自定义解析逻辑
- 非侵入式：附加数据而不修改原始事件

#### 基础用法

```typescript
import { createExecutor } from '@quantum-design/ai-core';
import { createCodeBlockParserPlugin } from '@quantum-design/ai-core-plugins';

const executor = createExecutor(
    { url: 'https://your-server/agui/runs' },
    {
        plugins: [
            createCodeBlockParserPlugin({
                codeBlockHandlers: [
                    {
                        type: 'json',
                        parse: (content) => JSON.parse(content),
                    },
                    {
                        type: 'typescript',
                        parse: (content) => content, // 直接返回文本
                    },
                ],
            }),
        ],
    },
);

const stream = executor.streamText({
    messages: [{ id: 'u1', role: 'user', content: '生成一个 JSON 配置' }],
});

for await (const event of stream.events) {
    if (event.type === 'TEXT_MESSAGE_CONTENT') {
        // event.codeBlockData 包含解析后的数据
        console.log(event.codeBlockData);
        // 输出示例: { json: { name: "config", value: 123 }, typescript: "const x = 1;" }
    }
}
```

#### 配置选项

```typescript
interface CodeBlockParserPluginOptions {
    // 输出字段名，默认 'codeBlockData'
    fieldName?: string;

    // 代码块处理器列表
    codeBlockHandlers: CodeBlockHandler[];
}

interface CodeBlockHandler<T = unknown> {
    // 代码块类型标识（如 'json', 'python'）
    type: string;

    // 解析函数，将代码块内容转换为目标类型
    parse: (content: string) => T;
}
```

#### 高级用法：多类型解析

```typescript
const plugin = createCodeBlockParserPlugin({
    fieldName: 'extractedData',
    codeBlockHandlers: [
        {
            type: 'json',
            parse: (content) => JSON.parse(content),
        },
        {
            type: 'yaml',
            parse: (content) => parseYaml(content),
        },
        {
            type: 'sql',
            parse: (content) => ({
                raw: content,
                normalized: content.trim().toLowerCase(),
            }),
        },
    ],
});
```

#### 行为说明

- 提取**最新**的同类型代码块内容
- 解析失败时静默忽略，保持流正常运行
- 每次 `TEXT_MESSAGE_CONTENT` 事件都会重新解析

---

## 自定义插件开发

### 简单插件示例

```typescript
import type { AguiPlugin } from '@quantum-design/ai-core';

// 日志插件
const loggerPlugin: AguiPlugin = {
    name: 'logger',
    onRunStart: (context) => {
        console.log(`[Run Started] runId: ${context.runId}`);
    },
    onRunEnd: (context, result) => {
        console.log(`[Run Ended] status: ${result.status}`);
    },
    onError: (error, context) => {
        console.error(`[Error] ${error.message}`);
    },
};
```

### 流式事件转换插件

```typescript
import { EventType } from '@ag-ui/core';
import type { AguiPlugin, AgUiEvent } from '@quantum-design/ai-core';

// 过滤空 delta 事件
const dropEmptyDeltaPlugin: AguiPlugin = {
    name: 'drop-empty-delta',
    transformStream(event: AgUiEvent) {
        if (event.type === EventType.TEXT_MESSAGE_CONTENT && !event.delta) {
            return null; // 返回 null 跳过该事件
        }
        return event;
    },
};
```

### 增强事件插件

```typescript
import { EventType } from '@ag-ui/core';
import type { AguiPlugin, AgUiEvent } from '@quantum-design/ai-core';

// 添加时间戳和字数统计
const enrichEventPlugin: AguiPlugin = {
    name: 'enrich-event',
    transformStream(event: AgUiEvent) {
        if (event.type === EventType.TEXT_MESSAGE_CONTENT) {
            const text = String(event.delta ?? '');
            return {
                ...event,
                timestamp: Date.now(),
                charCount: text.length,
            };
        }
        return event;
    },
};
```

### 预处理插件

```typescript
import type { AguiPlugin } from '@quantum-design/ai-core';

// 注入用户信息
const injectUserPlugin: AguiPlugin = {
    name: 'inject-user',
    enforce: 'pre', // 最先执行
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

### 工厂函数模式

推荐使用工厂函数创建可配置的插件：

```typescript
import { EventType } from '@ag-ui/core';
import type { AguiPlugin, AgUiEvent } from '@quantum-design/ai-core';

interface KeywordHighlightPluginOptions {
    keywords: string[];
    highlightClass?: string;
}

export function createKeywordHighlightPlugin(options: KeywordHighlightPluginOptions): AguiPlugin {
    const { keywords, highlightClass = 'highlight' } = options;
    let textBuffer = '';

    return {
        name: 'keyword-highlight',
        transformStream(event: AgUiEvent) {
            if (event.type === EventType.RUN_STARTED) {
                textBuffer = '';
            } else if (event.type === EventType.TEXT_MESSAGE_CONTENT) {
                textBuffer += String(event.delta ?? '');

                // 检查是否包含关键词
                const matchedKeywords = keywords.filter((kw) => textBuffer.includes(kw));

                return {
                    ...event,
                    matchedKeywords,
                    highlightClass,
                };
            }
            return event;
        },
    };
}

// 使用
const plugin = createKeywordHighlightPlugin({
    keywords: ['error', 'warning', 'success'],
    highlightClass: 'text-warning',
});
```

---

## 最佳实践

### 1. 插件命名规范

- 内置插件使用 `built-in:` 前缀
- 自定义插件使用项目/团队前缀，如 `myapp:logger`

```typescript
const plugin: AguiPlugin = {
    name: 'myapp:custom-plugin', // 清晰的命名空间
    // ...
};
```

### 2. 错误处理

插件内部的错误应该被捕获并优雅处理，不应中断流：

```typescript
const safePlugin: AguiPlugin = {
    name: 'safe-plugin',
    transformStream(event) {
        try {
            // 可能出错的操作
            return doSomething(event);
        } catch (error) {
            console.error('Plugin error:', error);
            return event; // 返回原始事件，保持流继续
        }
    },
};
```

### 3. 状态管理

需要状态的插件应在 `RUN_STARTED` 时重置：

```typescript
import { EventType } from '@ag-ui/core';

const statefulPlugin: AguiPlugin = {
    name: 'stateful-plugin',
    transformStream(event) {
        if (event.type === EventType.RUN_STARTED) {
            // 重置状态
            this.state = { count: 0, buffer: '' };
        }
        // ...
    },
};
```

### 4. 插件组合

多个插件可以组合使用，注意执行顺序：

```typescript
const executor = createExecutor(
  { url: 'https://your-server/agui/runs' },
  {
    plugins: [
      // 1. 预处理
      { name: 'inject-context', enforce: 'pre', transformParams: ... },

      // 2. 核心转换
      createMarkdownToHtmlPlugin(),
      createCodeBlockParserPlugin({ ... }),

      // 3. 后处理
      { name: 'logger', enforce: 'post', onRunEnd: ... }
    ]
  }
);
```

### 5. 性能优化

对于计算密集型操作，考虑使用防抖或采样：

```typescript
const optimizedPlugin: AguiPlugin = {
    name: 'optimized-plugin',
    transformStream(event) {
        if (event.type === EventType.TEXT_MESSAGE_CONTENT) {
            // 每隔 N 个事件才执行计算
            if (++this.counter % 10 === 0) {
                // 执行昂贵的计算
            }
        }
        return event;
    },
};
```

---

## API 导出

```typescript
// 插件工厂函数
export { createMarkdownToHtmlPlugin } from './markdownToHtmlPlugin';
export { createCodeBlockParserPlugin } from './codeBlockParserPlugin';

// 类型导出
export type { MarkdownToHtmlPluginOptions, RenderToken, TransformHandler } from './markdownToHtmlPlugin';
export type { CodeBlockParserPluginOptions, CodeBlockHandler } from './codeBlockParserPlugin';
```

---

## 依赖

| 依赖                      | 用途                      |
| ------------------------- | ------------------------- |
| `@quantum-design/ai-core` | 提供插件接口类型定义      |
| `@ag-ui/core`             | 提供 AG-UI 事件类型       |
| `markdown-it`             | Markdown 解析和 HTML 渲染 |

---

## License

ISC
