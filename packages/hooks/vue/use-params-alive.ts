import { isClient } from '@quantum-design/utils';
import { js_create_session_storage } from '@quantum-design/utils/extra';
import { type Ref, getCurrentInstance, unref, watch } from 'vue';

class Subscribe {
    cache: Fn[]= []
    constructor() {
        this.cache = [];
        if (isClient) {
            window.addEventListener('beforeunload', this.notify.bind(this));
        }
    }
    watch(callBack: Fn) {
        this.cache.push(callBack);
    }
    notify() {
        if (!this.cache.length) return;
        this.cache.forEach(fn => {
            fn();
        });
        if (isClient) {
            window.removeEventListener('beforeunload', this.notify);
        }
    }
}

const cacheParams = 'cache_params';

let aliveTabsGlobal: string[] = [];
let projectSettingGlobal: IRootPropsProjectSetting = {};

const subscribe = new Subscribe();

export interface IRootPropsProjectSetting {
    cache?: boolean | Ref<boolean>;
    show?: boolean | Ref<boolean>;
    keepalive?: boolean | Ref<boolean>;
}
export interface IRootProps {
    aliveTabs: Ref<string[]>;
    projectSetting: IRootPropsProjectSetting
}

function set_value(name?: string, params?: Fn) {
    if (name) {
        const ss = js_create_session_storage({
            timeout: 60 * 60 * 24 // 过期时间 1天
        });
        const _values = ss?.get(cacheParams) || {};
        const _res: any = {};
        for (const key of aliveTabsGlobal) {
            if (key === name && params) {
                _res[key] = params();
            } else {
                _res[key] = _values[key];
            }
            ss?.set(cacheParams, _res);
        }
    }
}

export function useParamsAliveRoot(props: IRootProps) {
    const {aliveTabs, projectSetting} = props;
    watch(() => aliveTabs.value, (val) => {
        aliveTabsGlobal = val;
        projectSettingGlobal = projectSetting;
        set_value();
    }, {immediate: true});
}

export function useParamsAlive(params: Fn) {
    const ss = js_create_session_storage({
        timeout: 60 * 60 * 24 // 过期时间 1天
    });
    const {cache, show, keepalive} = projectSettingGlobal;
    const instance = getCurrentInstance();
    const _name = instance?.type?.name;
    if (!_name) {
        console.error('必须在定义name的组件下使用');
        return {
            get_params: () => ({})
        };
    }

    console.log(show, keepalive, cache);
    if (unref(show) && unref(keepalive)) {
        if (unref(cache)) {
            subscribe.watch(() => set_value(_name, params));
        } else {
            subscribe.watch(() => { // 缓单个页面
                ss?.set(cacheParams, {
                    [_name]: params()
                });
            });
        }
    }
    function get_params() { // 方法暴露, 即想用的时候再去获得参数
        if (_name) {
            const _values = ss?.get(cacheParams) || {};
            const _res = _values[_name];
            return _res;
        }
    }
    return {
        get_params
    };
}
