/**
 * @quantum-design/ai-hub - 整合主流 AI 供应商和模型
 *
 * 主要功能：
 * - 统一的 AI 接口封装
 * - 支持多个 AI 供应商（阿里云、OpenAI 等）
 * - 流式和非流式响应
 * - 自动重试和错误处理
 * - 会话管理
 */

// 基础类型和接口
import type { AIConfig, AIMessage, AIResponse, AIStreamResponse, AIGenerateOptions } from './base';

// 基础抽象类和管理器
import { BaseAIProvider, AIHub, aiHub } from './base';

// 阿里云供应商
import { AliyunProvider } from './aliyun/app';

// 阿里云模型和配置
import { AliyunModels, type AliyunConfig, type AliyunModelConfig, type AliyunRequest, type BailianRequest, type AliyunResponse, type BailianResponse, type AliyunStreamChunk, type BailianStreamChunk } from './aliyun/model';

export type { AIConfig, AIMessage, AIResponse, AIStreamResponse, AIGenerateOptions, AliyunConfig, AliyunModelConfig, AliyunRequest, BailianRequest, AliyunResponse, BailianResponse, AliyunStreamChunk, BailianStreamChunk };

export { BaseAIProvider, AIHub, aiHub, AliyunProvider, AliyunModels };

// 便捷函数：创建阿里云供应商
export function createAliyunProvider(config: AliyunConfig): AliyunProvider {
    return new AliyunProvider(config);
}

// 便捷函数：创建并注册阿里云供应商到默认 AI Hub
export function registerAliyunProvider(name: string = 'aliyun', config: AliyunConfig): AliyunProvider {
    const provider = new AliyunProvider(config);
    aiHub.register(name, provider);
    return provider;
}

// 版本信息
export const version = '0.0.2-beta.2';
