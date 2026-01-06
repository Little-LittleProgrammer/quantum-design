import { z } from 'zod';
import { normalizeImageInput } from '../utils/image.js';
import type { ToolContext, ToolResponse } from './base.js';

export const InputSchema = z.object({
    image: z.string(),
    language: z.string().optional(),
});

type Input = z.infer<typeof InputSchema>;

export function getDiagnoseErrorPrompt(args: Input): string {
    const language = args.language || 'unknown';

    return `Analyze this error screenshot and provide:
1. Error type identification (syntax, runtime, type, reference, etc.)
2. Exact location (file, line number, function if visible)
3. Root cause analysis
4. Specific fix suggestions with code examples
5. Stack trace summary if present
6. Fix priority and impact assessment

Programming language: ${language}

Provide actionable fix recommendations.`;
}

export async function executeDiagnoseError(args: Record<string, unknown>, context: ToolContext): Promise<ToolResponse> {
    try {
        const parsed = InputSchema.parse(args);
        const imageInput = await normalizeImageInput(parsed.image);
        const prompt = getDiagnoseErrorPrompt(parsed);

        const result = await context.dashscopeClient.analyzeImage(imageInput, prompt);

        return {
            content: [
                {
                    type: 'text',
                    text: `## Error Diagnosis\n\n**Language:** ${parsed.language || 'Not specified'}\n\n### Analysis:\n\n${result}`,
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
