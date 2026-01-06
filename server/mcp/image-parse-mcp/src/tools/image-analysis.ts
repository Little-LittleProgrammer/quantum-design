import { z } from 'zod';
import { normalizeImageInput } from '../utils/image.js';
import type { ToolContext, ToolResponse } from './base.js';

export const InputSchema = z.object({
    image: z.string(),
    prompt: z.string().optional(),
});

type Input = z.infer<typeof InputSchema>;

export function getImageAnalysisPrompt(args: Input): string {
    if (args.prompt) {
        return args.prompt;
    }

    return `Provide a comprehensive analysis of this image.
Describe:
1. Main subject/content
2. Composition and visual elements
3. Style and mood
4. Context or setting
5. Any text or labels present
6. Notable details or features`;
}

export async function executeImageAnalysis(args: Record<string, unknown>, context: ToolContext): Promise<ToolResponse> {
    try {
        const parsed = InputSchema.parse(args);
        const imageInput = await normalizeImageInput(parsed.image);
        const prompt = getImageAnalysisPrompt(parsed);

        const result = await context.dashscopeClient.analyzeImage(imageInput, prompt);

        return {
            content: [
                {
                    type: 'text',
                    text: `## Image Analysis\n\n${result}`,
                },
            ],
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
            content: [{ type: 'text', text: `Error: ${message}` }],
            isError: true,
        };
    }
}
