<template>
    <div v-if="needRefresh" class="qm-pwa pwa-toast" role="alert">
        <div class="message">
            <h3>新的内容可用，点击重新加载按钮更新。</h3>
            <p>更新时间: {{ showData.timestamp }}</p>
            <p v-if="showData.files.length > 0">更新页面: {{ showData.files.join(',') }}</p>
        </div>
        <button @click="updateServiceWorker?.()">
            重新加载
        </button>
        <button @click="close">
            关闭
        </button>
    </div>
</template>

<script lang="ts" setup>

import { useRegisterSW } from 'virtual:pwa-register/vue';
import { js_is_array } from '@quantum-design/utils';
import {routerData} from '@/router';
import { Ref, ref } from 'vue';

const intervalMS = 10000; // 10秒钟
const needRefresh = ref(false);
const showData: Ref<Record<'timestamp' | 'files', any>> = ref({
    timestamp: new Date().toLocaleString(),
    files: []
});
const formatData: Record<string, any> = [];
for (const fir of routerData) {
    if (fir.children) {
        for (const sub of fir.children) {
            formatData[sub.path] = sub.meta?.title || sub.name;
        }
    }
}

const {
    updateServiceWorker
} = useRegisterSW({
    immediate: true,
    onRegisteredSW(_swUrl, r) {
        if (r) {
            let _lastDate = new Date().getTime();
            const requestUpdate = () => {
                const _currentDate = new Date().getTime();
                if (_currentDate - _lastDate > intervalMS) {
                    _lastDate = _currentDate;
                    r.update();
                }
                requestAnimationFrame(requestUpdate);
            };
            requestUpdate();
        }
    },
    onNeedRefresh() {
        fetch('/git-changes.json', {
            cache: 'no-store',
            headers: {
                'cache': 'no-store',
                'cache-control': 'no-cache'
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // 解析JSON数据
        }).then(data => {
            if (data && data.files && data.timestamp) {
                showData.value.timestamp = data.timestamp;
                const set = new Set();
                const pathObj: Record<string, any> = {};
                for (const [k, v] of Object.entries(formatData || [])) {
                    const kArr = k.split('/') || [];
                    const finKey = ['list', 'index', 'detail'].includes(kArr[kArr.length - 1]) ? kArr[kArr.length - 2] : kArr[kArr.length - 1];
                    pathObj[finKey] = v;
                }
                if (js_is_array(data.files)) {
                    for (const file of data.files) {
                        if (!(file.endsWith('.vue') || file.endsWith('.ts'))) continue;
                        for (const [k, v] of Object.entries(pathObj)) {
                            if (~(file.indexOf(k))) {
                                set.add(v);
                            }
                        }
                    }
                }
                showData.value.files = [...set];
            }
            if (showData.value.files.length !== 0) {
                needRefresh.value = true;
            }
        }).catch(error => {
            console.error('There was a problem with your fetch operation:', error);
        });
    }
});

const close = async() => {
    needRefresh.value = false;
};
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
        z-index: 9000;
        text-align: left;
        @include bg-color(aside-bg);
        & .message {
            margin-bottom: 8px;
            @include text-color(text-color);
            font-size: 16px;
            line-height: 1.5;
            h3 {
                font-weight: 600;
            }
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

