<template>
    <div class="ai-demo">
        <a-card title="@quantum-design/ai-hub Demo" class="demo-card">
            <!-- 配置区域 -->
            <div class="config-section">
                <q-antd-form @register="registerForm">
                    <template #resetBefore>
                        <a-button @click="clearChat" :disabled="loading" type="default"> 清空对话 </a-button>

                        <a-button @click="clearSession" :disabled="loading" type="default"> 重置会话 </a-button>
                    </template>
                </q-antd-form>
            </div>

            <!-- 对话区域 -->
            <div class="chat-section">
                <div class="chat-messages" ref="messagesContainer">
                    <div v-for="(message, index) in messages" :key="index" :class="['message', message.role]">
                        <div class="message-role">
                            <a-tag :color="getRoleColor(message.role)">
                                {{ getRoleLabel(message.role) }}
                            </a-tag>
                        </div>
                        <div class="message-content">
                            <!-- 推理内容 -->
                            <div v-if="message.reasoning_content" class="reasoning-content">
                                <a-collapse v-model:activeKey="activeReasoningKeys" ghost>
                                    <a-collapse-panel key="reasoning" header="🧠 推理过程">
                                        <div class="reasoning-text">{{ message.reasoning_content }}</div>
                                    </a-collapse-panel>
                                </a-collapse>
                            </div>
                            <!-- 主要内容 -->
                            <div class="content-text">{{ message.content }}</div>
                            <div v-if="message.usage" class="usage-info">
                                <a-tag color="blue"> Token: {{ message.usage.totalTokens }} (输入: {{ message.usage.promptTokens }}, 输出: {{ message.usage.completionTokens }}) </a-tag>
                            </div>
                        </div>
                    </div>

                    <!-- 正在生成指示器 -->
                    <div v-if="loading && (streamContent || streamReasoningContent)" class="message assistant generating">
                        <div class="message-role">
                            <a-tag color="green">AI 助手</a-tag>
                        </div>
                        <div class="message-content">
                            <!-- 流式推理内容 -->
                            <div v-if="streamReasoningContent" class="reasoning-content">
                                <a-collapse v-model:activeKey="activeReasoningKeys" ghost>
                                    <a-collapse-panel key="reasoning" header="🧠 推理过程">
                                        <div class="reasoning-text">{{ streamReasoningContent }}</div>
                                    </a-collapse-panel>
                                </a-collapse>
                            </div>
                            <!-- 流式主要内容 -->
                            <div class="content-text">{{ streamContent }}</div>
                            <a-spin class="loading-indicator" />
                        </div>
                    </div>
                </div>

                <!-- 输入区域 -->
                <div class="input-section">
                    <a-input-group compact>
                        <a-textarea v-model:value="inputMessage" placeholder="请输入你的消息..." :auto-size="{ minRows: 1, maxRows: 4 }" :disabled="loading" />
                        <a-button type="primary" @click="sendMessage" :loading="loading" :disabled="!canSend"> 发送 </a-button>
                    </a-input-group>
                </div>
            </div>

            <!-- 状态信息 -->
            <div v-if="statusInfo" class="status-section">
                <a-alert :type="statusInfo.type" :message="statusInfo.message" :description="statusInfo.description" show-icon closable @close="statusInfo = null" />
            </div>
        </a-card>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue';
import { message, Alert as AAlert, Spin as ASpin, Collapse as ACollapse, CollapsePanel as ACollapsePanel } from 'ant-design-vue';
import { createAliyunProvider, AliyunModels, type AIMessage, type AliyunProvider } from '@quantum-design/ai-hub';
import { useForm, QAntdForm, type FormSchema } from '@quantum-design/vue3-antd-pc-ui';

defineOptions({
    name: 'AiDemo'
});

// 消息数据
const messages = ref<(AIMessage & { usage?: any })[]>([]);
const inputMessage = ref('');
const loading = ref(false);
const streamContent = ref('');
const streamReasoningContent = ref('');
const messagesContainer = ref<HTMLElement>();
const activeReasoningKeys = ref<string[]>(['reasoning']);

// 状态信息
const statusInfo = ref<{
    type: 'success' | 'info' | 'warning' | 'error';
    message: string;
    description?: string;
} | null>(null);

// AI 提供商实例
let provider: AliyunProvider | null = null;

// 模型选项
const modelOptions = [
    { label: '通义千问 3 32B (推荐)', value: AliyunModels.QWen3_32B_Instruct },
    { label: '通义千问 Turbo (最新)', value: AliyunModels.QWenTurbo },
    { label: '通义千问 Plus (最新)', value: AliyunModels.QWenPlus },
    { label: '通义千问 Max (最新)', value: AliyunModels.QWenMax },
    { label: '通义千问 3 235B', value: AliyunModels.QWen3_235B_Instruct },
    { label: 'DeepSeek V3', value: AliyunModels.DeepSeekV3 },
    { label: 'DeepSeek R1', value: AliyunModels.DeepSeekR1 },
    { label: 'QVQ Max (图片理解)', value: AliyunModels.QvqMax }
];

// 表单配置 schemas
const schemas = computed<FormSchema[]>(() => [
    {
        field: 'apiKey',
        label: 'API Key',
        component: 'InputPassword',
        colProps: { span: 12 },
        componentProps: {
            placeholder: '请输入阿里云 DashScope API Key',
            disabled: loading.value
        },
        required: true
    },
    {
        field: 'modelName',
        label: '模型选择',
        component: 'Select',
        colProps: { span: 12 },
        componentProps: {
            placeholder: '选择模型',
            disabled: loading.value,
            options: modelOptions
        },
        required: true
    },
    {
        field: 'bailianAppId',
        label: '百炼应用 ID (可选)',
        component: 'Input',
        colProps: { span: 8 },
        componentProps: {
            placeholder: '百炼应用 ID',
            disabled: loading.value
        }
    },
    {
        field: 'temperature',
        label: '温度参数',
        component: 'Slider',
        colProps: { span: 8 },
        componentProps: {
            min: 0,
            max: 1,
            step: 0.1,
            disabled: loading.value
        }
    },
    {
        field: 'maxTokens',
        label: '最大 Token',
        component: 'InputNumber',
        colProps: { span: 8 },
        componentProps: {
            min: 1,
            max: 4000,
            disabled: loading.value,
            style: { width: '100%' }
        }
    },
    {
        field: 'streamMode',
        label: '流式响应',
        component: 'Switch',
        colProps: { span: 8 },
        componentProps: {
            disabled: loading.value
        }
    }
]);

// 表单注册
const [registerForm, { getFieldsValue, setFieldsValue }] = useForm({
    schemas,
    labelWidth: 120,
    baseColProps: { span: 24 },
    showSubmitButton: false,
    submitOnReset: false,
    autoSubmitOnEnter: false
});

// 计算属性
const canSend = computed(() => {
    return !loading.value;
});

// 方法
const getRoleColor = (role: string) => {
    switch (role) {
        case 'user':
            return 'blue';
        case 'assistant':
            return 'green';
        case 'system':
            return 'orange';
        default:
            return 'default';
    }
};

const getRoleLabel = (role: string) => {
    switch (role) {
        case 'user':
            return '用户';
        case 'assistant':
            return 'AI 助手';
        case 'system':
            return '系统';
        default:
            return role;
    }
};

const initProvider = (values: any) => {
    try {
        provider = createAliyunProvider({
            apiKey: values.apiKey,
            modelName: values.modelName,
            bailianAppId: values.bailianAppId || undefined,
            timeout: 60000,
            maxRetries: 3,
            baseURL: '/ai'
        });

        statusInfo.value = {
            type: 'success',
            message: '提供商初始化成功',
            description: `模型: ${values.modelName}${values.bailianAppId ? ', 百炼应用: ' + values.bailianAppId : ''}`
        };
    } catch (error) {
        statusInfo.value = {
            type: 'error',
            message: '提供商初始化失败',
            description: error instanceof Error ? error.message : '未知错误'
        };
        throw error;
    }
};

const scrollToBottom = async() => {
    await nextTick();
    if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
};

const sendMessage = async() => {
    if (!canSend.value) return;

    try {
        loading.value = true;
        streamContent.value = '';
        streamReasoningContent.value = '';
        statusInfo.value = null;
        const values = getFieldsValue();

        // 初始化提供商
        initProvider(values);

        const userMessage: AIMessage = {
            role: 'user',
            content: inputMessage.value.trim()
        };

        // 添加用户消息
        messages.value.push(userMessage);
        inputMessage.value = '';
        await scrollToBottom();

        const allMessages = messages.value.map(({ usage: _usage, ...msg }) => msg);

        if (values.streamMode) {
            // 流式响应
            let assistantContent = '';
            let assistantReasoningContent = '';
            let usage: any;

            for await (const chunk of provider!.generateStream({
                messages: allMessages,
                temperature: values.temperature,
                maxTokens: values.maxTokens
            })) {
                assistantContent += chunk.content;
                streamContent.value = assistantContent;

                if (chunk.reasoning_content) {
                    assistantReasoningContent += chunk.reasoning_content;
                    streamReasoningContent.value = assistantReasoningContent;
                }

                await scrollToBottom();

                if (chunk.done) {
                    usage = chunk.usage;
                    break;
                }
            }

            // 添加完整的助手回复
            const assistantMessage: AIMessage & { usage?: any } = {
                role: 'assistant',
                content: assistantContent,
                usage
            };

            if (assistantReasoningContent) {
                assistantMessage.reasoning_content = assistantReasoningContent;
            }

            messages.value.push(assistantMessage);
            streamContent.value = '';
            streamReasoningContent.value = '';
        } else {
            // 非流式响应
            const response = await provider!.generate({
                messages: allMessages,
                temperature: values.temperature,
                maxTokens: values.maxTokens
            });

            const assistantMessage: AIMessage & { usage?: any } = {
                role: 'assistant',
                content: response.content,
                usage: response.usage
            };

            if (response.reasoning_content) {
                assistantMessage.reasoning_content = response.reasoning_content;
            }

            messages.value.push(assistantMessage);
        }

        await scrollToBottom();
        message.success('消息发送成功');
    } catch (error) {
        console.error('发送消息失败:', error);
        statusInfo.value = {
            type: 'error',
            message: '发送消息失败',
            description: error instanceof Error ? error.message : '未知错误'
        };
        message.error('发送消息失败');
    } finally {
        loading.value = false;
        streamContent.value = '';
        streamReasoningContent.value = '';
    }
};

const clearChat = () => {
    messages.value = [];
    statusInfo.value = null;
    message.success('对话已清空');
};

const clearSession = () => {
    if (provider) {
        provider.clear();
        message.success('会话已重置');
    }
};

// 组件挂载时的初始化
onMounted(() => {
    // 添加欢迎消息
    messages.value.push({
        role: 'system',
        content: '欢迎使用 AI Hub Demo！请先配置 API Key 和选择模型，然后开始对话。'
    });

    // 设置表单初始值
    setFieldsValue({
        apiKey: '',
        modelName: AliyunModels.QWen3_32B_Instruct,
        bailianAppId: '',
        temperature: 0.7,
        maxTokens: 1000,
        streamMode: true
    });
});
</script>

<style scoped lang="scss">
.ai-demo {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;

    .demo-card {
        .config-section {
            background: #fafafa;
            padding: 16px;
            border-radius: 6px;
            margin-bottom: 16px;

            .q-form {
                .ant-row {
                    margin-bottom: 8px;
                }
            }
        }

        .chat-section {
            .chat-messages {
                height: 500px;
                overflow-y: auto;
                border: 1px solid #d9d9d9;
                border-radius: 6px;
                padding: 16px;
                margin-bottom: 16px;
                background: #ffffff;

                .message {
                    display: flex;
                    margin-bottom: 16px;
                    animation: fadeIn 0.3s ease-in;

                    &.user {
                        justify-content: flex-end;

                        .message-role {
                            order: 2;
                            margin-left: 8px;
                        }

                        .message-content {
                            order: 1;
                            background: #1890ff;
                            color: white;
                            margin-right: 8px;
                        }
                    }

                    &.assistant {
                        justify-content: flex-start;

                        &.generating {
                            .message-content {
                                border: 2px dashed #52c41a;
                                position: relative;

                                .loading-indicator {
                                    position: absolute;
                                    top: 8px;
                                    right: 8px;
                                }
                            }
                        }

                        .message-content {
                            background: #f6f6f6;
                            color: #333;
                            margin-left: 8px;
                        }
                    }

                    &.system {
                        justify-content: center;

                        .message-content {
                            background: #fff7e6;
                            color: #d46b08;
                            border: 1px solid #ffd591;
                        }
                    }

                    .message-role {
                        flex-shrink: 0;
                        align-self: flex-start;
                    }

                    .message-content {
                        max-width: 70%;
                        padding: 12px 16px;
                        border-radius: 8px;
                        position: relative;

                        .content-text {
                            white-space: pre-wrap;
                            word-wrap: break-word;
                            line-height: 1.5;
                        }

                        .reasoning-content {
                            margin-bottom: 12px;
                            border: 1px solid #e8f4fd;
                            border-radius: 6px;
                            background: #f8fcff;

                            .reasoning-text {
                                white-space: pre-wrap;
                                word-wrap: break-word;
                                line-height: 1.4;
                                font-size: 13px;
                                color: #666;
                                max-height: 200px;
                                overflow-y: auto;
                                padding: 8px;
                            }

                            :deep(.ant-collapse-ghost > .ant-collapse-item > .ant-collapse-header) {
                                padding: 8px 12px;
                                font-size: 13px;
                                color: #1890ff;
                                font-weight: 500;
                            }

                            :deep(.ant-collapse-ghost > .ant-collapse-item > .ant-collapse-content > .ant-collapse-content-box) {
                                padding: 0;
                            }
                        }

                        .usage-info {
                            margin-top: 8px;
                            font-size: 12px;
                            opacity: 0.8;
                        }
                    }
                }
            }

            .input-section {
                .ant-input-group {
                    display: flex;

                    .ant-input {
                        flex: 1;
                    }

                    .ant-btn {
                        height: auto;
                        border-left: 0;
                    }
                }
            }
        }

        .status-section {
            margin-top: 16px;
        }
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 滚动条样式 */
.chat-messages::-webkit-scrollbar {
    width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}
</style>
