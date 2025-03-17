// 各大AI服务商的基础URL配置
export const STABILITY_BASE_URL = 'https://api.stability.ai';
export const OPENAI_BASE_URL = 'https://api.openai.com';
export const ANTHROPIC_BASE_URL = 'https://api.anthropic.com';
export const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/';

// 国内AI服务商的基础URL配置
export const BAIDU_BASE_URL = 'https://aip.baidubce.com';
export const BAIDU_OATUH_URL = `${BAIDU_BASE_URL}/oauth/2.0/token`;

export const BYTEDANCE_BASE_URL = 'https://ark.cn-beijing.volces.com';

export const ALIBABA_BASE_URL = 'https://dashscope.aliyuncs.com/api/';

export const TENCENT_BASE_URL = 'https://hunyuan.tencentcloudapi.com';

export const MOONSHOT_BASE_URL = 'https://api.moonshot.cn';
export const IFLYTEK_BASE_URL = 'https://spark-api-open.xf-yun.com';

export const DEEPSEEK_BASE_URL = 'https://api.deepseek.com';

export const XAI_BASE_URL = 'https://api.x.ai';

export const CHATGLM_BASE_URL = 'https://open.bigmodel.cn';

export const SILICONFLOW_BASE_URL = 'https://api.siliconflow.cn';

// 缓存和上传相关的URL配置
export const CACHE_URL_PREFIX = '/api/cache';
export const UPLOAD_URL = `${CACHE_URL_PREFIX}/upload`;

// API路径枚举，定义了各服务商的API路由
export enum ApiPath {
    Cors = '',
    Azure = '/ai-hub/azure',
    OpenAI = '/ai-hub/openai',
    Anthropic = '/ai-hub/anthropic',
    Google = '/ai-hub/google',
    Baidu = '/ai-hub/baidu',
    ByteDance = '/ai-hub/bytedance',
    Alibaba = '/ai-hub/alibaba',
    Tencent = '/ai-hub/tencent',
    Moonshot = '/ai-hub/moonshot',
    Iflytek = '/ai-hub/iflytek',
    Stability = '/ai-hub/stability',
    Artifacts = '/ai-hub/artifacts',
    XAI = '/ai-hub/xai',
    ChatGLM = '/ai-hub/chatglm',
    DeepSeek = '/ai-hub/deepseek',
    SiliconFlow = '/ai-hub/siliconflow',
}

// 服务提供商枚举，列出所有支持的AI服务提供商
export enum ServiceProvider {
    OpenAI = 'OpenAI',
    Azure = 'Azure',
    Google = 'Google',
    Anthropic = 'Anthropic',
    Baidu = 'Baidu',
    ByteDance = 'ByteDance',
    Alibaba = 'Alibaba',
    Tencent = 'Tencent',
    Moonshot = 'Moonshot',
    Stability = 'Stability',
    Iflytek = 'Iflytek',
    XAI = 'XAI',
    ChatGLM = 'ChatGLM',
    DeepSeek = 'DeepSeek',
    SiliconFlow = 'SiliconFlow',
}

// 模型提供商枚举，列出所有支持的模型提供商
export enum ModelProvider {
    Stability = 'Stability',
    GPT = 'GPT',
    GeminiPro = 'GeminiPro',
    Claude = 'Claude',
    Ernie = 'Ernie',
    Doubao = 'Doubao',
    Qwen = 'Qwen',
    Hunyuan = 'Hunyuan',
    Moonshot = 'Moonshot',
    Iflytek = 'Iflytek',
    XAI = 'XAI',
    ChatGLM = 'ChatGLM',
    DeepSeek = 'DeepSeek',
    SiliconFlow = 'SiliconFlow',
}

export const Stability = {
    GeneratePath: 'v2beta/stable-image/generate',
    ExampleEndpoint: 'https://api.stability.ai',
};

// Anthropic AI服务配置
export const Anthropic = {
    ChatPath: 'v1/messages',
    ChatPath1: 'v1/complete',
    ExampleEndpoint: 'https://api.anthropic.com',
    Vision: '2023-06-01',
};

// OpenAI AI服务配置
export const OpenaiPath = {
    ChatPath: 'v1/chat/completions',
    SpeechPath: 'v1/audio/speech',
    ImagePath: 'v1/images/generations',
    UsagePath: 'dashboard/billing/usage',
    SubsPath: 'dashboard/billing/subscription',
    ListModelPath: 'v1/models',
};

// Azure AI服务配置
export const Azure = {
    ChatPath: (deployName: string, apiVersion: string) => `deployments/${deployName}/chat/completions?api-version=${apiVersion}`,
    // https://<your_resource_name>.openai.azure.com/openai/deployments/<your_deployment_name>/images/generations?api-version=<api_version>
    ImagePath: (deployName: string, apiVersion: string) => `deployments/${deployName}/images/generations?api-version=${apiVersion}`,
    ExampleEndpoint: 'https://{resource-url}/openai',
};

// Google AI服务配置
export const Google = {
    ExampleEndpoint: 'https://generativelanguage.googleapis.com/',
    ChatPath: (modelName: string) => `v1beta/models/${modelName}:streamGenerateContent`,
};

// 百度AI服务配置
export const Baidu = {
    ExampleEndpoint: BAIDU_BASE_URL,
    ChatPath: (modelName: string) => {
        let endpoint = modelName;
        if (modelName === 'ernie-4.0-8k') {
            endpoint = 'completions_pro';
        }
        if (modelName === 'ernie-4.0-8k-preview-0518') {
            endpoint = 'completions_adv_pro';
        }
        if (modelName === 'ernie-3.5-8k') {
            endpoint = 'completions';
        }
        if (modelName === 'ernie-speed-8k') {
            endpoint = 'ernie_speed';
        }
        return `rpc/2.0/ai_custom/v1/wenxinworkshop/chat/${endpoint}`;
    },
};

// 字节跳动AI服务配置
export const ByteDance = {
    ExampleEndpoint: 'https://ark.cn-beijing.volces.com/api/',
    ChatPath: 'api/v3/chat/completions',
};

// 阿里巴巴AI服务配置
export const Alibaba = {
    ExampleEndpoint: ALIBABA_BASE_URL,
    ChatPath: (modelName: string) => {
        if (modelName.includes('vl') || modelName.includes('omni')) {
            return 'v1/services/aigc/multimodal-generation/generation';
        }
        return `v1/services/aigc/text-generation/generation`;
    },
};

// 腾讯AI服务配置
export const Tencent = {
    ExampleEndpoint: TENCENT_BASE_URL,
};

// 月神AI服务配置
export const Moonshot = {
    ExampleEndpoint: MOONSHOT_BASE_URL,
    ChatPath: 'v1/chat/completions',
};

// 讯飞AI服务配置
export const Iflytek = {
    ExampleEndpoint: IFLYTEK_BASE_URL,
    ChatPath: 'v1/chat/completions',
};

// 深度求索AI服务配置
export const DeepSeek = {
    ExampleEndpoint: DEEPSEEK_BASE_URL,
    ChatPath: 'chat/completions',
};

// XAI AI服务配置
export const XAI = {
    ExampleEndpoint: XAI_BASE_URL,
    ChatPath: 'v1/chat/completions',
};

// ChatGLM AI服务配置
export const ChatGLM = {
    ExampleEndpoint: CHATGLM_BASE_URL,
    ChatPath: 'api/paas/v4/chat/completions',
    ImagePath: 'api/paas/v4/images/generations',
    VideoPath: 'api/paas/v4/videos/generations',
};

// 硅流AI服务配置
export const SiliconFlow = {
    ExampleEndpoint: SILICONFLOW_BASE_URL,
    ChatPath: 'v1/chat/completions',
    ListModelPath: 'v1/models?&sub_type=chat',
};

export const VISION_MODEL_REGEXES = [/vision/, /gpt-4o/, /claude-3/, /gemini-1\.5/, /gemini-exp/, /gemini-2\.0/, /learnlm/, /qwen-vl/, /qwen2-vl/, /qwen-moni/, /gpt-4-turbo(?!.*preview)/, /^dall-e-3$/, /glm-4v/, /vl/i];

const openaiModels = [
    // As of July 2024, gpt-4o-mini should be used in place of gpt-3.5-turbo,
    // as it is cheaper, more capable, multimodal, and just as fast. gpt-3.5-turbo is still available for use in the API.
    'gpt-3.5-turbo',
    'gpt-3.5-turbo-1106',
    'gpt-3.5-turbo-0125',
    'gpt-4',
    'gpt-4-0613',
    'gpt-4-32k',
    'gpt-4-32k-0613',
    'gpt-4-turbo',
    'gpt-4-turbo-preview',
    'gpt-4o',
    'gpt-4o-2024-05-13',
    'gpt-4o-2024-08-06',
    'gpt-4o-2024-11-20',
    'chatgpt-4o-latest',
    'gpt-4o-mini',
    'gpt-4o-mini-2024-07-18',
    'gpt-4-vision-preview',
    'gpt-4-turbo-2024-04-09',
    'gpt-4-1106-preview',
    'dall-e-3',
    'o1-mini',
    'o1-preview',
    'o3-mini',
];

const googleModels = [
    'gemini-1.0-pro', // Deprecated on 2/15/2025
    'gemini-1.5-pro-latest',
    'gemini-1.5-pro',
    'gemini-1.5-pro-002',
    'gemini-1.5-pro-exp-0827',
    'gemini-1.5-flash-latest',
    'gemini-1.5-flash-8b-latest',
    'gemini-1.5-flash',
    'gemini-1.5-flash-8b',
    'gemini-1.5-flash-002',
    'gemini-1.5-flash-exp-0827',
    'learnlm-1.5-pro-experimental',
    'gemini-exp-1114',
    'gemini-exp-1121',
    'gemini-exp-1206',
    'gemini-2.0-flash',
    'gemini-2.0-flash-exp',
    'gemini-2.0-flash-lite-preview-02-05',
    'gemini-2.0-flash-thinking-exp',
    'gemini-2.0-flash-thinking-exp-1219',
    'gemini-2.0-flash-thinking-exp-01-21',
    'gemini-2.0-pro-exp',
    'gemini-2.0-pro-exp-02-05',
];

const anthropicModels = ['claude-instant-1.2', 'claude-2.0', 'claude-2.1', 'claude-3-sonnet-20240229', 'claude-3-opus-20240229', 'claude-3-opus-latest', 'claude-3-haiku-20240307', 'claude-3-5-haiku-20241022', 'claude-3-5-haiku-latest', 'claude-3-5-sonnet-20240620', 'claude-3-5-sonnet-20241022', 'claude-3-5-sonnet-latest', 'claude-3-7-sonnet-20250219', 'claude-3-7-sonnet-latest'];

const baiduModels = ['ernie-4.0-turbo-8k', 'ernie-4.0-8k', 'ernie-4.0-8k-preview', 'ernie-4.0-8k-preview-0518', 'ernie-4.0-8k-latest', 'ernie-3.5-8k', 'ernie-3.5-8k-0205', 'ernie-speed-128k', 'ernie-speed-8k', 'ernie-lite-8k', 'ernie-tiny-8k'];

const bytedanceModels = ['Doubao-lite-4k', 'Doubao-lite-32k', 'Doubao-lite-128k', 'Doubao-pro-4k', 'Doubao-pro-32k', 'Doubao-pro-128k'];

const alibabaModels = ['qwen-turbo', 'qwen-turbo-latest', 'qwen-plus', 'qwen-plus-latest', 'qwen-max', 'qwen-max-latest', 'qwen-long', 'deepseek-v3', 'deepseek-r1-distill-qwen-32b', 'deepseek-r1', 'qwq-plus', 'qwq-plus-latest', 'qwen-omni-turbo', 'qwen-omni-turbo-latest', 'qwen-vl-plus', 'qwen-vl-max', 'qwen2.5-vl-72b-instruct'];

const tencentModels = ['hunyuan-pro', 'hunyuan-standard', 'hunyuan-lite', 'hunyuan-role', 'hunyuan-functioncall', 'hunyuan-code', 'hunyuan-vision'];

const moonshotModels = ['moonshot-v1-8k', 'moonshot-v1-32k', 'moonshot-v1-128k'];

const iflytekModels = ['general', 'generalv3', 'pro-128k', 'generalv3.5', '4.0Ultra'];

const deepseekModels = ['deepseek-chat', 'deepseek-coder', 'deepseek-reasoner'];

const xAIModels = ['grok-beta', 'grok-2', 'grok-2-1212', 'grok-2-latest', 'grok-vision-beta', 'grok-2-vision-1212', 'grok-2-vision', 'grok-2-vision-latest'];

const chatglmModels = [
    'glm-4-plus',
    'glm-4-0520',
    'glm-4',
    'glm-4-air',
    'glm-4-airx',
    'glm-4-long',
    'glm-4-flashx',
    'glm-4-flash',
    'glm-4v-plus',
    'glm-4v',
    'glm-4v-flash', // free
    'cogview-3-plus',
    'cogview-3',
    'cogview-3-flash', // free
    // 目前无法适配轮询任务
    //   "cogvideox",
    //   "cogvideox-flash", // free
];

const siliconflowModels = [
    'Qwen/Qwen2.5-7B-Instruct',
    'Qwen/Qwen2.5-72B-Instruct',
    'deepseek-ai/DeepSeek-R1',
    'deepseek-ai/DeepSeek-R1-Distill-Llama-70B',
    'deepseek-ai/DeepSeek-R1-Distill-Llama-8B',
    'deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B',
    'deepseek-ai/DeepSeek-R1-Distill-Qwen-14B',
    'deepseek-ai/DeepSeek-R1-Distill-Qwen-32B',
    'deepseek-ai/DeepSeek-R1-Distill-Qwen-7B',
    'deepseek-ai/DeepSeek-V3',
    'meta-llama/Llama-3.3-70B-Instruct',
    'THUDM/glm-4-9b-chat',
    'Pro/deepseek-ai/DeepSeek-R1',
    'Pro/deepseek-ai/DeepSeek-V3',
];

export const ALL_MODELS: Record<ServiceProvider, any> = {
    [ServiceProvider.OpenAI]: openaiModels,
    [ServiceProvider.Azure]: openaiModels,
    [ServiceProvider.Google]: googleModels,
    [ServiceProvider.Anthropic]: anthropicModels,
    [ServiceProvider.Baidu]: baiduModels,
    [ServiceProvider.ByteDance]: bytedanceModels,
    [ServiceProvider.Alibaba]: alibabaModels,
    [ServiceProvider.Tencent]: tencentModels,
    [ServiceProvider.Moonshot]: moonshotModels,
    [ServiceProvider.Iflytek]: iflytekModels,
    [ServiceProvider.DeepSeek]: deepseekModels,
    [ServiceProvider.XAI]: xAIModels,
    [ServiceProvider.ChatGLM]: chatglmModels,
    [ServiceProvider.SiliconFlow]: siliconflowModels,
    [ServiceProvider.Stability]: [],
};
