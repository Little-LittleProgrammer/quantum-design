import type { ZodSchema } from 'zod';
import type { NormalizedImage } from '../utils/image.js';

export interface ToolResponse {
    content: Array<{
        type: 'text' | 'image' | 'resource';
        text?: string;
        mimeType?: string;
        data?: string;
    }>;
    isError?: boolean;
}

export type ToolHandler<TArgs = Record<string, unknown>> = (
    args: TArgs,
    context: ToolContext
) => Promise<ToolResponse>;

export interface ToolDefinition {
    name: string;
    description: string;
    inputSchema: {
        type: 'object';
        properties: Record<string, unknown>;
        required?: string[];
    };
}

export interface ToolContext {
    dashscopeClient: {
        analyzeImage(image: NormalizedImage, prompt: string): Promise<string>;
        analyzeImages(images: NormalizedImage[], prompt: string): Promise<string>;
        analyzeVideo(videoUrl: string, prompt: string, fps?: number): Promise<string>;
    };
}

export abstract class BaseTool<TArgs = Record<string, unknown>> {
    abstract readonly name: string;
    abstract readonly description: string;
    abstract readonly inputSchema: ZodSchema<TArgs>;

    protected abstract getPrompt(args: TArgs): string;

    protected abstract formatResponse(result: string): ToolResponse;

    async execute(args: TArgs, context: ToolContext): Promise<ToolResponse> {
        try {
            const prompt = this.getPrompt(args);
            const image = await this.parseImageInput(args);

            if (image) {
                const result = await context.dashscopeClient.analyzeImage(image, prompt);
                return this.formatResponse(result);
            }

            throw new Error('No valid image input provided');
        } catch (error) {
            return this.handleError(error);
        }
    }

    protected async parseImageInput(_args: TArgs): Promise<NormalizedImage | null> {
        // Override in subclasses if needed
        return null;
    }

    protected handleError(error: unknown): ToolResponse {
        const message = error instanceof Error ? error.message : String(error);
        Logger.error(`Tool ${this.name} error:`, error);
        return {
            content: [{ type: 'text', text: `Error: ${message}` }],
            isError: true,
        };
    }
}

// Simple logger for tools (will be initialized from main)
const Logger = {
    debug: (...args: unknown[]) => console.debug('[DEBUG]', ...args),
    info: (...args: unknown[]) => console.info('[INFO]', ...args),
    warn: (...args: unknown[]) => console.warn('[WARN]', ...args),
    error: (...args: unknown[]) => console.error('[ERROR]', ...args),
};
