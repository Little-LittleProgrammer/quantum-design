<!--  -->
<template>
    <tooltip placement="top">
        <template #title>
            <span>刷新</span>
        </template>
        <RedoOutlined @click="redo" />
    </tooltip>
</template>

<script lang='ts' setup>
import {Tooltip} from 'ant-design-vue';
import {RedoOutlined} from '@ant-design/icons-vue';
import { useTableContext } from '../../hooks/use-table-context';

const table = useTableContext();
function redo() {
    table.reload();
}
</script>
<style lang='scss' scoped>
</style>
