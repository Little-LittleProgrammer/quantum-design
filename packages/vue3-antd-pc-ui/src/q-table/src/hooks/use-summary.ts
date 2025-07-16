import { type Ref, type ComputedRef, computed, unref } from 'vue';
import type { BasicTableProps, Recordable } from '../types/table';
import { isArray, isFunction } from '@quantum-design/utils';

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
        if (isArray(summaryData) && summaryData.length > 0) {
            return summaryData;
        }
        if (isFunction(summaryFunc)) {
            return summaryFunc(getDataSourceRef.value);
        }
        if (isArray(unref(globalSummaryData)) && unref(globalSummaryData).length > 0) {
            return unref(globalSummaryData);
        }
        return [];
    });
    return {
        getSummaryData
    };
}
