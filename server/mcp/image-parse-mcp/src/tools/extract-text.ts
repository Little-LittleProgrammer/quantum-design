import { z } from 'zod';
import { normalizeImageInput } from '../utils/image.js';
import type { ToolContext, ToolResponse } from './base.js';

export const InputSchema = z.object({
    image: z.string(),
    include_position: z.boolean().optional(),
});

type Input = z.infer<typeof InputSchema>;

export function getExtractTextPrompt(_args: Input): string {
    return `Extract all text from this image with high accuracy.
For code snippets, preserve indentation and formatting.
For tables, maintain the table structure.
For documents, maintain paragraphs and sections.
If there are multiple languages, identify them separately.`;
}

export async function executeExtractText(args: Record<string, unknown>, context: ToolContext): Promise<ToolResponse> {
    try {
        const parsed = InputSchema.parse(args);
        const imageInput = await normalizeImageInput(parsed.image);
        const prompt = getExtractTextPrompt(parsed);

        const result = await context.dashscopeClient.analyzeImage(imageInput, prompt);

        return {
            content: [
                {
                    type: 'text',
                    text: `## Extracted Text\n\n${result}`,
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
