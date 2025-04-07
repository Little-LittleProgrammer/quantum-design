#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { config } from 'dotenv';
import { getParams, getGlobalOptions, setGlobalOptions } from 'qm-workflow';

import { FeishuMcpServer } from './server';
import { resolve } from 'path';

// 读取前加载.env文件
config({ path: resolve(process.cwd(), '.env') });

async function main() {
    try {
        const isStdioMode = process.argv.includes('--stdio');

        const params = getParams();
        if (!params) {
            throw new Error('Failed to get parameters');
        }

        setGlobalOptions(params);
        const options = getGlobalOptions();
        if (!options) {
            throw new Error('Failed to get global options');
        }

        const server = new FeishuMcpServer(options);

        if (isStdioMode) {
            const transport = new StdioServerTransport();
            await server.connect(transport);
        } else {
            await server.startHttpServer();
        }
    } catch (error) {
        console.error('Server initialization error:', error);
        throw error;
    }
}

main().catch((error) => {
    console.error('Fatal error in main():', error);
    process.exit(1);
});

