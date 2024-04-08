import { Ref, ComputedRef, computed, unref } from 'vue';
import { BasicTableProps, Recordable } from '../types/table';
import { js_is_array, js_is_function } from '@quantum-design/utils';

interface ActionType {
    getDataSourceRef: ComputedRef<Recordable>,
    summaryData: Ref<Recordable[]>
}
export function useSummary(
    propsRef: ComputedRef<BasicTableProps>,
    {
        getDataSourceRef,
        summaryData: globalSummaryData
    }: ActionType
) {
    const getIsEmptyData = computed(() => {
        return (unref(getDataSourceRef) || []).length === 0;
    });
    const getSummaryData = computed(() => {
        if (unref(getIsEmptyData)) return [];
        const { summaryFunc, summaryData } = unref(propsRef);
        if (js_is_array(summaryData) && summaryData.length > 0) {
            return summaryData;
        }
        if (js_is_function(summaryFunc)) {
            return summaryFunc(getDataSourceRef.value);
        }
        if (js_is_array(unref(globalSummaryData)) && unref(globalSummaryData).length > 0) {
            return unref(globalSummaryData);
        }
        return [];
    });
    return {
        getSummaryData
    };
}
