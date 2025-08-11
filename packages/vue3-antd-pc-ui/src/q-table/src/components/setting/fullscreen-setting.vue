<!--  -->
<template>
    <Tooltip placement="top">
        <template #title>
            <span>{{ isFullscreen ? '退出全屏' : '全屏' }}</span>
        </template>
        <FullscreenExitOutlined v-if="isFullscreen" @click="handleFullScreen" />
        <FullscreenOutlined v-else @click="handleFullScreen" />
    </Tooltip>
</template>

<script lang="ts" setup>
import { Tooltip } from 'ant-design-vue';
import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons-vue';
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useTableContext } from '../../hooks/use-table-context';

const table = useTableContext();
const isFullscreen = ref(false);
const emit = defineEmits(['fullscreen-change']);
function getTableContentElement() {
    const wrapEl = table.wrapRef?.value;
    if (!wrapEl) return null;

    // 找到包含Table组件的card容器
    // 如果有搜索表单，表格内容是第二个card；如果没有搜索表单，表格内容是第一个card
    const hasSearchForm = wrapEl.classList.contains('q-table-form-container');
    const cardElements = wrapEl.querySelectorAll('.ant-card');

    if (hasSearchForm && cardElements.length >= 2) {
        // 有搜索表单，取第二个card（表格内容）
        return cardElements[1] as HTMLElement;
    } else if (!hasSearchForm && cardElements.length >= 1) {
        // 没有搜索表单，取第一个card（表格内容）
        return cardElements[0] as HTMLElement;
    }

    return null;
}

function exitFullscreen() {
    if (!isFullscreen.value) return;

    const tableCardEl = getTableContentElement();
    if (!tableCardEl) return;

    isFullscreen.value = false;
    tableCardEl.classList.remove('q-table-content-fullscreen');
    document.body.style.overflow = '';

    // 退出全屏后重新计算表格高度
    nextTick(() => {
        table.redoHeight?.();
    });
}

function enterFullscreen() {
    const tableCardEl = getTableContentElement();
    if (!tableCardEl) return;

    isFullscreen.value = true;
    tableCardEl.classList.add('q-table-content-fullscreen');
    document.body.style.overflow = 'hidden';

    // 进入全屏后重新计算表格高度
    nextTick(() => {
        table.redoHeight?.();
    });
}

function handleFullScreen() {
    if (isFullscreen.value) {
        exitFullscreen();
    } else {
        enterFullscreen();
    }
    emit('fullscreen-change', isFullscreen.value);
}

// ESC键退出全屏
function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && isFullscreen.value) {
        exitFullscreen();
    }
}

onMounted(() => {
    document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
    // 组件卸载时退出全屏状态
    if (isFullscreen.value) {
        exitFullscreen();
    }
    document.removeEventListener('keydown', handleKeydown);
});
</script>
