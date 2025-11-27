import { describe, it, expect, vi } from 'vitest';
import { check_status } from '../axios/check-status';
import { gResultEnum } from '@quantum-design/shared/enums';

describe('check-status.ts', () => {
    describe('check_status', () => {
        it('应该正确处理 ERROR 状态', async () => {
            const mockCb = vi.fn();
            await check_status(gResultEnum.ERROR, '自定义错误信息', mockCb);
            expect(mockCb).toHaveBeenCalledWith(gResultEnum.ERROR, '自定义错误信息');
        });

        it('应该正确处理 LOGIN 状态', async () => {
            const mockCb = vi.fn();
            await check_status(gResultEnum.LOGIN, '', mockCb);
            expect(mockCb).toHaveBeenCalledWith(gResultEnum.LOGIN, '登录认证过期，请重新登录后继续。');
        });

        it('应该正确处理 PROMISE 状态（无权限）', async () => {
            const mockCb = vi.fn();
            await check_status(gResultEnum.PROMISE, '', mockCb);
            expect(mockCb).toHaveBeenCalledWith(gResultEnum.PROMISE, '禁止访问, 您没有权限访问此资源。');
        });

        it('应该正确处理 NOTFOUND 状态', async () => {
            const mockCb = vi.fn();
            await check_status(gResultEnum.NOTFOUND, '', mockCb);
            expect(mockCb).toHaveBeenCalledWith(gResultEnum.NOTFOUND, '未找到, 请求的资源不存在。');
        });

        it('应该正确处理 NOALLOW 状态', async () => {
            const mockCb = vi.fn();
            await check_status(gResultEnum.NOALLOW, '', mockCb);
            expect(mockCb).toHaveBeenCalledWith(gResultEnum.NOALLOW, '请求方法未允许');
        });

        it('应该正确处理 TIMEOUT 状态', async () => {
            const mockCb = vi.fn();
            await check_status(gResultEnum.TIMEOUT, '', mockCb);
            expect(mockCb).toHaveBeenCalledWith(gResultEnum.TIMEOUT, '请求超时，请稍后再试。');
        });

        it('应该正确处理 413 状态（数据过大）', async () => {
            const mockCb = vi.fn();
            await check_status('413', '', mockCb);
            expect(mockCb).toHaveBeenCalledWith('413', '数据过大');
        });

        it('应该正确处理 SERVERERROR 状态', async () => {
            const mockCb = vi.fn();
            await check_status(gResultEnum.SERVERERROR, '', mockCb);
            expect(mockCb).toHaveBeenCalledWith(gResultEnum.SERVERERROR, '服务器端出错');
        });

        it('应该正确处理 501-505 状态码', async () => {
            const statusTests = [
                { code: '501', message: '网络未实现' },
                { code: '502', message: '网络错误' },
                { code: '503', message: '服务不可用' },
                { code: '504', message: '网络超时' },
                { code: '505', message: 'http版本不支持该请求' },
            ];

            for (const test of statusTests) {
                const mockCb = vi.fn();
                await check_status(test.code, '', mockCb);
                expect(mockCb).toHaveBeenCalledWith(test.code, test.message);
            }
        });

        it('应该正确处理未知状态码', async () => {
            const mockCb = vi.fn();
            await check_status('999', '', mockCb);
            expect(mockCb).toHaveBeenCalledWith('999', '连接错误');
        });

        it('应该在没有回调函数时不报错', async () => {
            await expect(check_status(gResultEnum.ERROR, '测试')).resolves.toBeUndefined();
        });

        it('应该在回调函数不是函数时不报错', async () => {
            await expect(check_status(gResultEnum.ERROR, '测试', 'not a function' as any)).resolves.toBeUndefined();
        });

        it('应该使用自定义错误消息覆盖默认消息', async () => {
            const mockCb = vi.fn();
            const customMsg = '这是自定义的错误消息';
            await check_status(gResultEnum.ERROR, customMsg, mockCb);
            expect(mockCb).toHaveBeenCalledWith(gResultEnum.ERROR, customMsg);
        });

        it('应该能处理多次连续调用', async () => {
            const mockCb1 = vi.fn();
            const mockCb2 = vi.fn();
            const mockCb3 = vi.fn();

            await check_status(gResultEnum.ERROR, '错误1', mockCb1);
            await check_status(gResultEnum.LOGIN, '错误2', mockCb2);
            await check_status(gResultEnum.TIMEOUT, '错误3', mockCb3);

            expect(mockCb1).toHaveBeenCalledTimes(1);
            expect(mockCb2).toHaveBeenCalledTimes(1);
            expect(mockCb3).toHaveBeenCalledTimes(1);
        });
    });
});
