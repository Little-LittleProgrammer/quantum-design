# @quantum-design/ai-hub

整合主流 AI 供应商和模型的统一工具库。

## 特性

- 🚀 **统一接口**: 为不同 AI 供应商提供统一的调用接口
- 🔄 **多供应商支持**: 支持阿里云通义千问、百炼应用等
- 💧 **流式响应**: 支持流式和非流式两种响应模式
- 🔁 **自动重试**: 内置指数退避重试机制
- 🎯 **类型安全**: 完整的 TypeScript 类型定义
- 📝 **会话管理**: 支持多轮对话会话管理

## 安装

```bash
npm install @quantum-design/ai-hub
# 或
yarn add @quantum-design/ai-hub
# 或
pnpm add @quantum-design/ai-hub
```

## 快速开始

### 基础用法

```typescript
import { createAliyunProvider, aiHub, AliyunModels } from '@quantum-design/ai-hub';

// 创建阿里云供应商
const aliyunProvider = createAliyunProvider({
    apiKey: 'your-api-key',
    modelName: AliyunModels.QWenTurbo,
});

// 注册到 AI Hub
aiHub.register('aliyun', aliyunProvider);

// 使用 AI Hub 生成回复
const response = await aiHub.generate('aliyun', {
    messages: [{ role: 'user', content: '你好，请介绍一下你自己' }],
});

console.log(response.content);
```

### 便捷方式

```typescript
import { registerAliyunProvider } from '@quantum-design/ai-hub';

// 直接创建并注册阿里云供应商
const provider = registerAliyunProvider('aliyun', {
    apiKey: 'your-api-key',
    modelName: 'qwen-turbo',
});

// 直接使用供应商
const response = await provider.generate({
    messages: [
        { role: 'system', content: '你是一个有用的助手' },
        { role: 'user', content: '帮我写一个 Hello World 程序' },
    ],
    temperature: 0.7,
    maxTokens: 1000,
});
```

### 流式响应

```typescript
// 流式生成回复（支持通义千问和百炼应用）
for await (const chunk of aiHub.generateStream('aliyun', {
    messages: [{ role: 'user', content: '请详细介绍 TypeScript 的优势' }],
})) {
    console.log(chunk.content);
    if (chunk.done) {
        console.log('生成完成，用量信息:', chunk.usage);
        break;
    }
}

// 使用百炼应用的流式响应
const bailianProvider = new AliyunProvider({
    apiKey: 'your-api-key',
    bailianAppId: 'your-bailian-app-id',
});

for await (const chunk of bailianProvider.generateStream({
    messages: [{ role: 'user', content: '你好，请介绍一下你自己' }],
})) {
    process.stdout.write(chunk.content);
    if (chunk.done) {
        console.log('\n流式响应完成');
        break;
    }
}
```

### 百炼应用

```typescript
import { AliyunProvider } from '@quantum-design/ai-hub';

// 使用百炼应用
const bailianProvider = new AliyunProvider({
    apiKey: 'your-api-key',
    bailianAppId: 'your-bailian-app-id',
});

const response = await bailianProvider.generate({
    messages: [{ role: 'user', content: '你好' }],
});

// 获取会话 ID 用于多轮对话
const sessionId = bailianProvider.getSessionId();
console.log('当前会话 ID:', sessionId);

// 百炼应用流式响应
for await (const chunk of bailianProvider.generateStream({
    messages: [{ role: 'user', content: '请详细介绍一下人工智能' }],
})) {
    console.log(chunk.content);
    if (chunk.done) {
        console.log('生成完成，会话 ID:', bailianProvider.getSessionId());
        break;
    }
}
```

## API 文档

### AIHub

#### 方法

- `register(name: string, provider: BaseAIProvider)`: 注册 AI 供应商
- `getProvider(name: string)`: 获取指定供应商
- `getProviderNames()`: 获取所有供应商名称
- `generate(providerName: string, options: AIGenerateOptions)`: 生成回复
- `generateStream(providerName: string, options: AIGenerateOptions)`: 流式生成回复

### AliyunProvider

#### 配置选项

```typescript
interface AliyunConfig {
    apiKey: string; // 必需：API 密钥
    modelName?: string; // 可选：模型名称，默认 qwen-turbo
    baseURL?: string; // 可选：自定义 API 地址
    timeout?: number; // 可选：请求超时时间，默认 60000ms
    maxRetries?: number; // 可选：最大重试次数，默认 3
    bailianAppId?: string; // 可选：百炼应用 ID
    sessionId?: string; // 可选：会话 ID（百炼应用）
}
```

#### 支持的模型

```typescript
enum AliyunModels {
    // 通义千问系列
    QWenTurbo = 'qwen-turbo',
    QWenPlus = 'qwen-plus',
    QWenMax = 'qwen-max',
    QWen2_5_72B_Instruct = 'qwen2.5-72b-instruct',
    QWen2_5_32B_Instruct = 'qwen2.5-32b-instruct',
    QWen2_5_14B_Instruct = 'qwen2.5-14b-instruct',
    QWen2_5_7B_Instruct = 'qwen2.5-7b-instruct',

    // DeepSeek 系列
    DeepSeekV3 = 'deepseek-v3',
    DeepSeekV2_5 = 'deepseek-v2.5',

    // 其他模型
    Baichuan2_13B = 'baichuan2-13b-chat-v1',
    ChatGLM3_6B = 'chatglm3-6b',
    Yi_34B_Chat = 'yi-34b-chat',
}
```

#### 生成选项

```typescript
interface AIGenerateOptions {
    messages: AIMessage[]; // 消息列表
    temperature?: number; // 温度参数 (0-1)
    maxTokens?: number; // 最大生成 token 数
    stream?: boolean; // 是否流式响应
    stop?: string[]; // 停止词
}
```

## 错误处理

```typescript
try {
    const response = await aiHub.generate('aliyun', {
        messages: [{ role: 'user', content: '你好' }],
    });
    console.log(response.content);
} catch (error) {
    if (error.message.includes('API error')) {
        console.error('API 调用失败:', error.message);
    } else {
        console.error('未知错误:', error);
    }
}
```

## 高级用法

### 自定义供应商

```typescript
import { BaseAIProvider, type AIGenerateOptions, type AIResponse } from '@quantum-design/ai-hub';

class CustomProvider extends BaseAIProvider {
    async generate(options: AIGenerateOptions): Promise<AIResponse> {
        // 实现自定义逻辑
        return {
            content: '自定义回复',
            model: this.config.modelName,
            finishReason: 'stop',
        };
    }

    async *generateStream(options: AIGenerateOptions): AsyncGenerator<AIStreamResponse> {
        // 实现流式响应
        yield { content: '流式', done: false };
        yield { content: '回复', done: true };
    }

    async getModels(): Promise<string[]> {
        return ['custom-model-1', 'custom-model-2'];
    }
}

// 注册自定义供应商
const customProvider = new CustomProvider({
    apiKey: 'custom-key',
    modelName: 'custom-model',
});
aiHub.register('custom', customProvider);
```

### 批量处理

```typescript
import { aiHub } from '@quantum-design/ai-hub';

async function batchGenerate(prompts: string[], providerName: string = 'aliyun') {
    const promises = prompts.map((prompt) =>
        aiHub.generate(providerName, {
            messages: [{ role: 'user', content: prompt }],
        }),
    );

    return Promise.all(promises);
}

const results = await batchGenerate(['介绍一下 TypeScript', '解释一下 Vue 3 的特性', '什么是响应式编程']);
```

## 环境变量配置

你可以通过环境变量来配置默认值：

```bash
# .env 文件
BAILIAN_API_KEY=your-api-key
ALIYUN_MODEL_NAME=qwen-turbo
BAILIAN_APP_ID=your-bailian-app-id
```

## 注意事项

1. **API 密钥安全**: 请妥善保管你的 API 密钥，不要将其提交到代码仓库
2. **请求频率**: 注意 API 调用频率限制，避免触发限流
3. **错误重试**: 内置重试机制会自动处理临时错误，但请合理设置重试次数
4. **流式响应**: 使用流式响应时注意及时处理数据，避免内存占用过高

## 贡献指南

欢迎提交 Issue 和 Pull Request！

## 许可证

ISC
