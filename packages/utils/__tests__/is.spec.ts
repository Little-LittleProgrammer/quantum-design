import { describe, it, expect } from 'vitest';
import { js_is_array, js_is_def, js_is_object, js_is_un_def, js_is_empty, js_is_function, js_is_date } from '../src/is';

describe('is.ts', () => {
    it('判断必须正确', () => {
        expect(js_is_def('1')).toBeTruthy();
        expect(js_is_un_def('1')).toBeFalsy();
        expect(js_is_object({})).toBeTruthy();

        expect(js_is_empty('')).toBeTruthy();
        expect(js_is_empty({})).toBeTruthy();
        expect(js_is_empty(['1'])).toBeFalsy();
        expect(js_is_empty({ test: 1 })).toBeFalsy();
        expect(js_is_date(new Date())).toBeTruthy();
        expect(js_is_function(() => void 0)).toBeTruthy();
        expect(js_is_array([])).toBeTruthy();
    });
});
