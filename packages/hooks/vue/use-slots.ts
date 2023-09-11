import { js_is_function } from '@quantum-design/utils';
import type { Slots } from 'vue';

export function useSlots() {
    /**
     * @description:  获取插槽以防止空错误
     */
    function getSlot(slots: Slots, slot = 'default', data?: any) {
        if (!slots || !Reflect.has(slots, slot)) {
            return null;
        }
        if (!js_is_function(slots[slot])) {
            console.error(`${slot} is not a function!`);
            return null;
        }
        const slotFn = slots[slot];
        if (!slotFn) return null;
        return slotFn(data);
    }

    /**
     * 排除插槽
     * @param slots
     * @param excludeKeys
     */
    function extendSlots(slots: Slots, excludeKeys: string[] = []) {
        const slotKeys = Object.keys(slots);
        const ret: any = {};
        slotKeys.map((key) => {
            if (excludeKeys.includes(key)) {
                return null;
            }
            ret[key] = (data?: any) => getSlot(slots, key, data);
        });
        return ret;
    }
    return {getSlot, extendSlots};
}
