<!--  -->
<template>
    <span class="qm-tag" v-if="value && value != ''"
        ><em :title="value">{{ value }}</em></span
    >
</template>

<script lang="ts">
export default {
    name: 'QTag',
};
</script>

<script lang="ts" setup>
import { tagProps } from './tagTypes';
defineOptions({
    name: 'QTag',
});
defineProps(tagProps);
</script>

<style lang="scss">
.qm-tag {
    display: inline-block;
    vertical-align: top;
    em {
        display: block;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        font-size: 14px;
        line-height: 23px;
        height: 23px;
        color: var(--primary-color);
        border: 1px solid rgba(var(--primary-color), 0.8);
        background: rgba(var(--primary-color), 0.1);
        padding: 0 var(--space);
        border-radius: var(--border-radius-base);
        box-sizing: border-box;
    }
}
</style>
