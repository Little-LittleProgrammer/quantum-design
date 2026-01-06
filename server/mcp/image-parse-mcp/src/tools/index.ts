import type { ToolDefinition, ToolContext, ToolResponse } from './base.js';
import { executeUiToArtifact } from './ui-to-artifact.js';
import { executeExtractText } from './extract-text.js';
import { executeDiagnoseError } from './diagnose-error.js';
import { executeUnderstandDiagram } from './understand-diagram.js';
import { executeAnalyzeChart } from './analyze-chart.js';
import { executeUiDiff } from './ui-diff.js';
import { executeImageAnalysis } from './image-analysis.js';
import { executeVideoAnalysis } from './video-analysis.js';

export type ToolHandler = (args: Record<string, unknown>, context: ToolContext) => Promise<ToolResponse>;

export const tools: ToolDefinition[] = [
    {
        name: 'ui_to_artifact',
        description: 'Convert UI screenshot to code, prompt, design specification, or natural language description',
        inputSchema: {
            type: 'object',
            properties: {
                image: {
                    type: 'string',
                    description: 'Image input: local path, URL, or Base64',
                },
                output_type: {
                    type: 'string',
                    enum: ['code', 'prompt', 'design_spec', 'natural_language'],
                    description: 'Output type: code, prompt, design_spec, or natural_language',
                },
                framework: {
                    type: 'string',
                    description: 'Optional: target framework (react, vue, html, etc.)',
                },
            },
            required: ['image', 'output_type'],
        },
    },
    {
        name: 'extract_text_from_screenshot',
        description: 'Extract and recognize text from screenshots using OCR. Optimized for code, terminal output, documents, and general text.',
        inputSchema: {
            type: 'object',
            properties: {
                image: {
                    type: 'string',
                    description: 'Image input: local path, URL, or Base64',
                },
                include_position: {
                    type: 'boolean',
                    description: 'Whether to include position information (optional)',
                },
            },
            required: ['image'],
        },
    },
    {
        name: 'diagnose_error_screenshot',
        description: 'Analyze error popups, stack traces, and log screenshots to provide location and fix suggestions.',
        inputSchema: {
            type: 'object',
            properties: {
                image: {
                    type: 'string',
                    description: 'Error screenshot input: local path, URL, or Base64',
                },
                language: {
                    type: 'string',
                    description: 'Programming language: javascript, python, java, etc. (optional)',
                },
            },
            required: ['image'],
        },
    },
    {
        name: 'understand_technical_diagram',
        description: 'Analyze architecture diagrams, flowcharts, UML, ER diagrams and generate structured interpretation.',
        inputSchema: {
            type: 'object',
            properties: {
                image: {
                    type: 'string',
                    description: 'Diagram image input: local path, URL, or Base64',
                },
                diagram_type: {
                    type: 'string',
                    enum: ['architecture', 'flowchart', 'uml', 'er', 'auto'],
                    description: 'Diagram type: architecture, flowchart, uml, er, or auto (default)',
                },
            },
            required: ['image'],
        },
    },
    {
        name: 'analyze_data_visualization',
        description: 'Read dashboards and charts to extract trends, anomalies, and business insights.',
        inputSchema: {
            type: 'object',
            properties: {
                image: {
                    type: 'string',
                    description: 'Chart/dashboard image input: local path, URL, or Base64',
                },
                focus_areas: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Specific metrics or areas to focus on (optional)',
                },
            },
            required: ['image'],
        },
    },
    {
        name: 'ui_diff_check',
        description: 'Compare two UI screenshots to identify visual differences and implementation deviations.',
        inputSchema: {
            type: 'object',
            properties: {
                source_image: {
                    type: 'string',
                    description: 'Source/reference image: local path, URL, or Base64',
                },
                target_image: {
                    type: 'string',
                    description: 'Target/comparison image: local path, URL, or Base64',
                },
                threshold: {
                    type: 'number',
                    minimum: 0,
                    maximum: 100,
                    description: 'Similarity threshold (0-100, optional)',
                },
            },
            required: ['source_image', 'target_image'],
        },
    },
    {
        name: 'image_analysis',
        description: 'General image understanding for visual content not covered by specialized tools.',
        inputSchema: {
            type: 'object',
            properties: {
                image: {
                    type: 'string',
                    description: 'Image input: local path, URL, or Base64',
                },
                prompt: {
                    type: 'string',
                    description: 'Analysis prompt for targeted analysis (optional)',
                },
            },
            required: ['image'],
        },
    },
    {
        name: 'video_analysis',
        description: 'Analyze MP4/MOV/M4V videos to extract keyframes, events, and content summary.',
        inputSchema: {
            type: 'object',
            properties: {
                video: {
                    type: 'string',
                    description: 'Video input: local path or URL (max 8MB for local files)',
                },
                fps: {
                    type: 'number',
                    minimum: 1,
                    maximum: 10,
                    description: 'Frame sampling rate (default: 2)',
                },
                prompt: {
                    type: 'string',
                    description: 'Analysis prompt for targeted analysis (optional)',
                },
            },
            required: ['video'],
        },
    },
];

export const toolHandlers: Record<string, ToolHandler> = {
    ui_to_artifact: executeUiToArtifact,
    extract_text_from_screenshot: executeExtractText,
    diagnose_error_screenshot: executeDiagnoseError,
    understand_technical_diagram: executeUnderstandDiagram,
    analyze_data_visualization: executeAnalyzeChart,
    ui_diff_check: executeUiDiff,
    image_analysis: executeImageAnalysis,
    video_analysis: executeVideoAnalysis,
};
