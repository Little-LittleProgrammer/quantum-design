
import { describe, it, expect } from 'vitest';
import { stringToBoolean, parseSchemas, serializeToString } from '../src/parse';

describe('parse.ts', () => {
    describe('stringToBoolean', () => {
        it('应该正确转换字符串为布尔值', () => {
            expect(stringToBoolean('true')).toBe(true);
            expect(stringToBoolean('True')).toBe(true);
            expect(stringToBoolean('TRUE')).toBe(true);
            expect(stringToBoolean('  true  ')).toBe(true);

            expect(stringToBoolean('false')).toBe(false);
            expect(stringToBoolean('False')).toBe(false);
            expect(stringToBoolean('FALSE')).toBe(false);
            expect(stringToBoolean('  false  ')).toBe(false);
        });

        it('应该保持非布尔值字符串不变', () => {
            expect(stringToBoolean('hello')).toBe('hello');
            expect(stringToBoolean('1')).toBe('1');
            expect(stringToBoolean('0')).toBe('0');
            expect(stringToBoolean('')).toBe('');
        });

        it('应该处理非字符串输入', () => {
            expect(stringToBoolean(123 as any)).toBe(123);
            expect(stringToBoolean(null as any)).toBe(null);
            expect(stringToBoolean(undefined as any)).toBe(undefined);
            expect(stringToBoolean({} as any)).toEqual({});
        });
    });

    describe('parseSchemas', () => {
        it('应该解析对象字符串', () => {
            const objStr = '{ name: "test", age: 25 }';
            const result = parseSchemas(objStr);
            expect(result).toEqual({ name: 'test', age: 25 });
        });

        it('应该处理对象输入', () => {
            const obj = { name: 'test', age: 25 };
            const result = parseSchemas(obj);
            expect(result).toEqual(obj);
            expect(result).not.toBe(obj); // 应该是深拷贝
        });

        it('应该转换字符串布尔值', () => {
            const obj = { isActive: 'true', isDisabled: 'false', name: 'test' };
            const result = parseSchemas(obj);
            expect(result).toEqual({ isActive: true, isDisabled: false, name: 'test' });
        });

        it('应该处理嵌套对象', () => {
            const obj = {
                user: {
                    isActive: 'true',
                    profile: {
                        isPublic: 'false'
                    }
                }
            };
            const result = parseSchemas(obj);
            expect(result).toEqual({
                user: {
                    isActive: true,
                    profile: {
                        isPublic: false
                    }
                }
            });
        });

        it('应该处理数组', () => {
            const obj = {
                flags: ['true', 'false', 'hello'],
                nested: [{ active: 'true' }]
            };
            const result = parseSchemas(obj);
            expect(result).toEqual({
                flags: [true, false, 'hello'],
                nested: [{ active: true }]
            });
        });

        it('应该安全处理函数字符串', () => {
            const obj = {
                normalFunc: '() => { return 1; }',
                arrowFunc: 'x => x * 2',
                dangerousFunc: 'function() { require("fs"); }',
                regularString: 'not a function'
            };
            const result = parseSchemas(obj);

            // 正常函数字符串应该被解析（如果安全）
            expect(typeof result.normalFunc).toBe('function');
            expect(typeof result.arrowFunc).toBe('function');

            // 危险函数字符串应该保持为字符串
            expect(typeof result.dangerousFunc).toBe('string');
            expect(result.regularString).toBe('not a function');
        });

        it('应该处理循环引用', () => {
            const obj: any = { name: 'test' };
            obj.self = obj;

            const result = parseSchemas(obj);
            expect(result.name).toBe('test');
            expect(result.self).toBe(result); // 循环引用应该被保持
        });

        it('应该处理特殊对象类型', () => {
            const date = new Date('2023-01-01');
            const regex = /test/g;
            const obj = {
                date: date,
                regex: regex,
                func: () => 'hello'
            };

            const result = parseSchemas(obj);
            expect(result.date).toEqual(date);
            expect(result.regex).toEqual(regex);
            expect(typeof result.func).toBe('function');
        });

        it('应该抛出错误对于无效输入', () => {
            expect(() => parseSchemas(123 as any)).toThrow('schema 必须是字符串或对象类型');
        });

        it('应该处理格式错误的对象字符串', () => {
            expect(() => parseSchemas('{ invalid json }')).toThrow();
        });
    });

    describe('serializeToString', () => {
        it('应该序列化基本对象', () => {
            const obj = { name: 'test', age: 25, active: true };
            const result = serializeToString(obj);
            const parsed = JSON.parse(result);
            expect(parsed).toEqual(obj);
        });

        it('应该处理字符串输入', () => {
            const str = 'hello world';
            const result = serializeToString(str);
            expect(result).toBe(str);
        });

        it('应该序列化函数为字符串', () => {
            const obj = {
                name: 'test',
                handler: function() { return 'hello'; },
                arrow: () => 'world'
            };

            const result = serializeToString(obj);
            const parsed = JSON.parse(result);
            expect(parsed.name).toBe('test');
            expect(typeof parsed.handler).toBe('string');
            expect(parsed.handler).toContain('function');
            expect(typeof parsed.arrow).toBe('string');
        });

        it('应该序列化正则表达式', () => {
            const obj = {
                pattern: /test/gi,
                name: 'regex test'
            };

            const result = serializeToString(obj);
            const parsed = JSON.parse(result);
            expect(parsed.name).toBe('regex test');
            expect(parsed.pattern).toBe('/test/gi');
        });

        it('应该处理嵌套对象', () => {
            const obj = {
                user: {
                    name: 'test',
                    permissions: {
                        read: true,
                        write: false
                    }
                },
                settings: ['option1', 'option2']
            };

            const result = serializeToString(obj);
            const parsed = JSON.parse(result);
            expect(parsed).toEqual(obj);
        });

        it('应该抛出错误对于循环引用', () => {
            const obj: any = { name: 'test' };
            obj.self = obj;

            expect(() => serializeToString(obj)).toThrow('序列化失败');
        });

        it('应该处理数组', () => {
            const arr = [1, 'test', true, { nested: 'value' }];
            const result = serializeToString(arr);
            const parsed = JSON.parse(result);
            expect(parsed).toEqual(arr);
        });

        it('应该处理特殊值', () => {
            const obj = {
                nullValue: null,
                undefinedValue: undefined,
                zeroValue: 0,
                emptyString: '',
                emptyArray: [],
                emptyObject: {}
            };

            const result = serializeToString(obj);
            const parsed = JSON.parse(result);
            expect(parsed.nullValue).toBe(null);
            expect(parsed.undefinedValue).toBe(undefined);
            expect(parsed.zeroValue).toBe(0);
            expect(parsed.emptyString).toBe('');
            expect(parsed.emptyArray).toEqual([]);
            expect(parsed.emptyObject).toEqual({});
        });

        it('应该处理Date对象', () => {
            const date = new Date('2023-01-01');
            const obj = { created: date };

            const result = serializeToString(obj);
            const parsed = JSON.parse(result);
            expect(new Date(parsed.created)).toEqual(date);
        });

        it('应该处理类实例', () => {
            class TestClass {
                name = 'test';
                getValue() { return 'value'; }
            }

            const instance = new TestClass();
            const result = serializeToString(instance);
            const parsed = JSON.parse(result);

            expect(parsed.name).toBe('test');
            expect(parsed.getValue).toBeUndefined(); // 方法在序列化时被忽略
        });
    });
});

