# 前言

## 版本

- 本目录主要是提供公共的 hooks 方法
- npm 包名称 `@quantum-design/hooks`
- 当前版本: **3.0.0** (最新升级)

## 总览

| hooks                  | 类型 | ui 库 | 链接                                                                           | 简介             |
| ---------------------- | ---- | ----- | ------------------------------------------------------------------------------ | ---------------- |
| useEcharts             | vue  | -     | [/packages/hooks/use-echarts](/packages/hooks/use-echarts)                     | echarts 图表集成 |
| useMessage             | vue  | antd  | [/packages/hooks/use-message](/packages/hooks/use-message)                     | 消息弹框         |
| useSortable            | base | -     | [/packages/hooks/use-sortable](/packages/hooks/use-sortable)                   | 拖拽排序         |
| useMultipartUpload     | base | -     | [/packages/hooks/use-multipart-upload](/packages/hooks/use-multipart-upload)   | 分片上传         |
| usePage                | vue  | -     | [/packages/hooks/use-page](/packages/hooks/use-page)                           | 路由跳转         |
| usePagination          | vue  | -     | [/packages/hooks/use-pagination](/packages/hooks/use-pagination)               | 前端分页         |
| useSlots               | vue  | -     | [/packages/hooks/use-slots](/packages/hooks/use-slots)                         | 插槽操作         |
| useParamsAliveRoot     | vue  | -     | [/packages/hooks/use-params-alive](/packages/hooks/use-params-alive)           | 参数保存根路由   |
| useParamsAlive         | vue  | -     | [/packages/hooks/use-params-alive](/packages/hooks/use-params-alive)           | 参数保存子路由   |
| **useDesignTokens**    | vue  | -     | [/packages/hooks/use-design-tokens](/packages/hooks/use-design-tokens)         | **设计令牌管理** |
| **useOriginTableSort** | vue  | -     | [/packages/hooks/use-origin-table-sort](/packages/hooks/use-origin-table-sort) | **表格排序**     |
| **usePriorityValue**   | vue  | -     | [/packages/hooks/use-priority-value](/packages/hooks/use-priority-value)       | **优先级值管理** |

## v3.0.0 新增功能

### 🆕 新增 Hooks

#### useDesignTokens

- 提供设计令牌（Design Tokens）的统一管理
- 支持主题切换时的令牌更新
- 与Tailwind CSS和CSS变量完美集成

#### useOriginTableSort

- 增强的表格排序功能
- 支持多列排序和自定义排序逻辑
- 优化大数据量下的排序性能

#### usePriorityValue

- 智能优先级值管理
- 支持动态优先级调整
- 适用于任务管理、队列处理等场景

### 🔧 性能优化

- 所有hooks支持Vue 3.5最新特性
- 优化内存使用和响应式性能
- 改进TypeScript类型推断
- 减少不必要的re-renders

### 📦 依赖升级

- 兼容最新的Vue 3.5.18
- 支持最新的Pinia 3.0.3
- 集成最新的ECharts 6.0.0
