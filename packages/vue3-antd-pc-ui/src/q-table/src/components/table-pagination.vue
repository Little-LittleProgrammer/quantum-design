<!--  -->
<template>
    <div class="q-table-pagination">
        <div class="pagination-button">
            <slot></slot>
        </div>
        <a-pagination v-bind="getPageOption"/>
    </div>
</template>

<script lang='ts' setup>
import { type PropType, computed} from 'vue';
import type {PaginationProps} from '../types/pagination';
import { Pagination as APagination } from 'ant-design-vue';
defineOptions({
    name: 'QAntdTablePagination'
});
const props = defineProps({
    pageOption: {
        type: Object as PropType<PaginationProps>
    }
});

const getPageOption = computed(() => {
    return {
        showTotal: (count:number) => `总共 ${count} 条`,
        showSizeChanger: true,
        pageSize: 10,
        current: 1,
        total: 0,
        ...props.pageOption
    };
});
</script>
<style lang="scss">
.q-table-pagination {
    display: flex;
    .pagination-button {
        flex: 1;
    }
}
</style>
