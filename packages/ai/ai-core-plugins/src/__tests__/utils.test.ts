import { describe, expect, it } from 'vitest';
import { codeBlockParse } from '../utils';

describe('codeBlockParse', () => {
    it('should parse code block', () => {
        const result = codeBlockParse('```json\n{"name": "John"}\n```');
        expect(result).toEqual({
            status: 'success',
            language: 'json',
            content: { name: 'John' },
        });
    });
    it('should parse code block with execute function', () => {
        const result = codeBlockParse('```json\n{"name": "John"}\n```', (language, content, match) => {
            if (language === 'json') {
                return JSON.parse(content);
            }
            return content;
        });
        expect(result).toEqual({
            status: 'success',
            language: 'json',
            content: { name: 'John' },
        });
    });
    it('should parse code block with execute function null', () => {
        const result = codeBlockParse('```json\n{"name": "John"}\n```', () => null);
        expect(result).toEqual({
            status: 'success',
            language: 'json',
            content: { name: 'John' },
        });
    });
    it('should parse code block with execute function error', () => {
        const result = codeBlockParse('```json\n{"name": "John"}\n');
        expect(result).toEqual({
            status: 'parseing',
            language: null,
            content: '```json\n{"name": "John"}\n',
        });
    });
    it('custum parse subtype', () => {
        const result = codeBlockParse('```custom\njajsfdhgfjasdnfksdanfajksdnfajksdnf\n```', (language, content, match) => {
            if (language === 'custom') {
                return '啦啦啦啦啦啦啦';
            }
            return null;
        });
        expect(result).toEqual({
            status: 'success',
            language: 'custom',
            content: '啦啦啦啦啦啦啦',
        });
    });
});
