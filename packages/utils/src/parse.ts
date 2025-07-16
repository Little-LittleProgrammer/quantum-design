import { isString, isBase, isFunction, isRegExp, isObject, isBoolean } from './is';

export function stringToBoolean(val: string) {
    if (isBoolean(val)) {
        return val === 'true';
    }
    return val;
}

/**
 * 解析schemas，将字符串转换为对象
 * @param schema
 * @returns
 */
export function parseSchemas(schema: string | Record<string, any>) {
    let firstDeal: Record<string, any> = {};
    if (!isObject(schema)) {
        if (!schema.startsWith('(')) {
            schema = `(${schema}`;
        }
        if (!schema.endsWith(')')) {
            schema = `${schema})`;
        }
        // eslint-disable-next-line no-eval
        firstDeal = eval(schema);
    } else {
        firstDeal = schema;
    }

    // 判断引用类型的temp
    function check_temp(target:any) {
        const _c = target.constructor;
        return new _c();
    }
    function dfs(target: any, map = new Map()) {
        if (isString(target)) {
            if ((target.includes('function') || target.includes('=>'))) {
                target = target.replace(/;/g, '\n');
                // eslint-disable-next-line no-eval
                return eval(`(${target})`); // 字符串转方法
            // return new Function(`return ${target}`)(); // 字符串转方法
            } else if (isBoolean(target)) {
                return stringToBoolean(target);
            }
            // else if (/^[-]?[0-9]*[.]?[0-9]*$/.test(target)) {
            //     return +target;
            // }
        }
        if (isBase(target) || isRegExp(target) || isFunction(target)) {
            return target;
        }
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
    const result = dfs(firstDeal);
    return result;
}

/**
 * 序列化对象为字符串
 * @param value
 * @returns
 */
export function serializeToString<T>(value: T): string {
    if (isString(value)) {
        return value;
    }
    function deal_special(val: any): string {
        // 压缩方法
        return val.toString().replace(/\n/g, ';');
    }
    // 判断引用类型的temp
    function check_temp(target: any) {
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
