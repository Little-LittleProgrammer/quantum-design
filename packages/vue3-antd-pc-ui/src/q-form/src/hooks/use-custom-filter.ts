import { ref, onMounted, computed, type Ref, type ComputedRef, nextTick } from 'vue';
import type { FormProps, FormSchema } from '../types/form';
import { IndexedDB, js_utils_get_current_url } from '@quantum-design/utils';

/**
 * 表单过滤器配置接口
 */
export interface ICustomFilterConfig {
    selectedFields: string[];
    fieldOrder: string[];
    timestamp: number;
}

export interface IUseCustomFilterOptions {
    getProps?: ComputedRef<FormProps>;
    alwaysVisibleFields?: string[];
    onConfigChange?: (config: ICustomFilterConfig) => void;
}

export interface IUseCustomFilterReturn {
    selectedFields: Ref<string[]>;
    fieldOrder: Ref<string[]>;
    loading: Ref<boolean>;
    displaySchemas: ComputedRef<FormSchema[]>;
    modalVisible: Ref<boolean>;
    customConfig: Ref<ICustomFilterConfig | null>;
    loadConfig: () => Promise<void>;
    saveConfig: (config?: ICustomFilterConfig) => Promise<void>;
    resetConfig: () => Promise<void>;
    updateSelectedFields: (fields: string[]) => Promise<void>;
    updateFieldOrder: (order: string[]) => Promise<void>;
    openCustomModal: () => void;
}

// 创建表单过滤器的IndexedDB管理类
class FormFilterDB {
    private static instance: FormFilterDB;
    private db: IndexedDB;
    private initialized: boolean = false;

    private constructor() {
        // 创建用于存储表单过滤器配置的IndexedDB
        this.db = new IndexedDB('vue3-antd-pc-ui', 'q-antd-form');
    }

    public static getInstance(): FormFilterDB {
        if (!FormFilterDB.instance) {
            FormFilterDB.instance = new FormFilterDB();
        }
        return FormFilterDB.instance;
    }

    // 预加载表单过滤器数据
    public async preloadFormFilters(): Promise<void> {
        if (this.initialized) return;

        try {
            // 初始化IndexedDB连接
            await this.db.getAll();
            this.initialized = true;
        } catch (error) {
            console.error('初始化表单过滤器数据库失败:', error);
        }
    }

    // 获取表单过滤器配置
    public async getFormFilter(key: string): Promise<ICustomFilterConfig | null> {
        try {
            const result = await this.db.get(key);
            if (result && result.code === 200 && result.data && result.data.length > 0) {
                return result.data[0].value;
            }
            return null;
        } catch (error) {
            console.error('获取表单过滤器配置失败:', error);
            return null;
        }
    }

    // 保存表单过滤器配置
    public async setFormFilter(key: string, config: ICustomFilterConfig): Promise<void> {
        try {
            await this.db.set(key, config);
        } catch (error) {
            console.error('保存表单过滤器配置失败:', error);
        }
    }
}

// 获取表单过滤器缓存键名
function getFormFilterCacheKey(formId?: string): string | null {
    if (!formId) return null;
    const curUrl = js_utils_get_current_url();
    return `${curUrl?.path}/${curUrl?.hash || ''}/${formId}`;
}

// 创建表单过滤器数据库实例
const configDB = FormFilterDB.getInstance();

export function useCustomFilter(originalSchemas: Ref<FormSchema[]>, {
    getProps,
    alwaysVisibleFields,
    onConfigChange
}: IUseCustomFilterOptions): IUseCustomFilterReturn {
    // 当前选中的字段
    const selectedFields = ref<string[]>([]);
    // 字段排序
    const fieldOrder = ref<string[]>([]);
    // 加载状态
    const loading = ref(false);
    // 弹窗显示状态
    const modalVisible = ref(false);
    // 当前配置
    const customConfig = ref<ICustomFilterConfig | null>(null);

    // 初始化时预加载
    onMounted(() => {
        configDB.preloadFormFilters();
        nextTick(() => {
            loadConfig();
        });
    });

    // 保存配置到存储
    async function storeConfigToStorage(config: ICustomFilterConfig): Promise<void> {
        console.log('storeConfigToStorage', config);
        const cacheKey = getFormFilterCacheKey(getProps?.value.formId);
        if (!cacheKey) return;

        // 直接使用配置存储API
        await configDB.setFormFilter(cacheKey, config);
    }

    // 从存储加载配置
    async function loadConfig(): Promise<void> {
        loading.value = true;
        try {
            const cacheKey = getFormFilterCacheKey(getProps?.value.formId);
            console.log('loadConfig', cacheKey);
            if (!cacheKey) return;
            const config = await configDB.getFormFilter(cacheKey);
            if (config) {
                selectedFields.value = config.selectedFields;
                fieldOrder.value = config.fieldOrder;
                customConfig.value = config;
            } else {
                // 如果没有配置，使用默认值
                const defaultFields = originalSchemas.value.filter((schema) => !(schema as any).hidden).map((schema) => schema.field);
                selectedFields.value = defaultFields;
                fieldOrder.value = defaultFields;
            }
        } finally {
            loading.value = false;
        }
    }

    // 保存当前配置
    async function saveConfig(inputConfig?: ICustomFilterConfig): Promise<void> {
        const config: ICustomFilterConfig = inputConfig || {
            selectedFields: selectedFields.value,
            fieldOrder: fieldOrder.value,
            timestamp: Date.now()
        };

        // 更新内部状态
        if (inputConfig) {
            selectedFields.value = inputConfig.selectedFields;
            fieldOrder.value = inputConfig.fieldOrder;
        }

        customConfig.value = config;
        await storeConfigToStorage(config);

        // 触发配置变化回调
        if (onConfigChange) {
            onConfigChange(config);
        }
    }

    // 重置配置
    async function resetConfig(): Promise<void> {
        const defaultFields = originalSchemas.value.filter((schema) => !(schema as any).hidden).map((schema) => schema.field);

        selectedFields.value = defaultFields;
        fieldOrder.value = defaultFields;
        customConfig.value = null;
        await saveConfig();
    }

    // 更新字段选择
    async function updateSelectedFields(fields: string[]): Promise<void> {
        // 确保必选字段始终存在
        if (alwaysVisibleFields?.length) {
            fields = [...new Set([...alwaysVisibleFields, ...fields])];
        }
        selectedFields.value = fields;
        await saveConfig();
    }

    // 更新字段顺序
    async function updateFieldOrder(order: string[]): Promise<void> {
        fieldOrder.value = order;
        await saveConfig();
    }

    // 打开自定义筛选弹窗
    function openCustomModal(): void {
        modalVisible.value = true;
    }

    // 计算显示的 schemas（基于选中字段和排序）
    const displaySchemas = computed(() => {
        const schemas = originalSchemas.value || [];
        const selected = selectedFields.value || [];
        const order = fieldOrder.value || [];

        if (!selected.length) {
            return schemas;
        }

        // 根据选中字段和排序生成显示的 schemas
        const schemaMap = new Map(schemas.map((schema) => [schema.field, schema]));
        const result: FormSchema[] = [];

        // 按照字段顺序添加选中的字段
        for (const field of order) {
            if (selected.includes(field) && schemaMap.has(field)) {
                result.push(schemaMap.get(field)!);
            }
        }

        // 添加不在排序中但被选中的字段
        for (const field of selected) {
            if (!order.includes(field) && schemaMap.has(field)) {
                result.push(schemaMap.get(field)!);
            }
        }

        return result;
    });

    return {
        selectedFields,
        fieldOrder,
        loading,
        displaySchemas,
        modalVisible,
        customConfig,
        loadConfig,
        saveConfig,
        resetConfig,
        updateSelectedFields,
        updateFieldOrder,
        openCustomModal
    };
}
