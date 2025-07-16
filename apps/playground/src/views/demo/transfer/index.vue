<template>
    <div class="transfer-demo">
        <h2>树形穿梭框组件演示</h2>

        <div class="demo-section">
            <h3>基础用法</h3>
            <p>支持树形结构数据的穿梭框，可以在左右两侧之间移动选中的节点。</p>

            <QAntdTransfer v-model:targetKeys="targetKeys" :treeData="treeData" @change="handleChange" />

            <div class="selected-info">
                <h4>已选择的项目 ({{ targetKeys.length }} 项):</h4>
                <p v-if="targetKeys.length === 0" class="empty-text">暂无选择</p>
                <div v-else class="selected-keys">
                    <a-tag v-for="key in targetKeys" :key="key" closable @close="removeSelectedKey(key)">
                        {{ getItemTitle(key) }}
                    </a-tag>
                </div>
            </div>
        </div>

        <div class="demo-section">
            <h3>自定义字段名</h3>
            <p>支持自定义字段名映射，适配不同的数据结构。</p>

            <QAntdTransfer v-model:targetKeys="targetKeys2" :treeData="customTreeData" :fieldNames="customFieldNames" @change="handleChange2" />
        </div>

        <div class="demo-section">
            <h3>返回所有父级节点</h3>
            <p>启用 returnAll 属性，选择子节点时会自动包含父级节点。</p>

            <QAntdTransfer v-model:targetKeys="targetKeys3" :treeData="treeData" :returnAll="true" @change="handleChangeWithParent" />

            <div v-if="parentKeys.length > 0" class="parent-info">
                <h4>包含的父级节点:</h4>
                <a-tag v-for="key in parentKeys" :key="key" color="blue">
                    {{ getItemTitle(key) }}
                </a-tag>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Tag as ATag } from 'ant-design-vue';
import { QAntdTransfer } from '@quantum-design/vue3-antd-pc-ui';
import type { ICity, IFieldNames } from '@quantum-design/vue3-antd-pc-ui/src/q-transfer/src/transfer';

// 基础示例数据
const treeData = ref<ICity[]>([
    {
        key: '1',
        title: '北京市',
        children: [
            { key: '1-1', title: '海淀区' },
            { key: '1-2', title: '朝阳区' },
            { key: '1-3', title: '东城区' },
            { key: '1-4', title: '西城区' }
        ]
    },
    {
        key: '2',
        title: '上海市',
        children: [
            { key: '2-1', title: '浦东新区' },
            { key: '2-2', title: '徐汇区' },
            { key: '2-3', title: '静安区' },
            { key: '2-4', title: '黄浦区' }
        ]
    },
    {
        key: '3',
        title: '广东省',
        children: [
            { key: '3-1', title: '深圳市' },
            { key: '3-2', title: '广州市' },
            { key: '3-3', title: '珠海市' },
            { key: '3-4', title: '东莞市' }
        ]
    },
    {
        key: '4',
        title: '江苏省',
        children: [
            { key: '4-1', title: '南京市' },
            { key: '4-2', title: '苏州市' },
            { key: '4-3', title: '无锡市' },
            { key: '4-4', title: '常州市' }
        ]
    }
]);

// 自定义字段名的示例数据
const customTreeData = ref([
    {
        id: 'dept1',
        name: '技术部',
        subDepts: [
            { id: 'dept1-1', name: '前端组' },
            { id: 'dept1-2', name: '后端组' },
            { id: 'dept1-3', name: '测试组' }
        ]
    },
    {
        id: 'dept2',
        name: '产品部',
        subDepts: [
            { id: 'dept2-1', name: '产品设计组' },
            { id: 'dept2-2', name: 'UI设计组' },
            { id: 'dept2-3', name: '用户研究组' }
        ]
    },
    {
        id: 'dept3',
        name: '运营部',
        subDepts: [
            { id: 'dept3-1', name: '内容运营组' },
            { id: 'dept3-2', name: '用户运营组' },
            { id: 'dept3-3', name: '商务合作组' }
        ]
    }
]);

// 自定义字段名映射
const customFieldNames: IFieldNames = {
    key: 'id',
    title: 'name',
    children: 'subDepts'
};

// 选中的键值
const targetKeys = ref<string[]>(['1-2', '2-1', '3-1']);
const targetKeys2 = ref<string[]>(['dept1-1', 'dept2-2']);
const targetKeys3 = ref<string[]>([]);
const parentKeys = ref<string[]>([]);

// 获取项目标题的辅助函数
const getItemTitle = (key: string): string => {
    const findInTree = (nodes: ICity[], targetKey: string): string => {
        for (const node of nodes) {
            if (node.key === targetKey) {
                return node.title;
            }
            if (node.children) {
                const found = findInTree(node.children, targetKey);
                if (found) return found;
            }
        }
        return key;
    };
    return findInTree(treeData.value, key);
};

// 移除选中项
const removeSelectedKey = (key: string) => {
    targetKeys.value = targetKeys.value.filter((k) => k !== key);
};

// 变化事件处理
const handleChange = (keys: string[]) => {
    console.log('选择变化:', keys);
};

const handleChange2 = (keys: string[]) => {
    console.log('自定义字段名选择变化:', keys);
};

const handleChangeWithParent = (keys: string[], parents: string[]) => {
    console.log('选择变化:', keys);
    console.log('父级节点:', parents);
    parentKeys.value = parents;
};
</script>

<style scoped>
.transfer-demo {
    padding: 24px;
    background: #fff;
}

.demo-section {
    margin-bottom: 40px;
    padding-bottom: 24px;
    border-bottom: 1px solid #f0f0f0;
}

.demo-section:last-child {
    border-bottom: none;
}

.demo-section h3 {
    margin-bottom: 8px;
    color: #262626;
    font-size: 16px;
    font-weight: 600;
}

.demo-section p {
    margin-bottom: 16px;
    color: #8c8c8c;
    font-size: 14px;
}

.selected-info {
    margin-top: 24px;
    padding: 16px;
    background: #fafafa;
    border-radius: 6px;
}

.selected-info h4 {
    margin-bottom: 12px;
    color: #262626;
    font-size: 14px;
    font-weight: 600;
}

.empty-text {
    color: #bfbfbf;
    font-style: italic;
}

.selected-keys {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.parent-info {
    margin-top: 16px;
    padding: 12px;
    background: #e6f7ff;
    border: 1px solid #91d5ff;
    border-radius: 6px;
}

.parent-info h4 {
    margin-bottom: 8px;
    color: #1890ff;
    font-size: 14px;
    font-weight: 600;
}

:deep(.q-transfer) {
    width: 100%;
}

:deep(.ant-transfer) {
    display: flex;
    align-items: flex-start;
}

:deep(.ant-transfer-list) {
    width: 300px;
    height: 400px;
}
</style>
