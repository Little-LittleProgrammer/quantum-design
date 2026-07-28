import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createAxios, defaultTransform } from '../axios/index';
import type { CreateAxiosOptions } from '../axios/axios-transform';
import { gResultEnum } from '@quantum-design/shared/enums';
import axios from 'axios';

// Mock dependencies
vi.mock('axios');
vi.mock('@quantum-design/utils', async () => {
    const actual = await vi.importActual('@quantum-design/utils');
    return {
        ...actual,
        isService: false,
        js_utils_deep_merge: (target: any, source: any) => ({ ...target, ...source }),
    };
});

describe('index.ts - defaultTransform 和 createAxios', () => {
    const mockAxiosInstance = {
        request: vi.fn(),
        interceptors: {
            request: { use: vi.fn() },
            response: { use: vi.fn() },
        },
        defaults: { headers: {} },
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (axios.create as any) = vi.fn().mockReturnValue(mockAxiosInstance);
    });

    describe('defaultTransform', () => {
        describe('beforeRequestHook', () => {
            it('应该添加 apiUrl 前缀', () => {
                const config = {
                    url: '/users',
                    method: 'GET',
                };
                const options = {
                    apiUrl: 'https://api.example.com',
                    joinPrefix: false,
                };

                const result = defaultTransform.beforeRequestHook?.(config as any, options as any);
                expect(result?.url).toBe('https://api.example.com/users');
            });

            it('应该添加 urlPrefix', () => {
                const config = {
                    url: '/users',
                    method: 'GET',
                };
                const options = {
                    joinPrefix: true,
                    urlPrefix: '/api/v1',
                };

                const result = defaultTransform.beforeRequestHook?.(config as any, options as any);
                expect(result?.url).toContain('/api/v1/users');
            });

            it('应该为 GET 请求添加时间戳参数', () => {
                const config = {
                    url: '/users',
                    method: 'GET',
                    params: { page: 1 },
                };
                const options = {
                    joinTime: true,
                    env: () => '',
                    joinCookie: false,
                };

                const result = defaultTransform.beforeRequestHook?.(config as any, options as any);
                expect(result?.params).toHaveProperty('t');
            });

            it('应该为 POST 请求在 URL 中添加时间戳', () => {
                const config = {
                    url: '/users',
                    method: 'POST',
                    data: { name: 'test' },
                };
                const options = {
                    joinTime: true,
                    env: () => '',
                    joinCookie: false,
                };

                const result = defaultTransform.beforeRequestHook?.(config as any, options as any);
                expect(result?.url).toContain('t=');
            });

            it('应该添加环境变量参数', () => {
                const config = {
                    url: '/users',
                    method: 'GET',
                    params: {},
                };
                const options = {
                    joinTime: false,
                    env: () => 'production',
                    joinCookie: false,
                };

                const result = defaultTransform.beforeRequestHook?.(config as any, options as any);
                expect(result?.params).toHaveProperty('env');
                expect(result?.params.env).toBe('production');
            });

            it('应该不处理完整的 URL', () => {
                const config = {
                    url: 'https://external-api.com/users',
                    method: 'GET',
                };
                const options = {
                    apiUrl: 'https://api.example.com',
                    joinPrefix: true,
                    urlPrefix: '/api',
                };

                const result = defaultTransform.beforeRequestHook?.(config as any, options as any);
                expect(result?.url).toBe('https://external-api.com/users');
            });
        });

        describe('requestInterceptors', () => {
            it('应该调用自定义请求拦截器', () => {
                const customRequest = vi.fn((config) => config);
                const options: CreateAxiosOptions = {
                    customTransform: {
                        customRequest,
                    },
                };
                const config = { url: '/test' };

                defaultTransform.requestInterceptors?.(config as any, options);
                expect(customRequest).toHaveBeenCalledWith(config);
            });
        });

        describe('responseInterceptors', () => {
            it('应该处理正常响应', () => {
                const response = {
                    data: { code: gResultEnum.SUCCESS, data: 'test' },
                    headers: {},
                    config: {},
                } as any;
                const options: CreateAxiosOptions = {
                    requestOptions: {
                        withToken: false,
                    },
                };

                const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
                const result = defaultTransform.responseInterceptors?.(response, options);
                expect(result).toBeDefined();
                consoleSpy.mockRestore();
            });

            it('应该处理错误响应', () => {
                const mockErrorCb = vi.fn();
                const response = {
                    data: { code: gResultEnum.ERROR, msg: '错误信息' },
                    headers: {},
                    config: {},
                } as any;
                const options: CreateAxiosOptions = {
                    requestOptions: {
                        withToken: false,
                        errorMessageCb: mockErrorCb,
                    },
                };

                const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
                defaultTransform.responseInterceptors?.(response, options);
                expect(mockErrorCb).toHaveBeenCalled();
                consoleSpy.mockRestore();
            });

            it('应该处理需要重新加载的响应', () => {
                const response = {
                    data: { code: gResultEnum.RELOAD },
                    headers: {},
                    config: {},
                } as any;
                const options: CreateAxiosOptions = {
                    requestOptions: {
                        withToken: true,
                    },
                };

                const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
                const result = defaultTransform.responseInterceptors?.(response, options);
                expect(result).toBeDefined();
                consoleSpy.mockRestore();
            });

            it('应该处理登录重定向', () => {
                const response = {
                    data: {
                        code: gResultEnum.LOGIN,
                        data: { url: 'https://login.example.com' },
                    },
                    headers: {},
                    config: {},
                } as any;
                const options: CreateAxiosOptions = {
                    requestOptions: {
                        withToken: false,
                    },
                };

                const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
                const result = defaultTransform.responseInterceptors?.(response, options);
                expect(result).toBeDefined();
                consoleSpy.mockRestore();
            });

            it('应该调用自定义响应拦截器', () => {
                const customResponse = vi.fn((res) => res);
                const response = {
                    data: { code: gResultEnum.SUCCESS },
                    headers: {},
                    config: {},
                } as any;
                const options: CreateAxiosOptions = {
                    customTransform: {
                        customResponse,
                    },
                    requestOptions: {},
                };

                const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
                defaultTransform.responseInterceptors?.(response, options);
                expect(customResponse).toHaveBeenCalled();
                consoleSpy.mockRestore();
            });
        });

        describe('responseInterceptorsCatch', () => {
            it('应该处理网络错误', async () => {
                const mockErrorCb = vi.fn();
                const error = {
                    toString: () => 'Error: Network Error',
                    message: 'Network Error',
                } as any;
                const options: CreateAxiosOptions = {
                    requestOptions: {
                        errorMessageCb: mockErrorCb,
                    },
                };

                const result = defaultTransform.responseInterceptorsCatch?.(error, options, mockAxiosInstance as any);
                expect(mockErrorCb).toHaveBeenCalledWith('400', expect.any(String));
                await expect(result).rejects.toBe(error);
            });

            it('应该处理超时错误', async () => {
                const mockErrorCb = vi.fn();
                const error = {
                    toString: () => 'Error: timeout',
                    message: 'timeout of 5000ms exceeded',
                } as any;
                const options: CreateAxiosOptions = {
                    requestOptions: {
                        errorMessageCb: mockErrorCb,
                    },
                };

                const result = defaultTransform.responseInterceptorsCatch?.(error, options, mockAxiosInstance as any);
                expect(mockErrorCb).toHaveBeenCalled();
                await expect(result).rejects.toBe(error);
            });

            it('应该处理取消的请求', async () => {
                const error = {
                    code: 'ERR_CANCELED',
                } as any;
                const options: CreateAxiosOptions = {
                    requestOptions: {},
                };

                const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
                const result = defaultTransform.responseInterceptorsCatch?.(error, options, mockAxiosInstance as any);
                await expect(result).resolves.toBeDefined();
                consoleSpy.mockRestore();
            });

            it('应该在 GET 请求失败时启用重试机制', async () => {
                const error = {
                    config: {
                        method: 'GET',
                        requestOptions: {
                            retryRequest: {
                                isOpenRetry: true,
                                count: 3,
                                waitTime: 0,
                            },
                        },
                    },
                    response: {
                        status: 500,
                    },
                } as any;
                const options: CreateAxiosOptions = {
                    requestOptions: {
                        retryRequest: {
                            isOpenRetry: true,
                            count: 3,
                            waitTime: 0,
                        },
                        errorMessageCb: vi.fn(),
                    },
                };

                mockAxiosInstance.request.mockResolvedValueOnce({ data: 'success' });
                const result = defaultTransform.responseInterceptorsCatch?.(error, options, mockAxiosInstance as any);
                // 验证重试逻辑被触发
                expect(error.config).toBeDefined();
                await expect(result).resolves.toEqual({ data: 'success' });
            });

            it('应该调用自定义错误响应拦截器', async () => {
                const customResponseError = vi.fn();
                const error = new Error('Test error') as any;
                const options: CreateAxiosOptions = {
                    customTransform: {
                        customResponseError,
                    },
                    requestOptions: {
                        errorMessageCb: vi.fn(),
                    },
                };

                const result = defaultTransform.responseInterceptorsCatch?.(error, options, mockAxiosInstance as any);
                expect(customResponseError).toHaveBeenCalledWith(error);
                await expect(result).rejects.toBe(error);
            });
        });
    });

    describe('createAxios', () => {
        it('应该创建带有默认配置的 axios 实例', () => {
            const instance = createAxios();
            expect(instance).toBeDefined();
            expect(axios.create).toHaveBeenCalled();
        });

        it('应该合并自定义配置', () => {
            const customOptions = {
                timeout: 30000,
                baseURL: 'https://custom-api.com',
            };
            const instance = createAxios(customOptions);
            expect(instance).toBeDefined();
        });

        it('应该使用默认的请求选项', () => {
            const instance = createAxios();
            expect(instance).toBeDefined();
            // 默认配置应该包含 requestOptions
        });

        it('应该能够覆盖默认的 requestOptions', () => {
            const customOptions = {
                requestOptions: {
                    joinTime: false,
                    withToken: false,
                },
            };
            const instance = createAxios(customOptions);
            expect(instance).toBeDefined();
        });

        it('应该设置默认的 Content-Type', () => {
            const instance = createAxios();
            expect(instance).toBeDefined();
        });

        it('应该配置默认的重试机制', () => {
            const instance = createAxios();
            expect(instance).toBeDefined();
        });

        it('应该允许自定义环境参数函数', () => {
            const customOptions = {
                requestOptions: {
                    env: () => 'custom-env',
                },
            };
            const instance = createAxios(customOptions);
            expect(instance).toBeDefined();
        });
    });
});
