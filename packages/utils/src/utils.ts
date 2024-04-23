import { isBase, isFunction, isMap, isObject, isRegExp, isSet, isString, isSymbol } from './is';

export function js_utils_deep_copy<T>(target:T, map = new Map()):T { //  深拷贝
    // 判断引用类型的temp
    function check_temp(target:any) {
        const _c = target.constructor;
        return new _c();
    }

    // 不可遍历应用类型深拷贝
    // 拷贝方法
    function clone_func(func:Fn):Fn | null {
        const _bodyReg = /(?<={)(.|\n)+(?=})/m;
        const _paramReg = /(?<=\().+(?=\)\s+{)/;
        const _funcStr = func.toString();
        if (func.prototype) {
            const _param = _paramReg.exec(_funcStr);
            const _body = _bodyReg.exec(_funcStr);
            if (_body) {
                if (_param) {
                    const _paramArr = _param[0].split(',');
                    return new Function(..._paramArr, _body[0]) as Fn;
                } else {
                    return new Function(_body[0]) as Fn;
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
    if (isSymbol(target)) return clone_symbol(target) as unknown as T;

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
            _temp.set(key, js_utils_deep_copy(val, map));
        });
        return _temp;
    }
    // 处理 Set类型
    if (isSet(target)) {
        target.forEach((val) => {
            _temp.add(js_utils_deep_copy(val, map));
        });
        return _temp;
    }
    // 处理数据和对象
    for (const key in target) {
        // 递归
        _temp[key] = js_utils_deep_copy(target[key], map);
    }
    return _temp;
}

export function js_utils_first_to_upper(str: string) {
    return str.trim().toLowerCase().replace(str[0], str[0].toUpperCase());
}

export function js_utils_get_uuid(len: number, radix?: number): string { //  指定长度和基数
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

export function js_utils_deep_merge<T = any>(src: any = {}, target: any = {}): T {
    let key: string;
    for (key in target) {
        src[key] = isObject(src[key]) ? js_utils_deep_merge(src[key], target[key]) : (src[key] = target[key]);
    }
    return src;
}
/**
 * 防抖截流
 * @param {*} fn 方法
 * @param {*} data 配置
 */
export function js_utils_throttle_event(fn: any, data: any) {
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
export function js_utils_quick_sort(nums: number[]) {
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

/**
 * 格式化数字
 */
export function js_utils_format_money_num<T extends string | number>(num: T): string {
    if (!num && num !== 0) {
        return '';
    }
    if (num.toString().includes('--')) {
        return num.toString();
    }
    let _str = '';
    _str = isString(num) ? num : num + '';
    const _resArr = _str.includes('.') ? _str.split('.') : [_str, '00'];
    const _int = _resArr[0].split('').reverse();
    // 如果含逗号，则代表已经格式化成功，则直接返回
    if (_int.includes(',')) {
        return _resArr.join('.');
    }
    const _formatArr = [];
    for (let i = 0; i < _int.length; i++) {
        _formatArr.push(_int[i]);
        if ((i + 1) % 3 === 0 && i !== _int.length - 1) {
            _formatArr.push(',');
        }
    }
    const _decimals = _resArr[1];
    return _formatArr.reverse().join('') + '.' + _decimals;
}

/**
 * 为对象指定位置添加新属性
 * @param obj :目标对象
 * @param key :要添加的新属性
 * @param value :新属性的值
 * @param index :添加位置，不传或长度超出则添加至末尾
 * @returns 新对象
 */
export function js_utils_add_to_object(obj: Record<string | number, any>, key: string | number, value: any, index: number) {
    const temp: Record<string, any> = {};
    let i = 0;
    // 如果未传index或索引超出对象size，则添加至末尾
    if ((!index || index >= Object.keys(obj).length) && key && value) {
        obj[key] = value;
        return obj;
    }
    // 按顺序循环遍历原对象
    for (const prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
            // 如果位置匹配，则添加新属性
            if (i === index && key && value) {
                temp[key] = value;
            }
            // 添加当前属性到对象模版中
            temp[prop] = obj[prop];
            // 计数增加
            i++;
        }
    }
    return temp;
}

/**
 * 查找多层值
 * @param object 要查找的对象 {a: {b:{c: {}}}}
 * @param string 要查找的属性 'a.b.c'
 * @returns 值
 */
export function js_utils_find_attr(object: any, path: string){
    const tags = path.replace(/\[(\w+)\]/g, '.$1').replace(/\["(\w+)"\]/g, '.$1').replace(/\['(\w+)'\]/g, '.$1').split('.');
    const tagsCopy = JSON.parse(JSON.stringify(tags));
    for (const _key of tagsCopy) {
        object = object[tags[0]];
        if (object === undefined || object === null) {
            return undefined;
        }
        tags.shift();
    }
    return object;
}

/**
 * @param path 要设置的属性 'a.b.c'
 * @param value 设置值
 * @param obj 要设置的对象 {a: {b:{c: {}}}}
 */
export function js_utils_edit_attr(path:string, value: any, obj:any) {
    const _list = path.replace(/\[(\w+)\]/g, '.$1').replace(/\["(\w+)"\]/g, '.$1').replace(/\['(\w+)'\]/g, '.$1').split('.');
    const _length = _list.length - 1;
    _list.reduce((cur: any, key:string, index: number) => {
        if (!(cur[key]))
            cur[key] = {};
        if (index === _length) {
            cur[key] = value;
        }
        return cur[key];
    }, obj);
}

/**
 * 金额转化-分转元
 * @param fen 要转化的金额
 * @param isFormat 是否要展示为千分位格式，如：20,000.10
 * @param digit 转化倍数，默认为100
 */
export function js_utils_fen_to_yuan(fen: number | string, isFormat = false, digit = 100): string {
    const _num = (Number(fen) / digit).toFixed(2);
    return isFormat ? js_utils_format_money_num(_num) : _num;
}

/**
 * 金额转化-元转分
 * @param yuan 要转化的金额
 * @param digit 转化倍数，默认为100
 */
export function js_utils_yuan_to_fen(yuan: number | string, digit = 100): number {
    let _dotSum = 0;
    const _amountStr = yuan.toString();
    const _digitStr = digit.toString();
    // 计算小数点位数
    if (_amountStr.includes('.')) {
        _dotSum += _amountStr.split('.')[1].length;
    }
    if (_digitStr.includes('.')) {
        _dotSum += _digitStr.split('.')[1].length;
    }
    return Number(_amountStr.replace('.', '')) * Number(_digitStr.replace('.', '')) / Math.pow(10, _dotSum);
}
/**
 * 数组转化成csv文件
 * @param list 转化的数组
 * @returns 结果下载链接
 * @example
 * ```
 * const _list = [["name", "city"], ["sam", "shanghai"]]
 * array_to_csv(_list)
 * ```
 */
export function js_utils_array_to_csv(list: string[][]) {
    let _csvContent = 'data:text/csv;charset=utf-8,';
    list.forEach((row) => {
        const _rowStr = row.join(',');
        _csvContent += _rowStr + '\r\n';
    });
    return encodeURI(_csvContent);
}
/**
 * csv转化为 array
 * @param file File
 * @param encoding 编码格式
 * @returns promise
 */
export function js_utils_csv_to_array(file: File, encoding = 'utf-8') {
    const _fileReader = new FileReader();
    _fileReader.readAsText(file, encoding);
    return new Promise((resolve, reject) => {
        _fileReader.onload = function() {
            if (isString(this.result)) {
                const _data = this.result.split('\n');
                const _res:string[][] = [];
                _data.map(item => {
                    if (item) {
                        _res.push(item.split(',').map(e => e.trim()));
                    }
                });
                resolve(_res);
            }
            reject('请上传正确的格式');
        };
    });
}

export function serializeToString<T>(value: T): string {
    if (isString(value)) {
        return value;
    }
    function deal_special(val: any): string {
        // 压缩方法
        return val.toString().replace(/\n/g, ';');
    }
    // 判断引用类型的temp
    function check_temp(target:any) {
        const _c = target.constructor;
        return new _c();
    }
    let serializeObj: Record<string, any> = {};
    function dfs(target: any, map = new Map()) {
        if (isBase(target)) {
            return target;
        }
        if (isFunction(target)) {
            return deal_special(target);
        }
        if (isRegExp(target)) return deal_special(target);

        const _temp = check_temp(target);
        // 防止循环引用
        if (map.get(target)) {
            return map.get(target);
        }
        map.set(target, _temp);
        // 处理数组和对象
        for (const key in target) {
        // 递归
            _temp[key] = dfs(target[key], map);
        }
        return _temp;
    }
    serializeObj = dfs(value);
    return JSON.stringify(serializeObj, null, 4);
}
