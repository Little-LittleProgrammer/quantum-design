import { z } from 'zod';
import { normalizeImageInput } from '../utils/image.js';
import type { ToolContext, ToolResponse } from './base.js';

export const InputSchema = z.object({
    image: z.string(),
    output_type: z.enum(['code', 'prompt', 'design_spec', 'natural_language']),
    framework: z.string().optional(),
});

type Input = z.infer<typeof InputSchema>;

export function getUiToArtifactPrompt(args: Input): string {
    const { output_type, framework } = args;

    const prompts: Record<string, string> = {
        code: `Analyze this UI image and generate ${framework ? `in ${framework}` : ''} code.
Include all CSS styling, responsive design considerations, and component structure.
Provide complete, working code that can be copy-pasted directly.`,

        prompt: `Analyze this UI image and generate a detailed image generation prompt.
Include description of layout, colors, typography, components, and style.
The prompt should be suitable for use with AI image generation tools.`,

        design_spec: `Analyze this UI image and extract design specifications.
Include: color palette, typography, spacing, component dimensions, layout grid, and design patterns.
Format as a structured design system document.`,

        natural_language: `Describe this UI image in natural language.
Include: layout, components, content, visual style, and user experience observations.`,
    };

    return prompts[output_type] || prompts.natural_language;
}

export async function executeUiToArtifact(args: Record<string, unknown>, _context: ToolContext): Promise<ToolResponse> {
    try {
        const parsed = InputSchema.parse(args);
        const imageInput = await normalizeImageInput(parsed.image);
        const prompt = getUiToArtifactPrompt(parsed);

        const result = await _context.dashscopeClient.analyzeImage(imageInput, prompt);

        return {
            content: [
                {
                    type: 'text',
                    text: `## UI to ${parsed.output_type.toUpperCase()}\n\n**Output Type:** ${parsed.output_type}\n**Framework:** ${parsed.framework || 'Not specified'}\n\n### Analysis Result:\n\n${result}`,
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
