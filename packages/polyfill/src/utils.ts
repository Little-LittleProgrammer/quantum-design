import { js_utils_edit_attr, js_utils_find_attr } from '@quantum-design/utils';

export function checkAndAdd<T>(fn: T & { name: string }, subType?: string) {
    if (subType) {
        const hasType = js_utils_find_attr(globalThis, subType);
        if (!hasType) {
            js_utils_edit_attr(subType, {}, globalThis);
        }
        const target = (globalThis as any)[subType];
        const hasFn = js_utils_find_attr(target, fn.name);
        if (!hasFn) {
            js_utils_edit_attr(fn.name, fn, target);
        }
    } else {
        if (!globalThis[fn.name as keyof typeof globalThis]) {
            (globalThis as any)[fn.name] = fn;
        }
    }
}
