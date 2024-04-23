import { describe, afterEach, beforeEach, it, expect, vi } from 'vitest';
import { js_create_local_storage } from '../src/storage';

describe('storage.ts', () => {
    const _key = 'abc';
    const _value = {
        a: 1, b: 2, c: 3
    };
    beforeEach(() => {
        // 告诉 vitest 我们使用模拟时间
        vi.useFakeTimers();
    });

    afterEach(() => {
        // 每次测试运行后恢复日期
        vi.useRealTimers();
    });
    it('普通操作正常', () => {
        const _ls = js_create_local_storage();
        _ls.set(_key, _value);
        expect(_ls.get(_key).toString()).equal(_value.toString());
        _ls.remove(_key);
        expect(_ls.get(_key)).toBeNull();
        _ls.clear();
        expect(_ls.get(_key)).toBeNull();
    });
    it('过期时间正常', () => {
        const _ls = js_create_local_storage({
            timeout: 60 * 60 * 24
        });
        // 将时间设置在工作时间之内
        _ls.set(_key, _value);
        const _date = new Date(new Date().getTime() + 24 * 60 * 60 * 1000 + 1);
        vi.setSystemTime(_date);
        expect(_ls.get(_key)).toBeUndefined();
    });
    it('加密测试正常', () => {
        const _ls = js_create_local_storage({
            timeout: 60 * 60 * 24
        });
        // 将时间设置在工作时间之内
        _ls.set(_key, _value);
        const _date = new Date(new Date().getTime() + 24 * 60 * 60 * 1000 + 1);
        vi.setSystemTime(_date);
        expect(_ls.get(_key)).toBeUndefined();
    });
});
