import { describe, it, expect, beforeEach } from 'vitest';
import { joinTimestamp, joinEnvToUrl, joinCookieToUrl, dealToken } from '../axios/helper';
import { js_create_local_storage } from '@quantum-design/utils/extra';

describe('helper.ts', () => {
    describe('joinTimestamp', () => {
        it('应该在 join 为 false 时返回空字符串或空对象', () => {
            expect(joinTimestamp(false, true)).toBe('');
            expect(joinTimestamp(false, false)).toEqual({});
        });

        it('应该在 restful 模式下返回时间戳字符串', () => {
            const result = joinTimestamp(true, true);
            expect(result).toMatch(/^t=\d+$/);
        });

        it('应该在非 restful 模式下返回时间戳对象', () => {
            const result = joinTimestamp(true, false);
            expect(result).toHaveProperty('t');
            expect(typeof (result as any).t).toBe('string');
        });

        it('应该返回当前时间戳', () => {
            const beforeTime = Date.now();
            const result = joinTimestamp(true, false) as any;
            const afterTime = Date.now();

            const timestamp = parseInt(result.t);
            expect(timestamp).toBeGreaterThanOrEqual(beforeTime);
            expect(timestamp).toBeLessThanOrEqual(afterTime);
        });
    });

    describe('joinEnvToUrl', () => {
        it('应该在 env 不是函数时返回空字符串或空对象', () => {
            expect(joinEnvToUrl(null as any, true)).toBe('');
            expect(joinEnvToUrl(undefined as any, false)).toEqual({});
        });

        it('应该在 restful 模式下返回环境变量字符串', () => {
            const envFn = () => 'production';
            const result = joinEnvToUrl(envFn, true);
            expect(result).toBe('env=production');
        });

        it('应该在非 restful 模式下返回环境变量对象', () => {
            const envFn = () => 'development';
            const result = joinEnvToUrl(envFn, false);
            expect(result).toEqual({ env: 'development' });
        });

        it('应该正确处理不同的环境值', () => {
            const environments = ['dev', 'test', 'staging', 'production'];

            environments.forEach((env) => {
                const envFn = () => env;
                const restfulResult = joinEnvToUrl(envFn, true);
                const objectResult = joinEnvToUrl(envFn, false);

                expect(restfulResult).toBe(`env=${env}`);
                expect(objectResult).toEqual({ env });
            });
        });

        it('应该处理返回空字符串的环境函数', () => {
            const envFn = () => '';
            expect(joinEnvToUrl(envFn, true)).toBe('env=');
            expect(joinEnvToUrl(envFn, false)).toEqual({ env: '' });
        });
    });

    describe('joinCookieToUrl', () => {
        beforeEach(() => {
            // 清理全局对象
            if (globalThis.document) {
                Object.defineProperty(globalThis.document, 'cookie', {
                    writable: true,
                    value: '',
                });
            }
        });

        it('应该在 join 为 false 时返回空字符串或空对象', () => {
            expect(joinCookieToUrl(false, true)).toBe('');
            expect(joinCookieToUrl(false, false)).toEqual({});
        });

        it('应该在 restful 模式下返回 cookie 字符串', () => {
            // 模拟 document.cookie
            if (globalThis.document) {
                Object.defineProperty(globalThis.document, 'cookie', {
                    writable: true,
                    value: 'qm_csrf_backend=test_token; other=value',
                });
            }

            const result = joinCookieToUrl(true, true);
            expect(result).toBe('qm_csrf_backend=test_token');
        });

        it('应该在非 restful 模式下返回 cookie 对象', () => {
            if (globalThis.document) {
                Object.defineProperty(globalThis.document, 'cookie', {
                    writable: true,
                    value: 'qm_csrf_backend=test_token; other=value',
                });
            }

            const result = joinCookieToUrl(true, false);
            expect(result).toEqual({ qm_csrf_backend: 'test_token' });
        });

        it('应该处理多个 cookie', () => {
            if (globalThis.document) {
                Object.defineProperty(globalThis.document, 'cookie', {
                    writable: true,
                    value: 'qm_csrf_backend=token123; session_id=abc; user=john',
                });
            }

            const result = joinCookieToUrl(true, false);
            expect(result).toEqual({ qm_csrf_backend: 'token123' });
        });

        it('应该处理没有 qm_csrf_backend 的情况', () => {
            if (globalThis.document) {
                Object.defineProperty(globalThis.document, 'cookie', {
                    writable: true,
                    value: 'other=value; session=123',
                });
            }

            const result = joinCookieToUrl(true, false);
            expect(result).toEqual({ qm_csrf_backend: undefined });
        });

        it('应该处理空 cookie', () => {
            if (globalThis.document) {
                Object.defineProperty(globalThis.document, 'cookie', {
                    writable: true,
                    value: '',
                });
            }

            const result = joinCookieToUrl(true, false);
            expect(result).toEqual({ qm_csrf_backend: undefined });
        });
    });

    describe('dealToken', () => {
        it('应该返回包含 setTokenToHeader 和 setTokenToLs 的对象', () => {
            const { setTokenToHeader, setTokenToLs } = dealToken();
            expect(typeof setTokenToHeader).toBe('function');
            expect(typeof setTokenToLs).toBe('function');
        });

        describe('setTokenToHeader', () => {
            it('应该在 withToken 为 false 时不添加 token', () => {
                const { setTokenToHeader } = dealToken();
                const options = {
                    requestOptions: {
                        withToken: false,
                    },
                };
                const config = {
                    headers: {},
                };

                const result = setTokenToHeader(options as any, config as any);
                expect(result.headers).toEqual({});
            });

            it('应该在没有 token 时不添加 header', () => {
                const { setTokenToHeader } = dealToken();
                const options = {
                    requestOptions: {
                        withToken: true,
                    },
                };
                const config = {
                    headers: {},
                };

                const result = setTokenToHeader(options as any, config as any);
                expect(result.headers).toEqual({});
            });

            it('应该在存在 headers 时添加 token', () => {
                const { setTokenToHeader } = dealToken();

                // 模拟 localStorage
                const mockToken = { 'x-qm-devops-token': 'test_token_123' };
                if (typeof localStorage !== 'undefined') {
                    js_create_local_storage().set('qm_token', mockToken);
                }

                const options = {
                    requestOptions: {
                        withToken: true,
                    },
                };
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                };

                const result = setTokenToHeader(options as any, config as any);
                expect(result.headers['x-qm-devops-token']).toBeDefined();
            });
        });

        describe('setTokenToLs', () => {
            it('应该在 join 为 false 时不设置 token', () => {
                const { setTokenToLs } = dealToken();
                const response = {
                    headers: {
                        'x-qm-devops-token': 'new_token',
                    },
                } as any;

                // 不应该抛出错误
                expect(() => setTokenToLs(false, response)).not.toThrow();
            });

            it('应该在响应包含 token 时保存到 localStorage', () => {
                const { setTokenToLs } = dealToken();
                const response = {
                    headers: {
                        'x-qm-devops-token': 'new_token_456',
                    },
                } as any;

                if (typeof localStorage !== 'undefined') {
                    setTokenToLs(true, response);
                    const saved = js_create_local_storage().get('qm_token');
                    expect(saved['x-qm-devops-token']).toBe('new_token_456');
                }
            });

            it('应该在响应不包含 token 时不报错', () => {
                const { setTokenToLs } = dealToken();
                const response = {
                    headers: {},
                } as any;

                expect(() => setTokenToLs(true, response)).not.toThrow();
            });
        });
    });
});
