
import light from 'ant-design-vue/dist/antd.less?inline';
import dark from 'ant-design-vue/dist/antd.dark.less?inline';

export function dom_listen() {
    const {$dom, _head, $styleDom, $startDom} = get_dom()
    set_style($dom, _head, $styleDom, $startDom)
    const _callback = (mutationsList) => { // 监听css变化, 防止去除canvas标签
        mutationsList.forEach((mutation) => {
            if (mutation.type == 'attributes' && mutation.attributeName === 'class') {
                set_style(mutation.target, _head, $styleDom, $startDom)
            }
        });
    };
    const observer = new MutationObserver(_callback);
    observer.observe($dom, {
        attributes: true, // 将其配置为侦听属性更改,
        attributeFilter: ['class'],
        childList: false,
        subtree: false,
        characterData: false
    });
}

function get_dom() {
    const $dom = document.documentElement;
    const _head = document.getElementsByTagName('head')[0];
    const $styleDom = document.createElement('style');
    const _getStyle = _head.getElementsByTagName('style');
    let $startDom: HTMLStyleElement = _getStyle[10]
    return {
        $dom, _head, $styleDom, $startDom
    }
}

function set_style($dom, _head, $styleDom, $startDom) {
    if ($dom.className === 'dark') {
        $styleDom.innerHTML = dark
    } else {
        $styleDom.innerHTML = light
    }
    _head.insertBefore($styleDom, $startDom);
}