# @quantum-design/ai-core

## 1.0.0

### Major Changes

- 基于 `@ag-ui/core` 的 aiCore SDK 封装，使用 HTTP + SSE 与服务端通信，支持：
    - 标准 AG-UI 事件流消费
    - 工具调用流式参数聚合（`TOOL_CALL_START/ARGS/END/RESULT`）
    - 可扩展插件系统（`pre -> normal -> post`）
    - 可中断流式运行（`AbortController`）
