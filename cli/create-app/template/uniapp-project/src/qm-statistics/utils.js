
import MD5 from 'md5';
import BASE64 from 'Base64';

export function extend2Lev(t) {
    return (
        each(Array.prototype.slice.call(arguments, 1), (e) => {
            for (const n in e) {
                // eslint-disable-next-line no-void
                if (e[n] !== void 0) {
                    if (variableType.isObject(e[n]) && variableType.isObject(t[n])) {
                        extend(t[n], e[n]);
                    } else {
                        t[n] = e[n];
                    }
                }
                // void 0 !== e[n] && (variableType.isObject(e[n]) && variableType.isObject(t[n]) ? extend(t[n], e[n]) : (t[n] = e[n]));
            }
        }),
        t
    );
}

export function each(t, e, n) {
    if (t == null) return !1;
    if (Array.prototype.forEach && t.forEach === Array.prototype.forEach) t.forEach(e, n);
    else if (t.length === +t.length) {
        for (let r = 0, i = t.length; r < i; r++) {
            if (r in t && e.call(n, t[r], r, t) === {}) {
                return !1;
            }
        }
    } else {
        for (const a in t) {
            if (Object.prototype.hasOwnProperty.call(t, a) && e.call(n, t[a], a, t) === {}) {
                return !1;
            }
        }
    }
}

export function extend(t) {
    return (
        each(Array.prototype.slice.call(arguments, 1), (e) => {
            for (const n in e) void 0 !== e[n] && (t[n] = e[n]);
        }),
        t
    );
}

export function is_json_string(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

export function get_current_source() {
    const source = {
        $source_package_name: '',
        $scene: ''
    };
    return source;
}

export function format_path(path) {
    if (typeof path === 'string') {
        path = path.replace(/^\//, '');
    } else {
        path = '取值异常';
    }
    return path;
}

export function get_current_path() {
    const pages = getCurrentPages()
    return pages[pages.length - 1].route
}

export function get_current_title() {
    const pages = getCurrentPages()
    return '';
}

// 把日期格式全部转化成日期字符串
export function search_obj_date(o) {
    // console.log('33333ooo', o)
    if (variableType.isObject(o)) {
        each(o, (a, b) => {
            if (variableType.isObject(a)) {
                search_obj_date(o[b]);
            } else if (variableType.isDate(a)) {
                o[b] = format_date(a);
            }
        });
    }
}

export function format_date(d) {
    function pad(n) {
        return n < 10 ? `0${n}` : n;
    }

    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${pad(d.getMilliseconds())}`;
}

export function get_market_source(pname) {
    switch (pname) {
        case 'com.huawei.appmarket':
            return 'xm-huaweistore';
        case 'com.vivo.hybrid':
            return 'xm-vivostore';
        case 'com.pandareader.quickapp':
            return 'xm-vivostore';
        case 'com.miui.home':
            return 'xm-xiaomistore';
        case 'search':
            return 'xm-huaweistore';
        case 'com.nearme.instant.platform':
            return 'xm-oppostore';
        case 'com.oppo.market':
            return 'xm-oppostore';
        case 'com.vivo.hybrid.sdkdemo':
            return 'xm-vivostore';
        case 'com.miui.quickappCenter':
            return 'xm-xiaomistore';
        case 'com.xiaomi.market':
            return 'xm-xiaomistore';
        case 'quickSearch':
            return 'xm-huaweistore';
        case 'com.miui.hybrid':
            return 'xm-xiaomistore';
        case 'com.huawei.android.launcher':
            return 'xm-huaweistore';
        case 'com.meizu.flyme.launcher':
            return 'xm-meizustore';
        case 'com.miui.personalassistant':
            return 'xm-xiaomistore';
        case 'com.oppo.launcher':
            return 'xm-oppostore';
        default:
            return 'xm-unknown';
    }
}



export function encrypt_data(data, qmkey) {
    const key = MD5(qmkey);
    const input = JSON.stringify(data);
    const _input = str_to_utf8(input);
    const _key = str_to_utf8(key);
    const d = [];
    for (let i = 0; i < _input.length; i++) {
        const input_i = _input[i];
        const value_i = _key[i % _key.length];
        const xorValue = input_i ^ value_i;
        d.push(xorValue);
    }
    const f = String.fromCharCode.apply(null, d);
    // BASE64.btoa(f);
    return BASE64.btoa(f);
}

function str_to_utf8(str) {
    // 字符串转utf8 字节数组（解决中文乱码问题）
    const bytes = new Array();
    let len; let
        c;
    len = str.length;
    for (let i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if (c >= 0x010000 && c <= 0x10FFFF) {
            bytes.push(((c >> 18) & 0x07) | 0xF0);
            bytes.push(((c >> 12) & 0x3F) | 0x80);
            bytes.push(((c >> 6) & 0x3F) | 0x80);
            bytes.push((c & 0x3F) | 0x80);
        } else if (c >= 0x000800 && c <= 0x00FFFF) {
            bytes.push(((c >> 12) & 0x0F) | 0xE0);
            bytes.push(((c >> 6) & 0x3F) | 0x80);
            bytes.push((c & 0x3F) | 0x80);
        } else if (c >= 0x000080 && c <= 0x0007FF) {
            bytes.push(((c >> 6) & 0x1F) | 0xC0);
            bytes.push((c & 0x3F) | 0x80);
        } else {
            bytes.push(c & 0xFF);
        }
    }
    return bytes;
}

export const native_to_string = Object.prototype.toString;

const ToStringTypes = {
    String: 'String',
    Number: 'Number',
    Boolean: 'Boolean',
    RegExp: 'RegExp',
    Null: 'Null',
    Undefined: 'Undefined',
    Symbol: 'Symbol',
    Object: 'Object',
    Date: 'Date',
    Array: 'Array',
    process: 'process',
    Window: 'Window',
    Function: 'Function'
};

export function is_type(type) {
    return function (value) {
        return native_to_string.call(value) === `[object ${type}]`;
    };
}

export const variableType = {
    isNumber: is_type(ToStringTypes.Number),
    isString: is_type(ToStringTypes.String),
    isBoolean: is_type(ToStringTypes.Boolean),
    isNull: is_type(ToStringTypes.Null),
    isUndefined: is_type(ToStringTypes.Undefined),
    isSymbol: is_type(ToStringTypes.Symbol),
    isFunction: is_type(ToStringTypes.Function),
    isObject: is_type(ToStringTypes.Object),
    isArray: is_type(ToStringTypes.Array),
    isDate: is_type(ToStringTypes.Date)
};

export function is_empty_object(obj) {
    return variableType.isObject(obj) && Object.keys(obj).length === 0;
}

export function is_empty(wat) {
    return (variableType.isString(wat) && wat.trim() === '') || wat === undefined || wat === null;
}

// 缓存 - 存
export function set_storage(key, value) {
    uni.setStorageSync(key, value)
}

// 缓存 - 取
export function get_storage(key) {
    return uni.getStorageSync(key)
}

// 对象转成参数字符串
export function querystring(obj){
    let strArr = []
    for(let key in obj){
        strArr.push(`${key}=${obj[key]}`)
    }
    return strArr.join('&')
}