import { Logger } from '../utils/logger.js';
import type { ServerConfig } from '../config.js';
import type { NormalizedImage } from '../utils/image.js';

export interface DashScopeMessage {
    role: 'user';
    content: Array<{
        type: 'text' | 'image_url' | 'video_url';
        text?: string;
        image_url?: { url: string };
        video_url?: { url: string; fps?: number };
    }>;
}

export interface DashScopeResponse {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: Array<{
        index: number;
        message: {
            role: string;
            content: string;
        };
        finish_reason: string;
    }>;
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

export class DashScopeClient {
    private readonly config: ServerConfig;

    constructor(config: ServerConfig) {
        this.config = config;
    }

    private async callAPI(messages: DashScopeMessage[]): Promise<string> {
        const response = await fetch(this.config.endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.config.apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: this.config.model,
                messages,
                max_tokens: 4096,
                temperature: 0.1,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            Logger.error('DashScope API error:', response.status, errorText);
            throw new Error(`DashScope API error: ${response.status} - ${errorText}`);
        }

        const data: DashScopeResponse = await response.json();

        if (data.choices && data.choices.length > 0) {
            return data.choices[0].message.content;
        }

        throw new Error('No response from DashScope API');
    }

    async analyzeImage(image: NormalizedImage, prompt: string): Promise<string> {
        const messages: DashScopeMessage[] = [
            {
                role: 'user',
                content: [
                    {
                        type: 'image_url',
                        image_url: {
                            url: image.data,
                        },
                    },
                    {
                        type: 'text',
                        text: prompt,
                    },
                ],
            },
        ];

        Logger.debug('Analyzing image with prompt:', prompt);
        return this.callAPI(messages);
    }

    async analyzeImages(images: NormalizedImage[], prompt: string): Promise<string> {
        const content: DashScopeMessage['content'] = images.map((img) => ({
            type: 'image_url',
            image_url: {
                url: img.data,
            },
        }));

        content.push({
            type: 'text',
            text: prompt,
        });

        const messages: DashScopeMessage[] = [
            {
                role: 'user',
                content,
            },
        ];

        Logger.debug(`Analyzing ${images.length} images with prompt:`, prompt);
        return this.callAPI(messages);
    }

    async analyzeVideo(videoUrl: string, prompt: string, fps: number = 2): Promise<string> {
        const messages: DashScopeMessage[] = [
            {
                role: 'user',
                content: [
                    {
                        type: 'video_url',
                        video_url: {
                            url: videoUrl,
                            fps,
                        },
                    },
                    {
                        type: 'text',
                        text: prompt,
                    },
                ],
            },
        ];

        Logger.debug('Analyzing video with prompt:', prompt, 'fps:', fps);
        return this.callAPI(messages);
    }

    async chat(messages: DashScopeMessage[]): Promise<string> {
        return this.callAPI(messages);
    }
}
