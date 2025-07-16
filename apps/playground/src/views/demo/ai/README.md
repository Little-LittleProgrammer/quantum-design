# AI Hub Demo 使用说明

这是一个基于 `@quantum-design/ai-hub` 包的完整 AI 对话演示应用。

## 功能特性

-   ✅ **多模型支持**: 支持阿里云通义千问系列、DeepSeek 等多种 AI 模型
-   ✅ **API Key 配置**: 支持手动输入阿里云 DashScope API Key
-   ✅ **流式响应**: 支持实时流式对话和普通对话模式
-   ✅ **百炼应用**: 支持阿里云百炼应用集成
-   ✅ **参数调节**: 支持温度参数、最大 Token 数等参数调节
-   ✅ **会话管理**: 支持多轮对话和会话重置
-   ✅ **美观界面**: 现代化的聊天界面，支持消息气泡、状态指示等
-   ✅ **用量统计**: 显示每次对话的 Token 使用情况

## 支持的模型

-   **通义千问 3 32B** (推荐)
-   **通义千问 Turbo/Plus/Max** (最新版本)
-   **通义千问 3 235B**
-   **DeepSeek V3**
-   **DeepSeek R1**
-   **QVQ Max** (图片理解)

## 快速开始

### 1. 安装依赖

在项目根目录运行：

```bash
pnpm install
```

### 2. 获取 API Key

1. 访问 [阿里云 DashScope 控制台](https://dashscope.console.aliyun.com/)
2. 创建应用并获取 API Key
3. 如果要使用百炼应用，还需要获取百炼应用 ID

### 3. 启动应用

```bash
# 在项目根目录启动 playground 应用
pnpm --filter playground dev
```

### 4. 访问 Demo

1. 打开浏览器访问：`http://localhost:5173`
2. 在左侧菜单中找到 `demo` -> `AI Hub Demo`
3. 输入你的 API Key
4. 选择想要使用的模型
5. 开始对话！

## 使用指南

### 基础配置

1. **API Key**: 必填，请输入有效的阿里云 DashScope API Key
2. **模型选择**: 从下拉列表中选择想要使用的模型
3. **百炼应用 ID**: 可选，如果要使用百炼应用功能则填写
4. **温度参数**: 控制回复的随机性，范围 0-1，默认 0.7
5. **最大 Token**: 限制单次回复的最大长度，默认 1000

### 对话功能

-   **发送消息**: 在输入框中输入消息，点击发送或使用 `Ctrl+Enter` 快捷键
-   **流式响应**: 开启后可以看到 AI 实时生成回复的过程
-   **清空对话**: 清除当前对话历史
-   **重置会话**: 重置百炼应用的会话状态

### 状态提示

-   **成功状态**: 绿色提示表示操作成功
-   **错误状态**: 红色提示表示操作失败，会显示具体错误信息
-   **加载状态**: 发送消息时会显示加载指示器

## 技术实现

### 核心依赖

```typescript
import { createAliyunProvider, AliyunModels, type AIMessage, type AliyunProvider } from '@quantum-design/ai-hub';
```

### 关键特性

-   **响应式配置**: 使用 Vue 3 的 `reactive` 管理配置状态
-   **流式处理**: 通过 `generateStream` 方法实现实时响应
-   **错误处理**: 完善的错误捕获和用户提示
-   **自动滚动**: 消息发送时自动滚动到底部
-   **美观样式**: 使用 SCSS 实现现代化界面

### 示例代码

```typescript
// 创建供应商
const provider = createAliyunProvider({
    apiKey: config.apiKey,
    modelName: config.modelName,
    bailianAppId: config.bailianAppId || undefined,
});

// 流式对话
for await (const chunk of provider.generateStream({
    messages: allMessages,
    temperature: config.temperature,
    maxTokens: config.maxTokens,
})) {
    console.log(chunk.content);
    if (chunk.done) break;
}
```

## 故障排除

### 常见问题

1. **API Key 无效**

    - 检查 API Key 是否正确
    - 确认 API Key 有足够的调用额度

2. **网络连接错误**

    - 检查网络连接
    - 确认防火墙设置

3. **模型不可用**

    - 某些模型可能需要特殊权限
    - 尝试使用其他模型

4. **百炼应用错误**
    - 检查百炼应用 ID 是否正确
    - 确认应用状态正常

### 调试信息

打开浏览器开发者工具，在 Console 中可以看到详细的错误信息和调试日志。

## 开发扩展

如果你想基于此 demo 进行二次开发，可以：

1. **添加新的 AI 供应商**: 继承 `BaseAIProvider` 类
2. **自定义界面**: 修改 Vue 组件和样式
3. **增强功能**: 添加文件上传、图片识别等功能
4. **集成到项目**: 将 AI 功能集成到你的实际项目中

## 相关链接

-   [AI Hub 包文档](../../packages/ai-hub/README.md)
-   [阿里云 DashScope 文档](https://help.aliyun.com/zh/dashscope/)
-   [百炼平台文档](https://help.aliyun.com/zh/model-studio/)

## 技术支持

如果遇到问题，请检查：

1. 依赖是否正确安装
2. API Key 是否有效
3. 网络连接是否正常
4. 浏览器控制台错误信息
