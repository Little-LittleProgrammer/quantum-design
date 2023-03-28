
import setting from '@/enums/projectEnum';
import { useGlobalStore } from '@/store/modules/global';
import { MemorialEnum } from '@wuefront/shared/enums';
import { addClass, hasClass, removeClass } from '@wuefront/utils';
import dark from 'ant-design-vue/dist/antd.dark.less?inline'; //?inline 参数来关闭 css注入
import lighter from 'ant-design-vue/dist/antd.less?inline';
import {date_util} from '@wuefront/utils';

/**
 * 更改主题
 * @param mode 主题模式
 */
export async function update_theme(mode: string = 'light') {
    const $htmlRoot = document.getElementById('JsHtmlRoot');
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
    }
    add_gray_skin($htmlRoot);
    if (mode == 'light') {
        // 保证按需引入， 放在文件头会导致多次引入
        add_skin(lighter);
    } else if (mode == 'dark') {
        add_skin(dark);
    }
}

function add_gray_skin(dom:HTMLElement) {
    const globalStore = useGlobalStore();
    if (setting.theme.grayMode) {
        const _timeNow = globalStore.date;
        console.log('_timeNow', _timeNow);
        type Enum = keyof typeof MemorialEnum
        for (const key in MemorialEnum) {
            if (date_util(_timeNow).format('MM-DD') == MemorialEnum[key as Enum]) {
                const hasGrayClass = hasClass(dom, 'gray-mode');
                if (!hasGrayClass) {
                    addClass(dom, 'gray-mode');
                }
            }
        }
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
    if (import.meta.env.PROD) {
        for (let i = 0; i < _getLink.length; i++) {
            if (_getLink[i]?.rel === 'stylesheet') {
                $startDom = _getLink[i]; // 找到插入点
                break;
            }
        }
    }
    // 查找style是否存在，存在的话需要删除dom
    if (_getStyle.length > 0) {
        for (let i = _getStyle.length - 1; i >= 0; i--) {
            // 删除 antd 的 样式
            if (_getStyle[i]?.dataset?.type === 'theme') {
                _getStyle[i].remove();
            }
            if (!import.meta.env.PROD) { // 开发模式
                if (_getStyle[i]?.innerHTML.includes('style-start-load')) {
                    $startDom = _getStyle[i];
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
