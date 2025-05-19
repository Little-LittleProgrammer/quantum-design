import type { ComputedRef, Ref } from 'vue';

import { computed, getCurrentInstance, unref, useAttrs, useSlots } from 'vue';

import {
    js_utils_get_first_non_empty,
    js_utils_kebab_to_camel_case
} from '@quantum-design/utils';

/**
 * 依次从插槽、attrs、props、state 中获取值
 * @param key
 * @param props
 * @param state
 */
export function usePriorityValue<
  T extends Record<string, any>,
  S extends Record<string, any>,
  K extends keyof T = keyof T,
>(key: K, props: T, state: Readonly<Ref<NoInfer<S>> | NoInfer<S>> | undefined) {
    const instance = getCurrentInstance();
    const slots = useSlots();
    const attrs = useAttrs() as T;

    const value = computed((): T[K] => {
    // props不管有没有传，都会有默认值，会影响这里的顺序，
    // 通过判断原始props是否有值来判断是否传入
        const rawProps = (instance?.vnode?.props || {}) as T;

        const standardRawProps = {} as T;

        for (const [key, value] of Object.entries(rawProps)) {
            standardRawProps[js_utils_kebab_to_camel_case(key) as K] = value;
        }
        const propsKey =
      standardRawProps?.[key] === undefined ? undefined : props[key];

        // slot可以关闭
        return js_utils_get_first_non_empty(
            slots[key as string],
            attrs[key],
            propsKey,
            state?.value?.[key as keyof S] || state?.[key as keyof T]
        ) as T[K];
    });

    return value;
}

/**
 * 批量获取state中的值（每个值都是ref）
 * @param props
 * @param state
 */
export function usePriorityValues<
  T extends Record<string, any>,
  S extends Ref<Record<string, any>> = Readonly<Ref<NoInfer<T>, NoInfer<T>>>,
>(props: T, state: S | undefined) {
    const result: { [K in keyof T]: ComputedRef<T[K]> } = {} as never;

    (Object.keys(props) as (keyof T)[]).forEach((key) => {
        result[key] = usePriorityValue(key as keyof typeof props, props, state);
    });

    return result;
}

/**
 * 批量获取state中的值（集中在一个computed，用于透传）
 * @param props
 * @param state
 */
export function useForwardPriorityValues<
  T extends Record<string, any>,
  S extends Ref<Record<string, any>> = Readonly<Ref<NoInfer<T>, NoInfer<T>>>,
>(props: T, state: S | undefined) {
    const computedResult: { [K in keyof T]: ComputedRef<T[K]> } = {} as never;

    (Object.keys(props) as (keyof T)[]).forEach((key) => {
        computedResult[key] = usePriorityValue(
      key as keyof typeof props,
      props,
      state
        );
    });

    return computed(() => {
        const unwrapResult: Record<string, any> = {};
        Object.keys(props).forEach((key) => {
            unwrapResult[key] = unref(computedResult[key]);
        });
        return unwrapResult as { [K in keyof T]: T[K] };
    });
}
