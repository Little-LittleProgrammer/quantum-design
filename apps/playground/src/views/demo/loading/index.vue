<template>
    <div class="loading-demo">
        <a-card title="基础用法" class="g-mt">
            <div class="loading-section">
                <div class="demo-item">
                    <h4>默认加载</h4>
                    <q-loading :loading="true" />
                </div>
                <div class="demo-item">
                    <h4>不同大小</h4>
                    <div style="display: flex; gap: 20px">
                        <div style="flex: 1">
                            <p>小</p>
                            <q-loading :loading="true" size="small" />
                        </div>
                        <div style="flex: 1">
                            <p>默认</p>
                            <q-loading :loading="true" size="default" />
                        </div>
                        <div style="flex: 1">
                            <p>大</p>
                            <q-loading :loading="true" size="large" />
                        </div>
                    </div>
                </div>
            </div>
        </a-card>

        <a-card title="不同动画模式" class="g-mt">
            <div class="loading-section">
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px">
                    <div class="demo-item">
                        <h4>旋转模式</h4>
                        <q-loading :loading="true" mode="rotate" />
                    </div>
                    <div class="demo-item">
                        <h4>四部分模式</h4>
                        <q-loading :loading="true" mode="four-part" />
                    </div>
                    <div class="demo-item">
                        <h4>内外模式</h4>
                        <q-loading :loading="true" mode="out-in" />
                    </div>
                    <div class="demo-item">
                        <h4>波浪模式</h4>
                        <q-loading :loading="true" mode="wave" />
                    </div>
                </div>
            </div>
        </a-card>

        <a-card title="控制加载状态" class="g-mt">
            <div class="loading-section">
                <div style="margin-bottom: 16px">
                    <a-space>
                        <a-button type="primary" @click="toggleLoading">
                            {{ isLoading ? '停止加载' : '开始加载' }}
                        </a-button>
                        <a-button @click="showDelayLoading">延迟显示加载</a-button>
                        <a-button @click="showCustomLoading">自定义样式加载</a-button>
                    </a-space>
                </div>
                <div class="demo-container">
                    <q-loading :loading="isLoading" :mode="loadingMode" :size="loadingSize">
                        <div style="padding: 40px; text-align: center; color: #666">内容区域 - 点击按钮查看加载效果</div>
                    </q-loading>
                </div>
            </div>
        </a-card>

        <a-card title="实际使用场景" class="g-mt">
            <div class="loading-section">
                <h4>模拟数据加载</h4>
                <div style="margin-bottom: 16px">
                    <a-button type="primary" @click="loadData">加载数据</a-button>
                    <a-button @click="loadWithError" style="margin-left: 8px">模拟加载失败</a-button>
                </div>
                <div class="data-container">
                    <q-loading :loading="dataLoading" text="正在加载数据..." size="large">
                        <div v-if="dataError" style="text-align: center; color: #ff4d4f; padding: 40px">加载失败，请重试</div>
                        <div v-else style="padding: 20px">
                            <h4>数据列表</h4>
                            <ul>
                                <li v-for="item in mockData" :key="item.id">{{ item.name }} - {{ item.description }}</li>
                            </ul>
                        </div>
                    </q-loading>
                </div>
            </div>
        </a-card>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { QLoading } from '@quantum-design/vue3-pc-ui';
import { Card as ACard, Button as AButton, Space as ASpace } from 'ant-design-vue';

defineOptions({
    name: 'LoadingDemo'
});

const isLoading = ref(false);
const loadingText = ref('加载中...');
const loadingMode = ref<'rotate' | 'four-part' | 'out-in' | 'wave'>('rotate');
const loadingSize = ref<'small' | 'default' | 'large'>('default');

const dataLoading = ref(false);
const dataError = ref(false);
const mockData = ref([
    { id: 1, name: '项目A', description: '前端开发项目' },
    { id: 2, name: '项目B', description: '后端API开发' },
    { id: 3, name: '项目C', description: '移动端应用' },
    { id: 4, name: '项目D', description: '数据分析平台' },
    { id: 5, name: '项目E', description: '用户管理系统' }
]);

function toggleLoading() {
    isLoading.value = !isLoading.value;
    if (isLoading.value) {
        loadingText.value = '加载中...';
        loadingMode.value = 'rotate';
        loadingSize.value = 'default';
    }
}

function showDelayLoading() {
    isLoading.value = true;
    loadingText.value = '延迟加载中...';
    loadingMode.value = 'wave';
    loadingSize.value = 'large';

    setTimeout(() => {
        isLoading.value = false;
    }, 3000);
}

function showCustomLoading() {
    isLoading.value = true;
    loadingText.value = '自定义加载效果';
    loadingMode.value = 'four-part';
    loadingSize.value = 'small';

    setTimeout(() => {
        isLoading.value = false;
    }, 2000);
}

function loadData() {
    dataLoading.value = true;
    dataError.value = false;

    // 模拟API调用
    setTimeout(() => {
        dataLoading.value = false;
        // 重新生成数据以模拟新数据
        mockData.value = [
            { id: Date.now() + 1, name: '新项目A', description: '新的前端项目' },
            { id: Date.now() + 2, name: '新项目B', description: '新的后端项目' },
            { id: Date.now() + 3, name: '新项目C', description: '新的全栈项目' }
        ];
    }, 2000);
}

function loadWithError() {
    dataLoading.value = true;
    dataError.value = false;

    // 模拟失败的API调用
    setTimeout(() => {
        dataLoading.value = false;
        dataError.value = true;
    }, 1500);
}
</script>

<style lang="scss" scoped>
.loading-demo {
    padding: 16px;
}

.loading-section {
    padding: 16px 0;
}

.demo-item {
    margin-bottom: 24px;

    h4 {
        margin: 8px 0;
        color: #333;
        font-weight: 500;
    }
}

.demo-container {
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    min-height: 200px;
    position: relative;
    background: #fafafa;
}

.data-container {
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    min-height: 300px;
    position: relative;
    background: #fff;

    ul {
        list-style: none;
        padding: 0;

        li {
            padding: 8px 0;
            border-bottom: 1px solid #f0f0f0;

            &:last-child {
                border-bottom: none;
            }
        }
    }
}
</style>
