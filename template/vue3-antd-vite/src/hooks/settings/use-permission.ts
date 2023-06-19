import { js_is_array } from '@q-front-npm/utils';
import { useSysStore } from '@/store/modules/systemManage';

export function usePermission() {
    const systemStore = useSysStore();
    function hasPermission(code?: string | string[], def = true) {
        if (!code) {
            return def;
        }
        if (!systemStore.getPermCodeList || systemStore.getPermCodeList.length === 0) {
            return def;
        }
        if (js_is_array(code)) {
            let _flag = def;
            for (const item of code) {
                _flag = _flag && systemStore.getPermCodeList.includes(item);
            }
            return _flag;
        } else {
            return systemStore.getPermCodeList.includes(code);
        }
    }
    return {hasPermission};
}
