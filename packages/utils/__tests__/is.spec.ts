import { describe, it, expect } from 'vitest';
import { js_is_array, js_is_def, js_is_object, js_is_un_def, js_is_empty, js_is_function, js_is_date, js_is, js_is_null, js_is_null_or_undef, js_is_number, js_is_promise, js_is_string, js_is_reg_exp, js_is_video, js_is_image, js_is_url, js_is_client, js_is_server, js_is_base, js_is_boolean, js_is_window, js_is_element } from '../src/is';

describe('is.ts', () => {
    it('判断必须正确', () => {
        expect(js_is('1', 'String')).toBeTruthy();
        expect(js_is_def('1')).toBeTruthy();
        expect(js_is_un_def('1')).toBeFalsy();
        expect(js_is_object({})).toBeTruthy();

        expect(js_is_empty('')).toBeTruthy();
        expect(js_is_empty({})).toBeTruthy();
        expect(js_is_empty(['1'])).toBeFalsy();
        expect(js_is_empty({ test: 1 })).toBeFalsy();
        expect(js_is_empty(new Map())).toBeTruthy();
        expect(js_is_empty(1)).toBeFalsy();
        expect(js_is_date(new Date())).toBeTruthy();
        expect(js_is_function(() => void 0)).toBeTruthy();
        expect(js_is_array([])).toBeTruthy();

        const _a = null;
        expect(js_is_null(_a)).toBeTruthy();
        expect(js_is_null_or_undef(_a)).toBeTruthy();
        expect(js_is_number(123123)).toBeTruthy();
        expect(js_is_promise(123123)).toBeFalsy();
        expect(js_is_string(123123)).toBeFalsy();
        expect(js_is_reg_exp(/12321/)).toBeTruthy();
        expect(js_is_video('1.mp4')).toBeTruthy();
        expect(js_is_image('1/png')).toBeTruthy();
        expect(js_is_url('https: //www.xxx.com')).toBeTruthy();
        expect(js_is_client).toBeTruthy();
        expect(js_is_server).toBeFalsy();
        expect(js_is_base(1)).toBeTruthy();
        expect(js_is_boolean(true)).toBeTruthy();
        expect(js_is_element(1)).toBeFalsy();
    });
});
