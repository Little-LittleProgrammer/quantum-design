<script lang="ts" setup>
import { useQAntdModal } from '@quantum-design/vue3-antd-pc-ui';

import { Button, message } from 'ant-design-vue';

const [Modal, modalApi] = useQAntdModal({
    draggable: true,
    onCancel() {
        modalApi.close();
    },
    onClosed() {
        message.info('onClosed：关闭动画结束');
    },
    onConfirm() {
        message.info('onConfirm');
        // modalApi.close();
    },
    onOpened() {
        message.info('onOpened：打开动画结束');
    },
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
