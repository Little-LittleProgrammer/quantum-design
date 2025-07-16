<!--  -->
<template>
    <div class="q-drawer-footer" :style="getStyle" v-if="showFooter || slots.footer">
        <template v-if="!slots.footer">
            <slot name='insterFooter'></slot>
            <a-button v-bind="cancelButtonProps"  @click="handle_close" class="mr-2" v-if="showCancelBtn">{{ cancelText }}</a-button>
            <slot name="centerFooter"></slot>
            <a-button
                :type="okType"
                @click="handle_ok"
                v-bind="okButtonProps"
                class="mr-2"
                :loading="confirmLoading"
                v-if="showOkBtn"
            >
                {{ okText }}
            </a-button>
            <slot name="appendFooter"></slot>
        </template>
        <template v-else>
            <slot name="footer"></slot>
        </template>
    </div>
</template>

<script lang='ts' setup>
import { type CSSProperties, useSlots } from 'vue';
import { computed } from 'vue';
import { footerProps } from '../props';
const props = defineProps({
    ...footerProps,
    height: {
        type: String,
        default: '60px'
    }
});
const slots = useSlots();

const emit = defineEmits(['ok', 'close']);

const getStyle = computed(():CSSProperties => {
    const _heightStr = `${props.height}`;
    return {
        height: _heightStr,
        lineHeight: `calc(${_heightStr} - 1px)`
    };
});

function handle_ok() {
    emit('ok');
}

function handle_close() {
    emit('close');
}

</script>
<style lang='scss'>
</style>
