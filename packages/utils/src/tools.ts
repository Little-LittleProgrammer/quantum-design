import { isBase, isFunction, isMap, isObject, isRegExp, isSet, isSymbol } from './is';
export function deep_copy<T>(target:T, map = new Map()):T { //  深拷贝
    // 判断引用类型的temp
    function check_temp(target:any) {
        const _c = target.constructor;
        return new _c();
    }

    // 不可遍历应用类型深拷贝
    // 拷贝方法
    function clone_func(func:Function):Function | null {
        const _bodyReg = /(?<={)(.|\n)+(?=})/m;
        const _paramReg = /(?<=\().+(?=\)\s+{)/;
        const _funcStr = func.toString();
        if (func.prototype) {
            const _param = _paramReg.exec(_funcStr);
            const _body = _bodyReg.exec(_funcStr);
            if (_body) {
                if (_param) {
                    const _paramArr = _param[0].split(',');
                    return new Function(..._paramArr, _body[0]);
                } else {
                    return new Function(_body[0]);
                }
            } else {
                return null;
            }
        } else {
            // eslint-disable-next-line
            return eval(_funcStr);
        }
    }
    // 拷贝Symbol
    function clone_symbol(target: T): T {
        return Object(Symbol.prototype.valueOf.call(target));
    }
    // 拷贝RegExp
    function clone_reg(target: RegExp): RegExp {
        const _result = new RegExp(target.source);
        _result.lastIndex = target.lastIndex;
        return _result;
    }

    // 基本数据类型直接返回
    if (isBase(target)) return target;
    // 判断 不可遍历类型, 并拷贝
    if (isFunction(target)) return clone_func(target) as unknown as T;
    if (isRegExp(target)) return clone_reg(target) as unknown as T;
    if (isSymbol(target)) return clone_symbol(target);

    // 引用数据类型特殊处理
    const _temp = check_temp(target);
    // 防止循环引用
    if (map.get(target)) {
        return map.get(target);
    }
    map.set(target, _temp);
    // 处理 Map类型
    if (isMap(target)) {
        target.forEach((val, key) => {
            _temp.set(key, deep_copy(val, map));
        });
        return _temp;
    }
    // 处理 Set类型
    if (isSet(target)) {
        target.forEach((val) => {
            _temp.add(deep_copy(val, map));
        });
        return _temp;
    }
    // 处理数据和对象
    for (const key in target) {
        // 递归
        _temp[key] = deep_copy(target[key], map);
    }
    return _temp;
}

export function first_to_upper(str: string) {
    return str.trim().toLowerCase().replace(str[0], str[0].toUpperCase());
}

export function get_uuid(len: number, radix?: number): string { //  指定长度和基数
    const _chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    const _uuid:string[] = [];
    let i;
    radix = radix || _chars.length;

    if (len) {
        // Compact form
        for (i = 0; i < len; i++) _uuid[i] = _chars[0 | Math.random() * radix];
    } else {
        // rfc4122, version 4 form
        let r;

        // rfc4122 requires these characters
        _uuid[8] = _uuid[13] = _uuid[18] = _uuid[23] = '-';
        _uuid[14] = '4';

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!_uuid[i]) {
                r = 0 | Math.random() * 16;
                _uuid[i] = _chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }
    return _uuid.join('');
}

export function deep_merge<T = any>(src: any = {}, target: any = {}): T {
    let key: string;
    for (key in target) {
        src[key] = isObject(src[key]) ? deep_merge(src[key], target[key]) : (src[key] = target[key]);
    }
    return src;
}
/**
 * 防抖截流
 * @param {*} fn 方法
 * @param {*} data 配置
 */
export function throttle_event(fn: any, data: any) {
    // 清除定时器
    clearTimeout(fn.__timebar);
    // 启动节流
    if (data !== true) {
        // 定义默认值
        data = data || {};
        const params = {
            time: data.time || 200,
            context: data.context || null,
            args: data.args
        };
        // 执行定时器
        // 函数也属于对象，因此可以添加属性
        return new Promise((resolve) => {
            fn.__timebar = setTimeout(function() {
                // 执行方法
                const _res = fn.apply(params.context, params.args);
                resolve(_res);
            }, params.time);
        });
    } else {
        // 如果是清除防抖
    }
}

/**
 * 快速排序, 会改变原数组
 * @param nums :待排序数组
 * @returns 排序好的数组
 * @describe 将每个元素放入他该放的位置, 类似前序, 不稳定排序
 */
export function quick_sort(nums: number[]) {
    function shuffle(nums: number[]) { // 随机打乱
        const _n = nums.length;
        for (let i = 0; i < _n; i++) {
            const _r = i + Math.floor(Math.random() * (_n - i));
            swap(nums, i, _r);
        }
    }
    function sort(nums:number[], low:number, high: number) {
        if (low >= high) {
            return;
        }

        const _p = partition(nums, low, high);

        sort(nums, low, _p - 1);
        sort(nums, _p + 1, high);
    }
    function partition(nums:number[], low:number, high: number): number {
        const _value = nums[low];
        let i = low + 1; let j = high;
        while (i <= j) {
            while (i < high && nums[i] <= _value) {
                i++;
            }
            while (j > low && nums[j] > _value) {
                j--;
            }
            if (i >= j) break;
            swap(nums, i, j);
        }
        swap(nums, low, j);
        return j;
    }
    function swap(nums: number[], i:number, j:number) {
        const _temp = nums[i];
        nums[i] = nums[j];
        nums[j] = _temp;
    }
    shuffle(nums);
    sort(nums, 0, nums.length - 1);
    return nums;
}
