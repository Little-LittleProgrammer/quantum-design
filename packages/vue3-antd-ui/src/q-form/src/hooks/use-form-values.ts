import { isArray, isFunction, isObject, isString, isNullOrUnDef, date_util } from '@qmfront/shared/utils';
import { unref } from 'vue';
import type { Ref, ComputedRef } from 'vue';
import type { FormProps, FormSchema } from '../types/form';
import { dateFormat } from '@qmfront/shared/enums';

interface UseFormValuesContext {
  defaultValueRef: Ref<any>;
  getSchema: ComputedRef<FormSchema[]>;
  getProps: ComputedRef<FormProps>;
  formModel: Record<string, any>;
}
export function use_form_values({
    defaultValueRef,
    getSchema,
    formModel,
    getProps
}: UseFormValuesContext) {
    // 处理表单值
    function handle_form_values(values: Record<string, any>) {
        if (!isObject(values)) {
            return {};
        }
        const res: Record<string, any> = {};
        for (const item of Object.entries(values)) {
            let [, value] = item;
            const [key] = item;
            if (!key || (isArray(value) && value.length === 0) || isFunction(value)) {
                continue;
            }
            const transformDateFunc = unref(getProps).transformDateFunc;
            if (isObject(value)) {
                value = transformDateFunc?.(value);
            }
            if (isArray(value) && value[0]?.format && value[1]?.format) {
                value = value.map((item) => transformDateFunc?.(item));
            }
            // 删除前后空格
            if (isString(value)) {
                value = value.trim();
            }
            res[key] = value;
        }
        return handle_range_time_value(res);
    }

    /**
   * @description: 处理时间参数
   */
    function handle_range_time_value(values: Record<string, any>) {
        const fieldMapToTime = unref(getProps).fieldMapToTime;

        if (!fieldMapToTime || !Array.isArray(fieldMapToTime)) {
            return values;
        }

        for (const [field, [startTimeKey, endTimeKey], format = dateFormat.date] of fieldMapToTime) {
            if (!field || !startTimeKey || !endTimeKey || !values[field]) {
                continue;
            }

            const [startTime, endTime]: string[] = values[field];

            values[startTimeKey] = date_util(startTime).format(format);
            values[endTimeKey] = date_util(endTime).format(format);
            Reflect.deleteProperty(values, field);
        }

        return values;
    }

    function init_default() {
        const schemas = unref(getSchema);
        const obj: Record<string, any> = {};
        schemas.forEach((item) => {
            const { defaultValue } = item;
            if (!isNullOrUnDef(defaultValue)) {
                obj[item.field] = defaultValue;
                formModel[item.field] = defaultValue;
            }
        });
        defaultValueRef.value = obj;
    }

    return { handle_form_values, init_default };
}
