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
import './style/index.scss';

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
