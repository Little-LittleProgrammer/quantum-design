import type { RouteLocationRaw, Router } from 'vue-router';

import { isString, deep_merge } from '@qmfront/utils';
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

export {
    useRedo,
    useGo
};
