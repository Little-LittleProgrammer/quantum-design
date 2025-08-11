<!-- 自定义筛选弹窗组件 -->
<template>
    <a-modal :open="visible" :title="title" width="1000px" :mask-closable="false" :keyboard="false" class="custom-filter-modal" @ok="handleConfirm" @cancel="handleCancel" @update:open="(value: boolean) => emit('update:visible', value)">
        <div class="custom-filter-content">
            <!-- 左右分栏布局 -->
            <div class="filter-layout">
                <!-- 左侧：字段选择区域 -->
                <div class="left-panel">
                    <div class="panel-header">
                        <span>字段</span>
                        <a-checkbox :indeterminate="indeterminate" :checked="checkAll" @change="onCheckAllChange" size="small"> 全选 </a-checkbox>
                    </div>

                    <!-- 字段列表 - 4栏展示 -->
                    <div class="field-grid">
                        <div v-for="schema in availableSchemas" :key="schema.field" class="field-item" @click="toggleField(schema)">
                            <a-checkbox :checked="isFieldSelected(schema)" :disabled="schema.alwaysVisible" @click.stop @change="(e: any) => onCheckboxChange(schema, e.target?.checked)" />
                            <span class="field-label" :class="{ 'field-disabled': schema.alwaysVisible }">
                                {{ schema.formFilterLabel || schema.label }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- 右侧：已选字段排序区域 -->
                <div class="right-panel">
                    <div class="panel-header">
                        <span>排序</span>
                        <span class="field-count">({{ selectedSchemasList.length }})</span>
                    </div>

                    <div class="sort-list" ref="sortableContainer">
                        <div v-for="schema in selectedSchemasList" :key="schema.field" class="sort-item" :class="{ 'always-visible': schema.alwaysVisible }" :data-field="schema.field">
                            <div class="drag-handle">
                                <holder-outlined />
                            </div>
                            <span class="field-text">{{ schema.formFilterLabel || schema.label }}</span>
                        </div>

                        <!-- 空状态 -->
                        <div v-if="selectedSchemasList.length === 0" class="empty-state">暂无已选字段</div>
                    </div>
                </div>
            </div>
        </div>

        <template #footer>
            <a-space>
                <a-button v-if="showResetButton" @click="handleReset"> 重置为默认 </a-button>
                <a-button @click="handleCancel">取消</a-button>
                <a-button type="primary" @click="handleConfirm"> 确定 </a-button>
            </a-space>
        </template>
    </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onUnmounted } from 'vue';
// @ts-expect-error sortablejs 缺少 TypeScript 类型定义
import Sortable from 'sortablejs';
import { HolderOutlined } from '@ant-design/icons-vue';
import { Modal as AModal, Button as AButton, Space as ASpace } from 'ant-design-vue';
import type { ICustomFilterModalProps } from '../types/form';

// SortableJS 事件类型定义
interface SortableEvent {
    to: Element;
    from: Element;
    item: Element;
    clone: Element;
    oldIndex?: number;
    newIndex?: number;
    oldDraggableIndex?: number;
    newDraggableIndex?: number;
    related?: Element;
}

// Emits 定义
interface Emits {
    (e: 'update:visible', visible: boolean): void;
    (e: 'confirm', config: { selectedFields: string[]; fieldOrder: string[] }): void;
    (e: 'reset'): void;
}

const props = withDefaults(defineProps<ICustomFilterModalProps>(), {
    title: '自定义筛选项',
    showResetButton: true
});

const emit = defineEmits<Emits>();

// 响应式数据
const selectedFields = ref<string[]>([]);
const fieldOrder = ref<string[]>([]);
const sortableContainer = ref<HTMLElement>();
let sortableInstance: Sortable | null = null;

// 计算属性
const availableSchemas = computed(() => {
    return props.schemas.filter((schema) => schema.formFilterLabel || schema.label);
});

const selectedSchemasList = computed(() => {
    const schemaMap = new Map(availableSchemas.value.map((schema) => [schema.field, schema]));
    return fieldOrder.value.map((fieldName) => schemaMap.get(fieldName)).filter(Boolean) as typeof availableSchemas.value;
});

// 全选相关
const selectableSchemas = computed(() => {
    return availableSchemas.value.filter((schema) => !schema.alwaysVisible);
});

const checkAll = computed(() => {
    return selectableSchemas.value.length > 0 && selectableSchemas.value.every((schema) => selectedFields.value.includes(schema.field));
});

const indeterminate = computed(() => {
    const selectedCount = selectableSchemas.value.filter((schema) => selectedFields.value.includes(schema.field)).length;
    return selectedCount > 0 && selectedCount < selectableSchemas.value.length;
});

// 工具函数
const isFieldSelected = (schema: any) => {
    return selectedFields.value.includes(schema.field);
};

const toggleField = (schema: any) => {
    if (schema.alwaysVisible) return;

    if (isFieldSelected(schema)) {
        removeField(schema);
    } else {
        addField(schema);
    }
};

const addField = (schema: any) => {
    if (!selectedFields.value.includes(schema.field)) {
        selectedFields.value.push(schema.field);
        fieldOrder.value.push(schema.field);
    }
};

const removeField = (schema: any) => {
    if (schema.alwaysVisible) return;

    const fieldIndex = selectedFields.value.indexOf(schema.field);
    if (fieldIndex > -1) {
        selectedFields.value.splice(fieldIndex, 1);
    }

    const orderIndex = fieldOrder.value.indexOf(schema.field);
    if (orderIndex > -1) {
        fieldOrder.value.splice(orderIndex, 1);
    }
};

const onCheckboxChange = (schema: any, checked: boolean) => {
    if (schema.alwaysVisible) return;

    if (checked) {
        addField(schema);
    } else {
        removeField(schema);
    }
};

// 全选功能
const onCheckAllChange = (e: any) => {
    const checked = e.target.checked;
    if (checked) {
        // 全选：添加所有可选字段
        selectableSchemas.value.forEach((schema) => {
            if (!selectedFields.value.includes(schema.field)) {
                selectedFields.value.push(schema.field);
                fieldOrder.value.push(schema.field);
            }
        });
    } else {
        // 取消全选：移除所有可选字段
        selectableSchemas.value.forEach((schema) => {
            const index = selectedFields.value.indexOf(schema.field);
            if (index > -1) {
                selectedFields.value.splice(index, 1);
            }
            const orderIndex = fieldOrder.value.indexOf(schema.field);
            if (orderIndex > -1) {
                fieldOrder.value.splice(orderIndex, 1);
            }
        });
    }
};

// 初始化拖拽排序
const initSortable = async() => {
    await nextTick();
    if (!sortableContainer.value) return;

    // 销毁现有实例
    if (sortableInstance) {
        sortableInstance.destroy();
    }

    sortableInstance = new Sortable(sortableContainer.value, {
        animation: 150,
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        dragClass: 'sortable-drag',
        // 移除handle限制，让整个item都可以拖拽
        onEnd: (evt: SortableEvent) => {
            const { oldIndex, newIndex } = evt;
            if (oldIndex !== newIndex && oldIndex !== undefined && newIndex !== undefined) {
                // 更新字段顺序
                const movedField = fieldOrder.value.splice(oldIndex, 1)[0];
                if (movedField) {
                    fieldOrder.value.splice(newIndex, 0, movedField);
                }
            }
        }
    });
};

// 初始化数据
const initializeData = () => {
    // 获取强制显示字段
    const alwaysVisibleFields = props.schemas.filter((schema) => schema.alwaysVisible === true).map((schema) => schema.field as string);

    // 合并初始选中字段和强制显示字段
    const initialSelected = [...(props.initialSelectedFields || []), ...alwaysVisibleFields];
    selectedFields.value = Array.from(new Set(initialSelected));

    // 初始化字段顺序
    if (props.initialFieldOrder && props.initialFieldOrder.length > 0) {
        // 直接使用IndexedDB中存储的顺序，不要重新排列
        fieldOrder.value = [...props.initialFieldOrder];
    } else {
        // 使用schemas的原始顺序
        fieldOrder.value = props.schemas.filter((schema) => selectedFields.value.includes(schema.field)).map((schema) => schema.field);
    }

    // 确保所有选中的字段都在fieldOrder中
    selectedFields.value.forEach((field) => {
        if (!fieldOrder.value.includes(field)) {
            fieldOrder.value.push(field);
        }
    });
};

// 监听弹窗显示
watch(
    () => props.visible,
    (visible) => {
        if (visible) {
            initializeData();
            nextTick(() => {
                initSortable();
            });
        }
    },
    { immediate: true }
);

// 事件处理
const handleConfirm = () => {
    emit('confirm', {
        selectedFields: [...selectedFields.value], // 创建纯数组副本
        fieldOrder: [...fieldOrder.value] // 创建纯数组副本
    });
    emit('update:visible', false);
};

const handleCancel = () => {
    emit('update:visible', false);
};

const handleReset = () => {
    emit('reset');
    emit('update:visible', false);
};

// 组件卸载时清理
onUnmounted(() => {
    if (sortableInstance) {
        sortableInstance.destroy();
    }
});
</script>

<script lang="ts">
export default {
    name: 'CustomFilterModal',
    components: {
        AModal,
        AButton,
        ASpace,
        HolderOutlined
    }
};
</script>
