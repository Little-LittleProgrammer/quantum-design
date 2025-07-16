import { isArray, isFunction, isObject, isString, isNullOrUndef, js_utils_find_attr, isEmpty, js_utils_edit_attr } from '@quantum-design/utils';
import { unref } from 'vue';
import type { Ref, ComputedRef } from 'vue';
import type { FormProps, FormSchema } from '../types/form';
import { gDateFormatEnum } from '@quantum-design/shared/enums';
import { cloneDeep, unset } from 'lodash-es';
import dayjs from 'dayjs';
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
    // TODO: formModel 值 与 暴露出去的值 不同步的问题
    function handle_fin_form_values(obj: Record<string, any>, result: Record<string, any> = {}, parentKey = '') {
        if (!isObject(obj)) {
            return {};
        }
        for (const key in obj) {
            if (!isNullOrUndef(obj[key])) {
                const propName = parentKey ? parentKey + '.' + key : key;
                if (isObject(obj[key])) {
                    handle_fin_form_values(obj[key], result, propName);
                } else {
                    result[propName] = obj[key];
                }
            }
        }
        return result;
    }

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
            if (isObject(value) && value?.format) {
                value = transformDateFunc?.(value);
            }
            if (isArray(value) && value[0]?.format && value[1]?.format) {
                value = value.map((item) => transformDateFunc?.(item));
            }
            // 删除前后空格
            if (isString(value)) {
                value = value.trim();
            }

            js_utils_edit_attr(key, value, res);
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
            if (!field || !startTimeKey || !endTimeKey) {
                continue;
            }
            if (!js_utils_find_attr(values, field)) {
                unset(values, field);
                continue;
            }

            const [startTime, endTime]: string[] = js_utils_find_attr(values, field);

            unset(values, field);

            if (!isNullOrUndef(startTime) && !isEmpty(startTime)) {
                js_utils_edit_attr(startTimeKey, dayjs(startTime).format(format), values);
                js_utils_edit_attr(`${field}.${startTimeKey}`, dayjs(startTime).format(format), values);
            }

            if (!isNullOrUndef(endTime) && !isEmpty(endTime)) {
                js_utils_edit_attr(endTimeKey, dayjs(endTime).format(format), values);
                js_utils_edit_attr(`${field}.${endTimeKey}`, dayjs(endTime).format(format), values);
            }
        }

        return values;
    }

    function init_default() {
        const schemas = unref(getSchema);
        const obj: Record<string, any> = {};
        schemas.forEach((item) => {
            const { defaultValue } = item;
            if (!isNullOrUndef(defaultValue)) {
                obj[item.field] = defaultValue;
                if (formModel[item.field] === undefined) {
                    formModel[item.field] = cloneDeep(defaultValue);
                }
            }
        });
        defaultValueRef.value = cloneDeep(obj);
    }

    return { handle_form_values, init_default, handle_fin_form_values };
}
