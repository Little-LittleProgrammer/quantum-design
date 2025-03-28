import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { DocxClient, getParams, getGlobalOptions, setGlobalOptions, CodeupClient } from 'qm-workflow';
import { formatErrorMessage, Logger } from './utils/tools';
/**
 * 统一的响应格式
 */
// interface McpResponse {
//     content: Array<{
//         type: 'text';
//         text: string;
//     }>;
// }

/**
 * 创建 MCP 服务器实例
 * @returns {McpServer} MCP 服务器实例
 */
export function createServer(): McpServer {
    const params = getParams();
    setGlobalOptions(params);
    const options = getGlobalOptions();

    // 验证飞书配置
    if (!options.feishuConfig?.appId || !options.feishuConfig?.appSecret || !options.feishuConfig?.spaceName) {
        throw new Error('飞书配置不完整，请检查 appId、appSecret 和 spaceName');
    }

    const docxClient = new DocxClient({
        appId: options.feishuConfig.appId,
        appSecret: options.feishuConfig.appSecret,
        spaceName: options.feishuConfig.spaceName,
        appUserToken: options.feishuConfig.appUserToken
    });

    const server = new McpServer({
        name: 'qm-workflow-mcp-server',
        version: '0.0.1'
    });

    /**
     * 统一的错误处理函数
     */
    const handleError = (error: unknown, operation: string): any => {
        Logger.error(`${operation}失败:`, error);
        const errorMessage = formatErrorMessage(error);
        return {
            content: [{ type: 'text' as const, text: `${operation}失败: ${errorMessage}` }]
        };
    };

    server.tool(
        'get_feishu_doc',
        'Get the Feishu document based on the url in markdown format',
        {
            url: z.string().describe('Feishu document url')
        },
        async({ url }) => {
            try {
                await docxClient.getWikiBase();
                const res = await docxClient.getWikiDocs(url);
                return {
                    content: [{ type: 'text' as const, text: res }]
                };
            } catch (error) {
                return handleError(error, `获取飞书文档信息,当前知识库${options.feishuConfig.spaceName}}`);
            }
        }
    );

    server.tool(
        'create_feishu_doc',
        'Create a Feishu document',
        {
            markdown: z.string().describe('Feishu document context in markdown format'),
            parent_node: z.string().describe('The folder where the created Feishu document belongs, the url splits the last item by /')
        },
        async({ markdown, parent_node }) => {
            try {
                await docxClient.getWikiBase();
                let token = parent_node;
                if (parent_node.includes('http')) {
                    const infoArr = parent_node.split('?')[0]?.split('/') || [];
                    token = infoArr.pop() || '';
                }
                const res = await docxClient.createWikiDocsMarkdown(markdown, token);
                return {
                    content: [{ type: 'text' as const, text: 'ok' }]
                };
            } catch (error) {
                return handleError(error, '创建飞书文档');
            }
        }
    );

    server.tool(
        'create_merge_request',
        'Use cur branch to create a merge request to target branch',
        {
            sourceBranch: z.string().describe('current branch'),
            description: z.string().describe('Merge request description,  if user input empty, use ai to generate， according to the diff with master，')
        },
        async({ sourceBranch, description }) => {
            try {
                const codeupInstance = new CodeupClient(options.aliConfig, {
                    sourceBranch: sourceBranch
                });
                await codeupInstance.getRepoInfo();
                const mrInfo = await codeupInstance.getMergeRequest();
                if (mrInfo) {
                    return {
                        content: [{ type: 'text' as const, text: '当前 mr 已存在，无需创建' }]
                    };
                }
                const res = await codeupInstance.createMergeRequest(sourceBranch, description);
                if (res.code === 200) {
                    return {
                        content: [{ type: 'text' as const, text: 'ok' }]
                    };
                } else {
                    return {
                        content: [{ type: 'text' as const, text: sourceBranch + codeupInstance.targetBranch + JSON.stringify(res) }]
                    };
                }
            } catch (error) {
                return handleError(error, '创建 mr');
            }
        }
    );
    return server;
}
