import { ComputedRef, Slots, computed, unref } from 'vue';
import { BasicTableProps, FetchParams } from '../types/table';
import { FormProps } from '@vue3-antd/q-form';
import { js_is_function } from '@quantum-design/utils';

export function useTableForm(
    propsRef: ComputedRef<BasicTableProps>,
    slots: Slots,
    fetch: (opt?: FetchParams | undefined) => Promise<void>,
    getLoading: ComputedRef<boolean | undefined>
) {
    const getFormProps = computed<Partial<FormProps>>(() => {
        const {formConfig} = unref(propsRef);
        const {submitButtonOptions} = formConfig || {};
        return {
            ...formConfig,
            submitButtonOptions: { loading: unref(getLoading), ...submitButtonOptions },
            compact: true
        };
    });

    // get form slot
    const getFormSlotKeys: ComputedRef<string[]> = computed(() => {
        const keys = Object.keys(slots);
        return keys
            .map((item) => (item.startsWith('form-') ? item : null))
            .filter((item) => !!item) as string[];
    });

    function replaceFormSlotKey(key: string) {
        if (!key) return '';
        return key?.replace?.(/form-/, '') ?? '';
    }

    function handleSearchInfoChange(info: Record<string, any>) {
        const { handleSearchInfoFn } = unref(propsRef);
        if (handleSearchInfoFn && js_is_function(handleSearchInfoFn)) {
            info = handleSearchInfoFn(info) || info;
        }
        fetch({ searchInfo: info, page: 1 });
    }

    return {
        getFormProps,
        replaceFormSlotKey,
        getFormSlotKeys,
        handleSearchInfoChange
    };
}
