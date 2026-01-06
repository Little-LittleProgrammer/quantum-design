import { z } from 'zod';
import { normalizeImageInput } from '../utils/image.js';
import type { ToolContext, ToolResponse } from './base.js';

export const InputSchema = z.object({
    source_image: z.string(),
    target_image: z.string(),
    threshold: z.number().min(0).max(100).optional(),
});

type Input = z.infer<typeof InputSchema>;

export function getUiDiffPrompt(args: Input): string {
    const threshold = args.threshold || 80;

    return `Compare these two UI images (source vs target).
Identify and describe:
1. Visual differences (layout shifts, color changes, content changes)
2. Layout differences (position offsets, size changes)
3. Color differences (hue shifts, contrast changes, missing colors)
4. Content differences (missing elements, extra elements, text differences)
5. Similarity percentage

Report all differences with severity levels (critical, major, minor).
Consider threshold: ${threshold}% similarity check.`;
}

export async function executeUiDiff(args: Record<string, unknown>, context: ToolContext): Promise<ToolResponse> {
    try {
        const parsed = InputSchema.parse(args);
        const [sourceImage, targetImage] = await Promise.all([
            normalizeImageInput(parsed.source_image),
            normalizeImageInput(parsed.target_image),
        ]);
        const prompt = getUiDiffPrompt(parsed);

        const result = await context.dashscopeClient.analyzeImages([sourceImage, targetImage], prompt);

        return {
            content: [
                {
                    type: 'text',
                    text: `## UI Diff Analysis\n\n**Source:** ${parsed.source_image}\n**Target:** ${parsed.target_image}\n**Threshold:** ${parsed.threshold || 'default (80%)'}%\n\n### Comparison Result:\n\n${result}`,
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
