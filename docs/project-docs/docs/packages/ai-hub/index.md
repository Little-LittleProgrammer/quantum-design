# AI Hub 统一AI服务集成

## 版本

- 本目录提供统一的AI服务集成库
- npm 包名称 `@quantum-design/ai-hub`
- 当前版本: **1.0.0** (v3.0.0新增包)

## 概述

AI Hub 是一个强大的AI服务统一接入库，为开发者提供简洁、高效的方式来集成多种主流AI供应商和模型。

### 🚀 核心特性

- **🎯 统一接口**: 为不同AI供应商提供统一的调用接口
- **🔄 多供应商支持**: 支持阿里云通义千问、百炼应用等主流AI服务
- **💧 流式响应**: 支持流式和非流式两种响应模式，实时获取AI回复
- **🔁 自动重试**: 内置指数退避重试机制，提高调用成功率
- **🎯 类型安全**: 完整的TypeScript类型定义，智能代码提示
- **📝 会话管理**: 支持多轮对话会话管理，维护对话上下文
- **⚡ 性能优化**: 智能缓存和连接池机制
- **🛡️ 错误处理**: 完善的错误处理和异常恢复机制

## 快速开始

### 安装

```bash
pnpm add @quantum-design/ai-hub
```

### 基础用法

```typescript
import { createAliyunProvider, aiHub, AliyunModels } from '@quantum-design/ai-hub';

// 创建阿里云供应商
const aliyunProvider = createAliyunProvider({
    apiKey: 'your-api-key',
    modelName: AliyunModels.QWenTurbo,
});

// 注册到AI Hub
aiHub.register('aliyun', aliyunProvider);

// 使用AI Hub生成回复
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
        { role: 'user', content: '帮我写一个Hello World程序' },
    ],
    temperature: 0.7,
    maxTokens: 1000,
});

console.log(response.content);
```

## 支持的AI模型

### 通义千问系列

| 模型名称             | 描述            | 适用场景             |
| -------------------- | --------------- | -------------------- |
| qwen-turbo           | 高速响应模型    | 实时对话、快速问答   |
| qwen-plus            | 平衡性能模型    | 通用对话、文本生成   |
| qwen-max             | 最高质量模型    | 复杂推理、长文本生成 |
| qwen2.5-72b-instruct | 72B指令微调模型 | 专业领域知识问答     |
| qwen2.5-32b-instruct | 32B指令微调模型 | 中等复杂度任务       |
| qwen2.5-14b-instruct | 14B指令微调模型 | 资源受限环境         |
| qwen2.5-7b-instruct  | 7B指令微调模型  | 轻量级应用           |

### 其他主流模型

| 模型名称              | 供应商   | 描述           |
| --------------------- | -------- | -------------- |
| deepseek-v3           | DeepSeek | 最新大语言模型 |
| deepseek-v2.5         | DeepSeek | 优化版本模型   |
| baichuan2-13b-chat-v1 | 百川智能 | 13B对话模型    |
| chatglm3-6b           | 智谱AI   | 6B清华对话模型 |
| yi-34b-chat           | 月之暗面 | 34B对话模型    |

## 高级用法

### 流式响应

流式响应允许你实时获取AI的回复内容，提供更好的用户体验：

```typescript
// 基础流式响应
for await (const chunk of aiHub.generateStream('aliyun', {
    messages: [{ role: 'user', content: '请详细介绍TypeScript的优势' }],
})) {
    console.log(chunk.content); // 实时输出AI回复
    if (chunk.done) {
        console.log('生成完成，用量信息:', chunk.usage);
        break;
    }
}

// 百炼应用流式响应（支持会话管理）
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
        console.log('会话ID:', bailianProvider.getSessionId());
        break;
    }
}
```

### 百炼应用集成

百炼应用提供更强的会话管理能力：

```typescript
import { AliyunProvider } from '@quantum-design/ai-hub';

// 创建百炼应用实例
const bailianProvider = new AliyunProvider({
    apiKey: 'your-api-key',
    bailianAppId: 'your-bailian-app-id',
});

// 首次对话
const response1 = await bailianProvider.generate({
    messages: [{ role: 'user', content: '我想学习Vue 3' }],
});

console.log('第一次回复:', response1.content);

// 获取会话ID
const sessionId = bailianProvider.getSessionId();
console.log('当前会话ID:', sessionId);

// 继续对话（自动包含上下文）
const response2 = await bailianProvider.generate({
    messages: [{ role: 'user', content: '它有什么新特性？' }],
});

console.log('第二次回复:', response2.content); // 自动关联上下文
```

### 会话管理

```typescript
// 创建多个会话
const session1 = new AliyunProvider({
    apiKey: 'your-api-key',
    modelName: 'qwen-turbo',
    sessionId: 'session-1',
});

const session2 = new AliyunProvider({
    apiKey: 'your-api-key',
    modelName: 'qwen-turbo',
    sessionId: 'session-2',
});

// 每个会话独立维护上下文
await session1.generate({
    messages: [{ role: 'user', content: '用户1：你好' }],
});

await session2.generate({
    messages: [{ role: 'user', content: '用户2：你好' }],
});

// 获取各自的会话ID
console.log('会话1 ID:', session1.getSessionId());
console.log('会话2 ID:', session2.getSessionId());
```

### 批量处理

```typescript
import { aiHub } from '@quantum-design/ai-hub';

// 批量生成处理
async function batchGenerate(prompts: string[], providerName: string = 'aliyun') {
    const promises = prompts.map((prompt) =>
        aiHub.generate(providerName, {
            messages: [{ role: 'user', content: prompt }],
        }),
    );

    return Promise.all(promises);
}

// 使用示例
const prompts = ['介绍一下TypeScript', '解释一下Vue 3的特性', '什么是响应式编程'];

const results = await batchGenerate(prompts);
results.forEach((result, index) => {
    console.log(`问题${index + 1}的答案:`, result.content);
});
```

### 自定义供应商

你可以扩展AI Hub来支持其他AI供应商：

```typescript
import { BaseAIProvider, type AIGenerateOptions, type AIResponse } from '@quantum-design/ai-hub';

class CustomProvider extends BaseAIProvider {
    async generate(options: AIGenerateOptions): Promise<AIResponse> {
        // 实现自定义逻辑
        return {
            content: '自定义回复',
            model: this.config.modelName,
            finishReason: 'stop',
            usage: {
                promptTokens: 10,
                completionTokens: 20,
                totalTokens: 30,
            },
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

## 配置选项

### AliyunConfig 接口

```typescript
interface AliyunConfig {
    apiKey: string; // 必需：API密钥
    modelName?: string; // 可选：模型名称，默认 qwen-turbo
    baseURL?: string; // 可选：自定义API地址
    timeout?: number; // 可选：请求超时时间，默认60000ms
    maxRetries?: number; // 可选：最大重试次数，默认3
    bailianAppId?: string; // 可选：百炼应用ID
    sessionId?: string; // 可选：会话ID（百炼应用）
}
```

### AIGenerateOptions 接口

```typescript
interface AIGenerateOptions {
    messages: AIMessage[]; // 消息列表
    temperature?: number; // 温度参数 (0-1)，控制创造性
    maxTokens?: number; // 最大生成token数
    stream?: boolean; // 是否流式响应
    stop?: string[]; // 停止词数组
    // v1.0.0 新增选项
    topP?: number; // 核采样参数
    frequencyPenalty?: number; // 频率惩罚
    presencePenalty?: number; // 存在惩罚
}
```

### AIMessage 接口

```typescript
interface AIMessage {
    role: 'system' | 'user' | 'assistant'; // 消息角色
    content: string; // 消息内容
    // v1.0.0 新增
    name?: string; // 可选的发言者名称
    timestamp?: number; // 消息时间戳
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
        console.error('API调用失败:', error.message);
    } else if (error.message.includes('Rate limit')) {
        console.error('请求频率超限，请稍后重试');
    } else if (error.message.includes('Authentication')) {
        console.error('身份验证失败，请检查API密钥');
    } else {
        console.error('未知错误:', error);
    }
}
```

### 错误类型

| 错误类型             | 说明           | 处理建议               |
| -------------------- | -------------- | ---------------------- |
| API_ERROR            | API调用失败    | 检查API密钥和网络连接  |
| RATE_LIMIT           | 请求频率超限   | 增加请求间隔或升级配额 |
| AUTHENTICATION_ERROR | 身份验证失败   | 验证API密钥正确性      |
| TIMEOUT_ERROR        | 请求超时       | 增加timeout配置        |
| INVALID_MODEL        | 无效的模型名称 | 检查modelName参数      |
| INVALID_MESSAGES     | 消息格式错误   | 检查messages格式       |

## 环境变量配置

通过环境变量来配置默认值：

```bash
# .env 文件
BAILIAN_API_KEY=your-api-key
ALIYUN_MODEL_NAME=qwen-turbo
BAILIAN_APP_ID=your-bailian-app-id
VITE_AI_TIMEOUT=60000
VITE_AI_MAX_RETRIES=3
```

```typescript
// 自动读取环境变量
const config = {
    apiKey: process.env.BAILIAN_API_KEY || 'default-key',
    modelName: process.env.ALIYUN_MODEL_NAME || 'qwen-turbo',
    bailianAppId: process.env.BAILIAN_APP_ID,
    timeout: parseInt(process.env.VITE_AI_TIMEOUT || '60000'),
    maxRetries: parseInt(process.env.VITE_AI_MAX_RETRIES || '3'),
};
```

## 性能优化

### 连接池配置

```typescript
const provider = new AliyunProvider({
    apiKey: 'your-api-key',
    modelName: 'qwen-turbo',
    // v1.0.0 新增性能配置
    poolConfig: {
        maxConnections: 10,
        keepAliveTime: 30000, // 30秒
        maxIdleTime: 60000, // 1分钟
    },
});
```

### 缓存配置

```typescript
const provider = new AliyunProvider({
    apiKey: 'your-api-key',
    modelName: 'qwen-turbo',
    // v1.0.0 新增缓存配置
    cacheConfig: {
        enabled: true,
        ttl: 300000, // 5分钟缓存
        maxSize: 100, // 最大缓存100条
        keyGenerator: (options) => {
            return JSON.stringify({
                messages: options.messages,
                temperature: options.temperature,
                modelName: 'qwen-turbo',
            });
        },
    },
});
```

## 最佳实践

### 1. API密钥安全

- 不要在代码中硬编码API密钥
- 使用环境变量存储敏感信息
- 定期轮换API密钥

### 2. 请求优化

- 合理设置temperature参数（0.7适合大多数场景）
- 控制maxTokens避免过长的回复
- 使用流式响应提升用户体验

### 3. 错误处理

- 实现指数退避重试策略
- 区分临时错误和永久错误
- 记录详细错误信息便于调试

### 4. 会话管理

- 为不同用户创建独立的会话
- 定期清理过期会话
- 合理控制上下文长度

### 5. 性能监控

```typescript
// v1.0.0 新增监控功能
aiHub.on('request', (data) => {
    console.log(`请求发送: ${data.provider}, ${data.modelName}`);
});

aiHub.on('response', (data) => {
    console.log(`响应接收: ${data.duration}ms, tokens: ${data.usage?.totalTokens}`);
});

aiHub.on('error', (data) => {
    console.error(`错误发生: ${data.errorType}, ${data.message}`);
});
```

## 集成示例

### Vue 3 组件集成

```vue
<template>
    <div class="ai-chat">
        <div class="messages">
            <div v-for="message in messages" :key="message.id" :class="['message', message.role]">
                <div class="content">{{ message.content }}</div>
                <div class="timestamp">{{ formatTime(message.timestamp) }}</div>
            </div>
        </div>
        <div class="input-area">
            <textarea v-model="inputText" @keydown.enter="handleSend" placeholder="输入你的问题..." />
            <button @click="handleSend" :disabled="loading">
                {{ loading ? '发送中...' : '发送' }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { registerAliyunProvider } from '@quantum-design/ai-hub';

const messages = ref<Array<{ id: string; role: string; content: string; timestamp: number }>>([]);
const inputText = ref('');
const loading = ref(false);

// 初始化AI提供商
const aiProvider = registerAliyunProvider('aliyun', {
    apiKey: import.meta.env.VITE_AI_API_KEY,
    modelName: 'qwen-turbo',
});

const handleSend = async () => {
    if (!inputText.value.trim() || loading.value) return;

    const userMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: inputText.value.trim(),
        timestamp: Date.now(),
    };

    messages.value.push(userMessage);
    inputText.value = '';
    loading.value = true;

    try {
        const response = await aiProvider.generate({
            messages: messages.value.map((m) => ({
                role: m.role,
                content: m.content,
            })),
        });

        const aiMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: response.content,
            timestamp: Date.now(),
        };

        messages.value.push(aiMessage);
    } catch (error) {
        console.error('AI回复失败:', error);
        messages.value.push({
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: '抱歉，我现在无法回复，请稍后再试。',
            timestamp: Date.now(),
        });
    } finally {
        loading.value = false;
    }
};

const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
};
</script>
```

### Nuxt 3 集成

```typescript
// plugins/ai-hub.client.ts
import { registerAliyunProvider } from '@quantum-design/ai-hub';

export default defineNuxtPlugin(() => {
    const aiProvider = registerAliyunProvider('aliyun', {
        apiKey: useRuntimeConfig().public.aiApiKey,
        modelName: 'qwen-turbo',
    });

    return {
        provide: {
            ai: aiProvider,
        },
    };
});

// composables/useAI.ts
export const useAI = () => {
    const { $ai } = useNuxtApp();

    const generate = async (messages: any[]) => {
        return await $ai.generate({ messages });
    };

    const generateStream = async (messages: any[]) => {
        return $ai.generateStream({ messages });
    };

    return {
        generate,
        generateStream,
    };
};
```

## 注意事项

1. **API密钥安全**: 请妥善保管你的API密钥，不要将其提交到代码仓库
2. **请求频率**: 注意API调用频率限制，避免触发限流
3. **错误重试**: 内置重试机制会自动处理临时错误，但请合理设置重试次数
4. **流式响应**: 使用流式响应时注意及时处理数据，避免内存占用过高
5. **成本控制**: 监控token使用量，合理设置maxTokens参数
6. **合规使用**: 遵守各AI服务提供商的使用条款和限制

## 路线图

### v1.1.0 计划功能

- [ ] OpenAI官方API支持
- [ ] Azure OpenAI集成
- [ ] Google Gemini支持
- [ ] Claude API集成
- [ ] 本地模型支持（Ollama）

### v1.2.0 计划功能

- [ ] 多模态支持（图片、语音）
- [ ] 向量数据库集成
- [ ] 知识库检索增强
- [ ] 更精细的权限控制
- [ ] 性能监控面板

### v2.0.0 计划功能

- [ ] 插件系统架构
- [ ] 自定义模型训练接口
- [ ] 企业级部署方案
- [ ] 分布式服务架构
- [ ] 高级分析和报告功能
