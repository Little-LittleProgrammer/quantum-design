export interface ViewportOffsetResult {
    left: number;
    top: number;
    right: number;
    bottom: number;
    rightIncludeBody: number;
    bottomIncludeBody: number;
}

/**
 * 设置样式的方法
 *
 * @param {*} dom 元素
 * @param {*} key css属性名称
 * @param {*} value css属性值
 * ```js
 * css(dom, width, '200px')
 * css(dom,{ color: 'red', width: '200px' })
 * ```
 */
export function css(dom:HTMLElement, key: string | CSSStyleDeclaration, value:string) {
    // 判读 key是对象还是字符串
    if (typeof key === 'string') {
        dom.style[key as never] = value;
    } else {
        // 遍历
        for (const name in key) {
            // name表示属性名称， key[name]表示属性值
            css(dom, name, key[name]);
        }
    }
}

/**
 * 计算当前元素距离body的偏移量
 * @param {*} dom dom元素
 */
export function offset(dom: Element & HTMLElement) {
    // 获取当前元素的定位值
    const result = {
        left: dom.offsetLeft,
        top: dom.offsetTop
    };
    // 依次遍历每一个元素的定位元素，直到body
    while (dom !== document.body) {
        // 获取当前元素的定位元素
        dom = dom.offsetParent as Element & HTMLElement;
        if (!dom) {
            return result;
        }
        // dom = dom.parentNode;
        // 累加结果:再加上边框
        result.left += dom.offsetLeft + dom.clientLeft;
        result.top += dom.offsetTop + dom.clientTop;
        // 兼容性考虑 navigator.userAgent
    }
    // 返回结果
    return result;
}

function trim(string: string) {
    return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
}

/* istanbul ignore next */
export function hasClass(el: Element, cls: string) {
    if (!el || !cls) return false;
    if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.');
    if (el.classList) {
        return el.classList.contains(cls);
    } else {
        return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
    }
}

/* istanbul ignore next */
export function addClass(el: Element, cls: string) {
    if (!el) return;
    let curClass = el.className;
    const classes = (cls || '').split(',');

    for (let i = 0, j = classes.length; i < j; i++) {
        const clsName = classes[i];
        if (!clsName) continue;

        if (el.classList) {
            el.classList.add(clsName);
        } else if (!hasClass(el, clsName)) {
            curClass += ' ' + clsName;
        }
    }
    if (!el.classList) {
        el.className = curClass;
    }
}

/* istanbul ignore next */
export function removeClass(el: Element, cls: string) {
    if (!el || !cls) return;
    const classes = cls.split(' ');
    let curClass = ' ' + el.className + ' ';

    for (let i = 0, j = classes.length; i < j; i++) {
        const clsName = classes[i];
        if (!clsName) continue;

        if (el.classList) {
            el.classList.remove(clsName);
        } else if (hasClass(el, clsName)) {
            curClass = curClass.replace(' ' + clsName + ' ', ' ');
        }
    }
    if (!el.classList) {
        el.className = trim(curClass);
    }
}

/* istanbul ignore next */
export function on(
    element: Element | HTMLElement | Document | Window,
    event: string,
    handler: EventListener | EventListenerObject
): void {
    if (element && event && handler) {
        element.addEventListener(event, handler, false);
    }
}

/* istanbul ignore next */
export function off(
    element: Element | HTMLElement | Document | Window,
    event: string,
    handler: EventListener | EventListenerObject
): void {
    if (element && event && handler) {
        element.removeEventListener(event, handler, false);
    }
}

