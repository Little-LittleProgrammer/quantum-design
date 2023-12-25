<template>
  <view class="content">
    <view class="text-area">
      <text class="title">{{ title }} - sub</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const title = ref('Hello');
</script>

<style lang="less">

</style>
