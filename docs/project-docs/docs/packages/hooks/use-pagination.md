# 前端分页
前端进行分页的hooks

## Usage

```vue
<template
    <a-table :columns="data.tableHeader" :dataSource="getPaginationList" :pagination="getPageOption">
    </a-table>
</template>

<script lang='ts' setup>
import { computed, reactive, ref } from 'vue';
import { usePagination } from '@qm-front-npm/hooks/vue';
import { ColumnType } from 'ant-design-vue/lib/table';
interface IDataProps {
    tableHeader: ColumnType[];
    pageOption: IPageOption
}
const data: IDataProps = reactive({
    tableHeader: []
});
const tableList = ref([]);
const { getPaginationList, setCurrentPage, setPageSize} = usePagination(tableList, 10);

const getPageOption = computed(() => ({
    onChange: (page: number, size: number) => {
        setCurrentPage(page);
        setPageSize(size);
    }
}));

</script>
<style lang='scss' scoped>
</style>

```

## API
`const { getPaginationList, setCurrentPage, setPageSize} = usePagination(tableList, pagesize);`

|  参数      |   类型   |   说明   |
|:---------:|----------|---------|
|  getPaginationList  |  `array`  | 处理过的list文件 |
|  setCurrentPage  |  `(page: number)=>void`  | 设置当前页 |
|  setPageSize  | `(size: number)=>void`  | 设置当前页大小 |

