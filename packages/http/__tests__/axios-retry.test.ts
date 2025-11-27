import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AxiosRetry } from '../axios/axios-retry';
import axios, { AxiosError, type AxiosInstance } from 'axios';
import type { CreateAxiosOptions } from '../axios/axios-transform';

describe('axios-retry.ts', () => {
    let axiosRetry: AxiosRetry;
    let mockAxiosInstance: AxiosInstance;

    beforeEach(() => {
        axiosRetry = new AxiosRetry();
        mockAxiosInstance = axios.create();
        vi.clearAllTimers();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe('axiosRetry', () => {
        it('应该能够创建实例', () => {
            expect(axiosRetry).toBeInstanceOf(AxiosRetry);
        });

        it('应该在达到最大重试次数后返回错误', async () => {
            const mockError = {
                response: {
                    config: {
                        url: '/api/test',
                        method: 'GET',
                        requestOptions: {
                            retryRequest: {
                                count: 3,
                                waitTime: 100,
                            },
                        },
                        __retryCount: 3,
                    },
                },
            } as AxiosError;

            await expect(axiosRetry.retry(mockAxiosInstance, mockError)).rejects.toEqual(mockError);
        });

        it('应该在未达到最大重试次数时进行重试', async () => {
            const mockConfig: CreateAxiosOptions = {
                url: '/api/test',
                method: 'GET',
                requestOptions: {
                    retryRequest: {
                        count: 3,
                        waitTime: 100,
                        isOpenRetry: true,
                    },
                },
                __retryCount: 1,
                headers: {
                    'Content-Type': 'application/json',
                } as any,
            };

            const mockError = {
                response: {
                    config: mockConfig,
                },
            } as AxiosError;

            const mockRequest = vi.fn().mockResolvedValue({ data: 'success' });
            mockAxiosInstance.request = mockRequest;

            const retryPromise = axiosRetry.retry(mockAxiosInstance, mockError);

            // 快进时间
            vi.advanceTimersByTime(100);

            const result = await retryPromise;
            expect(result.data).toBe('success');
            expect(mockRequest).toHaveBeenCalledWith(
                expect.objectContaining({
                    url: '/api/test',
                    method: 'GET',
                    __retryCount: 2,
                }),
            );
        });

        it('应该在重试时增加重试计数', async () => {
            const mockConfig: CreateAxiosOptions = {
                url: '/api/test',
                method: 'GET',
                requestOptions: {
                    retryRequest: {
                        count: 5,
                        waitTime: 50,
                        isOpenRetry: true,
                    },
                },
                __retryCount: 2,
                headers: {} as any,
            };

            const mockError = {
                response: {
                    config: mockConfig,
                },
            } as AxiosError;

            const mockRequest = vi.fn().mockResolvedValue({ data: 'success' });
            mockAxiosInstance.request = mockRequest;

            const retryPromise = axiosRetry.retry(mockAxiosInstance, mockError);
            vi.advanceTimersByTime(50);

            await retryPromise;
            expect(mockConfig.__retryCount).toBe(3);
        });

        it('应该在重试时删除旧的 headers', async () => {
            const mockConfig: CreateAxiosOptions = {
                url: '/api/test',
                method: 'GET',
                requestOptions: {
                    retryRequest: {
                        count: 3,
                        waitTime: 100,
                        isOpenRetry: true,
                    },
                },
                __retryCount: 0,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer token',
                } as any,
            };

            const mockError = {
                response: {
                    config: mockConfig,
                },
            } as AxiosError;

            const mockRequest = vi.fn().mockResolvedValue({ data: 'success' });
            mockAxiosInstance.request = mockRequest;

            const retryPromise = axiosRetry.retry(mockAxiosInstance, mockError);
            vi.advanceTimersByTime(100);

            await retryPromise;
            expect(mockConfig.headers).toBeUndefined();
        });

        it('应该正确处理没有 retryRequest 配置的情况', async () => {
            const mockConfig: CreateAxiosOptions = {
                url: '/api/test',
                method: 'GET',
                requestOptions: {},
                __retryCount: 0,
            };

            const mockError = {
                response: {
                    config: mockConfig,
                },
            } as AxiosError;

            // 没有 retryRequest 配置时，count 为 undefined，应该立即返回错误
            await expect(axiosRetry.retry(mockAxiosInstance, mockError)).rejects.toEqual(mockError);
        });

        it('应该在不同的等待时间后重试', async () => {
            const waitTimes = [50, 100, 200];

            for (const waitTime of waitTimes) {
                const mockConfig: CreateAxiosOptions = {
                    url: '/api/test',
                    method: 'GET',
                    requestOptions: {
                        retryRequest: {
                            count: 3,
                            waitTime,
                            isOpenRetry: true,
                        },
                    },
                    __retryCount: 0,
                };

                const mockError = {
                    response: {
                        config: mockConfig,
                    },
                } as AxiosError;

                const mockRequest = vi.fn().mockResolvedValue({ data: 'success' });
                const instance = axios.create();
                instance.request = mockRequest;

                const retryPromise = axiosRetry.retry(instance, mockError);
                vi.advanceTimersByTime(waitTime);

                await retryPromise;
                expect(mockRequest).toHaveBeenCalled();
            }
        });

        it('应该处理初始 __retryCount 为 undefined 的情况', async () => {
            const mockConfig: CreateAxiosOptions = {
                url: '/api/test',
                method: 'GET',
                requestOptions: {
                    retryRequest: {
                        count: 3,
                        waitTime: 100,
                        isOpenRetry: true,
                    },
                },
                // __retryCount 未定义
            };

            const mockError = {
                response: {
                    config: mockConfig,
                },
            } as AxiosError;

            const mockRequest = vi.fn().mockResolvedValue({ data: 'success' });
            mockAxiosInstance.request = mockRequest;

            const retryPromise = axiosRetry.retry(mockAxiosInstance, mockError);
            vi.advanceTimersByTime(100);

            await retryPromise;
            expect(mockConfig.__retryCount).toBe(1);
        });
    });
});
