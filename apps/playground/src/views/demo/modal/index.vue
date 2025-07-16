<template>
    <div>
        <a-button type="primary" @click="openBaseModal">打开基本弹窗</a-button>
        <BaseModal />
        <a-button type="primary" @click="openAutoHeightModal">打开自适应弹窗</a-button>
        <AutoHeightModal />
    </div>
</template>

<script lang="ts" setup>
import { useQAntdModal } from '@quantum-design/vue3-antd-pc-ui';
import BaseDemo from './base-demo.vue';
import AutoHeightDemo from './auto-height-demo.vue';

const [BaseModal, baseModalApi] = useQAntdModal({
    // 连接抽离的组件
    connectedComponent: BaseDemo,
});

const [AutoHeightModal, autoHeightModalApi] = useQAntdModal({
    connectedComponent: AutoHeightDemo,
});

function openBaseModal() {
    baseModalApi.open();
}

function openAutoHeightModal() {
    autoHeightModalApi.open();
}
</script>

<style lang="scss" scoped>
.custom-title {
    display: flex;
    align-items: center;
    gap: 8px;
}

.modal-content {
    padding: 24px;
}

.custom-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 16px;
}
</style>
