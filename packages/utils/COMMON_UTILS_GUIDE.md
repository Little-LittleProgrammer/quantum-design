# packages/utils 常用方法学习笔记

这份文档不是完整 API 手册，而是按"仓库内实际使用频率 + 测试覆盖 + 日常开发通用性"筛出来的一份学习笔记。

适合快速建立认知：

- 先看哪些方法最常用
- 再看它们分别解决什么问题
- 最后记住几个容易踩坑的行为差异

## 1. 高频方法速览

### 1.1 仓库里最常出现的一批

| 分类        | 常用方法                                                                                                  | 典型场景                             |
| ----------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| 类型判断    | `isFunction` `isArray` `isObject` `isString` `isNullOrUndef`                                              | 组件入参兜底、表单值判断、运行时保护 |
| 对象路径    | `js_utils_find_attr` `js_utils_edit_attr`                                                                 | 读写深层对象、动态表单、字段映射     |
| 对象合并    | `js_utils_deep_merge`                                                                                     | 默认配置和用户配置合并               |
| 差异计算    | `js_utils_diff`                                                                                           | 比较配置项变化，只提交改动部分       |
| DOM/浏览器  | `js_utils_copy_code` `js_utils_dom_add_class` `js_utils_dom_remove_class` `js_utils_update_css_variables` | 复制代码、切主题、切换类名           |
| 字符串转换  | `js_utils_first_to_upper` `js_utils_kebab_to_camel_case`                                                  | 事件名拼接、属性名转换               |
| 兜底取值    | `getFirstNonEmpty`                                                                                        | 多个来源取第一个有效值               |
| 树结构      | `js_utils_find_node_all`                                                                                  | 树表格、多层节点筛选                 |
| 解析/序列化 | `parseSchemas` `serializeToString`                                                                        | 配置字符串转对象、对象回写字符串     |

### 1.2 学习顺序建议

1. 先掌握 `is.ts`
2. 再掌握 `utils.ts` 里的路径读写和对象合并
3. 然后看 `dom-util.ts`
4. 最后看 `parse.ts`、`indexed-db.ts` 和 `extra.ts`

## 2. 类型判断工具

源码位置：

- `packages/utils/src/is.ts`

### 2.1 `jsIs`

```ts
jsIs(value, 'String');
jsIs(value, 'Date');
```

核心作用：

- 对 `Object.prototype.toString.call` 做了一层封装
- 适合做底层通用判断

适合理解为：

- 这是很多 `isXxx` 的基础能力

**实现代码：**

```ts
const toString = Object.prototype.toString;

export function jsIs(val: unknown, type: string) {
    return toString.call(val) === `[object ${type}]`;
}
```

### 2.2 `isObject`

```ts
isObject({}); // true
isObject([]); // false
isObject(null); // false
```

特点：

- 只认普通对象
- 不把数组当成对象处理

常见用途：

- 判断配置对象
- 深合并前做对象分支判断

**实现代码：**

```ts
export function isObject(val: any): val is Record<any, any> {
    return val !== null && jsIs(val, 'Object');
}
```

### 2.3 `isFunction` / `isArray` / `isString`

这三个是仓库里最高频的一组判断。

```ts
if (isFunction(onClick)) {
    onClick();
}

if (isArray(data)) {
    data.forEach(renderItem);
}

if (isString(title)) {
    console.log(title.trim());
}
```

适用场景：

- Vue 组件 props 兼容多种写法
- 表单 schema 运行时判断
- 事件回调安全执行

**实现代码：**

```ts
export function isFunction(val: unknown): val is Fn {
    return typeof val === 'function';
}

export function isArray(val: any): val is Array<any> {
    return val && Array.isArray(val);
}

export function isString(val: unknown): val is string {
    return jsIs(val, 'String');
}
```

### 2.4 `isNullOrUndef`

```ts
isNullOrUndef(null); // true
isNullOrUndef(undefined); // true
isNullOrUndef(''); // false
isNullOrUndef(0); // false
```

要点：

- 只判断 `null` 和 `undefined`
- 不会误伤 `0`、`false`、空字符串

这类函数在"配置兜底"和"保留合法假值"场景特别重要。

**实现代码：**

```ts
export function isNull(val: unknown): val is null {
    return val === null;
}

export function isUnDef<T = unknown>(val?: T): val is T {
    return !isDef(val);
}

export function isNullOrUndef(val: unknown): val is null | undefined {
    return isUnDef(val) || isNull(val);
}
```

### 2.5 `isEmpty`

支持判断：

- 数组
- 字符串
- `Map`
- `Set`
- 普通对象

```ts
isEmpty([]); // true
isEmpty({}); // true
isEmpty(''); // true
isEmpty(0); // false
```

注意：

- 它不是通用"空值"判断
- 数字、布尔等基础类型会直接返回 `false`

**实现代码：**

```ts
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
```

### 2.6 `getFirstNonEmpty`

```ts
getFirstNonEmpty(undefined, null, '', 0, 'fallback');
// 返回 ''
```

这个名字容易误导。

实际行为：

- 返回第一个不是 `null`、也不是 `undefined` 的值
- 空字符串 `''`、`0`、`false` 都会被视为有效值

适合用在：

- props 优先级
- query > props > 默认值
- 多来源配置合并前的选择

**实现代码：**

```ts
export function getFirstNonEmpty<T>(...values: (null | T | undefined)[]): T | undefined {
    for (const value of values) {
        if (value !== undefined && value !== null) {
            return value;
        }
    }
    return undefined;
}
```

## 3. 对象、路径与数据处理

源码位置：

- `packages/utils/src/utils.ts`
- `packages/utils/src/diff.ts`

### 3.1 `js_utils_find_attr`

```ts
const data = {
    user: {
        profile: {
            name: 'Evan',
        },
    },
};

js_utils_find_attr(data, 'user.profile.name'); // 'Evan'
```

亮点：

- 支持点路径
- 支持方括号路径
- 支持数组通配符 `*`

```ts
js_utils_find_attr({ list: [{ id: 1 }, { id: 2 }] }, 'list[*].id'); // [1, 2]
```

适合用在：

- 动态表单字段映射
- 配置驱动 UI
- 通用对象取值

**实现代码：**

```ts
export function js_utils_find_attr(object: any, path: string) {
    const tags = path
        .replace(/\[(\w+|\*)\]/g, '.$1')
        .replace(/\["(\w+|\*)"\]/g, '.$1')
        .replace(/\['(\w+|\*)'\]/g, '.$1')
        .split('.')
        .filter(Boolean);

    function findAttr(obj: any, tags: string[]): any[] {
        if (!tags.length) {
            return [obj];
        }

        const currentTag = tags[0];
        const remainingTags = tags.slice(1);

        if (currentTag === '*') {
            if (!Array.isArray(obj)) {
                return [];
            }
            return obj.flatMap((item) => findAttr(item, remainingTags));
        } else {
            if (obj === undefined || obj === null) {
                return [];
            }
            return findAttr(obj[currentTag as string], remainingTags);
        }
    }
    const ans = findAttr(object, tags);
    if (ans.length <= 1) {
        return ans[0];
    }
    return ans;
}
```

### 3.2 `js_utils_edit_attr`

```ts
const data = {};
js_utils_edit_attr('user.profile.name', 'Evan', data);
```

执行后：

```ts
{
    user: {
        profile: {
            name: 'Evan';
        }
    }
}
```

亮点：

- 不存在的路径会自动创建
- 支持数组通配符 `*`
- 支持批量写入

```ts
const data = { users: [{}, {}] };
js_utils_edit_attr('users[*].role', 'admin', data);
```

```ts
const data = { users: [{}, {}] };
js_utils_edit_attr('users[*].city', ['上海', '北京'], data);
```

非常适合：

- 表单回填
- 接口字段映射
- 动态构造嵌套对象

**实现代码：**

```ts
export function js_utils_edit_attr(path: string, value: any, obj: any) {
    const _list = path
        .replace(/\[(\w+|\*)\]/g, '.$1')
        .replace(/\["(\w+|\*)"\]/g, '.$1')
        .replace(/\['(\w+|\*)'\]/g, '.$1')
        .split('.')
        .filter(Boolean);
    const _length = _list.length - 1;

    function setAttr(cur: any, index: number, arrayIndex?: number) {
        if (index > _length) return;
        const key = _list[index];
        if (isNullOrUndef(key) || isNullOrUndef(cur)) return;

        if (key === '*') {
            if (isArray(cur)) {
                const isLastLevel = index + 1 === _length;
                const isValueArray = isArray(value);
                if (isLastLevel && isValueArray) {
                    cur.forEach((item, idx) => setAttr(item, index + 1, idx));
                } else {
                    cur.forEach((item) => setAttr(item, index + 1, arrayIndex));
                }
            }
        } else {
            if (!(key in cur)) {
                cur[key] = isNaN(Number(_list[index + 1])) ? {} : [];
            }
            if (index === _length) {
                if (arrayIndex !== undefined && isArray(value)) {
                    cur[key] = value[arrayIndex];
                } else {
                    cur[key] = value;
                }
            } else {
                setAttr(cur[key], index + 1, arrayIndex);
            }
        }
    }

    setAttr(obj, 0);
}
```

### 3.3 `js_utils_deep_merge`

```ts
const baseConfig = { theme: { mode: 'light' } };
const overrideConfig = { theme: { primary: '#1677ff' } };

js_utils_deep_merge(baseConfig, overrideConfig);
```

结果：

```ts
{
    theme: {
        mode: 'light',
        primary: '#1677ff'
    }
}
```

核心特征：

- 会递归合并普通对象
- 会直接修改第一个参数 `src`

学习时一定记住：

- 它不是纯函数
- 如果不希望原对象被改，先手动拷贝一份

**实现代码：**

```ts
export function js_utils_deep_merge<T = any>(src: any = {}, target: any = {}): T {
    let key: string;
    for (key in target) {
        src[key] = isObject(src[key]) ? js_utils_deep_merge(src[key], target[key]) : (src[key] = target[key]);
    }
    return src;
}
```

### 3.4 `js_utils_deep_copy`

支持处理：

- 普通对象
- 数组
- `Map`
- `Set`
- `RegExp`
- `Symbol`
- 函数
- 循环引用

适合用在：

- 克隆配置快照
- 对比前后的对象状态
- 避免联动修改原始对象

注意：

- 函数复制采用包装函数方式，不是完整还原闭包环境
- 更适合业务对象拷贝，不适合替代专业序列化方案

**实现代码：**

```ts
export function js_utils_deep_copy<T>(target: T, map = new Map()): T {
    function check_temp(target: any) {
        const _c = target.constructor;
        return new _c();
    }

    function clone_func(func: Fn): Fn | null | undefined {
        const wrappedFunc: Fn = function (...args: any[]) {
            return (func as any).apply(this, args);
        };
        map.set(func, wrappedFunc);
        const keys = Object.keys(func as any);
        for (const key of keys) {
            if (key === 'length' || key === 'name' || key === 'prototype' || key === 'caller' || key === 'arguments') continue;
            const desc = Object.getOwnPropertyDescriptor(func as any, key);
            if (!desc) continue;
            try {
                if ('value' in desc) {
                    Object.defineProperty(wrappedFunc, key, { ...desc, value: js_utils_deep_copy((desc as any).value, map) });
                } else {
                    Object.defineProperty(wrappedFunc, key, desc);
                }
            } catch {
                // 某些属性可能不可配置/只读，忽略即可
            }
        }
        return wrappedFunc;
    }

    function clone_symbol(target: T): T {
        return Object(Symbol.prototype.valueOf.call(target));
    }

    function clone_reg(target: RegExp): RegExp {
        const _result = new RegExp(target.source);
        _result.lastIndex = target.lastIndex;
        return _result;
    }

    if (isBase(target)) return target;
    if (isFunction(target)) return clone_func(target) as unknown as T;
    if (isRegExp(target)) return clone_reg(target) as unknown as T;
    if (isSymbol(target)) return clone_symbol(target) as unknown as T;

    const _temp = check_temp(target);
    if (map.get(target)) {
        return map.get(target);
    }
    map.set(target, _temp);

    if (isMap(target)) {
        target.forEach((val, key) => {
            _temp.set(key, js_utils_deep_copy(val, map));
        });
        return _temp;
    }
    if (isSet(target)) {
        target.forEach((val) => {
            _temp.add(js_utils_deep_copy(val, map));
        });
        return _temp;
    }

    for (const key in target) {
        _temp[key] = js_utils_deep_copy(target[key], map);
    }
    return _temp;
}
```

### 3.5 `js_utils_diff`

```ts
js_utils_diff({ theme: { mode: 'light' }, page: 1 }, { theme: { mode: 'dark' }, page: 1 });
```

返回：

```ts
{
    theme: {
        mode: 'dark';
    }
}
```

适合用在：

- 配置中心保存变更
- 表单脏值比较
- 只上传改动字段

重点注意：

- 数组比较使用 `js_utils_arrays_equal`
- 这个比较不关心顺序，只关心元素和数量是否一致

也就是说：

```ts
js_utils_arrays_equal([1, 2, 3], [3, 2, 1]); // true
```

如果你的业务要求"数组顺序也算变化"，那它就不适合直接拿来用。

**实现代码：**

```ts
type DiffResult<T> = Partial<{
    [K in keyof T]: T[K] extends object ? DiffResult<T[K]> : T[K];
}>;

function js_utils_arrays_equal<T>(a: T[], b: T[]): boolean {
    if (a.length !== b.length) return false;
    const counter = new Map<T, number>();
    for (const value of a) {
        counter.set(value, (counter.get(value) || 0) + 1);
    }
    for (const value of b) {
        const count = counter.get(value);
        if (count === undefined || count === 0) {
            return false;
        }
        counter.set(value, count - 1);
    }
    return true;
}

function js_utils_diff<T extends Record<string, any>>(obj1: T, obj2: T): DiffResult<T> {
    function findDifferences(o1: any, o2: any): any {
        if (Array.isArray(o1) && Array.isArray(o2)) {
            if (!js_utils_arrays_equal(o1, o2)) {
                return o2;
            }
            return undefined;
        }

        if (typeof o1 === 'object' && typeof o2 === 'object' && o1 !== null && o2 !== null) {
            const diffResult: any = {};
            const keys = new Set([...Object.keys(o1), ...Object.keys(o2)]);
            keys.forEach((key) => {
                const valueDiff = findDifferences(o1[key], o2[key]);
                if (valueDiff !== undefined) {
                    diffResult[key] = valueDiff;
                }
            });
            return Object.keys(diffResult).length > 0 ? diffResult : undefined;
        }

        return o1 === o2 ? undefined : o2;
    }

    return findDifferences(obj1, obj2);
}
```

### 3.6 `js_utils_throttle_event`

名字叫 "throttle"，但实际行为更接近"防抖"。

```ts
js_utils_throttle_event(saveConfig, {
    time: 200,
    context: this,
    args: [payload],
});
```

行为特征：

- 每次调用都会先清掉上一次定时器
- 只执行最后一次
- 返回 `Promise`

适合用在：

- 输入联动请求
- 滚动或 resize 回调包装
- 高频配置保存

**实现代码：**

```ts
export function js_utils_throttle_event(fn: any, data: any) {
    clearTimeout(fn.__timebar);
    if (data !== true) {
        data = data || {};
        const params = {
            time: data.time || 200,
            context: data.context || null,
            args: data.args,
        };
        return new Promise((resolve) => {
            fn.__timebar = setTimeout(function () {
                const _res = fn.apply(params.context, params.args);
                resolve(_res);
            }, params.time);
        });
    }
}
```

## 4. DOM 与浏览器工具

源码位置：

- `packages/utils/src/dom-util.ts`
- `packages/utils/src/utils.ts`

### 4.1 `js_utils_copy_code`

```ts
await js_utils_copy_code('npm install @quantum-design/utils');
```

行为：

- 优先用 `navigator.clipboard.writeText`
- 不支持时回退到 `textarea + execCommand`

适合：

- 代码复制按钮
- 表单复制
- 调试信息复制

**实现代码：**

```ts
export async function js_utils_copy_code(str: string) {
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(str);
            return true;
        } else {
            const $input = document.createElement('textarea');
            document.body.appendChild($input);
            $input.value = str;
            $input.select();
            if (document.execCommand('copy')) {
                document.execCommand('copy');
                document.body.removeChild($input);
                return true;
            } else {
                document.body.removeChild($input);
                return false;
            }
        }
    } catch (err) {
        console.error('Failed to copy: ', err);
        return false;
    }
}
```

### 4.2 `js_utils_dom_has_class` / `js_utils_dom_add_class` / `js_utils_dom_remove_class`

这三个通常搭配使用。

```ts
js_utils_dom_add_class(el, 'dark-mode');
js_utils_dom_has_class(el, 'dark-mode');
js_utils_dom_remove_class(el, 'dark-mode');
```

特点：

- 同时兼容 `classList` 和字符串 className 方案
- `add` 支持逗号分隔
- `remove` 支持空格分隔

这点要注意：

- 两个函数的分隔规则不一样
- `add` 用逗号
- `remove` 用空格

**实现代码：**

```ts
export function js_utils_trim(string: string) {
    return (string || '').replace(/^\s+|\s+$/g, '');
}

export function js_utils_dom_has_class(el: Element, cls: string) {
    if (!el || !cls) return false;
    if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.');
    if (el.classList) {
        return el.classList.contains(cls);
    } else {
        return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
    }
}

export function js_utils_dom_add_class(el: Element, cls: string) {
    if (!el) return;
    let curClass = el.className;
    const classes = (cls || '').split(',');

    for (let i = 0, j = classes.length; i < j; i++) {
        const clsName = classes[i];
        if (!clsName) continue;
        if (el.classList) {
            el.classList.add(clsName);
        } else if (!js_utils_dom_has_class(el, clsName)) {
            curClass += ' ' + clsName;
        }
    }
    if (!el.classList) {
        el.className = curClass;
    }
}

export function js_utils_dom_remove_class(el: Element, cls: string) {
    if (!el || !cls) return;
    const classes = cls.split(' ');
    let curClass = ' ' + el.className + ' ';

    for (let i = 0, j = classes.length; i < j; i++) {
        const clsName = classes[i];
        if (!clsName) continue;
        if (el.classList) {
            el.classList.remove(clsName);
        } else if (js_utils_dom_has_class(el, clsName)) {
            curClass = curClass.replace(' ' + clsName + ' ', ' ');
        }
    }
    if (!el.classList) {
        el.className = js_utils_trim(curClass);
    }
}
```

### 4.3 `js_utils_update_css_variables`

```ts
js_utils_update_css_variables({
    '--qd-primary-color': '#1677ff',
    '--qd-bg-color': '#0f172a',
});
```

作用：

- 动态创建或更新一个 `style` 标签
- 把 CSS 变量挂到 `:root`

非常适合：

- 主题切换
- 品牌色切换
- 运行时样式配置

**实现代码：**

```ts
export function js_utils_update_css_variables(variables: Record<string, string>, id: string = '__quantum-design-styles__') {
    const styleElement = document.querySelector(`#${id}`) || document.createElement('style');
    styleElement.id = id;

    let cssText = ':root {';
    for (const key in variables) {
        if (Object.prototype.hasOwnProperty.call(variables, key)) {
            cssText += `${key}: ${variables[key]};`;
        }
    }
    cssText += '}';

    styleElement.textContent = cssText;

    if (!document.querySelector(`#${id}`)) {
        setTimeout(() => {
            document.head.append(styleElement);
        });
    }
}
```

### 4.4 `js_utils_get_current_url`

```ts
const urlInfo = js_utils_get_current_url();
```

返回信息包括：

- `path`
- `fullPath`
- `query`
- `hash`
- `host`
- `origin`

适合：

- 读取当前页面 query
- 表格配置按 URL 持久化
- 调试当前路由上下文

注意：

- 只在浏览器环境可用
- 服务端环境会返回 `null`

**实现代码：**

```ts
export interface UrlInfo {
    path: string;
    fullPath: string;
    query: Record<string, string>;
    hash: string;
    host: string;
    hostname: string;
    origin: string;
    pathname: string;
    port: string;
    protocol: string;
    search: string;
}

export function js_utils_get_current_url(): UrlInfo | null {
    if (!isClient || !window.location) {
        return null;
    }
    try {
        const url = new URL(window.location.href);
        const query: Record<string, string> = {};
        url.searchParams.forEach((value, key) => {
            query[key] = value;
        });
        return {
            path: url.pathname,
            fullPath: url.pathname + url.search,
            query,
            hash: url.hash,
            host: url.host,
            hostname: url.hostname,
            origin: url.origin,
            pathname: url.pathname,
            port: url.port,
            protocol: url.protocol,
            search: url.search,
        };
    } catch (error) {
        console.error('获取当前 URL 失败:', error);
        return null;
    }
}
```

### 4.5 `js_utils_css`

```ts
js_utils_css(dom, 'width', '200px');

js_utils_css(dom, {
    color: 'red',
    width: '200px',
});
```

适合作为简易样式写入工具：

- 快速设置内联样式
- 给 canvas 或临时元素批量赋值

**实现代码：**

```ts
export function js_utils_css(dom: HTMLElement, key: string | Partial<CSSStyleDeclaration>, value?: string) {
    if (typeof key === 'string' && value) {
        dom.style[key as never] = value;
    } else {
        for (const name in key as CSSStyleDeclaration) {
            js_utils_css(dom, name, key[name]);
        }
    }
}
```

## 5. 字符串和命名转换

源码位置：

- `packages/utils/src/utils.ts`
- `packages/utils/src/letter.ts`

### 5.1 `js_utils_first_to_upper`

```ts
js_utils_first_to_upper('click'); // 'Click'
```

典型用途：

- 拼接事件名
- 生成 `onClick` 这类 key

仓库内真实使用场景：

- 表单组件里根据事件名动态生成 `on${Xxx}`

**实现代码：**

```ts
export function js_utils_first_to_upper(str: string) {
    return str.trim().toLowerCase().replace(str[0], str[0].toUpperCase());
}
```

### 5.2 `js_utils_kebab_to_camel_case`

```ts
js_utils_kebab_to_camel_case('user-name'); // 'userName'
```

适合：

- DOM 属性转组件属性
- HTML attribute 转 JS key
- 统一 kebab-case 和 camelCase 两套命名

**实现代码：**

```ts
function js_utils_kebab_to_camel_case(str: string): string {
    return str
        .split('-')
        .filter(Boolean)
        .map((word, index) => (index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
        .join('');
}
```

### 5.3 `js_utils_capitalize_first_letter` / `js_utils_to_lower_case_first_letter`

这两个更偏基础字符串工具。

适合：

- 轻量命名拼接
- 代码生成场景
- 统一字段格式

**实现代码：**

```ts
function js_utils_capitalize_first_letter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function js_utils_to_lower_case_first_letter(str: string): string {
    if (!str) return str;
    return str.charAt(0).toLowerCase() + str.slice(1);
}
```

## 6. 树结构工具

源码位置：

- `packages/utils/src/tree-util.ts`

### 6.1 `js_utils_find_node_all`

```ts
const nodes = js_utils_find_node_all(tree, (node) => node.type === 'file');
```

特点：

- 返回所有满足条件的节点
- 使用广度优先遍历
- 支持自定义 `children` 字段名

```ts
js_utils_find_node_all(tree, matcher, {
    children: 'subItems',
});
```

适合：

- 树表格勾选
- 多层菜单搜索
- 权限树筛选

一个容易记的点：

- 返回顺序是 BFS，不是 DFS

**实现代码：**

```ts
interface TreeHelperConfig {
    id: string;
    children: string;
    pid: string;
}

const DEFAULT_CONFIG: TreeHelperConfig = {
    id: 'id',
    children: 'children',
    pid: 'pid',
};

const getConfig = (config: Partial<TreeHelperConfig>) => Object.assign({}, DEFAULT_CONFIG, config);

export function js_utils_find_node_all<T = any>(tree: T[], func: Fn, config: Partial<TreeHelperConfig> = {}): T[] {
    config = getConfig(config);
    const { children } = config;
    const _list = [...tree];
    const _result: T[] = [];
    while (_list.length) {
        const _curNode = _list.shift()!;
        func(_curNode) && _result.push(_curNode);
        (_curNode as any)[children!] && _list.push(...(_curNode as any)[children!]);
    }
    return _result;
}
```

## 7. 解析与序列化

源码位置：

- `packages/utils/src/parse.ts`

### 7.1 `parseSchemas`

```ts
parseSchemas('{ name: "test", isActive: "true" }');
```

它会做几件事：

- 把对象字符串解析为对象
- 把 `'true'` / `'false'` 转成布尔值
- 尝试把安全的函数字符串转成函数
- 深度遍历整个对象

适合：

- 动态 schema 配置
- 低代码配置解析
- 字符串配置转运行时对象

注意：

- 内部明确拦截了 `require`、`import`、`eval` 这类危险字符串
- 但它本质仍然是"字符串转可执行结构"的能力，用时仍要控制来源

**实现代码：**

```ts
function stringToBoolean(val: string): boolean | string {
    if (!isString(val)) return val;
    const lowerVal = val.toLowerCase().trim();
    if (lowerVal === 'true') return true;
    if (lowerVal === 'false') return false;
    return val;
}

function parseFunctionString(funcStr: string): Fn | null {
    try {
        if (funcStr.includes('require') || funcStr.includes('import') || funcStr.includes('eval')) {
            console.warn('不安全的函数字符串，拒绝解析');
            return null;
        }
        if (funcStr.includes('=>')) {
            return new Function(`return ${funcStr}`)();
        } else if (funcStr.includes('function')) {
            return new Function(`return ${funcStr}`)();
        }
        return null;
    } catch (error) {
        console.warn('函数字符串解析失败:', error);
        return null;
    }
}

function parseObjectString(objStr: string): Record<string, any> {
    try {
        let processedStr = objStr.trim();
        if (!processedStr.startsWith('(')) processedStr = `(${processedStr}`;
        if (!processedStr.endsWith(')')) processedStr = `${processedStr})`;
        return new Function(`return ${processedStr}`)();
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.warn('对象字符串解析失败:', error);
        throw new Error(`无法解析对象字符串: ${errorMessage}`);
    }
}

function createSameTypeObject(target: any): any {
    try {
        const constructor = target.constructor;
        return new constructor();
    } catch (error) {
        console.log(error);
        return Array.isArray(target) ? [] : {};
    }
}

function deepTraverseAndProcess(target: any, processMap = new Map()): any {
    if (isString(target)) {
        if (target.includes('function') || target.includes('=>')) {
            const parsedFunc = parseFunctionString(target);
            return parsedFunc || target;
        }
        const booleanResult = stringToBoolean(target);
        if (typeof booleanResult === 'boolean') return booleanResult;
        return target;
    }
    if (isBase(target) || isRegExp(target) || isFunction(target)) return target;
    if (processMap.has(target)) return processMap.get(target);

    const newObject = createSameTypeObject(target);
    processMap.set(target, newObject);
    for (const key in target) {
        if (Object.prototype.hasOwnProperty.call(target, key)) {
            newObject[key] = deepTraverseAndProcess(target[key], processMap);
        }
    }
    return newObject;
}

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
```

### 7.2 `serializeToString`

```ts
serializeToString({
    name: 'test',
    handler: () => 'ok',
    pattern: /test/gi,
});
```

行为：

- 函数会被转成字符串
- 正则会被转成字符串
- 普通对象会被格式化成 JSON 字符串
- 检测到循环引用会直接抛错

适合：

- 把运行时 schema 回写到编辑器
- 把对象保存为可展示字符串
- 调试复杂配置对象

**实现代码：**

```ts
function handleSpecialTypeToString(value: any): string {
    if (isFunction(value)) return value.toString();
    if (isRegExp(value)) return value.toString();
    return String(value);
}

function deepSerializeProcess(target: any, processMap = new Map()): any {
    if (isBase(target)) return target;
    if (isFunction(target) || isRegExp(target)) return handleSpecialTypeToString(target);
    if (processMap.has(target)) {
        throw new Error('检测到循环引用，无法序列化');
    }

    const newObject = createSameTypeObject(target);
    processMap.set(target, newObject);
    for (const key in target) {
        if (Object.prototype.hasOwnProperty.call(target, key)) {
            newObject[key] = deepSerializeProcess(target[key], processMap);
        }
    }
    return newObject;
}

export function serializeToString<T>(value: T): string {
    try {
        if (isString(value)) return value;
        const serializedObject = deepSerializeProcess(value);
        return JSON.stringify(serializedObject, null, 4);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('serializeToString 执行失败:', error);
        throw new Error(`序列化失败: ${errorMessage}`);
    }
}
```

## 8. 存储与持久化

源码位置：

- `packages/utils/extra.ts`
- `packages/utils/src/storage.ts`
- `packages/utils/src/cipher.ts`
- `packages/utils/src/indexed-db.ts`

### 8.1 `js_create_local_storage` / `js_create_session_storage`

```ts
const local = js_create_local_storage({
    prefixKey: 'user',
    timeout: 60 * 60,
});

local.set('token', 'xxx');
local.get('token');
```

能力：

- 自动加前缀
- 支持过期时间
- 封装了 `set/get/remove/clear`

适合：

- 用户配置缓存
- 页面级临时状态
- token 之外的轻量缓存

注意：

- 默认逻辑里 `hasEncrypt` 是关闭的
- `clear()` 会清空整个底层 storage，而不只是当前前缀

**实现代码：**

```ts
// WebStorage 类
class WebStorage {
    storage: Storage;
    hasEncrypt: boolean;
    encryption: Encryption;
    prefixKey: string;
    timeout: number | null;

    constructor(storage: Storage, prefixKey: string, hasEncrypt: boolean, encryption: Encryption, timeout: number | null) {
        this.storage = storage;
        this.prefixKey = prefixKey;
        this.hasEncrypt = hasEncrypt;
        this.encryption = encryption;
        this.timeout = timeout;
    }

    getKey(key: string) {
        return `${this.prefixKey}_${key}`.toUpperCase();
    }

    set(key: string, value: any, expire: number | null = this.timeout) {
        const stringData = JSON.stringify({
            value,
            time: Date.now(),
            expire: !isNullOrUndef(expire) ? new Date().getTime() + expire * 1000 : null,
        });
        const storageData = this.hasEncrypt ? this.encryption.encryptByAES(stringData) : stringData;
        this.storage.setItem(this.getKey(key), storageData);
    }

    get(key: string): any {
        const val = this.storage.getItem(this.getKey(key));
        if (!val) return null;
        try {
            const decVal = this.hasEncrypt ? this.encryption.decryptByAES(val) : val;
            const data = JSON.parse(decVal);
            const { value, expire } = data;
            if (isNullOrUndef(expire) || expire >= new Date().getTime()) {
                return value;
            }
            this.remove(key);
        } catch (e) {
            return null;
        }
    }

    remove(key: string) {
        this.storage.removeItem(this.getKey(key));
    }

    clear(): void {
        this.storage.clear();
    }
}

// 工厂方法
export const js_create_storage = ({ prefixKey = '', storage = localStorage, timeout = null, hasEncrypt = false }: Options) => {
    const encryption = new Encryption({
        key: '1F1F1F1E1E1E1D1D',
        iv: '1A1A1A1B1B1B1C1C',
    });
    return new WebStorage(storage, prefixKey, hasEncrypt, encryption, timeout);
};

export const js_create_session_storage = (options: Options = {}) => {
    return js_create_storage(createOptions(sessionStorage, { ...options, prefixKey: 'session' }));
};

export const js_create_local_storage = (options: Options = {}) => {
    return js_create_storage(createOptions(localStorage, { ...options, prefixKey: 'local' }));
};
```

### 8.2 `Encryption`

支持：

- AES 加解密
- MD5
- SHA256

适合：

- 本地简单加密
- 固定字符串摘要

要点：

- `encryptByAES` / `decryptByAES` 是可逆加解密
- `encryptByMd5` / `encryptBySha256` 是摘要，不可逆

**实现代码：**

```ts
import crypto from 'crypto-js/aes';
import utf8 from 'crypto-js/enc-utf8';
import pkcs7 from 'crypto-js/pad-pkcs7';
import ECB from 'crypto-js/mode-ecb';
import UTF8 from 'crypto-js/enc-utf8';
import md5 from 'crypto-js/md5';
import sha256 from 'crypto-js/sha256';

export class Encryption {
    private key;
    private iv;

    constructor(opt: EncryptionParams = { key: '', iv: '' }) {
        const { key, iv } = opt;
        this.key = utf8.parse(key);
        this.iv = utf8.parse(iv);
    }

    get getOptions() {
        return { mode: ECB, padding: pkcs7, iv: this.iv };
    }

    encryptByAES(cipherText: string) {
        return crypto.encrypt(cipherText, this.key, this.getOptions).toString();
    }

    decryptByAES(cipherText: string) {
        return crypto.decrypt(cipherText, this.key, this.getOptions).toString(UTF8);
    }

    encryptByMd5(cipherText: string) {
        return md5(cipherText);
    }

    encryptBySha256(cipherText: string) {
        return sha256(cipherText);
    }
}
```

### 8.3 `IndexedDB`

这是 `packages/utils` 里偏"重量级"的浏览器存储封装。

能力包括：

- 自动开库和建表
- `set/get/getAll/update/delete/deleteAll`
- `count/has/keys`
- 多表支持
- 操作队列串行化
- 连接缓存

适合：

- 前端离线缓存
- 大量结构化数据存储
- 比 `localStorage` 更复杂的数据场景

学习建议：

- 先把它当成"浏览器端轻量数据库"
- 再理解它对版本升级、对象仓库和索引的封装

**核心实现代码（常用方法）：**

```ts
export class IndexedDB {
    public dbversion: number;
    public indexedDB: IDBFactory | null;
    private static dbCacheMap = new Map<string, DBCache>();
    public readonly dbName: string;
    public readonly storeName: string;
    private static storeSchemas = new Map<string, Set<string>>();
    private operationQueue: QueueItem[] = [];
    private isProcessingQueue = false;

    constructor(dbName: string, storeName: string, version = 1) {
        this.dbName = dbName;
        this.dbversion = version;
        this.storeName = storeName;
        this.indexedDB = isWindow(window) ? window.indexedDB : null;
        // 注册表到预定义列表
        if (!IndexedDB.storeSchemas.has(dbName)) {
            IndexedDB.storeSchemas.set(dbName, new Set());
        }
        const schema = IndexedDB.storeSchemas.get(dbName);
        schema?.add(storeName);
    }

    // 队列串行化
    private enqueueOperation<T>(operation: () => Promise<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            this.operationQueue.push({ operation, resolve, reject });
            this.processQueue();
        });
    }

    private async processQueue(): Promise<void> {
        if (this.isProcessingQueue || this.operationQueue.length === 0) return;
        this.isProcessingQueue = true;
        while (this.operationQueue.length > 0) {
            const item = this.operationQueue.shift();
            if (!item) break;
            try {
                const result = await item.operation();
                item.resolve(result);
            } catch (error) {
                item.reject(error);
            }
        }
        this.isProcessingQueue = false;
    }

    // 打开数据库
    private _open(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            if (!this.indexedDB) {
                reject({ code: ErrorCode.notSupported, error: new Error('IndexedDB 不受支持'), msg: 'IndexedDB 不受支持' });
                return;
            }
            const cache = IndexedDB.dbCacheMap.get(this.dbName);
            if (cache && cache.db.objectStoreNames.contains(this.storeName)) {
                resolve(cache.db);
                return;
            }
            // ... 详细开库逻辑见源文件 indexed-db.ts
        });
    }

    // 设置键值对
    set<T = any>(key: string | number | symbol, value: T): Promise<IIndexedDBRes> {
        return this.enqueueOperation(async () => {
            return this._executeOperation<IIndexedDBRes>(async (store) => {
                // 使用索引查询是否存在，存在则更新，不存在则添加
                // 详细实现见源文件 indexed-db.ts
            });
        });
    }

    // 获取数据
    get<T = any>(key?: string | number | symbol): Promise<IIndexedDBRes<IStoredItem<T>[]>> {
        return this.enqueueOperation(async () => {
            return this._executeOperation<IIndexedDBRes<IStoredItem<T>[]>>(async (store) => {
                // 使用索引查询或获取全部
                // 详细实现见源文件 indexed-db.ts
            }, 'readonly');
        });
    }

    // 删除数据
    delete(key: string | number | symbol, limit?: number): Promise<IIndexedDBRes> {
        return this.enqueueOperation(async () => {
            return this._executeOperation<IIndexedDBRes>(async (store) => {
                // 使用游标遍历删除
                // 详细实现见源文件 indexed-db.ts
            });
        });
    }

    // 检查是否存在
    async has(key: string | number | symbol): Promise<boolean> {
        try {
            const result = await this.get(key);
            return result.data !== undefined && result.data.length > 0;
        } catch {
            return false;
        }
    }

    // 关闭数据库
    close(): void {
        const cache = IndexedDB.dbCacheMap.get(this.dbName);
        if (cache) {
            cache.db.close();
            IndexedDB.dbCacheMap.delete(this.dbName);
        }
    }

    // 静态方法：删除整个数据库
    static deleteDatabase(dbName: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (typeof window === 'undefined' || !window.indexedDB) {
                reject(new Error('IndexedDB 不受支持'));
                return;
            }
            IndexedDB.clearCache(dbName);
            const deleteRequest = window.indexedDB.deleteDatabase(dbName);
            deleteRequest.onsuccess = () => {
                IndexedDB.storeSchemas.delete(dbName);
                resolve();
            };
            deleteRequest.onerror = () => reject(deleteRequest.error);
        });
    }
}
```

> 完整实现代码较长，以上内容为核心方法摘要，完整源码请查看 `packages/utils/src/indexed-db.ts`。

## 9. 几个最值得记住的坑点

### 9.1 名字像节流，实际更像防抖

`js_utils_throttle_event` 每次都会清除上次定时器，所以更接近 debounce。

### 9.2 深合并会改原对象

`js_utils_deep_merge(src, target)` 会直接修改 `src`。

### 9.3 数组 diff 不看顺序

`js_utils_diff` 在数组比较时只看元素集合和数量，不看顺序。

### 9.4 `getFirstNonEmpty` 不会跳过空字符串

它只跳过 `null` 和 `undefined`。

### 9.5 class 工具的分隔符不统一

- `js_utils_dom_add_class(el, 'a,b')`
- `js_utils_dom_remove_class(el, 'a b')`

### 9.6 `clear()` 是全清

`WebStorage.clear()` 调的是底层 `storage.clear()`，不是按前缀清理。

## 10. 学习路线总结

如果你是第一次看这个包，建议按下面顺序学习：

1. `is.ts`
2. `utils.ts` 里的 `js_utils_find_attr`、`js_utils_edit_attr`、`js_utils_deep_merge`
3. `dom-util.ts` 里的 class 和复制能力
4. `diff.ts`
5. `parse.ts`
6. `extra.ts` 和 `indexed-db.ts`

如果你是日常业务开发，优先掌握下面这 10 个就够用了：

1. `isFunction`
2. `isArray`
3. `isObject`
4. `isNullOrUndef`
5. `js_utils_find_attr`
6. `js_utils_edit_attr`
7. `js_utils_deep_merge`
8. `js_utils_diff`
9. `js_utils_copy_code`
10. `getFirstNonEmpty`
