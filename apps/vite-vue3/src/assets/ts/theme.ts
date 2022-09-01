import dark from 'ant-design-vue/dist/antd.dark.less';
import lighter from 'ant-design-vue/dist/antd.less';
import { addClass, hasClass, removeClass } from '@qmfront/shared/utils';

/**
 * 更改主题
 * @param mode 主题模式
 */
export function update_theme(mode: string | null = 'light') {
    const $htmlRoot = document.getElementById('htmlRoot');
    if (!$htmlRoot) {
        return;
    }
    const hasDarkClass = hasClass($htmlRoot, 'dark');
    if (mode === 'dark') {
        $htmlRoot.setAttribute('data-theme', 'dark');
        if (!hasDarkClass) {
            addClass($htmlRoot, 'dark');
        }
    } else if (mode == 'light') {
        $htmlRoot.setAttribute('data-theme', 'light');
        if (hasDarkClass) {
            removeClass($htmlRoot, 'dark');
        }
    } else if (mode == 'gray-mode') {
        const hasDarkClass = hasClass($htmlRoot, 'gray-mode');
        if (!hasDarkClass) {
            addClass($htmlRoot, 'gray-mode');
        }
    }

    if (mode == 'light') {
        // 保证按需引入， 放在文件头会导致多次引入
        add_skin(lighter);
    } else if (mode == 'dark') {
        add_skin(dark);
    }
}

/**
 * 添加主题
 * @param content css格式的主题样式
 * @description 通过在html添加style实现
 */
function add_skin(content: string) {
    const _head = document.getElementsByTagName('head')[0];
    const _getStyle = _head.getElementsByTagName('style');
    const _getLink = _head.getElementsByTagName('link');
    let $startDom: HTMLStyleElement = _getStyle[0];
    // 查找style是否存在，存在的话需要删除dom
    if (_getStyle.length > 0) {
        for (let i = _getStyle.length - 1; i >= 0; i--) {
            // if (_getStyle[i]?.getAttribute('data-type') === 'theme') {
            //     _getStyle[i].remove();
            // }
            if (import.meta.env.PROD) {
                if (_getStyle[i]?.dataset?.type === 'theme') {
                    _getStyle[i].remove();
                }
                if (_getLink[i]?.rel === 'stylesheet') {
                    $startDom = _getLink[i + 1];
                }
            } else {
                if (_getStyle[i]?.innerHTML.includes('style-start-load')) {
                    $startDom = _getStyle[i];
                }
                // 删除 antd 的 样式
                if (_getStyle[i]?.innerHTML.includes('[class^=ant-]::-ms-clear')) {
                    _getStyle[i].remove();
                }
            }
        }
    }
    // 最后加入对应的主题和加载less的js文件
    const $styleDom = document.createElement('style');
    $styleDom.dataset.type = 'theme';
    $styleDom.innerHTML = content;
    _head.insertBefore($styleDom, $startDom);
}

/**
 * 反转颜色
 * @param colorStr 颜色的string值
 * @todo 必须为 #000格式的颜色
 */
export function reserve_color(colorStr: string) {
    colorStr = drop_prefix(colorStr);
    const _rgb1 = to_num3(colorStr);
    const _rgb2 = _rgb1.map(e => {
        return 0xff - e;
    });
    return '#' + pad2(_rgb2[0]) + pad2(_rgb2[1]) + pad2(_rgb2[2]);
}

/**
 * 颜色混合fff
 * @param colorStr 颜色的string值
 * @param weight 轻重 越低越接近传入值
 */
export function mix_lighten(colorStr: string, weight: number) {
    return mix('fff', colorStr, weight);
}

/**
 * 颜色混合000
 * @param colorStr 颜色的string值
 * @param weight 轻重 越低越接近传入值
 */
export function mix_darken(colorStr: string, weight: number) {
    return mix('000', colorStr, weight);
}

function mix(
    color1: string,
    color2: string,
    weight: number,
    alpha1?: number,
    alpha2?: number
) {
    color1 = drop_prefix(color1);
    color2 = drop_prefix(color2);
    if (weight === undefined) weight = 0.5;
    if (alpha1 === undefined) alpha1 = 1;
    if (alpha2 === undefined) alpha2 = 1;

    const w = 2 * weight - 1;
    const alphaDelta = alpha1 - alpha2;
    const w1 = ((w * alphaDelta === -1 ? w : (w + alphaDelta) / (1 + w * alphaDelta)) + 1) / 2;
    const w2 = 1 - w1;

    const rgb1 = to_num3(color1);
    const rgb2 = to_num3(color2);
    const r = Math.round(w1 * rgb1[0] + w2 * rgb2[0]);
    const g = Math.round(w1 * rgb1[1] + w2 * rgb2[1]);
    const b = Math.round(w1 * rgb1[2] + w2 * rgb2[2]);
    return '#' + pad2(r) + pad2(g) + pad2(b);
}

function to_num3(colorStr: string) {
    colorStr = drop_prefix(colorStr);
    if (colorStr.length === 3) {
        colorStr = colorStr[0] + colorStr[0] + colorStr[1] + colorStr[1] + colorStr[2] + colorStr[2];
    }
    const r = parseInt(colorStr.slice(0, 2), 16);
    const g = parseInt(colorStr.slice(2, 4), 16);
    const b = parseInt(colorStr.slice(4, 6), 16);
    return [r, g, b];
}

function drop_prefix(colorStr: string) {
    return colorStr.replace('#', '');
}

function pad2(num: number) {
    let t = num.toString(16);
    if (t.length === 1) t = '0' + t;
    return t;
}

