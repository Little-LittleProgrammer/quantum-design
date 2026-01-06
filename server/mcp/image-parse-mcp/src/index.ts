import { loadConfig } from './config.js';
import { initLogger, Logger } from './utils/logger.js';
import { setOssConfig } from './utils/oss.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema, ErrorCode, ListToolsRequestSchema, McpError, type CallToolRequest } from '@modelcontextprotocol/sdk/types.js';
import { tools, toolHandlers } from './tools/index.js';
import type { ToolContext } from './tools/base.js';
import { DashScopeClient } from './client/dashscope.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

async function main(): Promise<void> {
    const config = loadConfig();
    initLogger({ level: config.logLevel });

    // Set OSS config for upload functionality
    if (config.oss) {
        setOssConfig(config.oss);
        Logger.info('OSS configuration loaded:', {
            bucket: config.oss.bucket,
            region: config.oss.region,
        });
    } else {
        Logger.info('OSS not configured, will use base64 for local files');
    }

    const logger = {
        info: (...args: unknown[]) => console.log('[INFO]', ...args),
        error: (...args: unknown[]) => console.error('[ERROR]', ...args),
        debug: (...args: unknown[]) => console.debug('[DEBUG]', ...args),
    };

    logger.info('Starting QM Image Parse MCP Server...');
    logger.info('Model:', config.model);
    logger.info('Endpoint:', config.endpoint);
    logger.info('Has API Key:', !!config.apiKey);

    const dashscopeClient = new DashScopeClient(config);

    const toolContext: ToolContext = {
        dashscopeClient: {
            analyzeImage: async (image, prompt) => {
                return dashscopeClient.analyzeImage(image, prompt);
            },
            analyzeImages: async (images, prompt) => {
                return dashscopeClient.analyzeImages(images, prompt);
            },
            analyzeVideo: async (videoUrl, prompt, fps) => {
                return dashscopeClient.analyzeVideo(videoUrl, prompt, fps);
            },
        },
    };

    const server = new Server(
        {
            name: 'qm-image-parse-mcp',
            version: '0.1.0',
        },
        {
            capabilities: {
                tools: {},
            },
        },
    );

    // List available tools
    server.setRequestHandler(ListToolsRequestSchema, async () => ({
        tools: tools.map(({ name, description, inputSchema }) => ({
            name,
            description,
            inputSchema,
        })),
    }));

    // Handle tool calls
    server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
        const { name, arguments: args } = request.params;

        const handler = toolHandlers[name];
        if (!handler) {
            throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
        }

        try {
            logger.info(`Executing tool: ${name}`);
            const result = await handler(args || {}, toolContext);
            return result as {
                content: Array<{ type: 'text'; text: string }>;
                isError?: boolean;
            };
        } catch (error) {
            logger.error(`Tool ${name} failed:`, error);
            if (error instanceof McpError) {
                throw error;
            }
            const message = error instanceof Error ? error.message : String(error);
            return {
                content: [{ type: 'text', text: `Error: ${message}` }],
                isError: true,
            };
        }
    });

    const transport = new StdioServerTransport();

    await server.connect(transport);

    logger.info('QM Image Parse MCP Server started');
}

main().catch((error) => {
    Logger.error('Fatal error:', error);
    // eslint-disable-next-line n/prefer-global/process
    process.exit(1);
});
