// 创建 openai， 调用ai
import type { IOpenaiConfig } from '../../enums/default-options';
import axios, { type AxiosResponse } from 'axios';

export interface ReviewResult {
    fileName: string;
    lineNumber: number;
    reviewResult: string;
    optimizedCode?: string;
    referenceIssue?: string;
}

export class OpenAIClient {
    modelName: string;
    private bailianAppId?: string;
    sessionId?: string;
    private baseURL: string;
    private apiKey: string;
    constructor(options: Partial<IOpenaiConfig>) {
        if (!options.apiKey) {
            throw new Error('openai apiKey 未配置');
        }
        if (options.bailianAppId) {
            this.bailianAppId = options.bailianAppId;
        }
        this.apiKey = options.apiKey;
        this.baseURL = this.bailianAppId
            ? `https://dashscope.aliyuncs.com/api/v1/apps/${this.bailianAppId}/completion`
            : 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation';
        this.modelName = options.modelName || 'deepseek-v3';
    }

    get getHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
        };
    }

    async askInfo(prompt: string) {
        const params = this.getParams(prompt);
        const res = await axios.post(this.baseURL, params, {
            headers: this.getHeaders,
        });
        const message = this.getChatCompletion(res);
        if (!message) {
            return null;
        }
        return message;
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
        const message = await this.askInfo(prompt);
        if (!message) {
            return null;
        }
        return message;
    }

    async reviewCode(prompt: string) {
        const message = await this.askInfo(prompt);
        if (!message) {
            return null;
        }
        const result = message.trim();
        // 首先忽略```json 和 ``` 解析 result 为 json
        if (!result) {
            return null;
        }
        try {
            const jsonResultStr = `${result.replace('```json', '').replace('```', '').trim()}`;
            if ((jsonResultStr.startsWith('{') && jsonResultStr.endsWith('}')) || (jsonResultStr.startsWith('[') && jsonResultStr.endsWith(']'))) {
                const jsonResult = JSON.parse(jsonResultStr);
                if (Array.isArray(jsonResult)) {
                    return {
                        type: 'json',
                        result: jsonResult.map((item: any) => ({
                            ...item,
                            lineNumber: isNaN(item.lineNumber) || item.lineNumber === null ? 1 : item.lineNumber,
                        })),
                    };
                } else {
                    return {
                        type: 'json',
                        result: [{
                            ...jsonResult,
                            lineNumber: isNaN(jsonResult.lineNumber) || jsonResult.lineNumber === null ? 1 : jsonResult.lineNumber,
                        }],
                    };
                }
            }
            return {
                type: 'text',
                result,
            };
        } catch (error) {
            console.log('解析结果失败', error);
            return null;
        }
    }

    private getChatCompletion(res: AxiosResponse) {
        try {
            if (res.status !== 200) {
                return null;
            }
            if (this.bailianAppId) {
                this.sessionId = res.data.output.session_id;
                return res.data.output.text?.trim() || '';
            }
            return res.data.choices[0]?.message.content?.trim() || '';
        } catch (error) {
            console.log('解析结果失败', error);
            return null;
        }
    }

    private getParams(prompt: string) {
        if (this.bailianAppId) {
            return {
                input: { prompt: prompt, },
                session_id: this.sessionId ? this.sessionId : undefined,
            };
        }
        return {
            model: this.modelName,
            input: {
                messages: [{ role: 'user', content: prompt, }],
            },
        };
    }
}
