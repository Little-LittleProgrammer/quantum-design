<script lang="ts" setup>
import { ref } from 'vue';

import { useQAntdModal } from '@quantum-design/vue3-antd-pc-ui';

import { Button, message } from 'ant-design-vue';

const list = ref<number[]>([]);

const [Modal, modalApi] = useQAntdModal({
    onCancel() {
        modalApi.close();
    },
    onConfirm() {
        message.info('onConfirm');
    },
    onOpenChange(isOpen) {
        if (isOpen) {
            handleUpdate(10);
        }
    },
});

function handleUpdate(len: number) {
    modalApi.setState({ confirmDisabled: true, loading: true, });
    setTimeout(() => {
        list.value = Array.from({ length: len, }, (_v, k) => k + 1);
        modalApi.setState({ confirmDisabled: false, loading: false, });
    }, 2000);
}
</script>

<template>
    <Modal title="自动计算高度">
        <div v-for="item in list" :key="item" class="list-item">
            {{ item }}
        </div>
        <template #prepend-footer>
            <Button type="link" @click="handleUpdate(6)">点击更新数据</Button>
        </template>
    </Modal>
</template>

<style lang="scss" scoped>
.list-item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 220px;
    background-color: var(--bg-muted);

    &:nth-child(even) {
        background-color: var(--bg-heavy);
    }
}
</style>
