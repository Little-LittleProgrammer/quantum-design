import type { RouteLocationRaw, Router } from 'vue-router';

import { isString, deep_merge } from '@wuefront/utils';
import { unref } from 'vue';

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
        
        if (isString(opt)) {
            isReplace ? replace(opt).catch(handleError) : push(opt).catch(handleError);
        } else {
            if (joinTime) {
                deep_merge(
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
    function close_page () {
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
}

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
    }

    return _elResizeObserver;
}

export {
    useRedo,
    useGo,
    useClosePage,
    useResizeObserver
};
