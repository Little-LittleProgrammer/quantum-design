<template>
    <div class="tree-table-demo">
        <a-card title="基础用法" class="g-mt">
            <q-tree-table :tree-data="basicTreeData" :header="basicHeader" />
        </a-card>

        <a-card title="自定义单元格内容" class="g-mt">
            <q-tree-table :tree-data="customTreeData" :header="customHeader">
                <template #default="{ cell, headerKey }">
                    <span v-if="headerKey === 'name'" class="custom-name">
                        <a-tag v-if="cell.level === 1" color="blue">{{ cell[headerKey] }}</a-tag>
                        <a-tag v-else-if="cell.level === 2" color="green">{{ cell[headerKey] }}</a-tag>
                        <span v-else>{{ cell[headerKey] }}</span>
                    </span>
                    <span v-else-if="headerKey === 'status'">
                        <a-tag :color="cell[headerKey] === '启用' ? 'success' : 'error'">
                            {{ cell[headerKey] }}
                        </a-tag>
                    </span>
                    <span v-else-if="headerKey === 'actions'">
                        <a-button size="small" type="link" @click="editItem(cell)">编辑</a-button>
                        <a-button size="small" type="link" danger @click="deleteItem(cell)">删除</a-button>
                    </span>
                    <span v-else>{{ cell[headerKey] }}</span>
                </template>
            </q-tree-table>
        </a-card>

        <a-card title="自定义表头" class="g-mt">
            <q-tree-table :tree-data="headerTreeData" :header="headerConfig">
                <template #header="{ hKey }">
                    <span v-if="hKey === 'name'"> <a-icon type="user" /> 名称 </span>
                    <span v-else-if="hKey === 'department'"> <a-icon type="team" /> 部门 </span>
                    <span v-else-if="hKey === 'position'"> <a-icon type="crown" /> 职位 </span>
                    <span v-else-if="hKey === 'salary'"> <a-icon type="dollar" /> 薪资 </span>
                    <span v-else>{{ hKey }}</span>
                </template>
                <template #default="{ cell, headerKey }">
                    <span v-if="headerKey === 'salary'">
                        <span style="color: #1890ff; font-weight: bold"> ¥{{ cell[headerKey] }} </span>
                    </span>
                    <span v-else>{{ cell[headerKey] }}</span>
                </template>
            </q-tree-table>
        </a-card>

        <a-card title="动态树表格" class="g-mt">
            <div style="margin-bottom: 16px">
                <a-space>
                    <a-button type="primary" @click="addRootNode">添加根节点</a-button>
                    <a-button @click="expandAll">展开所有</a-button>
                    <a-button @click="collapseAll">收起所有</a-button>
                    <a-button @click="refreshData">刷新数据</a-button>
                </a-space>
            </div>
            <q-tree-table :tree-data="dynamicTreeData" :header="dynamicHeader">
                <template #default="{ cell, headerKey }">
                    <span v-if="headerKey === 'actions'">
                        <a-button size="small" type="link" @click="addChild(cell)">添加子项</a-button>
                        <a-button size="small" type="link" danger @click="removeNode(cell)">删除</a-button>
                    </span>
                    <span v-else-if="headerKey === 'type'">
                        <a-tag :color="getTypeColor(cell[headerKey])">
                            {{ cell[headerKey] }}
                        </a-tag>
                    </span>
                    <span v-else>{{ cell[headerKey] }}</span>
                </template>
            </q-tree-table>
        </a-card>

        <a-card title="复杂数据结构" class="g-mt">
            <q-tree-table :tree-data="complexTreeData" :header="complexHeader">
                <template #default="{ cell, headerKey }">
                    <span v-if="headerKey === 'progress'">
                        <a-progress :percent="cell[headerKey]" size="small" :status="cell[headerKey] === 100 ? 'success' : 'active'" />
                    </span>
                    <span v-else-if="headerKey === 'priority'">
                        <a-tag :color="getPriorityColor(cell[headerKey])">
                            {{ cell[headerKey] }}
                        </a-tag>
                    </span>
                    <span v-else-if="headerKey === 'assignee'">
                        <a-avatar size="small" :style="{ backgroundColor: getAvatarColor(cell[headerKey]) }">
                            {{ cell[headerKey]?.charAt(0) }}
                        </a-avatar>
                        <span style="margin-left: 8px">{{ cell[headerKey] }}</span>
                    </span>
                    <span v-else>{{ cell[headerKey] }}</span>
                </template>
            </q-tree-table>
        </a-card>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { QTreeTable } from '@quantum-design/vue3-pc-ui';
import { Card as ACard, Tag as ATag, Button as AButton, Space as ASpace, Progress as AProgress, Avatar as AAvatar, message } from 'ant-design-vue';

defineOptions({
    name: 'TreeTableDemo'
});

// 基础用法数据
const basicHeader = {
    name: '名称',
    type: '类型',
    size: '大小',
    modified: '修改时间'
};

const basicTreeData = ref([
    {
        key: 'folder1',
        name: '文档',
        type: '文件夹',
        size: '-',
        modified: '2024-01-15',
        level: 1,
        children: [
            {
                key: 'file1',
                name: '工作计划.docx',
                type: '文档',
                size: '2.5MB',
                modified: '2024-01-15',
                level: 2
            },
            {
                key: 'file2',
                name: '会议纪要.pdf',
                type: 'PDF',
                size: '1.8MB',
                modified: '2024-01-14',
                level: 2
            }
        ]
    },
    {
        key: 'folder2',
        name: '图片',
        type: '文件夹',
        size: '-',
        modified: '2024-01-13',
        level: 1,
        children: [
            {
                key: 'img1',
                name: 'logo.png',
                type: '图片',
                size: '256KB',
                modified: '2024-01-13',
                level: 2
            }
        ]
    }
]);

// 自定义单元格数据
const customHeader = {
    name: '菜单名称',
    path: '路径',
    status: '状态',
    actions: '操作'
};

const customTreeData = ref([
    {
        key: 'menu1',
        name: '系统管理',
        path: '/system',
        status: '启用',
        level: 1,
        children: [
            {
                key: 'menu1-1',
                name: '用户管理',
                path: '/system/user',
                status: '启用',
                level: 2
            },
            {
                key: 'menu1-2',
                name: '角色管理',
                path: '/system/role',
                status: '停用',
                level: 2
            }
        ]
    },
    {
        key: 'menu2',
        name: '内容管理',
        path: '/content',
        status: '启用',
        level: 1,
        children: [
            {
                key: 'menu2-1',
                name: '文章管理',
                path: '/content/article',
                status: '启用',
                level: 2
            }
        ]
    }
]);

// 自定义表头数据
const headerConfig = {
    name: '姓名',
    department: '部门',
    position: '职位',
    salary: '薪资'
};

const headerTreeData = ref([
    {
        key: 'dept1',
        name: '技术部',
        department: '技术中心',
        position: '部门',
        salary: '-',
        level: 1,
        children: [
            {
                key: 'emp1',
                name: '张三',
                department: '前端组',
                position: '前端工程师',
                salary: '15000',
                level: 2
            },
            {
                key: 'emp2',
                name: '李四',
                department: '后端组',
                position: '后端工程师',
                salary: '16000',
                level: 2
            }
        ]
    }
]);

// 动态树表格数据
const dynamicHeader = {
    name: '节点名称',
    type: '节点类型',
    value: '值',
    actions: '操作'
};

const dynamicTreeData = ref([
    {
        key: 'node1',
        name: '根节点1',
        type: '根节点',
        value: '100',
        level: 1,
        children: [
            {
                key: 'node1-1',
                name: '子节点1-1',
                type: '子节点',
                value: '50',
                level: 2
            }
        ]
    }
]);

// 复杂数据结构
const complexHeader = {
    name: '任务名称',
    progress: '进度',
    priority: '优先级',
    assignee: '负责人',
    dueDate: '截止日期'
};

const complexTreeData = ref([
    {
        key: 'project1',
        name: '前端重构项目',
        progress: 75,
        priority: '高',
        assignee: '张三',
        dueDate: '2024-03-15',
        level: 1,
        children: [
            {
                key: 'task1',
                name: '组件库升级',
                progress: 90,
                priority: '高',
                assignee: '李四',
                dueDate: '2024-02-28',
                level: 2
            },
            {
                key: 'task2',
                name: 'UI样式调整',
                progress: 60,
                priority: '中',
                assignee: '王五',
                dueDate: '2024-03-10',
                level: 2
            }
        ]
    },
    {
        key: 'project2',
        name: '移动端适配',
        progress: 30,
        priority: '中',
        assignee: '赵六',
        dueDate: '2024-04-20',
        level: 1,
        children: [
            {
                key: 'task3',
                name: '响应式布局',
                progress: 100,
                priority: '高',
                assignee: '孙七',
                dueDate: '2024-02-15',
                level: 2
            }
        ]
    }
]);

// 工具函数
function editItem(item: any) {
    message.info(`编辑项目: ${item.name}`);
}

function deleteItem(item: any) {
    message.warning(`删除项目: ${item.name}`);
}

function addRootNode() {
    const newNode = {
        key: `node-${Date.now()}`,
        name: `新根节点${dynamicTreeData.value.length + 1}`,
        type: '根节点',
        value: '0',
        level: 1,
        children: []
    };
    dynamicTreeData.value.push(newNode);
    message.success('添加根节点成功');
}

function addChild(parent: any) {
    if (!parent.children) {
        parent.children = [];
    }
    const newChild = {
        key: `${parent.key}-${parent.children.length + 1}`,
        name: `${parent.name}-子节点${parent.children.length + 1}`,
        type: '子节点',
        value: '0',
        level: parent.level + 1
    };
    parent.children.push(newChild);
    message.success('添加子节点成功');
}

function removeNode(node: any) {
    // 简化的删除逻辑，实际项目中需要递归查找并删除
    message.warning(`删除节点: ${node.name}`);
}

function expandAll() {
    message.info('展开所有节点');
}

function collapseAll() {
    message.info('收起所有节点');
}

function refreshData() {
    message.success('刷新数据成功');
}

function getTypeColor(type: string) {
    const colorMap: Record<string, string> = {
        根节点: 'blue',
        子节点: 'green',
        叶节点: 'orange'
    };
    return colorMap[type] || 'default';
}

function getPriorityColor(priority: string) {
    const colorMap: Record<string, string> = {
        高: 'red',
        中: 'orange',
        低: 'green'
    };
    return colorMap[priority] || 'default';
}

function getAvatarColor(name: string) {
    const colors = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae', '#87d068'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
}
</script>

<style lang="scss" scoped>
.tree-table-demo {
    padding: 16px;
}

.custom-name {
    display: inline-flex;
    align-items: center;
}
</style>
