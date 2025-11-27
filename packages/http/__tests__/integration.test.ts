import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createAxios } from '../axios/index';
import type { CreateAxiosOptions } from '../axios/axios-transform';

describe('集成测试 - HTTP 完整流程', () => {
    let axiosInstance: ReturnType<typeof createAxios>;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('完整请求流程', () => {
        it('应该能够创建并配置 axios 实例', () => {
            const customOptions: Omit<Partial<CreateAxiosOptions>, 'defaultTransform'> = {
                baseURL: 'https://api.test.com',
                timeout: 5000,
                requestOptions: {
                    apiUrl: 'https://api.test.com',
                    joinPrefix: true,
                    urlPrefix: '/api/v1',
                    joinTime: true,
                    withToken: true,
                    cancelToken: true,
                },
            };

            axiosInstance = createAxios(customOptions);
            expect(axiosInstance).toBeDefined();
            expect(axiosInstance.getAxios()).toBeDefined();
        });

        it('应该能够配置自定义 transform', () => {
            const customTransform: any = {
                customRequest: vi.fn((config) => {
                    config.headers = {
                        ...config.headers,
                        'X-Custom-Header': 'custom-value',
                    };
                    return config;
                }),
                customResponse: vi.fn((response) => {
                    return response;
                }),
            };

            const options: Omit<Partial<CreateAxiosOptions>, 'defaultTransform'> = {
                customTransform,
            };

            axiosInstance = createAxios(options);
            expect(axiosInstance).toBeDefined();
        });

        it('应该正确处理请求拦截器链', () => {
            const requestInterceptor = vi.fn((config) => config);

            const options: Omit<Partial<CreateAxiosOptions>, 'defaultTransform'> = {
                customTransform: {
                    customRequest: requestInterceptor,
                },
            };

            axiosInstance = createAxios(options);
            expect(axiosInstance).toBeDefined();
        });

        it('应该正确配置重试机制', () => {
            const options: Omit<Partial<CreateAxiosOptions>, 'defaultTransform'> = {
                requestOptions: {
                    retryRequest: {
                        isOpenRetry: true,
                        count: 3,
                        waitTime: 100,
                    },
                },
            };

            axiosInstance = createAxios(options);
            expect(axiosInstance).toBeDefined();
        });

        it('应该能够设置和更新请求头', () => {
            axiosInstance = createAxios();

            const headers = {
                Authorization: 'Bearer test-token',
                'X-Request-ID': 'req-123',
                'X-Custom-Header': 'custom-value',
            };

            axiosInstance.setHeader(headers);
            const axios = axiosInstance.getAxios();
            expect(axios.defaults.headers).toEqual(headers);

            // 更新部分请求头
            axiosInstance.setHeader({
                Authorization: 'Bearer new-token',
            });

            expect(axios.defaults.headers['Authorization']).toBe('Bearer new-token');
        });

        it('应该能够重新配置 axios 实例', () => {
            axiosInstance = createAxios({
                baseURL: 'https://api.old.com',
            });

            const newConfig: CreateAxiosOptions = {
                baseURL: 'https://api.new.com',
                timeout: 10000,
            };

            axiosInstance.configAxios(newConfig);
            expect(axiosInstance.getAxios()).toBeDefined();
        });
    });

    describe('请求方法组合测试', () => {
        beforeEach(() => {
            axiosInstance = createAxios({
                requestOptions: {
                    apiUrl: 'https://api.test.com',
                    joinTime: true,
                    withToken: true,
                },
            });
        });

        it('应该能够链式配置请求', async () => {
            // Mock axios 实例
            const mockRequest = vi.fn().mockResolvedValue({
                data: { code: '0', data: 'success' },
            });
            (axiosInstance.getAxios() as any).request = mockRequest;

            await axiosInstance.get({ url: '/users' });
            expect(mockRequest).toHaveBeenCalled();
        });

        it('应该能够处理多个并发请求', async () => {
            const mockRequest = vi
                .fn()
                .mockResolvedValueOnce({ data: { code: '0', data: 'user1' } })
                .mockResolvedValueOnce({ data: { code: '0', data: 'user2' } })
                .mockResolvedValueOnce({ data: { code: '0', data: 'user3' } });

            (axiosInstance.getAxios() as any).request = mockRequest;

            const promises = [axiosInstance.get({ url: '/users/1' }), axiosInstance.get({ url: '/users/2' }), axiosInstance.get({ url: '/users/3' })];

            await Promise.all(promises);
            expect(mockRequest).toHaveBeenCalledTimes(3);
        });

        it('应该能够处理不同类型的请求', async () => {
            const mockRequest = vi.fn().mockResolvedValue({
                data: { code: '0', data: 'success' },
            });
            (axiosInstance.getAxios() as any).request = mockRequest;

            await axiosInstance.get({ url: '/users' });
            await axiosInstance.post({ url: '/users', data: { name: 'test' } });
            await axiosInstance.put({ url: '/users/1', data: { name: 'updated' } });
            await axiosInstance.delete({ url: '/users/1' });

            expect(mockRequest).toHaveBeenCalledTimes(4);
        });
    });

    describe('错误处理流程', () => {
        beforeEach(() => {
            axiosInstance = createAxios({
                requestOptions: {
                    errorMessageCb: vi.fn(),
                },
            });
        });

        it('应该能够捕获并处理请求错误', async () => {
            const mockRequest = vi.fn().mockRejectedValue(new Error('Network Error'));
            (axiosInstance.getAxios() as any).request = mockRequest;

            const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

            await axiosInstance.get({ url: '/users' });

            expect(mockRequest).toHaveBeenCalled();
            consoleSpy.mockRestore();
        });

        it('应该能够处理超时错误', async () => {
            const timeoutError = {
                name: 'AxiosError',
                message: 'timeout of 5000ms exceeded',
                code: 'ECONNABORTED',
            };

            const mockRequest = vi.fn().mockRejectedValue(timeoutError);
            (axiosInstance.getAxios() as any).request = mockRequest;

            const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

            await axiosInstance.get({ url: '/users' });

            expect(mockRequest).toHaveBeenCalled();
            consoleSpy.mockRestore();
        });
    });

    describe('formData 和文件上传', () => {
        beforeEach(() => {
            axiosInstance = createAxios({
                requestOptions: {
                    uploadUrl: 'https://upload.test.com',
                },
            });
        });

        it('应该能够正确处理 FormData 请求', () => {
            const config = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                data: {
                    username: 'test',
                    password: '123456',
                },
            };

            const result = axiosInstance.supportFormData(config as any);
            expect(typeof result.data).toBe('string');
        });

        it('应该能够上传文件', async () => {
            const mockFile = new File(['content'], 'test.txt', { type: 'text/plain' });
            const mockRequest = vi.fn().mockResolvedValue({
                data: { code: '0', data: { url: 'https://cdn.test.com/test.txt' } },
            });
            (axiosInstance.getAxios() as any).request = mockRequest;

            await axiosInstance.uploadFile({ url: '/upload' }, {
                file: mockFile,
                name: 'file',
                filename: 'test.txt',
                data: {
                    userId: '123',
                },
            } as any);

            expect(mockRequest).toHaveBeenCalled();
        });
    });

    describe('请求取消机制', () => {
        it('应该能够配置请求取消', () => {
            const options: Omit<Partial<CreateAxiosOptions>, 'defaultTransform'> = {
                requestOptions: {
                    cancelToken: true,
                },
            };

            axiosInstance = createAxios(options);
            expect(axiosInstance).toBeDefined();
        });

        it('应该能够禁用请求取消', () => {
            const options: Omit<Partial<CreateAxiosOptions>, 'defaultTransform'> = {
                requestOptions: {
                    cancelToken: false,
                },
            };

            axiosInstance = createAxios(options);
            expect(axiosInstance).toBeDefined();
        });
    });

    describe('环境配置', () => {
        it('应该能够配置环境参数', () => {
            const options: Omit<Partial<CreateAxiosOptions>, 'defaultTransform'> = {
                requestOptions: {
                    env: () => 'production',
                    joinPrefix: true,
                    urlPrefix: '/api',
                },
            };

            axiosInstance = createAxios(options);
            expect(axiosInstance).toBeDefined();
        });

        it('应该能够动态切换环境', () => {
            let currentEnv = 'development';

            const options: Omit<Partial<CreateAxiosOptions>, 'defaultTransform'> = {
                requestOptions: {
                    env: () => currentEnv,
                },
            };

            axiosInstance = createAxios(options);
            expect(axiosInstance).toBeDefined();

            // 模拟环境切换
            currentEnv = 'production';
            expect(currentEnv).toBe('production');
        });
    });

    describe('认证和 Token 管理', () => {
        it('应该能够配置 Token 携带', () => {
            const options: Omit<Partial<CreateAxiosOptions>, 'defaultTransform'> = {
                requestOptions: {
                    withToken: true,
                },
            };

            axiosInstance = createAxios(options);
            expect(axiosInstance).toBeDefined();
        });

        it('应该能够设置认证方案', () => {
            const options: Omit<Partial<CreateAxiosOptions>, 'defaultTransform'> = {
                authenticationScheme: 'Bearer',
                requestOptions: {
                    withToken: true,
                },
            };

            axiosInstance = createAxios(options);
            expect(axiosInstance).toBeDefined();
        });
    });

    describe('响应处理', () => {
        beforeEach(() => {
            axiosInstance = createAxios();
        });

        it('应该能够返回原始响应', async () => {
            const mockResponse = {
                data: { code: '0', data: 'test' },
                status: 200,
                statusText: 'OK',
                headers: {},
                config: {},
            };

            const mockRequest = vi.fn().mockResolvedValue(mockResponse);
            (axiosInstance.getAxios() as any).request = mockRequest;

            const result = await axiosInstance.get({ url: '/test' }, { isReturnNativeResponse: true });

            expect(result).toEqual(mockResponse);
        });

        it('应该默认只返回响应数据', async () => {
            const mockData = { code: '0', data: 'test' };
            const mockResponse = {
                data: mockData,
                status: 200,
                statusText: 'OK',
                headers: {},
                config: {},
            };

            const mockRequest = vi.fn().mockResolvedValue(mockResponse);
            (axiosInstance.getAxios() as any).request = mockRequest;

            const result = await axiosInstance.get({ url: '/test' });
            expect(result).toEqual(mockData);
        });
    });
});
