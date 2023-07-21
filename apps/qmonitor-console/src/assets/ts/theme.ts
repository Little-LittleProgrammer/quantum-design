
import { useGlobalStore } from '@/store/modules/global';
import { gMemorialEnum } from '@wuefrontared/enums';
import { js_utils_dom_add_class, js_utils_dom_has_class, js_utils_dom_remove_class } from '@wuefrontils';
import dark from 'ant-design-vue/dist/antd.dark.less?inline'; //?inline 参数来关闭 css注入
import lighter from 'ant-design-vue/dist/antd.less?inline';
import {gDateUtil} from '@wuefrontils';
import { useProjectSetting } from '@wuefront/vue3-antd-pc-ui';

const themeCss:Recordable<string> = {
    light: lighter,
    dark
};

/**
 * 更改主题
 * @param mode 主题模式
 */
export async function update_theme(mode: string = 'light') {
    const $htmlRoot = document.getElementById('JsHtmlRoot');
    if (!$htmlRoot) {
        return;
    }
    $htmlRoot.setAttribute('data-theme', mode);
    js_utils_dom_remove_class($htmlRoot, 'dark'); js_utils_dom_remove_class($htmlRoot, 'light');
    js_utils_dom_add_class($htmlRoot, mode);
    add_gray_skin($htmlRoot);
    add_skin(mode);
}

function add_gray_skin(dom:HTMLElement) {
    const globalStore = useGlobalStore();
    const {getGraySwitch} = useProjectSetting();
    if (getGraySwitch.value) {
        const _timeNow = globalStore.date;
        console.log('_timeNow', _timeNow);
        type Enum = keyof typeof gMemorialEnum
        for (const key in gMemorialEnum) {
            if (gDateUtil(_timeNow).format('MM-DD') == gMemorialEnum[key as Enum]) {
                const hasGrayClass = js_utils_dom_has_class(dom, 'gray-mode');
                if (!hasGrayClass) {
                    js_utils_dom_add_class(dom, 'gray-mode');
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
function add_skin(mode: string) {
    const _content = themeCss[mode];
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
    $styleDom.innerHTML = _content;
    _head.insertBefore($styleDom, $startDom);
}

