import { config } from 'dotenv';
import { Logger, type LogLevel } from './utils/logger.js';

export interface OssConfig {
    accessKeyId: string;
    accessKeySecret: string;
    bucket: string;
    region: string;
}

export interface ServerConfig {
    apiKey: string;
    model: string;
    endpoint: string;
    logLevel: LogLevel;
    oss?: OssConfig;
}

const DEFAULT_CONFIG: Partial<ServerConfig> = {
    model: 'qwen3-vl-plus-2025-12-19',
    endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
    logLevel: 'info',
};

export function loadConfig(): ServerConfig {
    // 优先从环境变量加载
    // eslint-disable-next-line n/prefer-global/process
    const apiKey = process.env.DASHSCOPE_API_KEY || '';

    // 如果环境变量没有，尝试从 .env 文件加载
    if (!apiKey) {
        const envResult = config();
        if (envResult.error) {
            Logger.warn('Failed to load .env file, using defaults');
        }
    }

    // eslint-disable-next-line n/prefer-global/process
    const finalApiKey = process.env.DASHSCOPE_API_KEY || '';

    // 验证 API Key
    if (!finalApiKey) {
        Logger.warn('DASHSCOPE_API_KEY not set. Tool calls will fail without a valid API key.');
    }

    // eslint-disable-next-line n/prefer-global/process
    const logLevel = (process.env.LOG_LEVEL as LogLevel) || DEFAULT_CONFIG.logLevel;

    // Load OSS configuration
    // eslint-disable-next-line n/prefer-global/process
    const ossAccessKeyId = process.env.OSS_ACCESS_KEY_ID || '';
    // eslint-disable-next-line n/prefer-global/process
    const ossAccessKeySecret = process.env.OSS_ACCESS_KEY_SECRET || '';
    // eslint-disable-next-line n/prefer-global/process
    const ossBucket = process.env.OSS_BUCKET || '';
    // eslint-disable-next-line n/prefer-global/process
    const ossRegion = process.env.OSS_REGION || 'oss-cn-hangzhou';

    const ossConfig: OssConfig | undefined =
        ossAccessKeyId && ossAccessKeySecret && ossBucket
            ? {
                  accessKeyId: ossAccessKeyId,
                  accessKeySecret: ossAccessKeySecret,
                  bucket: ossBucket,
                  region: ossRegion,
              }
            : undefined;

    const configValue: ServerConfig = {
        apiKey: finalApiKey,
        // eslint-disable-next-line n/prefer-global/process
        model: process.env.MODEL || DEFAULT_CONFIG.model || 'qwen3-vl-plus-2025-12-19',
        // eslint-disable-next-line n/prefer-global/process
        endpoint: process.env.ENDPOINT || DEFAULT_CONFIG.endpoint || 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
        logLevel,
        oss: ossConfig,
    };

    Logger.info('Server configuration loaded:', {
        model: configValue.model,
        endpoint: configValue.endpoint,
        logLevel: configValue.logLevel,
        hasApiKey: !!configValue.apiKey,
        hasOssConfig: !!configValue.oss,
    });

    return configValue;
}
