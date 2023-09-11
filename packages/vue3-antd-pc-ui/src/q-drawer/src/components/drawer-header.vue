<!--  -->
<template>
    <span class="q-drawer-header" v-if="!props.isDetail">
        <slot name="title"></slot>
        {{ !slots.title ? props.title : '' }}
    </span>
    <div class="q-drawer-header q-drawer-header-detail" v-else>
        <span class="q-drawer-header-twrap">
            <span @click="handle_close" v-if="props.showDetailBack">
                <q-icon type="ArrowLeftOutlined" class="q-drawer-header-back" />
            </span>
            <span v-if="title">{{ title }}</span>
        </span>

        <span class="q-drawer-header-toolbar">
            <slot name="titleToolbar"></slot>
        </span>
    </div>
</template>

<script lang='ts' setup>
import { propTypes } from '@quantum-design/types/vue/types';
import { onMounted, useSlots} from 'vue';
import {Icon as QIcon} from '@/q-icon/src/icon';
const props = defineProps({
    isDetail: propTypes.bool,
    showDetailBack: propTypes.bool,
    title: propTypes.string
});
const slots = useSlots();
const emit = defineEmits(['close']);
function handle_close() {
    emit('close');
}
onMounted(() => {
});

</script>
<style lang='scss' scoped>
</style>
