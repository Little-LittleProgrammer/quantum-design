# Changelog

## 0.0.2

### Patch Changes

-   371bf90: 修复 utils 缺陷
-   371bf90: 常规更新
-   Updated dependencies [371bf90]
-   Updated dependencies [371bf90]
-   Updated dependencies [371bf90]
    -   @quantum-design/utils@2.0.3
    -   @quantum-design/shared@2.0.3

## 0.0.2-beta.7

### Patch Changes

-   修复 utils 缺陷
-   Updated dependencies
    -   @quantum-design/shared@2.0.3-beta.1
    -   @quantum-design/utils@2.0.3-beta.2

## 0.0.2-beta.6

### Patch Changes

-   常规更新
-   Updated dependencies
    -   @quantum-design/shared@2.0.3-beta.0
    -   @quantum-design/utils@2.0.3-beta.1

## 0.0.2-beta.5

### Patch Changes

-   Updated dependencies
    -   @quantum-design/utils@2.0.3-beta.0

## 0.0.2-beta.4

### Patch Changes

-   修复 ai 通讯缺陷

## 0.0.2-beta.3

### Patch Changes

-   固定版本
-   Updated dependencies
    -   @quantum-design/shared@2.1.1-beta.1
    -   @quantum-design/utils@2.1.1-beta.2

All notable changes to this project will be documented in this file.

## [0.0.2-beta.3] - 2024-06-04

### Added

-   ✨ 百炼应用流式响应支持
-   🔄 `generateStream` 方法现在同时支持通义千问和百炼应用
-   📝 百炼应用流式响应中的会话 ID 自动管理
-   🎯 新增 `BailianStreamChunk` 类型定义

### Enhanced

-   **AliyunProvider**: `generateStream` 方法重构，支持百炼应用和通义千问两种模式
-   **Type Safety**: 新增百炼应用流式响应的完整类型定义
-   **Session Management**: 百炼应用流式响应中自动更新和管理会话 ID
-   **Error Handling**: 改进流式响应的错误处理和调试信息

### Documentation

-   📚 更新 README 文档，添加百炼应用流式响应示例
-   💡 增加流式响应使用指南
-   🔧 完善 API 文档说明

## [0.0.2-beta.2] - 2024-06-04

### Added

-   🎉 初始版本发布
-   ✨ 统一的 AI 接口封装
-   🔄 支持阿里云通义千问和百炼应用
-   💧 流式和非流式响应支持
-   🔁 内置指数退避重试机制
-   🎯 完整的 TypeScript 类型定义
-   📝 多轮对话会话管理
-   🛠️ 便捷的创建和注册函数

### Features

-   **BaseAIProvider**: 抽象基类，定义统一接口
-   **AIHub**: 管理器类，支持多供应商注册和调用
-   **AliyunProvider**: 阿里云 AI 供应商实现
-   **AliyunModels**: 支持的阿里云模型枚举
-   **流式响应**: 支持 Server-Sent Events 流式输出
-   **错误处理**: 完善的错误处理和重试机制
-   **会话管理**: 百炼应用的会话 ID 自动管理

### Supported Models

-   通义千问系列: qwen-turbo, qwen-plus, qwen-max
-   Qwen 2.5 系列: 72B, 32B, 14B, 7B Instruct 模型
-   DeepSeek 系列: v3, v2.5
-   其他模型: Baichuan2, ChatGLM3, Yi-34B

### API

-   `createAliyunProvider(config)`: 创建阿里云供应商
-   `registerAliyunProvider(name, config)`: 创建并注册阿里云供应商
-   `aiHub.register(name, provider)`: 注册供应商
-   `aiHub.generate(providerName, options)`: 生成回复
-   `aiHub.generateStream(providerName, options)`: 流式生成回复

### Documentation

-   📚 完整的 README 文档
-   💡 详细的使用示例
-   🔧 API 参考文档
-   ⚙️ 配置选项说明

## 0.0.2-beta.1

### Patch Changes

-   Updated dependencies
    -   @quantum-design/utils@2.1.1-beta.1

## 0.0.2-beta.0

### Patch Changes

-   Updated dependencies
    -   @quantum-design/utils@2.1.1-beta.0
