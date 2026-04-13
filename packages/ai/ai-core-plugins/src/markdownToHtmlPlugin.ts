import { EventType } from '@quantum-design/ai-core';
import MarkdownIt from 'markdown-it';

import type { AgUiEvent, AguiPlugin } from '@quantum-design/ai-core';

const MARKDOWN_HTML_FIELD = 'markdownHtml';
const MARKDOWN_BLOCK_FIELD = 'markdownBlock';

export interface MarkdownBaseBlock {
    type: 'text' | 'codeBlock';
    subtype: string;
    htmlContent: string;
    rawContent: string;
    stageType: AgUiEvent['type'];
}

function parseMarkdownBlocks(markdownText: string, md: MarkdownIt, event: AgUiEvent): MarkdownBaseBlock[] {
    const fullCodeBlockPattern = /```([^\n`]*)\n([\s\S]*?)```/g;
    const partialCodeBlockPattern = /```([^\n`]*)\n[\s\S]*$/;
    const blocks: MarkdownBaseBlock[] = [];
    let previousIndex = 0;
    let match = fullCodeBlockPattern.exec(markdownText);

    while (match) {
        const matchStart = match.index;
        const fullRaw = match[0];
        const language = (match[1] ?? '').trim();

        if (matchStart > previousIndex) {
            const textRaw = markdownText.slice(previousIndex, matchStart);
            if (textRaw) {
                blocks.push({
                    type: 'text',
                    subtype: '',
                    rawContent: textRaw,
                    htmlContent: md.render(textRaw),
                    stageType: event.type,
                });
            }
        }

        blocks.push({
            type: 'codeBlock',
            subtype: language,
            rawContent: fullRaw,
            htmlContent: md.render(fullRaw),
            stageType: event.type,
        });

        previousIndex = matchStart + fullRaw.length;
        match = fullCodeBlockPattern.exec(markdownText);
    }

    if (previousIndex < markdownText.length) {
        const trailingText = markdownText.slice(previousIndex);
        const partialMatch = partialCodeBlockPattern.exec(trailingText);
        if (partialMatch) {
            const partialStart = partialMatch.index;
            const partialLanguage = (partialMatch[1] ?? '').trim();
            const leadingText = trailingText.slice(0, partialStart);
            const partialRaw = trailingText.slice(partialStart);

            if (leadingText) {
                blocks.push({
                    type: 'text',
                    subtype: '',
                    rawContent: leadingText,
                    htmlContent: md.render(leadingText),
                    stageType: event.type,
                });
            }

            blocks.push({
                stageType: event.type,
                type: 'codeBlock',
                subtype: partialLanguage,
                rawContent: partialRaw,
                htmlContent: md.render(partialRaw),
            });
        } else if (trailingText) {
            blocks.push({
                type: 'text',
                subtype: '',
                rawContent: trailingText,
                htmlContent: md.render(trailingText),
                stageType: event.type,
            });
        }
    }

    return blocks;
}

export interface MarkdownToHtmlPluginOptions {
    mode: ('html' | 'block')[];
}

/**
 * Non-invasive markdown plugin:
 * - never mutates original delta/content fields
 * - adds "current accumulated markdown to html" to every event
 */
export function createMarkdownToHtmlPlugin(options: MarkdownToHtmlPluginOptions): AguiPlugin {
    const md = new MarkdownIt({
        html: false,
        linkify: true,
        breaks: true,
    });
    const htmlFieldName = MARKDOWN_HTML_FIELD;
    const blockFieldName = MARKDOWN_BLOCK_FIELD;
    const modes = options.mode ?? [];
    let textBuffer = '';
    let currentHtml = '';
    let currentMarkdownBlock: MarkdownBaseBlock[] = [];

    const attachHtml = (event: AgUiEvent): AgUiEvent => {
        return {
            ...event,
            [htmlFieldName]: currentHtml,
            [blockFieldName]: currentMarkdownBlock,
        };
    };

    return {
        name: 'built-in:markdown-to-html',
        transformStream(event: AgUiEvent) {
            if (event.type === EventType.TEXT_MESSAGE_CONTENT) {
                textBuffer += String(event.delta ?? '');
                currentHtml = modes.includes('html') ? md.render(textBuffer) : '';
                // currentMarkdownBlock = md.parse(textBuffer);
                currentMarkdownBlock = modes.includes('block') ? parseMarkdownBlocks(textBuffer, md, event) : [];
            } else if (event.type === EventType.RUN_STARTED) {
                textBuffer = '';
                currentHtml = '';
                currentMarkdownBlock = [];
            }

            return attachHtml(event);
        },
    };
}
