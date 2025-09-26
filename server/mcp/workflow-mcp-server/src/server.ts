import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { DocxClient, CodeupClient, AppStackClient } from 'qm-workflow';
import { formatErrorMessage, Logger } from './utils/tools';
import express, { Request, Response } from 'express';
import type { Transport } from '@modelcontextprotocol/sdk/shared/transport.js';
/**
 * 统一的响应格式
 */
// interface McpResponse {
//     content: Array<{
//         type: 'text';
//         text: string;
//     }>;
// }

function handleError(error: unknown, operation: string): any {
    Logger.error(`${operation}失败:`, error);
    const errorMessage = formatErrorMessage(error);
    return {
        content: [{ type: 'text' as const, text: `${operation}失败: ${errorMessage}` }],
    };
}

export class FeishuMcpServer {
    private readonly server: McpServer;
    private sseTransports: Map<string, SSEServerTransport> = new Map();
    private docxClient: DocxClient;
    private readonly options: any = null;
    constructor(options: any) {
        // 验证飞书配置
        if (!options.feishuConfig?.appId || !options.feishuConfig?.appSecret) {
            throw new Error('飞书配置不完整，请检查 appId、appSecret');
        }
        this.options = options;
        this.sseTransports = new Map<string, SSEServerTransport>();

        this.docxClient = new DocxClient({
            appId: options.feishuConfig.appId,
            appSecret: options.feishuConfig.appSecret,
            spaceName: options.feishuConfig.spaceName,
            appUserToken: options.feishuConfig.appUserToken,
        });

        this.server = new McpServer({
            name: 'qm-workflow-mcp-server',
            version: '0.0.1',
        });
        this.registerTools();
    }

    async registerTools() {
        this.server.tool(
            'get_feishu_doc',
            'Get the Feishu document based on the url in markdown format',
            {
                type: 'object',
                properties: {
                    url: {
                        type: 'string',
                        description: 'Feishu document url',
                    },
                },
                required: ['url'],
            },
            async ({ url }) => {
                try {
                    const res = await this.docxClient.getWikiDocs(url);
                    return {
                        content: [{ type: 'text' as const, text: res }],
                    };
                } catch (error) {
                    return handleError(error, '获取飞书文档信息');
                }
            },
        );

        this.server.tool(
            'create_feishu_doc',
            'Create a Feishu document',
            {
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
            },
            async ({ markdown, parent_node }) => {
                try {
                    await this.docxClient.getWikiBase();
                    let token = parent_node;
                    if (parent_node.includes('http')) {
                        const infoArr = parent_node.split('?')[0]?.split('/') || [];
                        token = infoArr.pop() || '';
                    }
                    const res = await this.docxClient.createWikiDocsMarkdown(markdown, token);
                    return {
                        content: [{ type: 'text' as const, text: JSON.stringify(res) }],
                    };
                } catch (error) {
                    return handleError(error, '创建飞书文档');
                }
            },
        );

        this.server.tool(
            'create_merge_request',
            'Use cur branch to create a merge request to target branch',
            {
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
            },
            async ({ sourceBranch, description }) => {
                try {
                    const codeupInstance = new CodeupClient(this.options.aliConfig, {
                        sourceBranch: sourceBranch,
                    });
                    await codeupInstance.getRepoInfo();
                    const mrInfo = await codeupInstance.getMergeRequest();
                    if (mrInfo) {
                        return {
                            content: [{ type: 'text' as const, text: '当前 mr 已存在，无需创建' }],
                        };
                    }
                    const res = await codeupInstance.createMergeRequest(sourceBranch, description);
                    if (res.code === 200) {
                        return {
                            content: [{ type: 'text' as const, text: 'ok' }],
                        };
                    } else {
                        return {
                            content: [{ type: 'text' as const, text: sourceBranch + codeupInstance.targetBranch + JSON.stringify(res) }],
                        };
                    }
                } catch (error) {
                    return handleError(error, '创建 mr');
                }
            },
        );

        this.server.tool(
            'development_project',
            'Deploy the project remotely',
            {
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
            },
            async ({ runEnv, project, branch }) => {
                try {
                    const appStackInstance = new AppStackClient(this.options.aliConfig);
                    await appStackInstance.getAppStack();
                    const res = appStackInstance.getWorkflows();
                    const needApps = res.filter((item) => item.name.includes(project));
                    const workflowList: { workflowSn: string; stageSn: string; stageName: string }[] = [];
                    needApps.forEach((workflow) => {
                        workflow.releaseStages.forEach((stage) => {
                            workflowList.push({
                                workflowSn: workflow.sn,
                                stageSn: stage.sn,
                                stageName: stage.name,
                            });
                        });
                    });
                    await appStackInstance.ExecuteAppStack(runEnv, workflowList, branch);
                    return {
                        content: [{ type: 'text' as const, text: 'ok' }],
                    };
                } catch (error) {
                    return handleError(error, '部署项目');
                }
            },
        );
    }

    async connect(transport: Transport) {
        await this.server.connect(transport);
        // 添加错误处理
        try {
            Logger.log = (...args: any[]) => {
                this.server.server.sendLoggingMessage({ level: 'info', data: args });
            };

            Logger.error = (...args: any[]) => {
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
