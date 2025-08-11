import { isString, isBase, isFunction, isRegExp, isObject } from './is';

/**
 * 将字符串转换为布尔值
 * @param val 字符串值
 * @returns 布尔值或原值
 */
export function stringToBoolean(val: string): boolean | string {
    if (!isString(val)) {
        return val;
    }

    const lowerVal = val.toLowerCase().trim();
    if (lowerVal === 'true') {
        return true;
    }
    if (lowerVal === 'false') {
        return false;
    }

    return val;
}

/**
 * 安全的函数字符串解析
 * @param funcStr 函数字符串
 * @returns 解析后的函数或null
 */
function parseFunctionString(funcStr: string): Fn | null {
    try {
        // 移除可能的危险代码
        if (funcStr.includes('require') || funcStr.includes('import') || funcStr.includes('eval')) {
            console.warn('不安全的函数字符串，拒绝解析');
            return null;
        }

        // 尝试使用 Function 构造器而不是 eval
        if (funcStr.includes('=>')) {
            // 箭头函数处理
            return new Function(`return ${funcStr}`)();
        } else if (funcStr.includes('function')) {
            // 普通函数处理
            return new Function(`return ${funcStr}`)();
        }

        return null;
    } catch (error) {
        console.warn('函数字符串解析失败:', error);
        return null;
    }
}

/**
 * 安全的对象字符串解析
 * @param objStr 对象字符串
 * @returns 解析后的对象
 */
function parseObjectString(objStr: string): Record<string, any> {
    try {
        // 确保字符串被正确包装
        let processedStr = objStr.trim();
        if (!processedStr.startsWith('(')) {
            processedStr = `(${processedStr}`;
        }
        if (!processedStr.endsWith(')')) {
            processedStr = `${processedStr})`;
        }

        // 使用 Function 构造器替代 eval
        return new Function(`return ${processedStr}`)();
    } catch (error) {
        console.warn('对象字符串解析失败:', error);
        throw new Error(`无法解析对象字符串: ${error.message}`);
    }
}

/**
 * 创建相同类型的空对象
 * @param target 目标对象
 * @returns 新的同类型对象
 */
function createSameTypeObject(target: any): any {
    try {
        const constructor = target.constructor;
        return new constructor();
    } catch (error) {
        // 如果构造函数调用失败，返回普通对象或数组
        console.log(error);
        return Array.isArray(target) ? [] : {};
    }
}

/**
 * 深度遍历处理对象
 * @param target 目标对象
 * @param processMap 防循环引用的Map
 * @returns 处理后的对象
 */
function deepTraverseAndProcess(target: any, processMap = new Map()): any {
    // 处理字符串类型
    if (isString(target)) {
        // 处理函数字符串
        if (target.includes('function') || target.includes('=>')) {
            const parsedFunc = parseFunctionString(target);
            return parsedFunc || target;
        }

        // 处理布尔值字符串
        const booleanResult = stringToBoolean(target);
        if (typeof booleanResult === 'boolean') {
            return booleanResult;
        }

        return target;
    }

    // 基本类型直接返回
    if (isBase(target) || isRegExp(target) || isFunction(target)) {
        return target;
    }

    // 防止循环引用
    if (processMap.has(target)) {
        return processMap.get(target);
    }

    const newObject = createSameTypeObject(target);
    processMap.set(target, newObject);

    // 递归处理对象属性
    for (const key in target) {
        if (Object.prototype.hasOwnProperty.call(target, key)) {
            newObject[key] = deepTraverseAndProcess(target[key], processMap);
        }
    }

    return newObject;
}

/**
 * 解析schemas，将字符串转换为对象
 * @param schema 待解析的schema
 * @returns 解析后的对象
 */
export function parseSchemas(schema: string | Record<string, any>): Record<string, any> {
    try {
        let initialObject: Record<string, any>;

        if (isObject(schema)) {
            initialObject = schema;
        } else if (isString(schema)) {
            initialObject = parseObjectString(schema);
        } else {
            throw new Error('schema 必须是字符串或对象类型');
        }

        return deepTraverseAndProcess(initialObject);
    } catch (error) {
        console.error('parseSchemas 执行失败:', error);
        throw error;
    }
}

/**
 * 处理特殊类型转换为字符串
 * @param value 特殊类型值
 * @returns 字符串表示
 */
function handleSpecialTypeToString(value: any): string {
    if (isFunction(value)) {
        return value.toString();
    }
    if (isRegExp(value)) {
        return value.toString();
    }
    return String(value);
}

/**
 * 深度序列化处理
 * @param target 目标对象
 * @param processMap 防循环引用的Map
 * @returns 序列化后的对象
 */
function deepSerializeProcess(target: any, processMap = new Map()): any {
    // 基本类型直接返回
    if (isBase(target)) {
        return target;
    }

    // 特殊类型转换为字符串
    if (isFunction(target) || isRegExp(target)) {
        return handleSpecialTypeToString(target);
    }

    // 防止循环引用
    if (processMap.has(target)) {
        return processMap.get(target);
    }

    const newObject = createSameTypeObject(target);
    processMap.set(target, newObject);

    // 递归处理对象属性
    for (const key in target) {
        if (Object.prototype.hasOwnProperty.call(target, key)) {
            newObject[key] = deepSerializeProcess(target[key], processMap);
        }
    }

    return newObject;
}

/**
 * 序列化对象为字符串
 * @param value 待序列化的值
 * @returns JSON字符串
 */
export function serializeToString<T>(value: T): string {
    try {
        if (isString(value)) {
            return value;
        }

        const serializedObject = deepSerializeProcess(value);
        return JSON.stringify(serializedObject, null, 4);
    } catch (error) {
        console.error('serializeToString 执行失败:', error);
        throw new Error(`序列化失败: ${error.message}`);
    }
}
