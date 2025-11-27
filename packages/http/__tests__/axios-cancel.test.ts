import { describe, it, expect, beforeEach } from 'vitest';
import { AxiosCanceler, getPendingUrl } from '../axios/axios-cancel';
import type { AxiosRequestConfig } from 'axios';

describe('axios-cancel.ts', () => {
    let axiosCanceler: AxiosCanceler;

    beforeEach(() => {
        axiosCanceler = new AxiosCanceler();
        axiosCanceler.reset();
    });

    describe('getPendingUrl', () => {
        it('应该正确生成 pending URL', () => {
            const config: AxiosRequestConfig = {
                method: 'GET',
                url: '/api/test',
            };
            const pendingUrl = getPendingUrl(config);
            expect(pendingUrl).toBe('GET&/api/test');
        });

        it('应该处理不同的请求方法', () => {
            const postConfig: AxiosRequestConfig = {
                method: 'POST',
                url: '/api/user',
            };
            expect(getPendingUrl(postConfig)).toBe('POST&/api/user');

            const deleteConfig: AxiosRequestConfig = {
                method: 'DELETE',
                url: '/api/user/1',
            };
            expect(getPendingUrl(deleteConfig)).toBe('DELETE&/api/user/1');
        });
    });

    describe('axiosCanceler', () => {
        it('应该能够创建实例', () => {
            expect(axiosCanceler).toBeInstanceOf(AxiosCanceler);
        });

        it('应该能够添加 pending 请求', () => {
            const config: AxiosRequestConfig = {
                method: 'GET',
                url: '/api/test',
            };

            axiosCanceler.addPending(config);
            expect(config.cancelToken).toBeDefined();
        });

        it('应该能够移除 pending 请求', () => {
            const config: AxiosRequestConfig = {
                method: 'GET',
                url: '/api/test',
            };

            axiosCanceler.addPending(config);
            axiosCanceler.removePending(config);
            // 再次添加不应该抛出错误
            expect(() => axiosCanceler.addPending(config)).not.toThrow();
        });

        it('应该能够移除所有 pending 请求', () => {
            const config1: AxiosRequestConfig = {
                method: 'GET',
                url: '/api/test1',
            };
            const config2: AxiosRequestConfig = {
                method: 'POST',
                url: '/api/test2',
            };

            axiosCanceler.addPending(config1);
            axiosCanceler.addPending(config2);
            axiosCanceler.removeAllPending();

            // 移除后应该能够重新添加
            expect(() => axiosCanceler.addPending(config1)).not.toThrow();
            expect(() => axiosCanceler.addPending(config2)).not.toThrow();
        });

        it('应该能够重置 pending map', () => {
            const config: AxiosRequestConfig = {
                method: 'GET',
                url: '/api/test',
            };

            axiosCanceler.addPending(config);
            axiosCanceler.reset();

            // 重置后应该能够重新添加相同的请求
            expect(() => axiosCanceler.addPending(config)).not.toThrow();
        });

        it('应该在添加相同请求时自动移除之前的请求', () => {
            const config: AxiosRequestConfig = {
                method: 'GET',
                url: '/api/test',
            };

            axiosCanceler.addPending(config);
            // 添加相同的请求应该先移除之前的
            axiosCanceler.addPending(config);

            expect(config.cancelToken).toBeDefined();
        });

        it('应该处理没有 cancelToken 的配置', () => {
            const config: AxiosRequestConfig = {
                method: 'GET',
                url: '/api/test',
            };

            delete config.cancelToken;
            expect(() => axiosCanceler.addPending(config)).not.toThrow();
            expect(config.cancelToken).toBeDefined();
        });

        it('应该能够处理多个不同的请求', () => {
            const configs: AxiosRequestConfig[] = [
                { method: 'GET', url: '/api/users' },
                { method: 'POST', url: '/api/users' },
                { method: 'GET', url: '/api/posts' },
                { method: 'DELETE', url: '/api/posts/1' },
            ];

            configs.forEach((config) => {
                expect(() => axiosCanceler.addPending(config)).not.toThrow();
            });

            configs.forEach((config) => {
                expect(() => axiosCanceler.removePending(config)).not.toThrow();
            });
        });
    });
});
