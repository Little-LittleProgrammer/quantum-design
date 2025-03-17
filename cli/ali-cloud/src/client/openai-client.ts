// 创建 openai， 调用ai
import OpenAI from 'openai';
import type { ChatCompletion } from 'openai/resources';

export interface ReviewResult {
    fileName: string;
    lineNumber: number;
    reviewResult: string;
    optimizedCode?: string;
    referenceIssue?: string;
}

export class OpenAIClient {
    private openai: OpenAI;
    modelName: string;
    constructor(apiKey: string, modelName: string) {
        this.openai = new OpenAI({
            apiKey: apiKey,
            baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
            timeout: 600000,
        });
        this.modelName = modelName;
    }

    async getMrDescription(combinedDiff: string): Promise<string | null> {
        const prompt = `请根据以下代码块，生成本次 MR 的描述：
                        
                        [完整Diff]
                        ${combinedDiff}
                        审查要求：
                        1. 请用Markdown格式回复
                        2. 请用中文回复
                        3. 第一段话总结本次mr的主要功能，概括完之后加上换行符
                        4. 后面描述本次 MR 的改动,格式为"文件名: 当前文件改动总结"`;

        const completion: ChatCompletion = await this.openai.chat.completions.create({
            model: this.modelName,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.2,
            top_p: 0.2,
        });
        const content = completion.choices[0]?.message.content?.trim() || '';
        return content;
    }

    async reviewCode(prompt: string) {
        const completion: ChatCompletion = await this.openai.chat.completions.create({
            model: this.modelName,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.2,
            top_p: 0.2
        });
        let result = completion.choices[0]?.message.content?.trim() || '';
        // 首先忽略```json 和 ``` 解析 result 为 json
        if (!result) {
            return null;
        }
        try {
            console.log('result', result);
            const jsonResultStr = `${result.replace('```json', '').replace('```', '').trim()}`
            if (jsonResultStr.startsWith('{') && jsonResultStr.endsWith('}') || jsonResultStr.startsWith('[') && jsonResultStr.endsWith(']')) {
                const jsonResult = JSON.parse(jsonResultStr);
                if (Array.isArray(jsonResult)) {
                    return {
                        type: 'json',
                        result: jsonResult.map((item: any) => ({
                            ...item,
                            lineNumber: isNaN(item.lineNumber) || item.lineNumber === null ? 1 : item.lineNumber
                        }))
                    };
                } else {
                    return {
                        type: 'json',
                        result: [{
                            ...jsonResult,
                            lineNumber: isNaN(jsonResult.lineNumber) || jsonResult.lineNumber === null ? 1 : jsonResult.lineNumber
                        }]
                    };
                }
            }
            return {
                type: 'text',
                result
            };
        } catch (error) {
            console.log('解析结果失败', error);
            return null;
        }
    }
        
}
