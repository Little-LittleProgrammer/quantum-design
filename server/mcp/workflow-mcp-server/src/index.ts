#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { config } from 'dotenv';

import { createServer } from './server';
import { resolve } from 'path';

// 读取前加载.env文件
config({ path: resolve(process.cwd(), '.env'), });

async function main() {
    const server: McpServer = createServer();
    const transport = new StdioServerTransport();
    await server.connect(transport);
}

main().catch((error) => {
    console.error('Fatal error in main():', error);
    process.exit(1);
});
