<!--  -->
<template>
    <div class="q-table-pagination">
        <div class="pagination-button">
            <slot></slot>
        </div>
        <a-pagination v-bind="getPageOption" @change="handle_pagination_change" />
    </div>
</template>

<script lang="ts" setup>
import { type PropType, computed } from 'vue';
import type { PaginationProps } from '../types/pagination';
import { Pagination as APagination } from 'ant-design-vue';
import { isBoolean } from '@quantum-design/utils';
defineOptions({
    name: 'QAntdTablePagination',
});
const props = defineProps({
    pageOption: {
        type: Object as PropType<PaginationProps | boolean>,
    },
});
const emit = defineEmits(['change']);
const getPageOption = computed(() => {
    return {
        showTotal: (count: number) => `总共 ${count} 条`,
        showSizeChanger: true,
        pageSize: 10,
        current: 1,
        total: 0,
        ...(props.pageOption as PaginationProps),
    };
});

function handle_pagination_change(page: number, pageSize: number) {
    if (isBoolean(props.pageOption)) {
        return;
    }
    emit('change', {
        current: page,
        pageSize,
        defaultPageSize: props.pageOption?.defaultPageSize,
        pageSizeOptions: props.pageOption?.pageSizeOptions,
        showQuickJumper: props.pageOption?.showQuickJumper,
        showSizeChanger: props.pageOption?.showSizeChanger,
        total: props.pageOption?.total,
        size: props.pageOption?.size,
    });
}
</script>
<style lang="scss"></style>
