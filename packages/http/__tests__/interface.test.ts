import { describe, it, expect } from 'vitest';
import type { RequestOptions, RetryRequest } from '../axios/interface';
import type { CreateAxiosOptions, AxiosResponseAgent, AxiosTransform, CustomAxiosTransform } from '../axios/axios-transform';

describe('interface.ts - 类型定义测试', () => {
    describe('requestOptions', () => {
        it('应该正确定义基本选项', () => {
            const options: RequestOptions = {
                isReturnNativeResponse: true,
                joinPrefix: true,
                apiUrl: 'https://api.example.com',
                urlPrefix: '/api/v1',
                joinTime: true,
                cancelToken: true,
                joinCookie: true,
                withToken: true,
                useServiceMsg: true,
                errorPage: '/error',
            };

            expect(options.isReturnNativeResponse).toBe(true);
            expect(options.joinPrefix).toBe(true);
            expect(options.apiUrl).toBe('https://api.example.com');
            expect(options.urlPrefix).toBe('/api/v1');
        });

        it('应该支持错误回调函数', () => {
            const errorCallback = (errCode: number, errMsg: string) => {
                console.log(`Error ${errCode}: ${errMsg}`);
            };

            const options: RequestOptions = {
                errorMessageCb: errorCallback,
            };

            expect(typeof options.errorMessageCb).toBe('function');
        });

        it('应该支持环境配置函数', () => {
            const envFn = () => 'production';

            const options: RequestOptions = {
                env: envFn,
            };

            expect(typeof options.env).toBe('function');
            expect(options.env?.()).toBe('production');
        });

        it('应该支持上传 URL 配置', () => {
            const options: RequestOptions = {
                uploadUrl: 'https://upload.example.com',
            };

            expect(options.uploadUrl).toBe('https://upload.example.com');
        });

        it('应该支持重试请求配置', () => {
            const retryConfig: RetryRequest = {
                isOpenRetry: true,
                count: 3,
                waitTime: 1000,
            };

            const options: RequestOptions = {
                retryRequest: retryConfig,
            };

            expect(options.retryRequest?.isOpenRetry).toBe(true);
            expect(options.retryRequest?.count).toBe(3);
            expect(options.retryRequest?.waitTime).toBe(1000);
        });

        it('应该支持自定义属性', () => {
            const options: RequestOptions = {
                customProp1: 'custom-value',
                customProp2: 123,
                customProp3: true,
            };

            expect(options.customProp1).toBe('custom-value');
            expect(options.customProp2).toBe(123);
            expect(options.customProp3).toBe(true);
        });
    });

    describe('retryRequest', () => {
        it('应该正确定义重试配置', () => {
            const retryConfig: RetryRequest = {
                isOpenRetry: true,
                count: 5,
                waitTime: 500,
            };

            expect(retryConfig.isOpenRetry).toBe(true);
            expect(retryConfig.count).toBe(5);
            expect(retryConfig.waitTime).toBe(500);
        });

        it('应该支持不同的重试次数', () => {
            const configs: RetryRequest[] = [
                { isOpenRetry: true, count: 1, waitTime: 100 },
                { isOpenRetry: true, count: 3, waitTime: 200 },
                { isOpenRetry: true, count: 5, waitTime: 500 },
            ];

            configs.forEach((config) => {
                expect(config.isOpenRetry).toBe(true);
                expect(config.count).toBeGreaterThan(0);
                expect(config.waitTime).toBeGreaterThan(0);
            });
        });

        it('应该支持禁用重试', () => {
            const retryConfig: RetryRequest = {
                isOpenRetry: false,
                count: 0,
                waitTime: 0,
            };

            expect(retryConfig.isOpenRetry).toBe(false);
        });
    });

    describe('createAxiosOptions', () => {
        it('应该扩展 AxiosRequestConfig', () => {
            const options: CreateAxiosOptions = {
                baseURL: 'https://api.example.com',
                timeout: 5000,
                headers: {
                    'Content-Type': 'application/json',
                },
                requestOptions: {
                    joinPrefix: true,
                },
            };

            expect(options.baseURL).toBe('https://api.example.com');
            expect(options.timeout).toBe(5000);
            expect(options.headers).toBeDefined();
        });

        it('应该支持认证方案', () => {
            const options: CreateAxiosOptions = {
                authenticationScheme: 'Bearer',
            };

            expect(options.authenticationScheme).toBe('Bearer');
        });

        it('应该支持自定义 transform', () => {
            const customTransform: CustomAxiosTransform = {
                customRequest: (config) => config,
                customResponse: (response) => response,
            };

            const options: CreateAxiosOptions = {
                customTransform,
            };

            expect(options.customTransform).toBeDefined();
            expect(typeof options.customTransform?.customRequest).toBe('function');
        });

        it('应该支持默认 transform', () => {
            const defaultTransform: AxiosTransform = {
                beforeRequestHook: (config, _options) => config,
                requestInterceptors: (config, _options) => config,
                responseInterceptors: (res, _options) => res,
            };

            const options: CreateAxiosOptions = {
                defaultTransform,
            };

            expect(options.defaultTransform).toBeDefined();
        });

        it('应该支持请求选项', () => {
            const requestOptions: RequestOptions = {
                joinPrefix: true,
                joinTime: true,
                withToken: true,
                cancelToken: true,
            };

            const options: CreateAxiosOptions = {
                requestOptions,
            };

            expect(options.requestOptions).toBeDefined();
            expect(options.requestOptions?.joinPrefix).toBe(true);
        });
    });

    describe('axiosResponseAgent', () => {
        it('应该扩展 AxiosResponse 并包含特定配置', () => {
            const response: AxiosResponseAgent = {
                data: { code: '0', message: 'success' },
                status: 200,
                statusText: 'OK',
                headers: {} as any,
                config: {
                    url: '/api/test',
                    headers: {} as any,
                } as any,
            };

            expect(response.data).toBeDefined();
            expect(response.status).toBe(200);
            expect(response.config.url).toBe('/api/test');
        });

        it('应该支持泛型数据类型', () => {
            interface UserData {
                id: number;
                name: string;
                email: string;
            }

            const response: AxiosResponseAgent<{ code: string; data: UserData }> = {
                data: {
                    code: '0',
                    data: {
                        id: 1,
                        name: 'Test User',
                        email: 'test@example.com',
                    },
                },
                status: 200,
                statusText: 'OK',
                headers: {} as any,
                config: {
                    url: '/api/users/1',
                    headers: {} as any,
                } as any,
            };

            expect(response.data.data.id).toBe(1);
            expect(response.data.data.name).toBe('Test User');
            expect(response.data.data.email).toBe('test@example.com');
        });
    });

    describe('customAxiosTransform', () => {
        it('应该支持自定义请求拦截器', () => {
            const customTransform: CustomAxiosTransform = {
                customRequest: (config) => {
                    config.headers = {
                        ...config.headers,
                        'X-Custom-Header': 'custom-value',
                    };
                    return config;
                },
            };

            expect(typeof customTransform.customRequest).toBe('function');
        });

        it('应该支持自定义响应拦截器', () => {
            const customTransform: CustomAxiosTransform = {
                customResponse: (response) => {
                    return response;
                },
            };

            expect(typeof customTransform.customResponse).toBe('function');
        });

        it('应该支持自定义错误处理', () => {
            const customTransform: CustomAxiosTransform = {
                customRequestError: (_error) => {
                    // Handle error
                },
                customResponseError: (_error) => {
                    // Handle error
                },
            };

            expect(typeof customTransform.customRequestError).toBe('function');
            expect(typeof customTransform.customResponseError).toBe('function');
        });

        it('应该支持完整的自定义拦截器配置', () => {
            const customTransform: CustomAxiosTransform = {
                customRequest: (config) => config,
                customResponse: (response) => response,
                customRequestError: (_error) => {
                    // Handle error
                },
                customResponseError: (_error) => {
                    // Handle error
                },
            };

            expect(customTransform.customRequest).toBeDefined();
            expect(customTransform.customResponse).toBeDefined();
            expect(customTransform.customRequestError).toBeDefined();
            expect(customTransform.customResponseError).toBeDefined();
        });
    });

    describe('axiosTransform', () => {
        it('应该支持请求前钩子', () => {
            const transform: AxiosTransform = {
                beforeRequestHook: (config, _options) => {
                    return config;
                },
            };

            expect(typeof transform.beforeRequestHook).toBe('function');
        });

        it('应该支持请求拦截器', () => {
            const transform: AxiosTransform = {
                requestInterceptors: (config, _options) => {
                    return config;
                },
            };

            expect(typeof transform.requestInterceptors).toBe('function');
        });

        it('应该支持响应拦截器', () => {
            const transform: AxiosTransform = {
                responseInterceptors: (res, _options) => {
                    return res;
                },
            };

            expect(typeof transform.responseInterceptors).toBe('function');
        });

        it('应该支持错误拦截器', () => {
            const transform: AxiosTransform = {
                requestInterceptorsCatch: (_error, _options) => {
                    // Handle error
                },
                responseInterceptorsCatch: (_error, _options, _axiosInstance) => {
                    // Handle error
                },
            };

            expect(typeof transform.requestInterceptorsCatch).toBe('function');
            expect(typeof transform.responseInterceptorsCatch).toBe('function');
        });

        it('应该支持完整的 transform 配置', () => {
            const transform: AxiosTransform = {
                beforeRequestHook: (config, _options) => config,
                requestInterceptors: (config, _options) => config,
                responseInterceptors: (res, _options) => res,
                requestInterceptorsCatch: (_error, _options) => {
                    // Handle error
                },
                responseInterceptorsCatch: (_error, _options, _axiosInstance) => {
                    // Handle error
                },
            };

            expect(transform.beforeRequestHook).toBeDefined();
            expect(transform.requestInterceptors).toBeDefined();
            expect(transform.responseInterceptors).toBeDefined();
            expect(transform.requestInterceptorsCatch).toBeDefined();
            expect(transform.responseInterceptorsCatch).toBeDefined();
        });
    });

    describe('类型兼容性测试', () => {
        it('requestOptions 应该是可扩展的', () => {
            interface CustomRequestOptions extends RequestOptions {
                customField: string;
            }

            const options: CustomRequestOptions = {
                customField: 'custom',
                joinPrefix: true,
            };

            expect(options.customField).toBe('custom');
            expect(options.joinPrefix).toBe(true);
        });

        it('createAxiosOptions 应该是可组合的', () => {
            const baseOptions: CreateAxiosOptions = {
                baseURL: 'https://api.example.com',
            };

            const extendedOptions: CreateAxiosOptions = {
                ...baseOptions,
                timeout: 5000,
                requestOptions: {
                    joinPrefix: true,
                },
            };

            expect(extendedOptions.baseURL).toBe('https://api.example.com');
            expect(extendedOptions.timeout).toBe(5000);
        });
    });
});
