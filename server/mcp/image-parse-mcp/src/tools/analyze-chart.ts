import { z } from 'zod';
import { normalizeImageInput } from '../utils/image.js';
import type { ToolContext, ToolResponse } from './base.js';

export const InputSchema = z.object({
    image: z.string(),
    focus_areas: z.array(z.string()).optional(),
});

type Input = z.infer<typeof InputSchema>;

export function getAnalyzeChartPrompt(args: Input): string {
    const focusAreas = args.focus_areas?.join(', ') || 'all metrics';

    return `Analyze this data visualization (chart, dashboard, graph).
Focus areas: ${focusAreas}

Provide:
1. Chart type identification (line, bar, pie, scatter, heatmap, etc.)
2. Key data points and values
3. Trend analysis (growth, decline, volatility, stability)
4. Anomaly identification (outliers, unexpected patterns)
5. Business insights and key takeaways
6. Recommendations based on the data`;
}

export async function executeAnalyzeChart(args: Record<string, unknown>, context: ToolContext): Promise<ToolResponse> {
    try {
        const parsed = InputSchema.parse(args);
        const imageInput = await normalizeImageInput(parsed.image);
        const prompt = getAnalyzeChartPrompt(parsed);

        const result = await context.dashscopeClient.analyzeImage(imageInput, prompt);

        return {
            content: [
                {
                    type: 'text',
                    text: `## Data Visualization Analysis\n\n**Focus Areas:** ${parsed.focus_areas?.join(', ') || 'All metrics'}\n\n### Insights:\n\n${result}`,
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
