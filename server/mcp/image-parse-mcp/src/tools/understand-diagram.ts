import { z } from 'zod';
import { normalizeImageInput } from '../utils/image.js';
import type { ToolContext, ToolResponse } from './base.js';

export const InputSchema = z.object({
    image: z.string(),
    diagram_type: z.enum(['architecture', 'flowchart', 'uml', 'er', 'auto']).optional(),
});

type Input = z.infer<typeof InputSchema>;

export function getUnderstandDiagramPrompt(args: Input): string {
    const diagramType = args.diagram_type || 'auto';

    const prompts: Record<string, string> = {
        architecture: `Analyze this system architecture diagram.
Identify: services, databases, message queues, external integrations, data flow direction, and infrastructure components.
Provide a structured breakdown with component descriptions and relationships.`,

        flowchart: `Analyze this flowchart/process diagram.
Identify: process steps, decision points, loops, input/output, and actors.
Provide a step-by-step description of the process.`,

        uml: `Analyze this UML diagram (class, sequence, or other).
Identify: classes, interfaces, relationships (inheritance, composition, association), methods, and attributes.
Provide a structured description suitable for code generation.`,

        er: `Analyze this Entity-Relationship diagram.
Identify: entities, attributes, primary keys, foreign keys, and relationships (1:1, 1:N, N:M).
Provide a schema description.`,

        auto: `Analyze this technical diagram.
Identify the diagram type (architecture, flowchart, UML, ER, or other).
Provide a comprehensive structural description including all components, relationships, and data flow.`,
    };

    return prompts[diagramType] || prompts.auto;
}

export async function executeUnderstandDiagram(args: Record<string, unknown>, context: ToolContext): Promise<ToolResponse> {
    try {
        const parsed = InputSchema.parse(args);
        const imageInput = await normalizeImageInput(parsed.image);
        const prompt = getUnderstandDiagramPrompt(parsed);

        const result = await context.dashscopeClient.analyzeImage(imageInput, prompt);

        return {
            content: [
                {
                    type: 'text',
                    text: `## Technical Diagram Analysis\n\n**Diagram Type:** ${parsed.diagram_type || 'auto-detect'}\n\n### Structure:\n\n${result}`,
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
