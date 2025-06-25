<!--  -->
<template>
    <Tooltip placement="top">
        <template #title>
            <span>导出</span>
        </template>
        <template v-if="!isCustom">
            <DownloadOutlined @click="handleExport" />
        </template>
        <template v-else> </template>
    </Tooltip>
</template>

<script lang="ts" setup>
import type { SizeType } from '../../types/table';
import { useQAntdModal } from '@vue3-antd/q-modal';
import { Tooltip, Dropdown, Menu, MenuItem } from 'ant-design-vue';
import { DownloadOutlined } from '@ant-design/icons-vue';
import { computed, ref } from 'vue';
import { useTableContext } from '../../hooks/use-table-context';

const table = useTableContext();
const selectedKeysRef = ref<SizeType[]>([table.getSize()]);

const isCustom = computed(() => {
    return !!table.getBindValues.value.exportSetting?.custom;
});

function handle_title_click({ key, }: { key: SizeType }) {
    selectedKeysRef.value = [key];
    table.setProps({
        size: key,
    });
}

function handleExport() {
    table.exportData();
}
</script>
