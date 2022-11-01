import { isArray, isFunction, isObject, isString, date_util, deep_merge } from '@qmfront/utils';
import { NamePath } from 'ant-design-vue/lib/form/interface';
import { ComputedRef, Ref, toRaw, unref } from 'vue';
import { dateItemType, handle_input_number_value } from '../helper';
import { FormActionType, FormProps, FormSchema } from '../types/form';
import { cloneDeep, uniqBy } from 'lodash-es';

export type EmitType = (event: string, ...args: any[]) => void;

interface UseFormActionContext {
    emit: EmitType;
    getProps: ComputedRef<FormProps>;
    getSchema: ComputedRef<FormSchema[]>;
    formModel: Record<string, any>;
    defaultValueRef: Ref<Record<string, any>>;
    formElRef: Ref<FormActionType>;
    schemaRef: Ref<FormSchema[]>;
    handle_form_values: Fn;
}

export function use_form_events({
    emit,
    getProps,
    formModel,
    getSchema,
    defaultValueRef,
    formElRef,
    schemaRef,
    handle_form_values
}:UseFormActionContext) {
    // 重置表单
    async function resetFields(): Promise<void> {
        const { resetFunc, submitOnReset } = unref(getProps);
        resetFunc && isFunction(resetFunc) && (await resetFunc());

        const formEl = unref(formElRef);
        if (!formEl) return;

        // 重新赋值初始值
        Object.keys(formModel).forEach(key => {
            formModel[key] = defaultValueRef.value[key];
        });
        clearValidate();
        emit('reset', toRaw(formModel));
        submitOnReset && handleSubmit();
    }
    // 表单提交
    async function handleSubmit(e?: Event): Promise<void> {
        e && e.preventDefault();
        const { submitFunc } = unref(getProps);
        if (submitFunc && isFunction(submitFunc)) {
            await submitFunc();
            return;
        }
        const formEl = unref(formElRef);
        if (!formEl) return;
        try {
            const values = await validate();
            const res = handle_form_values(values);
            emit('submit', res);
        } catch (error) {
            throw new Error(error as string);
        }
    }
    // 校验
    async function validate(nameList?: NamePath[] | undefined) {
        return await unref(formElRef)?.validate(nameList);
    }
    // 设置表单数据
    async function setFieldsValue(values:Record<string, any>): Promise<void> {
        const fields = unref(getSchema).map(item => item.field).filter(Boolean);
        const validkeys: string[] = [];
        Object.keys(values).forEach(key => {
            const schema = unref(getSchema).find(item => item.field === key);
            let _value = values[key];
            const hasKey = Reflect.has(values, key);
            _value = handle_input_number_value(schema?.component, _value);
            // 0| '' is allow
            if (hasKey && fields.includes(key)) {
                // time type
                if (item_is_date_type(key)) {
                    if (isArray(_value)) {
                        const arr:any[] = [];
                        for (const ele of _value) {
                            arr.push(ele ? date_util(ele) : null);
                        }
                        formModel[key] = arr;
                    } else if (isObject(_value)){
                        const fieldMapToTime = unref(getProps).fieldMapToTime;
                        if (!fieldMapToTime || !Array.isArray(fieldMapToTime)) {
                            formModel[key] = _value;
                        } else {
                            for (const [field, [startTimeKey, endTimeKey], format ] of fieldMapToTime) {
                                if (!field || !startTimeKey || !endTimeKey || !values[field]) {
                                    continue;
                                }
                                if (key === field) {
                                    formModel[key] = [date_util(_value[startTimeKey]), date_util(_value[endTimeKey])];
                                    break;
                                }
                            }
                        }
                    } else {
                        const { componentProps } = schema || {};
                        let _props = componentProps as any;
                        if (isFunction(componentProps)) {
                            _props = _props({formModel});
                        }
                        formModel[key] = _value ? (_props?.valueFormat ? _value : date_util(_value)) : null;
                    }
                } else {
                    formModel[key] = _value;
                }
                validkeys.push(key);
            }
        });

        validateFields(validkeys).catch(() => {});
    }
    // 根据字段名进行删除
    async function removeSchemaByFiled(fields: string | string[]): Promise<void> {
        const schemaList: FormSchema[] = cloneDeep(unref(getSchema));
        if (!fields) {
            return;
        }
        const fieldList: string[] = isString(fields) ? [fields] : fields;
        function _remove_schema_by_filed(field: string, schemaList: FormSchema[]): void {
            if (isString(field)) {
                const index = schemaList.findIndex((schema) => schema.field === field);
                if (index !== -1) {
                    delete formModel[field];
                    schemaList.splice(index, 1);
                }
            }
        }
        for (const field of fieldList) {
            _remove_schema_by_filed(field, schemaList);
        }
        schemaRef.value = schemaList;
    }

    async function appendSchemaByField(schema: FormSchema, prefixField?: string, first = false) {
        const schemaList:FormSchema[] = cloneDeep(unref(getSchema));
        const index = schemaList.findIndex(schema => schema.field === prefixField);
        const hasInList = schemaList.some((item) => item.field === prefixField || schema.field);

        if (!hasInList) return;

        if (!prefixField || index === -1 || first) {
            first ? schemaList.unshift(schema) : schemaList.push(schema);
            schemaRef.value = schemaList;
            return;
        }
        if (index !== -1) {
            schemaList.splice(index + 1, 0, schema);
        }

        schemaRef.value = schemaList;
    }
    async function resetSchema(data: Partial<FormSchema> | Partial<FormSchema>[]) {
        let updateData: Partial<FormSchema>[] = [];
        if (isObject(data)) {
            updateData.push(data as FormSchema);
        }
        if (isArray(data)) {
            updateData = [...data];
        }

        const hasField = updateData.every(
            (item) => item.component === 'Divider' || (Reflect.has(item, 'field') && item.field)
        );

        if (!hasField) {
            console.error(
                'All children of the form Schema array that need to be updated must contain the `field` field'
            );
            return;
        }
        schemaRef.value = updateData as FormSchema[];
    }
    async function updateSchema(data: Partial<FormSchema> | Partial<FormSchema>[]) {
        let updateData: Partial<FormSchema>[] = [];
        if (isObject(data)) {
            updateData.push(data as FormSchema);
        }
        if (isArray(data)) {
            updateData = [...data];
        }

        const hasField = updateData.every(
            (item) => item.component === 'Divider' || (Reflect.has(item, 'field') && item.field)
        );
        if (!hasField) {
            console.error(
                '需要更新的Schema数组的所有子数组必须包含field'
            );
            return;
        }
        const schema: FormSchema[] = [];
        updateData.forEach(item => {
            unref(getSchema).forEach((val) => {
                if (val.field === item.field) {
                    const newSchema = deep_merge(val, item);
                    schema.push(newSchema as FormSchema);
                } else {
                    schema.push(val);
                }
            });
        });
        schemaRef.value = uniqBy(schema, 'field');
    }
    function getFieldsValue(): Record<string, any> {
        const formEl = unref(formElRef);
        if (!formEl) return {};
        return handle_form_values(toRaw(unref(formModel)));
    }
    // 判断是否是一个时间
    function item_is_date_type(key: string) {
        return unref(getSchema).some((item) => {
            return item.field === key ? dateItemType.includes(item.component) : false;
        });
    }
    async function validateFields(nameList?: NamePath[] | undefined) {
        return unref(formElRef)?.validateFields(nameList);
    }
    async function clearValidate(name?: string | string[]) {
        await unref(formElRef)?.clearValidate(name);
    }
    async function scrollToField(name: NamePath, options?: ScrollOptions | undefined) {
        await unref(formElRef)?.scrollToField(name, options);
    }
    return {
        handleSubmit,
        clearValidate,
        validate,
        validateFields,
        getFieldsValue,
        updateSchema,
        resetSchema,
        appendSchemaByField,
        removeSchemaByFiled,
        resetFields,
        setFieldsValue,
        scrollToField
    };
}

