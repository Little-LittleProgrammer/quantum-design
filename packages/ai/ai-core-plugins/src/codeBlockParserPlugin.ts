import { EventType } from '@quantum-design/ai-core';

import type { AgUiEvent, AguiPlugin } from '@quantum-design/ai-core';

const CODE_BLOCK_DATA_FIELD = 'codeBlockData';

export interface CodeBlockHandler<T = unknown> {
    type: string;
    parse: (content: string) => T;
}

export interface CodeBlockParserPluginOptions {
    fieldName?: string;
    codeBlockHandlers: CodeBlockHandler[];
}

function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractLatestCodeBlockContent(text: string, type: string): string | undefined {
    const pattern = new RegExp(`\`\`\`${escapeRegExp(type)}\\s*\\n([\\s\\S]*?)\`\`\``, 'g');
    let latest: string | undefined;
    let match: RegExpExecArray | null = pattern.exec(text);
    while (match) {
        latest = match[1];
        match = pattern.exec(text);
    }
    return latest;
}

export function createCodeBlockParserPlugin(options: CodeBlockParserPluginOptions): AguiPlugin {
    const fieldName = options.fieldName ?? CODE_BLOCK_DATA_FIELD;

    let textBuffer = '';
    let parsedData: Record<string, unknown> = {};

    const attachParsedData = (event: AgUiEvent): AgUiEvent => ({
        ...event,
        [fieldName]: parsedData,
    });

    const refreshParsedData = () => {
        const next: Record<string, unknown> = {};
        for (const handler of options.codeBlockHandlers) {
            const raw = extractLatestCodeBlockContent(textBuffer, handler.type);
            if (raw == null) continue;
            try {
                next[handler.type] = handler.parse(raw);
            } catch {
                // Ignore invalid code block payload and keep stream alive.
            }
        }
        parsedData = next;
    };

    return {
        name: 'built-in:code-block-parser',
        transformStream(event) {
            if (event.type === EventType.RUN_STARTED) {
                textBuffer = '';
                parsedData = {};
            } else if (event.type === EventType.TEXT_MESSAGE_CONTENT) {
                textBuffer += String(event.delta ?? '');
                refreshParsedData();
            }

            return attachParsedData(event);
        },
    };
}
