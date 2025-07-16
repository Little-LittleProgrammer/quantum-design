import {gRegEnum} from '@quantum-design/shared/enums';

const toString = Object.prototype.toString;
function user_agent() {
    return typeof window !== 'undefined' && window.navigator && window.navigator.userAgent || 'server';
}

export function jsIs(val: unknown, type: string) {
    return toString.call(val) === `[object ${type}]`;
}

export function isDef<T = unknown>(val?: T): val is T {
    return typeof val !== 'undefined';
}

export function isUnDef<T = unknown>(val?: T): val is T {
    return !isDef(val);
}

export function isObject(val: any): val is Record<any, any> {
    return val !== null && jsIs(val, 'Object');
}

export function isEmpty<T = unknown>(val: T): val is T {
    if (isArray(val) || isString(val)) {
        return val.length === 0;
    }

    if (val instanceof Map || val instanceof Set) {
        return val.size === 0;
    }

    if (isObject(val)) {
        return Object.keys(val).length === 0;
    }

    return false;
}

export function isDate(val: unknown): val is Date {
    return jsIs(val, 'Date');
}

export function isNull(val: unknown): val is null {
    return val === null;
}

export function isNullOrUndef(val: unknown): val is null | undefined {
    return isUnDef(val) || isNull(val);
}

export function isNumber(val: unknown): val is number {
    return jsIs(val, 'Number');
}

export function isPromise<T = any>(val: unknown): val is Promise<T> {
    return jsIs(val, 'Promise') && isObject(val) && isFunction(val.then) && isFunction(val.catch);
}

export function isString(val: unknown): val is string {
    return jsIs(val, 'String');
}

export function isFunction(val: unknown): val is Fn {
    return typeof val === 'function';
}

export function isBoolean(val: unknown): val is boolean {
    return jsIs(val, 'Boolean');
}

export function isRegExp(val: unknown): val is RegExp {
    return jsIs(val, 'RegExp');
}

export function isSymbol(val: unknown): val is symbol {
    return jsIs(val, 'Symbol');
}

export function isArray(val: any): val is Array<any> {
    return val && Array.isArray(val);
}

export function isWindow(val: any): val is Window {
    return typeof window !== 'undefined' && jsIs(val, 'Window');
}

export function isElement(val: unknown): val is Element {
    return isObject(val) && !!val.tagName;
}

export function isMap(val: unknown): val is Map<any, any> {
    return jsIs(val, 'Map');
}

export function isSet(val: unknown): val is Set<any> {
    return jsIs(val, 'Set');
}

// 是否是基本数据类型
export function isBase(val: unknown): boolean {
    // 可遍历的引用类型
    let _flag = !(isMap(val) || isSet(val) || isArray(val) || isObject(val));
    // 不可遍历的引用类型
    _flag = _flag && !(isSymbol(val) || isRegExp(val) || isFunction(val));

    return _flag;
}

// 是否相等
export function isEqual<T = unknown>(val1: T, val2: T): boolean {
    // 如果其中有基本类型
    if (isBase(val1) || isBase(val2)) {
        return val1 === val2;
    }
    // 如果特意传的就是两个指向同一地址的对象
    if (val1 === val2) {
        return true;
    }
    // 两个都是对象或者数组，而且不相等
    const _obj1_keys = Object.keys(val1 as object);
    const _obj2_keys = Object.keys(val2 as object);
    // 先判断长度进行过滤
    if (_obj1_keys.length !== _obj2_keys.length) {
        return false;
    }
    // 以val1为基准，和val2依次递归比较
    for (const key in val1) {
        const res = isEqual(val1[key], val2[key]);
        // 如果出现不相等直接返回false
        if (!res) {
            return false;
        }
    }
    return true;
}

export const isService = typeof window === 'undefined';

export const isClient = !isService;

export function isUrl(path: string): boolean {
    const reg = gRegEnum.urlReg;
    return reg.test(path);
}

// 判断文件后缀是否为图片
export function isImage(fileName: string): boolean {
    const _types = ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff'];
    return _types.some(item => fileName.toLowerCase().includes(item));
}

// 判断文件后缀是否为视频
export function isVideo(fileName: string): boolean {
    const _types = ['mp4', 'avi', 'wmv', 'mkv', 'mov', 'flv', 'webm'];
    return _types.some(item => fileName.toLowerCase().includes(item));
}

// 判断当前浏览器环境
export function isAndroid(): boolean {
    return /(android|adr|linux)/i.test(user_agent());
}

export function isIos(): boolean {
    return /(iphone|ipad|ipod)/i.test(user_agent());
}

export function jsIsMobile(): boolean {
    return isAndroid() || isIos();
}

export function isIPhone(): boolean {
    return /iphone/i.test(user_agent());
}

export function isIpad(): boolean {
    return /ipad/i.test(user_agent());
}

export function isWechat(): boolean {
    return /MicroMessenger/i.test(user_agent());
}

export function isDingDing(): boolean {
    return /DingTalk/i.test(user_agent());
}

export function isSafariBrowser(): boolean {
    return /^((?!chrome|android).)*safari/i.test(user_agent());
}

export function isBaiduBrowser(): boolean {
    return /Baidu/i.test(user_agent());
}
export function js_utils_get_first_non_empty<T>(
    ...values: (null | T | undefined)[]
): T | undefined {
    for (const value of values) {
        if (value !== undefined && value !== null) {
            return value;
        }
    }
    return undefined;
}
