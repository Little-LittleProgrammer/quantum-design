import { js_is_array, js_is_function, js_is_object, js_is_string, js_is_null_or_undef, gDateUtil } from '@q-front-npm/utils';
import { unref } from 'vue';
import type { Ref, ComputedRef } from 'vue';
import type { FormProps, FormSchema } from '../types/form';
import { gDateFormatEnum } from '@q-front-npm/shared/enums';
import { cloneDeep } from 'lodash-es';

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
        if (!js_is_object(values)) {
            return {};
        }
        const res: Record<string, any> = {};
        for (const item of Object.entries(values)) {
            let [, value] = item;
            const [key] = item;
            if (!key || (js_is_array(value) && value.length === 0) || js_is_function(value)) {
                continue;
            }
            const transformDateFunc = unref(getProps).transformDateFunc;
            if (js_is_object(value) && value?.format) {
                value = transformDateFunc?.(value);
            }
            if (js_is_array(value) && value[0]?.format && value[1]?.format) {
                value = value.map((item) => transformDateFunc?.(item));
            }
            // 删除前后空格
            if (js_is_string(value)) {
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

        for (const [field, [startTimeKey, endTimeKey], format = gDateFormatEnum.date] of fieldMapToTime) {
            if (!field || !startTimeKey || !endTimeKey || !values[field]) {
                continue;
            }

            const [startTime, endTime]: string[] = values[field];

            values[startTimeKey] = gDateUtil(startTime).format(format);
            values[endTimeKey] = gDateUtil(endTime).format(format);
            Reflect.deleteProperty(values, field);

            values[field] = {
                [startTimeKey]: values[startTimeKey],
                [endTimeKey]: values[endTimeKey]
            };
        }

        return values;
    }

    function init_default() {
        const schemas = unref(getSchema);
        const obj: Record<string, any> = {};
        schemas.forEach((item) => {
            const { defaultValue } = item;
            if (!js_is_null_or_undef(defaultValue)) {
                obj[item.field] = defaultValue;
                if (formModel[item.field] === undefined) {
                    formModel[item.field] = defaultValue;
                }
            }
        });
        defaultValueRef.value = cloneDeep(obj);
    }

    return { handle_form_values, init_default };
}
