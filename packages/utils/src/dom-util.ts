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

export function js_utils_css(dom:HTMLElement, key: string | Partial<CSSStyleDeclaration>, value?:string) {
    // 判读 key是对象还是字符串
    if (typeof key === 'string' && value) {
        dom.style[key as never] = value;
    } else {
        // 遍历
        for (const name in (key as CSSStyleDeclaration)) {
            // name表示属性名称， key[name]表示属性值
            js_utils_css(dom, name, key[name]);
        }
    }
}

/**
 * 计算当前元素距离body的偏移量
 * @param {*} dom dom元素
 */
export function js_utils_dom_offset(dom: Element & HTMLElement) {
    // 获取当前元素的定位值
    const result = {
        left: dom.offsetLeft,
        top: dom.offsetTop
    };
    // 依次遍历每一个元素的定位元素，直到body
    while (dom !== document.body && dom.offsetParent !== null) {
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

export function js_utils_trim(string: string) {
    return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
}

/* istanbul ignore next */
export function js_utils_dom_has_class(el: Element, cls: string) {
    if (!el || !cls) return false;
    if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.');
    if (el.classList) {
        return el.classList.contains(cls);
    } else {
        return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
    }
}

/* istanbul ignore next */
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

/* istanbul ignore next */
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

/* istanbul ignore next */
export function on(
    element: Element | HTMLElement | Document | Window,
    event: string,
    handler: EventListener | EventListenerObject,
    options?: AddEventListenerOptions
): void {
    if (element && event && handler) {
        element.addEventListener(event, handler, {
            passive: true,
            ...(options || {})
        });
    }
}

/* istanbul ignore next */
export function off(
    element: Element | HTMLElement | Document | Window,
    event: string,
    handler: EventListener | EventListenerObject,
    options?: AddEventListenerOptions
): void {
    if (element && event && handler) {
        element.removeEventListener(event, handler, {
            passive: true,
            ...(options || {})
        });
    }
}

export interface ICanvasOption {
    width?: number;
    height?: number;
    style?: CSSStyleDeclaration
}
/**
 * 将html代码转化为图片
 * @param {*} dom dom元素
 * @param {*} options 配置  宽高：width， height， canvas样式：style
 * @description
 */
export function js_utils_html_to_canvas(dom: HTMLElement | HTMLImageElement, options:ICanvasOption) {
    const _reqOptions: Required<ICanvasOption> = Object.assign({ width: 100, height: 100, style: {} }, options); // 默认样式
    const $canvas = document.createElement('canvas');
    $canvas.id = 'canvas';
    $canvas.width = _reqOptions.width;
    $canvas.height = _reqOptions.height;
    if (JSON.stringify(_reqOptions.style) !== '{}') { // 配置canvas的样式
        for (const key in _reqOptions.style) {
            js_utils_css($canvas, `${key}`, `${_reqOptions.style[key]}`);
        }
    }
    const ctx = $canvas.getContext('2d')!;

    async function init_main() { // 主方法
        const data = await get_svg_dom_string(dom as HTMLImageElement);
        // const DOMURL = window.URL || window.webkitURL || window;
        const img = new Image();
        img.src = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(data)));
        // const svg = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
        // const url = DOMURL.createObjectURL(svg);
        // img.setAttribute('crossOrigin', 'anonymous');
        // img.src = url;
        return new Promise<HTMLCanvasElement>((resolve) => {
            img.onload = function() { // 最终生成的canvas
                ctx.drawImage(img, 0, 0);
                // const parentNode = dom.parentNode;
                // parentNode.insertBefore($canvas, dom); // 将canvas插入原来的位置
                // parentNode.removeChild(dom); // 最终移除页面中被转换的代码
                resolve($canvas);
            };
        });
    }

    async function get_svg_dom_string(element: HTMLElement & HTMLImageElement) { // 将html代码嵌入svg
        const $dom = await render_dom(element, true);
        return `
                    <svg xmlns="http://www.w3.org/2000/svg" width = "${_reqOptions.width}" height = "${_reqOptions.height}">
                        <foreignObject width="100%" height="100%">
                                ${$dom}
                        </foreignObject>\n
                    </svg>
                `;
    }

    async function render_dom(element: HTMLElement & HTMLImageElement, isTop?: boolean) { // 递归调用获取子标签
        const tag = element.tagName.toLowerCase();
        let _str = `<${tag} `;
        let _flag = true;
        // 最外层的节点要加xmlns命名空间
        isTop && (_str += `xmlns="http://www.w3.org/1999/xhtml" `);
        if (_str === '<img ') { // img标签特殊处理
            _flag = false;
            let base64Img = '';
            if (element.src.length > 30000) { // 判断src属性是不是base64， 是的话不用处理，不是的话，转换base64
                base64Img = element.src;
            } else {
                base64Img = await get_base64_image(element.src);
            }
            _str += `src="${base64Img}" style="${get_element_styles(element)}" />\n`;
        } else if (_str.includes('svg') || _str.includes('path')) {
            _flag = false;
            _str = '';
        } else {
            _str += `style="${get_element_styles(element)}">\n`;
        }
        if (element.children.length) {
            for (const el of (element.children as unknown as (HTMLElement & HTMLImageElement)[])) {
                _str += await render_dom(el);
            }
        } else {
            _str += element.innerHTML;
        }
        if (_flag) {
            _str += `</${tag}>\n`;
        }
        return _str;
    }

    function get_element_styles(element: HTMLElement & HTMLImageElement) { // 获取标签的所有样式
        let _css: Partial<CSSStyleDeclaration> = {};
        // 能力检测
        _css = window.getComputedStyle(element);

        let _style = '';
        Object.keys(_css).forEach(key => {
            // 排除无用样式
            if (key === '-webkit-locale') {
                _style += '';
            } else {
                _style += `${key}:${_css[key as unknown as number]};`;
            }
        });
        // 将字符串里的双引号变成单引号，防止赋值style的时候造成混乱
        return _style.replace(/\"/g, '\'');
    }

    function get_base64_image(img: string) { // 获取图片的base64
        const _image = new Image();
        _image.src = img;
        return new Promise<string>(resolve => {
            _image.onload = function() {
                const $canvas = document.createElement('canvas');
                $canvas.id = 'image';
                $canvas.width = _image.width;
                $canvas.height = _image.height;
                const ctxImg = $canvas.getContext('2d');
                ctxImg?.drawImage(_image, 0, 0, _image.width, _image.height);
                const _ext = _image.src.substring(_image.src.lastIndexOf('.') + 1).toLowerCase();
                const _dataURL = $canvas.toDataURL('image/' + _ext);
                resolve(_dataURL);
            };
        });
    }

    return init_main();
}
