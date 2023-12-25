<template>
    <view class="qm-mask" v-if="props.visible" :class="{ 'qm-mask_transparent': transparent }" @click="on_click"></view>
</template>
<script setup>
const props = defineProps({
    visible: {
        type: Boolean,
        default: true
    },
    transparent: {
        type: Boolean,
        default: false
    },
    maskClick: {
        type: Boolean,
        default: true
    }
});
const $emit = defineEmits(['click']);
const on_click = () => {
    if (props.maskClick) {
        $emit('click');
    }
};

</script>
<style lang="less">
.qm-mask {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, .6);
    animation: opacityHideToShow .3s linear forwards;

    &_transparent {
        background-color: transparent;
    }
}
</style>
