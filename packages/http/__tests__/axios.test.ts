import { describe, it, expect, vi, beforeEach } from 'vitest';
import { VAxios } from '../axios/axios';
import { gContentTypeEnum } from '@quantum-design/shared/enums';
import type { CreateAxiosOptions } from '../axios/axios-transform';
import axios from 'axios';

// Mock axios
vi.mock('axios');

describe('axios.ts', () => {
    let vAxios: VAxios;
    const mockAxiosInstance = {
        request: vi.fn(),
        interceptors: {
            request: {
                use: vi.fn(),
            },
            response: {
                use: vi.fn(),
            },
        },
        defaults: {
            headers: {},
        },
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (axios.create as any) = vi.fn().mockReturnValue(mockAxiosInstance);
    });

    describe('vAxios 类', () => {
        it('应该能够创建实例', () => {
            const options: CreateAxiosOptions = {
                baseURL: 'https://api.example.com',
            };
            vAxios = new VAxios(options);
            expect(vAxios).toBeInstanceOf(VAxios);
        });

        it('应该设置拦截器', () => {
            const options: CreateAxiosOptions = {
                baseURL: 'https://api.example.com',
                defaultTransform: {
                    requestInterceptors: vi.fn((config) => config),
                    responseInterceptors: vi.fn((res) => res),
                },
            };
            vAxios = new VAxios(options);

            expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled();
            expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalled();
        });

        it('应该能够获取 axios 实例', () => {
            const options: CreateAxiosOptions = {
                baseURL: 'https://api.example.com',
            };
            vAxios = new VAxios(options);
            const instance = vAxios.getAxios();
            expect(instance).toBe(mockAxiosInstance);
        });

        it('应该能够重新配置 axios', () => {
            const options: CreateAxiosOptions = {
                baseURL: 'https://api.example.com',
            };
            vAxios = new VAxios(options);

            const newConfig: CreateAxiosOptions = {
                baseURL: 'https://new-api.example.com',
            };
            vAxios.configAxios(newConfig);

            expect(axios.create).toHaveBeenCalledTimes(2);
        });

        it('应该能够设置请求头', () => {
            const options: CreateAxiosOptions = {
                baseURL: 'https://api.example.com',
            };
            vAxios = new VAxios(options);

            const headers = {
                Authorization: 'Bearer token',
                'Custom-Header': 'custom-value',
            };
            vAxios.setHeader(headers);

            expect(mockAxiosInstance.defaults.headers).toEqual(headers);
        });

        describe('supportFormData', () => {
            it('应该在 Content-Type 不是 FORM_URLENCODED 时返回原配置', () => {
                const options: CreateAxiosOptions = {
                    baseURL: 'https://api.example.com',
                };
                vAxios = new VAxios(options);

                const config = {
                    method: 'POST',
                    headers: {
                        'Content-Type': gContentTypeEnum.JSON,
                    },
                    data: { key: 'value' },
                };

                const result = vAxios.supportFormData(config as any);
                expect(result).toEqual(config);
            });

            it('应该在 GET 请求时返回原配置', () => {
                const options: CreateAxiosOptions = {
                    baseURL: 'https://api.example.com',
                };
                vAxios = new VAxios(options);

                const config = {
                    method: 'GET',
                    headers: {
                        'Content-Type': gContentTypeEnum.FORM_URLENCODED,
                    },
                    data: { key: 'value' },
                };

                const result = vAxios.supportFormData(config as any);
                expect(result).toEqual(config);
            });

            it('应该序列化 FORM_URLENCODED 数据', () => {
                const options: CreateAxiosOptions = {
                    baseURL: 'https://api.example.com',
                };
                vAxios = new VAxios(options);

                const config = {
                    method: 'POST',
                    headers: {
                        'Content-Type': gContentTypeEnum.FORM_URLENCODED,
                    },
                    data: { key: 'value', foo: 'bar' },
                };

                const result = vAxios.supportFormData(config as any);
                expect(typeof result.data).toBe('string');
            });
        });

        describe('hTTP 方法快捷方式', () => {
            beforeEach(() => {
                const options: CreateAxiosOptions = {
                    baseURL: 'https://api.example.com',
                };
                vAxios = new VAxios(options);
                mockAxiosInstance.request.mockResolvedValue({
                    data: { code: '0', data: 'success' },
                });
            });

            it('应该能够发送 GET 请求', async () => {
                await vAxios.get({ url: '/api/users' });
                expect(mockAxiosInstance.request).toHaveBeenCalled();
            });

            it('应该能够发送 POST 请求', async () => {
                await vAxios.post({ url: '/api/users', data: { name: 'test' } });
                expect(mockAxiosInstance.request).toHaveBeenCalled();
            });

            it('应该能够发送 PUT 请求', async () => {
                await vAxios.put({ url: '/api/users/1', data: { name: 'updated' } });
                expect(mockAxiosInstance.request).toHaveBeenCalled();
            });

            it('应该能够发送 DELETE 请求', async () => {
                await vAxios.delete({ url: '/api/users/1' });
                expect(mockAxiosInstance.request).toHaveBeenCalled();
            });
        });

        describe('request 方法', () => {
            beforeEach(() => {
                const options: CreateAxiosOptions = {
                    baseURL: 'https://api.example.com',
                };
                vAxios = new VAxios(options);
            });

            it('应该返回响应数据', async () => {
                const responseData = { code: '0', data: 'test data' };
                mockAxiosInstance.request.mockResolvedValue({
                    data: responseData,
                });

                const result = await vAxios.request({ url: '/api/test' });
                expect(result).toEqual(responseData);
            });

            it('应该在设置 isReturnNativeResponse 时返回原始响应', async () => {
                const nativeResponse = {
                    data: { code: '0', data: 'test' },
                    status: 200,
                    statusText: 'OK',
                    headers: {},
                    config: {},
                };
                mockAxiosInstance.request.mockResolvedValue(nativeResponse);

                const result = await vAxios.request({ url: '/api/test' }, { isReturnNativeResponse: true });
                expect(result).toEqual(nativeResponse);
            });

            it('应该调用 beforeRequestHook', async () => {
                const beforeRequestHook = vi.fn((config) => config);
                const options: CreateAxiosOptions = {
                    baseURL: 'https://api.example.com',
                    defaultTransform: {
                        beforeRequestHook,
                    },
                };
                vAxios = new VAxios(options);

                mockAxiosInstance.request.mockResolvedValue({
                    data: { code: '0', data: 'test' },
                });

                await vAxios.request({ url: '/api/test' });
                expect(beforeRequestHook).toHaveBeenCalled();
            });

            it('应该处理请求错误', async () => {
                mockAxiosInstance.request.mockRejectedValue(new Error('Network Error'));

                const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

                await vAxios.request({ url: '/api/test' });

                expect(consoleSpy).toHaveBeenCalled();
                consoleSpy.mockRestore();
            });
        });

        describe('uploadFile 方法', () => {
            beforeEach(() => {
                const options: CreateAxiosOptions = {
                    baseURL: 'https://api.example.com',
                    requestOptions: {
                        uploadUrl: 'https://upload.example.com',
                        env: () => 'production',
                    },
                };
                vAxios = new VAxios(options);
            });

            it('应该能够上传文件', async () => {
                const mockFile = new File(['content'], 'test.txt', { type: 'text/plain' });
                const params = {
                    file: mockFile,
                    name: 'file',
                    filename: 'test.txt',
                };

                mockAxiosInstance.request.mockResolvedValue({
                    data: { code: '0', data: 'uploaded' },
                });

                await vAxios.uploadFile({ url: '/upload' }, params as any);

                expect(mockAxiosInstance.request).toHaveBeenCalledWith(
                    expect.objectContaining({
                        method: 'POST',
                        headers: expect.objectContaining({
                            'Content-type': gContentTypeEnum.FORM_DATA,
                        }),
                    }),
                );
            });

            it('应该处理额外的数据字段', async () => {
                const mockFile = new File(['content'], 'test.txt', { type: 'text/plain' });
                const params = {
                    file: mockFile,
                    name: 'file',
                    filename: 'test.txt',
                    data: {
                        userId: '123',
                        category: 'documents',
                    },
                };

                mockAxiosInstance.request.mockResolvedValue({
                    data: { code: '0', data: 'uploaded' },
                });

                await vAxios.uploadFile({ url: '/upload' }, params as any);

                expect(mockAxiosInstance.request).toHaveBeenCalled();
            });

            it('应该处理数组类型的数据', async () => {
                const mockFile = new File(['content'], 'test.txt', { type: 'text/plain' });
                const params = {
                    file: mockFile,
                    name: 'file',
                    filename: 'test.txt',
                    data: {
                        tags: ['tag1', 'tag2', 'tag3'],
                    },
                };

                mockAxiosInstance.request.mockResolvedValue({
                    data: { code: '0', data: 'uploaded' },
                });

                await vAxios.uploadFile({ url: '/upload' }, params as any);

                expect(mockAxiosInstance.request).toHaveBeenCalled();
            });
        });
    });
});
