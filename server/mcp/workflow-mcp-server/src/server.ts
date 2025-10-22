import { CallToolRequestSchema, ErrorCode, ListToolsRequestSchema, McpError, type CallToolRequest } from '@modelcontextprotocol/sdk/types.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import type { Transport } from '@modelcontextprotocol/sdk/shared/transport.js';
import express, { Request, Response } from 'express';
import { AppStackClient, CodeupClient, DocxClient } from 'qm-workflow';

import { formatErrorMessage, Logger } from './utils/tools';
import { IFeishuTool, IFeishuMcpOptions, IFeishuConfig, IJsonSchema, ToolHandlerFn, IToolResponse, type IToolHandlerContext } from './type';

function handleError(error: unknown, operation: string): IToolResponse {
    Logger.error(`${operation}失败:`, error);
    const errorMessage = formatErrorMessage(error);
    return {
        content: [{ type: 'text', text: `${operation}失败: ${errorMessage}` }],
        isError: true,
    };
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
}

function isFeishuConfig(value: unknown): value is IFeishuConfig {
    if (!isRecord(value)) {
        return false;
    }
    return typeof value.appId === 'string' && value.appId.length > 0 && typeof value.appSecret === 'string' && value.appSecret.length > 0;
}

const getFeishuDocSchema: IJsonSchema = {
    type: 'object',
    properties: {
        url: {
            type: 'string',
            description: 'Feishu document url',
        },
    },
    required: ['url'],
};

const handleGetFeishuDoc: ToolHandlerFn = async (args, context) => {
    try {
        if (!context.docxClient) {
            throw new McpError(ErrorCode.InvalidParams, '飞书配置不完整，请检查 appId、appSecret');
        }
        const res = await context.docxClient.getWikiDocs(args.url);
        return {
            content: [{ type: 'text', text: res }],
        };
    } catch (error) {
        return handleError(error, '获取飞书文档信息');
    }
};

const createFeishuDocSchema: IJsonSchema = {
    type: 'object',
    properties: {
        markdown: {
            type: 'string',
            description: 'Feishu document context in markdown format',
        },
        parent_node: {
            type: 'string',
            description: 'The folder where the created Feishu document belongs, the url splits the last item by /',
        },
    },
    required: ['markdown', 'parent_node'],
};

const handleCreateFeishuDoc: ToolHandlerFn = async (args, context) => {
    try {
        if (!context.docxClient) {
            throw new McpError(ErrorCode.InvalidParams, '飞书配置不完整，请检查 appId、appSecret');
        }
        await context.docxClient.getWikiBase();
        let token = args.parent_node;
        if (token.includes('http')) {
            const infoArr = token.split('?')[0]?.split('/') || [];
            token = infoArr.pop() || '';
        }
        const res = await context.docxClient.createWikiDocsMarkdown(args.markdown, token);
        return {
            content: [{ type: 'text', text: JSON.stringify(res) }],
        };
    } catch (error) {
        return handleError(error, '创建飞书文档');
    }
};

const createMergeRequestSchema: IJsonSchema = {
    type: 'object',
    properties: {
        sourceBranch: {
            type: 'string',
            description: 'current branch',
        },
        description: {
            type: 'string',
            description: 'Merge request description, if user input empty, use ai to generate according to the diff with master',
        },
    },
    required: ['sourceBranch', 'description'],
};

const handleCreateMergeRequest: ToolHandlerFn = async (args, context) => {
    try {
        if (!context.options.aliConfig.token) {
            throw new McpError(ErrorCode.InvalidParams, '阿里云 token 未配置');
        }
        const codeupInstance = new CodeupClient(context.options.aliConfig, {
            sourceBranch: args.sourceBranch,
        });
        await codeupInstance.getRepoInfo();
        const mrInfo = await codeupInstance.getMergeRequest();
        if (mrInfo) {
            return {
                content: [{ type: 'text', text: '当前 mr 已存在，无需创建' }],
            };
        }
        const res = await codeupInstance.createMergeRequest(args.sourceBranch, args.description);
        if (res?.code === 200 && res?.data?.detailUrl) {
            return {
                content: [{ type: 'text', text: `mr 创建成功: ${res.data.detailUrl}` }],
            };
        }
        return {
            content: [{ type: 'text', text: JSON.stringify(res) }],
        };
    } catch (error) {
        return handleError(error, '创建 mr');
    }
};

const developmentProjectSchema: IJsonSchema = {
    type: 'object',
    properties: {
        runEnv: {
            type: 'string',
            description: 'deploy environment',
        },
        project: {
            type: 'string',
            description: 'project name',
        },
        branch: {
            type: 'string',
            description: 'branch name',
        },
    },
    required: ['runEnv', 'project', 'branch'],
};

const handleDevelopmentProject: ToolHandlerFn = async (args, context) => {
    try {
        if (!context.options.aliConfig.token) {
            throw new McpError(ErrorCode.InvalidParams, '阿里云 token 未配置');
        }
        const appStackInstance = new AppStackClient(context.options.aliConfig);
        await appStackInstance.getAppStack();
        const workflows = appStackInstance.getWorkflows();
        if (!Array.isArray(workflows)) {
            return {
                content: [{ type: 'text', text: '部署项目失败: 未获取到工作流信息' }],
                isError: true,
            };
        }
        const workflowList = workflows
            .filter(isWorkflow)
            .filter((workflow) => workflow.name.includes(args.project))
            .flatMap((workflow) =>
                workflow.releaseStages.map((stage) => ({
                    workflowSn: workflow.sn,
                    stageSn: stage.sn,
                    stageName: stage.name,
                })),
            );
        await appStackInstance.ExecuteAppStack(args.runEnv, workflowList, args.branch);
        return {
            content: [{ type: 'text', text: 'ok' }],
        };
    } catch (error) {
        return handleError(error, '部署项目');
    }
};

const tools: IFeishuTool[] = [
    {
        name: 'get_feishu_doc',
        description: 'Get the Feishu document based on the url in markdown format',
        schema: getFeishuDocSchema,
        handler: handleGetFeishuDoc,
    },
    {
        name: 'create_feishu_doc',
        description: 'Create a Feishu document',
        schema: createFeishuDocSchema,
        handler: handleCreateFeishuDoc,
    },
    {
        name: 'create_merge_request',
        description: 'Use cur branch to create a merge request to target branch',
        schema: createMergeRequestSchema,
        handler: handleCreateMergeRequest,
    },
    {
        name: 'development_project',
        description: 'Deploy the project remotely',
        schema: developmentProjectSchema,
        handler: handleDevelopmentProject,
    },
];

export class FeishuMcpServer {
    private readonly server: Server;

    private readonly sseTransports: Map<string, SSEServerTransport> = new Map();

    private readonly options: IFeishuMcpOptions;

    private readonly docxClient: DocxClient;

    constructor(options: IFeishuMcpOptions) {
        this.options = options;
        if (isFeishuConfig(options.feishuConfig)) {
            this.docxClient = new DocxClient({
                appId: options.feishuConfig.appId,
                appSecret: options.feishuConfig.appSecret,
                spaceName: options.feishuConfig.spaceName,
                appUserToken: options.feishuConfig.appUserToken,
            });
        }
        this.server = new Server(
            {
                name: 'qm-workflow-mcp-server',
                version: '0.1.4',
            },
            {
                capabilities: {
                    tools: {},
                },
            },
        );
        this.registerHandlers();
    }

    private registerHandlers(): void {
        this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
            tools: tools.map(({ name, description, schema }) => ({
                name,
                description,
                inputSchema: schema,
            })),
        }));

        this.server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
            const tool = tools.find((item) => item.name === request.params.name);
            if (!tool) {
                throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`);
            }
            try {
                const context: IToolHandlerContext = {
                    docxClient: this.docxClient,
                    options: this.options,
                };
                return await tool.handler(request.params.arguments ?? {}, context);
            } catch (error) {
                if (error instanceof McpError) {
                    throw error;
                }
                return handleError(error, tool.description);
            }
        });
    }

    async connect(transport: Transport) {
        await this.server.connect(transport);
        try {
            Logger.log = (...args: unknown[]) => {
                this.server.server.sendLoggingMessage({ level: 'info', data: args });
            };

            Logger.error = (...args: unknown[]) => {
                this.server.server.sendLoggingMessage({ level: 'error', data: args });
            };
        } catch (error) {
            return handleError(error, 'Logger initialization failed');
        }
    }

    async startHttpServer(port?: number): Promise<void> {
        const app = express();
        app.get('/__mcp/sse', async (_req: Request, res: Response) => {
            try {
                console.log('New SSE connection established');
                const sseTransport = new SSEServerTransport('/__mcp/messages', res);
                this.sseTransports.set(sseTransport.sessionId, sseTransport);
                res.on('close', () => {
                    this.sseTransports.delete(sseTransport.sessionId);
                });
                await this.server.connect(sseTransport);
            } catch (error) {
                console.error('SSE connection error:', error);
                res.status(500).end();
            }
        });

        app.post('/__mcp/messages', async (req: Request, res: Response) => {
            try {
                const query = new URLSearchParams(req.url?.split('?').pop() || '');
                const clientId = query.get('sessionId');
                if (!clientId) {
                    res.sendStatus(400);
                    return;
                }
                const transport = this.sseTransports.get(clientId);
                if (!transport) {
                    res.sendStatus(400);
                    return;
                }
                await transport.handlePostMessage(req, res);
            } catch (error) {
                console.error('Message handling error:', error);
                res.status(500).end();
            }
        });

        Logger.log = console.log;
        Logger.error = console.error;
        const finalPort = port || this.options.port;

        app.listen(finalPort, () => {
            Logger.log(`HTTP server listening on port ${finalPort}`);
            Logger.log(`SSE endpoint available at http://localhost:${finalPort}/sse`);
            Logger.log(`Message endpoint available at http://localhost:${finalPort}/messages`);
        });
    }
}
