<script lang="ts" setup>
import { useQAntdModal } from '@quantum-design/vue3-antd-pc-ui';

import { Button, message } from 'ant-design-vue';

const [Modal, modalApi] = useQAntdModal({
    draggable: true,
    onCancel() {
        modalApi.close();
        console.log('onCancel');
    },
    onConfirm() {
        message.info('onConfirm');
        console.log('onConfirm');
        // modalApi.close();
    },
    onOpenChange(isOpen: boolean) {
        message.info(`onOpenChange: ${isOpen}`);
        console.log('onOpenChange', isOpen);
    },
    onOpened() {
        message.info('onOpened');
        console.log('onOpened');
    }
});

function lockModal() {
    modalApi.lock();
    setTimeout(() => {
        modalApi.unlock();
    }, 3000);
}
</script>
<template>
    <Modal title="基础弹窗示例" title-tooltip="标题提示内容">
        base demo
        <Button type="primary" @click="lockModal">锁定弹窗</Button>
    </Modal>
</template>
