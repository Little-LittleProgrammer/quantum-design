<template>
    <div v-if="offlineReady || needRefresh" class="qm-pwa pwa-toast" role="alert">
        <div class="message">
            <span v-if="offlineReady">
                应用程序准备离线工作
            </span>
            <span v-else>
                新的内容可用，点击重新加载按钮更新。
            </span>
        </div>
        <button v-if="needRefresh" @click="updateServiceWorker()">
            重新加载
        </button>
    </div>
</template>

<script lang="ts" setup>

import { useRegisterSW } from 'virtual:pwa-register/vue';

const intervalMS = 60 * 60 * 1000; // 一小时
const {
    offlineReady,
    needRefresh,
    updateServiceWorker
} = useRegisterSW({
    onRegisteredSW(swUrl, r) {
        r && setInterval(async() => {
            if (!(!r.installing && navigator))
                return;

            if (('connection' in navigator) && !navigator.onLine)
                return;

            const resp = await fetch(swUrl, {
                cache: 'no-store',
                headers: {
                    'cache': 'no-store',
                    'cache-control': 'no-cache'
                }
            });

            if (resp?.status === 200) {
                needRefresh.value = true;
                // await r.update();
            }
        }, intervalMS);
    }
});

// const close = async() => {
//     offlineReady.value = false;
//     needRefresh.value = false;
// };
</script>

<style lang="scss" scoped>
.qm-pwa {
    &.pwa-toast {
        position: fixed;
        right: 0;
        bottom: 0;
        margin: 16px;
        padding: 12px;
        border: 1px solid;
        @include border-color(border-color);
        border-radius: 6px;
        z-index: 1;
        text-align: left;
        @include bg-color(aside-bg);
        & .message {
            margin-bottom: 8px;
            @include text-color(text-color);
            font-size: 16px;
        }
        & button {
            border: 1px solid;
            @include bg-color(border-color);
            @include border-color(border-color);
            @include text-color(text-color);
            outline: none;
            margin-right: 5px;
            border-radius: 2px;
            padding: 8px 10px;
            font-size: 14px;
        }
    }
}
</style>

