<template>
    <div class="tag-demo">
        <a-card title="基础用法" class="g-mt">
            <div class="tag-section">
                <q-tag value="默认标签" />
                <q-tag value="标签内容" />
                <q-tag value="这是一个很长的标签内容，会自动截断显示" />
                <q-tag value="" />
                <span style="margin-left: 8px; color: #999">空值标签不会显示</span>
            </div>
        </a-card>

        <a-card title="动态标签" class="g-mt">
            <div class="tag-section">
                <div style="margin-bottom: 16px">
                    <a-input v-model:value="newTagValue" placeholder="输入标签内容" style="width: 200px; margin-right: 8px" @press-enter="addTag" />
                    <a-button type="primary" @click="addTag">添加标签</a-button>
                    <a-button @click="clearTags" style="margin-left: 8px">清空标签</a-button>
                </div>
                <div>
                    <q-tag v-for="(tag, index) in dynamicTags" :key="index" :value="tag" style="margin-right: 8px; margin-bottom: 8px" />
                </div>
            </div>
        </a-card>

        <a-card title="标签集合展示" class="g-mt">
            <div class="tag-section">
                <h4>技术标签:</h4>
                <div style="margin-bottom: 16px">
                    <q-tag v-for="tech in techTags" :key="tech" :value="tech" style="margin-right: 8px; margin-bottom: 8px" />
                </div>

                <h4>状态标签:</h4>
                <div style="margin-bottom: 16px">
                    <q-tag v-for="status in statusTags" :key="status" :value="status" style="margin-right: 8px; margin-bottom: 8px" />
                </div>

                <h4>分类标签:</h4>
                <div>
                    <q-tag v-for="category in categoryTags" :key="category" :value="category" style="margin-right: 8px; margin-bottom: 8px" />
                </div>
            </div>
        </a-card>

        <a-card title="文本截断示例" class="g-mt">
            <div class="tag-section">
                <div style="margin-bottom: 8px">
                    <q-tag value="短标签" />
                </div>
                <div style="margin-bottom: 8px">
                    <q-tag value="这是一个中等长度的标签内容" />
                </div>
                <div style="margin-bottom: 8px">
                    <q-tag value="这是一个非常非常非常长的标签内容，会自动进行文本截断处理，超出部分用省略号表示" />
                </div>
                <div style="margin-bottom: 8px">
                    <q-tag value="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua" />
                </div>
            </div>
        </a-card>

        <a-card title="使用场景示例" class="g-mt">
            <div class="tag-section">
                <h4>用户信息:</h4>
                <div style="margin-bottom: 16px">
                    <span style="margin-right: 8px">姓名:</span>
                    <q-tag value="张三" />
                    <span style="margin-left: 16px; margin-right: 8px">部门:</span>
                    <q-tag value="技术部" />
                    <span style="margin-left: 16px; margin-right: 8px">职位:</span>
                    <q-tag value="前端工程师" />
                </div>

                <h4>文章标签:</h4>
                <div style="margin-bottom: 16px">
                    <q-tag v-for="tag in articleTags" :key="tag" :value="tag" style="margin-right: 8px; margin-bottom: 8px" />
                </div>

                <h4>产品特性:</h4>
                <div>
                    <q-tag v-for="feature in productFeatures" :key="feature" :value="feature" style="margin-right: 8px; margin-bottom: 8px" />
                </div>
            </div>
        </a-card>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { QTag } from '@quantum-design/vue3-pc-ui';
import { Card as ACard, Input as AInput, Button as AButton } from 'ant-design-vue';

defineOptions({
    name: 'TagDemo'
});

const newTagValue = ref('');
const dynamicTags = ref<string[]>(['Vue.js', 'TypeScript', 'Vite']);

const techTags = ref(['Vue.js', 'React', 'Angular', 'TypeScript', 'JavaScript', 'Node.js', 'Express', 'Koa', 'Webpack', 'Vite']);

const statusTags = ref(['进行中', '已完成', '待审核', '已发布', '草稿', '已归档']);

const categoryTags = ref(['前端开发', '后端开发', '移动开发', '桌面应用', '数据库', '运维部署', '测试', '设计']);

const articleTags = ref(['Vue3源码解析', '性能优化', '工程化', '组件设计', '状态管理', '路由系统', '构建工具']);

const productFeatures = ref(['响应式设计', '组件化架构', '类型安全', '开发友好', '高性能', '易扩展', '文档完善', '社区活跃']);

function addTag() {
    if (newTagValue.value && !dynamicTags.value.includes(newTagValue.value)) {
        dynamicTags.value.push(newTagValue.value);
        newTagValue.value = '';
    }
}

function clearTags() {
    dynamicTags.value = [];
}
</script>

<style lang="scss" scoped>
.tag-demo {
    padding: 16px;
}

.tag-section {
    padding: 16px 0;
}

h4 {
    margin: 8px 0;
    color: #333;
    font-weight: 500;
}
</style>
