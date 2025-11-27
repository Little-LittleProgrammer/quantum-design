import { describe, it, expect } from 'vitest';
import { isArray, isDef, isObject, isUnDef, isEmpty, isFunction, isDate, jsIs, isNull, isNullOrUndef, isNumber, isPromise, isString, isRegExp, isVideo, isImage, isUrl, isClient, isService, isBase, isBoolean, isElement } from '../src/is';

describe('is.ts', () => {
    it('判断必须正确', () => {
        expect(jsIs('1', 'String')).toBeTruthy();
        expect(isDef('1')).toBeTruthy();
        expect(isUnDef('1')).toBeFalsy();
        expect(isObject({})).toBeTruthy();

        expect(isEmpty('')).toBeTruthy();
        expect(isEmpty({})).toBeTruthy();
        expect(isEmpty(['1'])).toBeFalsy();
        expect(isEmpty({ test: 1 })).toBeFalsy();
        expect(isEmpty(new Map())).toBeTruthy();
        expect(isEmpty(1)).toBeFalsy();
        expect(isDate(new Date())).toBeTruthy();
        expect(isFunction(() => void 0)).toBeTruthy();
        expect(isArray([])).toBeTruthy();

        const _a = null;
        expect(isNull(_a)).toBeTruthy();
        expect(isNullOrUndef(_a)).toBeTruthy();
        expect(isNumber(123123)).toBeTruthy();
        expect(isPromise(123123)).toBeFalsy();
        expect(isString(123123)).toBeFalsy();
        expect(isRegExp(/12321/)).toBeTruthy();
        expect(isVideo('1.mp4')).toBeTruthy();
        expect(isImage('1/png')).toBeTruthy();
        expect(isUrl('https: //www.xxx.com')).toBeTruthy();
        expect(isClient).toBeTruthy();
        expect(isService).toBeFalsy();
        expect(isBase(1)).toBeTruthy();
        expect(isBoolean(true)).toBeTruthy();
        expect(isElement(1)).toBeFalsy();
    });
});
