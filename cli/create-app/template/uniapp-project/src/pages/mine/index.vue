<template>
    <view class="content">
        <view class="text-area">
            <text class="title">{{ title }} - mine</text>
        </view>
    </view>
</template>

<script setup>
import $qmsa from '@/api/qm-statistics';
import { ref, onMounted } from 'vue';

const title = ref('Hello');
onMounted(() => {
    $qmsa.track('launch_warmboot_#_open', {}, true);
});
</script>

<style lang="scss"></style>
