/**
 * 代码块解析结果
 */
export interface CodeBlockResult {
    status: 'finished' | 'error' | 'processing';
    /** 代码块语言标识 */
    language: string | null;
    /** 代码块内容 */
    content: string;
}

/**
 * 解析代码块字符串，提取语言标识和内容
 * @param blockString 包含代码块的字符串
 * @returns 解析结果对象，包含语言和内容
 * @example
 * const result = codeBlockParse('```typescript\nconst a = 1;\n```');
 * // result: { language: 'typescript', content: 'const a = 1;' }
 */
export function codeBlockParse(blockString: string, execute?: (language: string | null, content: string, match: RegExpExecArray | null) => any): CodeBlockResult {
    const reg = /```([^\n`]*)\n([\s\S]*?)```/g;
    const match = reg.exec(blockString);
    if (match) {
        const language = match[1]?.trim() || null;
        const content = match[2]?.trim() || '';
        const finExecute = (language: string | null, content: string, match: RegExpExecArray | null) => {
            let result = null;
            try {
                if (typeof execute === 'function') {
                    result = execute(language, content, match);
                }
                if (language === 'json') {
                    result = JSON.parse(content);
                }
            } catch (error) {
                result = null;
            } finally {
                return result;
            }
        };
        try {
            const result = finExecute(language, content, match);
            return {
                status: 'finished',
                language,
                content: result,
            };
        } catch (error) {
            return {
                status: 'error',
                language,
                content,
            };
        }
    }
    return {
        status: 'processing',
        language: null,
        content: blockString,
    };
}
