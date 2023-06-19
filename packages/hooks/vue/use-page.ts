import type { RouteLocationRaw, Router } from 'vue-router';

import { js_is_string, js_utils_deep_merge } from '@q-front-npm/utils';
import { unref, onMounted, ref } from 'vue';

import { useRouter } from 'vue-router';

function handleError(e: Error) {
    console.error(e);
}

// page switch
function useGo(router?: Router) {
    let _router;
    if (!router) {
        _router = useRouter();
    } else {
        _router = router;
    }
    const { push, replace } = _router;
    function go(opt: RouteLocationRaw, isReplace = false, joinTime = false) {
        if (!opt) {
            return;
        }

        if (js_is_string(opt)) {
            isReplace ? replace(opt).catch(handleError) : push(opt).catch(handleError);
        } else {
            if (joinTime) {
                js_utils_deep_merge(
                    opt,
                    {
                        query: {
                            t: Date.now()
                        }
                    }
                );
            }
            const o = opt as RouteLocationRaw;
            isReplace ? replace(o).catch(handleError) : push(o).catch(handleError);
        }
    }
    return go;
}

/**
 * @description: 重新刷新当前页面
 */
const useRedo = (_router?: Router) => {
    const { push, currentRoute } = _router || useRouter();
    const { query, params = {}, name, fullPath } = unref(currentRoute.value);
    function redo(): Promise<boolean> {
        return new Promise((resolve) => {
            if (name && Object.keys(params).length > 0) {
                params['_redirect_type'] = 'name';
                params['path'] = String(name);
            } else {
                params['_redirect_type'] = 'path';
                params['path'] = fullPath;
            }
            push({ name: 'Redirect', params, query }).then(() => resolve(true));
        });
    }
    return redo;
};

/**
 * @description: 关闭当前页面
 */
const useClosePage = () => {
    function close_page() {
        const userAgent = navigator.userAgent;
        if (userAgent.includes('Firefox') || userAgent.includes('Chrome')) {
            window.location.replace('about:blank');
        } else {
            window.opener = null;
            window.open('', '_self');
        }
        window.close();
    }
    return close_page;
};

/**
 * @description: 元素的高度或宽度变化时同时获取元素的位置和尺寸信息
 */
const useResizeObserver = () => {
    let _resizeObserver: ResizeObserver;

    // 监听元素变化
    function observe($el: HTMLElement, callback: (rect: DOMRect) => void) {
        _resizeObserver = new ResizeObserver(() => {
            const _rect = $el.getBoundingClientRect();
            callback && callback(_rect);
        });
        _resizeObserver.observe($el);
    }

    // 停止监听某个元素变化
    function unobserve($el: HTMLElement) {
        _resizeObserver.unobserve($el);
    }

    // 停止监听所有元素变化
    function disconnect() {
        _resizeObserver.disconnect();
    }

    const _elResizeObserver = {
        observe,
        unobserve,
        disconnect
    };

    return _elResizeObserver;
};

/**
 * @description: 用于Antd表格的getContainer属性绑定目标Dom
 */
const useStickyContainer = (className = 'js-main-conatiner') => {
    const $dom = ref<HTMLElement | null>(null);
    onMounted(() => {
        $dom.value = document.getElementsByClassName(className)?.[0] as HTMLElement;
    });
    return $dom;
};

/**
 * @description: 用于修复Antd表格组件在边界情况下出现的双滚动条问题
 */
const useFixStickyScrollBar = (className = 'js-layout-main') => {
    setTimeout(() => {
        const $scroolDom = document.querySelector('.ant-table-sticky-scroll') as HTMLElement;
        const $tableDom = document.querySelector('.ant-table-body') as HTMLElement;
        const $layoutDom = document.querySelector(`.${className}`) as HTMLElement;
        if (!$scroolDom || !$tableDom || !$layoutDom) return;
        const _isTableBottomInView = $tableDom.getBoundingClientRect().bottom <= $layoutDom.getBoundingClientRect().bottom;
        if ($scroolDom && _isTableBottomInView) {
            $scroolDom.style.opacity = '0';
        }
    }, 0);
};

export {
    useRedo,
    useGo,
    useClosePage,
    useResizeObserver,
    useStickyContainer,
    useFixStickyScrollBar
};
