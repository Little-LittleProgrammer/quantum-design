/**
 * @quantum-design/ai-hub 基础使用示例
 */

import { createAliyunProvider, registerAliyunProvider, aiHub, AliyunModels, type AIMessage } from '../src';

// 示例 1: 基础用法
async function basicUsage() {
    console.log('=== 基础用法示例 ===');

    // 创建阿里云供应商
    const aliyunProvider = createAliyunProvider({
        apiKey: process.env.BAILIAN_API_KEY || 'your-api-key',
        modelName: AliyunModels.QWenTurbo,
    });

    // 注册到 AI Hub
    aiHub.register('aliyun', aliyunProvider);

    try {
        // 生成回复
        const response = await aiHub.generate('aliyun', {
            messages: [{ role: 'user', content: '你好，请介绍一下你自己', }],
            resultFormat: 'message',
        });

        console.log('回复:', response.content);
        console.log('模型:', response.model);
        console.log('用量:', response.usage);
    } catch (error) {
        console.error('错误:', error.message);
    }
}

// 示例 2: 便捷方式
async function convenientUsage() {
    console.log('\n=== 便捷方式示例 ===');

    // 直接创建并注册
    const provider = registerAliyunProvider('aliyun-2', {
        apiKey: process.env.BAILIAN_API_KEY || 'your-api-key',
        modelName: AliyunModels.DeepSeekV3,
    });

    try {
        const response = await provider.generate({
            messages: [
                { role: 'system', content: '你是一个专业的前端开发助手', },
                { role: 'user', content: '请解释一下 TypeScript 的优势', }
            ],
            temperature: 0.7,
            maxTokens: 500,
        });

        console.log('专业回复:', response.content);
    } catch (error) {
        console.error('错误:', error.message);
    }
}

// 示例 3: 流式响应
async function streamUsage() {
    console.log('\n=== 流式响应示例 ===');

    try {
        console.log('开始流式生成...');
        for await (const chunk of aiHub.generateStream('aliyun', {
            messages: [{ role: 'user', content: '请详细介绍 Vue 3 的 Composition API', }],
        })) {
            process.stdout.write(chunk.content);

            if (chunk.done) {
                console.log('\n\n生成完成！');
                if (chunk.usage) {
                    console.log('用量统计:', chunk.usage);
                }
                break;
            }
        }
    } catch (error) {
        console.error('流式错误:', error.message);
    }
}

// 示例 4: 多轮对话
async function multiTurnChat() {
    console.log('\n=== 多轮对话示例 ===');

    const provider = createAliyunProvider({
        apiKey: process.env.BAILIAN_API_KEY || 'your-api-key',
        modelName: AliyunModels.DeepSeekV3,
    });

    const messages: AIMessage[] = [
        { role: 'system', content: '你是一个友善的编程助手', },
        { role: 'user', content: '什么是闭包？', }
    ];

    try {
        // 第一轮对话
        let response = await provider.generate({ messages, });
        console.log('助手:', response.content);

        // 添加助手回复到对话历史
        messages.push({ role: 'assistant', content: response.content, });

        // 用户继续提问
        messages.push({ role: 'user', content: '能给个 JavaScript 闭包的例子吗？', });

        // 第二轮对话
        response = await provider.generate({ messages, });
        console.log('助手:', response.content);
    } catch (error) {
        console.error('对话错误:', error.message);
    }
}

// 示例 5: 百炼应用
async function bailianUsage() {
    console.log('\n=== 百炼应用示例 ===');

    const bailianProvider = createAliyunProvider({
        apiKey: process.env.BAILIAN_API_KEY || 'your-api-key',
        bailianAppId: process.env.BAILIAN_APP_ID || 'your-bailian-app-id',
    });

    try {
        // 第一轮对话
        const response1 = await bailianProvider.generate({
            messages: [{ role: 'user', content: '你好，我叫张三', }],
        });
        console.log('第一轮回复:', response1.content);
        console.log('会话 ID:', bailianProvider.getSessionId());

        // 第二轮对话（会自动使用相同的会话 ID）
        const response2 = await bailianProvider.generate({
            messages: [{ role: 'user', content: '我刚才说我叫什么名字？', }],
        });
        console.log('第二轮回复:', response2.content);

        // 百炼应用流式响应示例
        console.log('\n--- 百炼应用流式响应 ---');
        console.log('开始流式生成...');
        for await (const chunk of bailianProvider.generateStream({
            messages: [{ role: 'user', content: '请详细介绍一下人工智能的发展历程', }],
        })) {
            process.stdout.write(chunk.content);
            if (chunk.done) {
                console.log('\n流式生成完成！');
                if (chunk.usage) {
                    console.log('用量统计:', chunk.usage);
                }
                break;
            }
        }
    } catch (error) {
        console.error('百炼应用错误:', error.message);
    }
}

// 示例 6: 批量处理
async function batchProcessing() {
    console.log('\n=== 批量处理示例 ===');

    const prompts = ['介绍一下 React', '介绍一下 Vue', '介绍一下 Angular'];

    try {
        const promises = prompts.map((prompt) =>
            aiHub.generate('aliyun', {
                messages: [{ role: 'user', content: prompt, }],
                maxTokens: 200,
            })
        );

        const results = await Promise.all(promises);

        results.forEach((result, index) => {
            console.log(`\n${prompts[index]}:`);
            console.log(result.content);
        });
    } catch (error) {
        console.error('批量处理错误:', error.message);
    }
}

// 运行所有示例
async function runExamples() {
    console.log('🚀 AI Hub 使用示例开始\n');

    await basicUsage();
    // await convenientUsage();
    await streamUsage();
    await multiTurnChat();
    // await bailianUsage();
    // await batchProcessing();

    console.log('\n✅ 所有示例执行完成');
}

// 如果直接运行此文件
if (require.main === module) {
    runExamples().catch(console.error);
}

export { basicUsage, convenientUsage, streamUsage, multiTurnChat, bailianUsage, batchProcessing };
