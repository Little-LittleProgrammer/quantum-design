<!--  -->
<template>
    <div class="table-pagination">
        <div class="pagination-button">
            <slot></slot>
        </div>
        <a-pagination v-bind="getPageOption"/>
    </div>
</template>

<script lang='ts' setup>
import { PropType, computed} from 'vue';
import {PaginationProps} from './interface';

const props = defineProps({
    pageOption: {
        type: Object as PropType<PaginationProps>
    }
});

const getPageOption = computed(() => {
    return {
        showTotal: (total_num:number) => `总共 ${total_num} 条`,
        showSizeChanger: true,
        pageSize: 10,
        current: 1,
        total: 0,
        ...props.pageOption
    };
});
</script>
<style lang='scss' scoped>
.table-pagination {
    display: flex;
    .pagination-button {
        flex: 1;
    }
}
</style>
