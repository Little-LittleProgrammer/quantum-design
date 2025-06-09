import { computed } from 'vue';
import type { FormSchema } from '../types/form';

/**
 * 创建FormSchema的类型帮助函数
 *
 * @example
 * ```typescript
 * // 基础用法，自动推断componentProps类型
 * const schema = createFormSchema({
 *   field: 'name',
 *   label: '姓名',
 *   component: 'Input',
 *   componentProps: {
 *     placeholder: '请输入姓名', // 这里会有Input组件的类型提示
 *   }
 * });
 *
 * // 自定义组件用法
 * type CustomComponents = {
 *   MyInput: { customProp: string };
 * };
 * const customSchema = createFormSchema<Record<string, any>, CustomComponents>({
 *   field: 'custom',
 *   label: '自定义',
 *   component: 'MyInput',
 *   componentProps: {
 *     customProp: 'test', // 这里会有MyInput组件的类型提示
 *   }
 * });
 * ```
 */

export function createFormSchema<
    Fields extends Record<string, any> = Record<string, any>,
    CustomComponentPropsMap extends Record<string, any> = Record<string, never>
>(schema: FormSchema<Fields, CustomComponentPropsMap>): FormSchema<Fields, CustomComponentPropsMap> {
    return schema;
}

/**
 * 创建表单Schema数组的类型帮助函数
 *
 * @example
 * ```typescript
 * const schemas = createFormSchemas([
 *   {
 *     field: 'name',
 *     label: '姓名',
 *     component: 'Input',
 *     componentProps: {
 *       placeholder: '请输入姓名',
 *     }
 *   },
 *   {
 *     field: 'age',
 *     label: '年龄',
 *     component: 'InputNumber',
 *     componentProps: {
 *       min: 0,
 *       max: 120,
 *     }
 *   }
 * ]);
 * ```
 */
export function createFormSchemas<
    Fields extends Record<string, any> = Record<string, any>,
    CustomComponentPropsMap extends Record<string, any> = Record<string, never>
>(schemas: FormSchema<Fields, CustomComponentPropsMap>[]): FormSchema<Fields, CustomComponentPropsMap>[] {
    return schemas;
}

export function defineSchemas<T extends object = Record<string, any>, C extends Record<string, any> = Record<string, any>>(schemaList: FormSchema<T, C>[]) {
    const schemas = computed<FormSchema<T, C>[]>(() => createFormSchemas<T, C>(schemaList));
    return {schemas,};
}
