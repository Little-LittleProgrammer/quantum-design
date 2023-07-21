import { describe, it, expect, vi } from 'vitest';
import { js_utils_deep_copy, js_utils_deep_merge, js_utils_edit_attr, js_utils_find_attr, js_utils_first_to_upper, js_utils_format_money_num, js_utils_quick_sort } from '../src/utils';

describe('utils.ts', () => {
    it('deep_copy测试', () => {
        const _value = {
            a: 1,
            b: () => void 0,
            c: {
                d: /123/,
                e: new Map(),
                f: new Set(),
                g: [1, 2, 3]
            }
        };
        expect(js_utils_deep_copy(_value).toString() == _value.toString()).toBeTruthy();
        const _deepValue = js_utils_deep_copy(_value);
        _deepValue.c.g.push(4);
        expect(_value.c.g.length === 3).toBeTruthy();
        expect(_deepValue.c.g.length === 4).toBeTruthy();
    });
    it('js_utils_first_to_upper', () => {
        const _value = 'abc';
        expect(js_utils_first_to_upper(_value)).equal('Abc');
    });
    it('js_utils_deep_merge', () => {
        const _valueA = {
            a: 1,
            b: 2,
            c: {}
        };
        const _valueB = {
            a: 3,
            b: 4,
            c: {
                d: 1
            }
        };
        expect(js_utils_deep_merge(_valueA, _valueB)).toEqual({
            a: 3, b: 4, c: {d: 1}
        });
    });
    it('js_utils_quick_sort', () => {
        expect(js_utils_quick_sort([2, 1, 3])).toEqual([1, 2, 3]);
    });
    it('js_utils_format_money_num', () => {
        expect(js_utils_format_money_num(123456)).toEqual('123,456.00');
    });
    it('js_utils_attr', () => {
        const _obj = {a: {b: {c: {d: {e: 5}}}}};
        expect(js_utils_find_attr(_obj, 'a.b.c.d.e')).toEqual(5);
        js_utils_edit_attr('a.b.c.d.e', 6, _obj);
        expect(_obj.a.b.c.d.e).toEqual(6);
    });
});
