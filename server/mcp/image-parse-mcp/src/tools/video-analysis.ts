import { z } from 'zod';
import { isVideoUrl } from '../utils/image.js';
import { normalizeVideoInput, isLocalFilePath } from '../utils/oss.js';
import type { ToolContext, ToolResponse } from './base.js';

export const InputSchema = z.object({
    video: z.string(),
    fps: z.number().min(1).max(10).optional(),
    prompt: z.string().optional(),
});

type Input = z.infer<typeof InputSchema>;

export function getVideoAnalysisPrompt(args: Input): string {
    if (args.prompt) {
        return args.prompt;
    }

    return `Analyze this video and provide:
1. Summary of the overall content
2. Key events or scenes with timestamps
3. Main subjects or actors
4. Key visual elements and settings
5. Audio content description (if applicable)
6. Important moments or highlights`;
}

export async function executeVideoAnalysis(args: Record<string, unknown>, context: ToolContext): Promise<ToolResponse> {
    try {
        const parsed = InputSchema.parse(args);
        let videoUrl = parsed.video;
        const fps = parsed.fps || 2;
        const prompt = getVideoAnalysisPrompt(parsed);

        // Handle local video file - upload to OSS first
        if (isLocalFilePath(videoUrl)) {
            videoUrl = await normalizeVideoInput(videoUrl);
        }

        // Validate video URL
        if (!isVideoUrl(videoUrl)) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `Warning: The input may not be a valid video URL. Please ensure the URL ends with a supported video extension (.mp4, .mov, .m4v, etc.)`,
                    },
                ],
                isError: false,
            };
        }

        const result = await context.dashscopeClient.analyzeVideo(videoUrl, prompt, fps);

        return {
            content: [
                {
                    type: 'text',
                    text: `## Video Analysis\n\n**Video:** ${videoUrl}\n**FPS:** ${fps}\n\n### Content Summary:\n\n${result}`,
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
