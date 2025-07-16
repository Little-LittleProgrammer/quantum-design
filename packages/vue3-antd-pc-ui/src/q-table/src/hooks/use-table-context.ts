import type { Ref } from 'vue';
import type { BasicTableProps, TableActionType, Recordable, TableSetting } from '../types/table';
import { provide, inject, type ComputedRef } from 'vue';

const key = Symbol('basic-table');

type Instance = TableActionType & {
    wrapRef: Ref<Nullable<HTMLElement>>;
    getBindValues: ComputedRef<Recordable>;
};

export type RetInstance = Omit<Instance, 'getBindValues'> & {
    getBindValues: ComputedRef<BasicTableProps>;
};

export function createTableContext(instance: Instance) {
    provide(key, instance);
}

export function useTableContext(): RetInstance {
    return inject(key) as RetInstance;
}

// 全局配置管理
let globalTableSetting: TableSetting | null = null;

/**
 * 设置全局表格配置
 * @param setting 表格配置
 *
 * @example
 * // 在 main.ts 中设置全局配置
 * import { setGlobalTableSetting } from '@/components/Table';
 *
 * setGlobalTableSetting({
 *   size: 'small',
 *   showHeader: true,
 *   bordered: true
 * });
 */
export function setGlobalTableSetting(setting: TableSetting) {
    globalTableSetting = setting;
    console.log('globalTableSetting', globalTableSetting);
}

/**
 * 获取全局表格配置
 * 优先级：inject > 全局配置 > null
 *
 * @example
 * // 在组件中使用
 * const tableSetting = getGeneralTableSetting();
 * if (tableSetting) {
 *   // 使用配置
 * }
 */
export function getGeneralTableSetting(): TableSetting | null {
    // 先尝试从 inject 获取（组件级别配置）
    const injectedSetting = inject('tableSetting', null);
    if (injectedSetting) {
        return injectedSetting;
    }

    // 再尝试从全局配置获取（应用级别配置）
    return globalTableSetting;
}

/**
 * 清除全局表格配置
 *
 * @example
 * // 在需要重置配置时调用
 * clearGlobalTableSetting();
 */
export function clearGlobalTableSetting() {
    globalTableSetting = null;
}
