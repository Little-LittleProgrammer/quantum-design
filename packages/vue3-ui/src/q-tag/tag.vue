<!--  -->
<template>
    <span class="qm-tag" v-if="value && value != ''"><em :title="value">{{ value }}</em></span>
</template>

<script lang="ts">
export default {
    name: 'QTag'
};
</script>

<script lang='ts' setup>
import './style/index.scss';
import { tagProps } from './tagTypes';
defineProps(tagProps);
</script>
