<!--  -->
<template>
    <Tooltip placement="top">
        <template #title>
            <span>密度</span>
        </template>

        <dropdown placement="bottom" :trigger="['click']" >
            <ColumnHeightOutlined />
            <template #overlay>
                <Menu @click="handle_title_click" selectable :selectedKeys="selectedKeysRef">
                    <menu-item key="default">
                        <span>默认</span>
                    </menu-item>
                    <menu-item key="middle">
                        <span>中等</span>
                    </menu-item>
                    <menu-item key="small">
                        <span>紧凑</span>
                    </menu-item>
                </Menu>
            </template>
        </dropdown>
    </Tooltip>
</template>

<script lang='ts' setup>
import type { SizeType } from '../../types/table';
import {Tooltip, Dropdown, Menu, MenuItem} from 'ant-design-vue';
import { ColumnHeightOutlined } from '@ant-design/icons-vue';
import { ref } from 'vue';
import { useTableContext } from '../../hooks/use-table-context';

const table = useTableContext();
const selectedKeysRef = ref<SizeType[]>([table.getSize()]);

function handle_title_click({ key }: { key: SizeType }) {
    selectedKeysRef.value = [key];
    table.setProps({
        size: key
    });
}
</script>
