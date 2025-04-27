<!-- 表单组件 -->
<template>
    <a-form v-bind="getBindValue" id="q-form" class="q-form" :class="getFormClass" ref="formElRef" :model="formModel" @keypress.enter="handle_enter_press">
        <a-row class="row" v-bind="getRow">
            <slot name="formHeader"></slot>
            <template v-for="schema in getSchema" :key="schema.field">
                <form-item :formActionType="formActionType" :schema="schema" :formProps="getProps" :allDefaultValues="defaultValueRef" :formModel="formModel" :setFormModel="set_form_model" :blurEvent="blur_event" :tableAction="tableAction">
                    <template #[item]="data" v-for="item in Object.keys($slots)">
                        <slot :name="item" v-bind="data || {}"></slot>
                    </template>
                </form-item>
            </template>
            <form-action v-bind="getProps">
                <template #[item]="data" v-for="item in ['resetBefore', 'submitBefore', 'submitAfter', 'advanceBefore', 'advanceAfter']">
                    <slot :name="item" v-bind="data || {}"></slot>
                </template>
            </form-action>
            <slot name="formFooter"></slot>
        </a-row>
    </a-form>
</template>

<script lang="ts">
import { js_utils_deep_merge, isArray, isFunction } from '@quantum-design/utils';
import { computed, defineComponent, onMounted, reactive, type Ref, ref, unref, watch } from 'vue';
import { dateItemType } from './helper';
import { basicProps } from './props';
import type { FormActionType, FormProps, FormSchema } from './types/form';
import formItem from './components/form-item.vue';
import formAction from './components/form-action.vue';
import { use_form_values } from './hooks/use-form-values';
import { type EmitType, use_form_events } from './hooks/use-form-events';
import { create_form_context } from './hooks/use-form-context';
import { Form as AForm, Row as ARow } from 'ant-design-vue';
import './style/form.scss';
import dayjs from 'dayjs';

export default defineComponent({
    name: 'QAntdForm',
    // 接收的 props
    props: {
        ...basicProps
    },
    // 提交给父组件的, reset, 清空
    emits: ['reset', 'submit', 'register', 'change', 'blur'],
    components: { formItem, formAction, AForm, ARow },
    setup(props, { emit, attrs }) {
        const formModel = reactive<Record<string, any>>({});
        const schemaRef = ref<Nullable<FormSchema[]>>(null);
        const defaultValueRef = ref<Record<string, any>>({});
        const isInitedDefaultRef = ref(false);
        const formElRef = ref<Nullable<FormActionType>>(null);
        const propsRef = ref<Partial<FormProps>>({});

        // 判断是否是紧凑模式, 通过props.compact判断
        const getFormClass = computed(() => {
            return unref(getProps).compact ? 'compact' : '';
        });
        // a-from 所需的api, 可能会多传, 但是无所谓
        const getBindValue = computed(() => ({ ...attrs, ...props, ...unref(getProps) } as Record<string, any>));
        // 父组件传入的props + 通过 useForm暴露出去的 setProps() 设置的props合集
        const getProps = computed((): FormProps => {
            return { ...props, ...unref(propsRef) } as FormProps;
        });

        // a-row 所需的api, 通过rowProps 和 baseRowStyle 控制
        const getRow = computed((): Record<string, any> => {
            const { baseRowStyle = {}, rowProps } = unref(getProps);
            return {
                style: baseRowStyle,
                ...rowProps
            };
        });
        // 主要, props.schemas
        const getSchema = computed((): FormSchema[] => {
            const schemas: FormSchema[] = unref(schemaRef) || (unref(getProps).schemas as any);
            for (const schema of schemas) {
                const { defaultValue, component } = schema;
                // handle date type
                if (defaultValue && dateItemType.includes(component)) {
                    if (!Array.isArray(defaultValue)) {
                        schema.defaultValue = dayjs(defaultValue);
                    } else {
                        const def: any[] = [];
                        defaultValue.forEach((item) => {
                            def.push(dayjs(item));
                        });
                        schema.defaultValue = def;
                    }
                }
            }
            return schemas as FormSchema[];
        });

        // 初始化数据, 数据处理
        const { handle_form_values, init_default } = use_form_values({
            getProps,
            defaultValueRef,
            getSchema,
            formModel
        });

        // 暴露出基本的 api, 供 useForm 以及本页面使用使用
        const { handleSubmit, setFieldsValue, clearValidate, validate, validateFields, getFieldsValue, updateSchema, resetSchema, appendSchemaByField, removeSchemaByFiled, resetFields, scrollToField } = use_form_events({
            emit: emit as EmitType,
            getProps,
            formModel,
            getSchema,
            defaultValueRef,
            formElRef: formElRef as Ref<FormActionType>,
            schemaRef: schemaRef as Ref<FormSchema[]>,
            handle_form_values
        });
        // inject 注入, 供 form-action使用
        create_form_context({
            resetAction: resetFields,
            submitAction: handleSubmit
        });

        // 监听 传入的 model, 为了设置值
        watch(
            () => unref(getProps).model,
            () => {
                const { model } = unref(getProps);
                if (!model) return;
                setFieldsValue(model);
            },
            {
                immediate: true
            }
        );

        // 监听 schemas,格式化 schemasRef = props.schemas, 区分出 分割线组件
        watch(
            () => unref(getProps).schemas,
            (schemas) => {
                resetSchema((unref(schemas) ?? []) as unknown as FormSchema<Record<string, any>, ''>);
            }
        );

        // 初始化数据
        watch(
            () => getSchema.value,
            (schema) => {
                // 防止 schema 更新时, 又重新 赋值初始值, 造车数据丢失
                if (unref(isInitedDefaultRef)) {
                    return;
                }
                if (schema?.length) {
                    init_default();
                    isInitedDefaultRef.value = true;
                }
            }
        );

        // 暴露给 useForm 用于更改传递 prop
        async function setProps(formProps: Partial<FormProps>): Promise<void> {
            const _cache = js_utils_deep_merge(unref(propsRef) || {}, formProps);
            propsRef.value = _cache;
        }

        // 设置 formObj 里的某项值, 用于form-item里具体组件的事件,例如: onChange:
        function set_form_model(key: string, value: any, schema: FormSchema) {
            formModel[key] = value;
            const { validateTrigger } = unref(getBindValue);
            if (isFunction(schema.dynamicRules) || isArray(schema.rules)) {
                return;
            }
            if (!validateTrigger || validateTrigger === 'change') {
                validateFields([key]).catch(() => {});
            }
            const finValue = getFieldsValue();
            emit('change', finValue);
        }

        function blur_event() {
            validate().then(() => {
                const value = getFieldsValue();
                emit('blur', value);
            });
        }

        // 当焦点为输入框时, enter提交事件
        function handle_enter_press(e: KeyboardEvent) {
            const { autoSubmitOnEnter } = unref(getProps);
            if (!autoSubmitOnEnter) return;
            if (e.key === 'Enter' && e.target && e.target instanceof HTMLElement) {
                const target: HTMLElement = e.target as HTMLElement;
                if (target && target.tagName && target.tagName.toUpperCase() == 'INPUT') {
                    handleSubmit();
                }
            }
        }

        // 暴露给useForm, 以及当 componentProps 为方法时使用
        const formActionType: Partial<FormActionType> = {
            getFieldsValue,
            setFieldsValue,
            resetFields,
            updateSchema,
            resetSchema,
            setProps,
            removeSchemaByFiled,
            appendSchemaByField,
            clearValidate,
            validateFields,
            validate,
            submit: handleSubmit,
            scrollToField: scrollToField
        };

        onMounted(() => {
            init_default();
            emit('register', formActionType);
        });
        return {
            getBindValue,
            handle_enter_press,
            formModel,
            getFormClass,
            defaultValueRef,
            getRow,
            getSchema,
            formActionType: formActionType as any,
            getProps,
            set_form_model,
            formElRef,
            handle_form_values,
            blur_event,
            // 方便暴露给useForm
            ...formActionType
        };
    }
});
</script>
