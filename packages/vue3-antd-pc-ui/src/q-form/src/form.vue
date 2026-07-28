<!--  -->
<template>
    <a-form v-bind="getBindValue" id="q-form" class="q-form" :class="getFormClass" ref="formElRef" :model="formModel" @keypress.enter="handle_enter_press">
        <a-row class="row" v-bind="getRow">
            <slot name="formHeader"></slot>
            <template v-for="schema in displaySchemas as unknown as FormSchema[]" :key="schema.field">
                <form-item :formActionType="formActionType" :schema="schema" :formProps="getProps" :allDefaultValues="defaultValueRef" :formModel="formModel" :setFormModel="set_form_model" :blurEvent="blur_event" :tableAction="tableAction">
                    <template #[item]="data" v-for="item in Object.keys($slots)">
                        <slot :name="item" v-bind="data || {}"></slot>
                    </template>
                </form-item>
            </template>
            <form-action v-bind="getProps">
                <template #[item]="data" v-for="item in ['resetBefore', 'submitBefore']">
                    <slot :name="item" v-bind="data || {}"></slot>
                </template>

                <template #submitAfter>
                    <!-- 自定义筛选按钮 -->
                    <slot v-if="getProps.enableCustomFilter" name="customFilterButton" :openCustomModal="customFilter.openCustomModal">
                        <a-button @click="customFilter.openCustomModal" class="ml">
                            <setting-outlined />
                            {{ getProps.customFilterButtonText }}
                        </a-button>
                    </slot>
                    <slot name="submitAfter"></slot>
                </template>

                <template #[item]="data" v-for="item in ['advanceBefore', 'advanceAfter']">
                    <slot :name="item" v-bind="data || {}"></slot>
                </template>
            </form-action>
            <slot name="formFooter"></slot>
        </a-row>

        <!-- 自定义筛选弹窗（按需加载） -->
        <Suspense v-if="getProps.enableCustomFilter">
            <template #default>
                <CustomFilterModal
                    :visible="customFilter.modalVisible.value"
                    :title="getProps.customFilterModalTitle"
                    :schemas="getSchema"
                    :initial-selected-fields="customFilter.customConfig.value?.selectedFields ? [...customFilter.customConfig.value.selectedFields] : undefined"
                    :initial-field-order="customFilter.customConfig.value?.fieldOrder ? [...customFilter.customConfig.value.fieldOrder] : undefined"
                    :show-reset-button="getProps.showCustomFilterReset"
                    @confirm="handleCustomFilterConfirm"
                    @reset="handleCustomFilterReset"
                    @update:visible="(value: boolean) => (customFilter.modalVisible.value = value)"
                />
            </template>
            <template #fallback>
                <!-- 加载中的占位符，通常不会显示因为组件很小 -->
                <div style="display: none">加载中...</div>
            </template>
        </Suspense>
    </a-form>
</template>

<script lang="ts">
import { js_utils_deep_merge, isArray, isFunction } from '@quantum-design/utils';
import { computed, defineAsyncComponent, defineComponent, onMounted, reactive, type DefineComponent, type ExtractPropTypes, type Ref, ref, unref, watch } from 'vue';
import { dateItemType } from './helper';
import { basicProps } from './props';
import type { FormActionType, FormProps, FormSchema } from './types/form';
import formItem from './components/form-item.vue';
import formAction from './components/form-action.vue';
import { use_form_values } from './hooks/use-form-values';
import { type EmitType, use_form_events } from './hooks/use-form-events';
import { create_form_context } from './hooks/use-form-context';
import { Form as AForm, Row as ARow, Button as AButton } from 'ant-design-vue';
import './style/form.scss';
import dayjs from 'dayjs';
import { useCustomFilter } from './hooks/use-custom-filter';
import { SettingOutlined } from '@ant-design/icons-vue';
// 按需引入自定义筛选弹窗组件
const CustomFilterModal = defineAsyncComponent(() => import('./components/custom-filter-modal.vue'));

const QAntdForm = defineComponent({
    name: 'QAntdForm',
    // 接收的 props
    props: {
        ...basicProps,
    },
    // 提交给父组件的, reset, 清空
    emits: ['reset', 'submit', 'register', 'change', 'blur', 'customFilterChange'],
    components: { formItem, formAction, AForm, ARow, AButton, CustomFilterModal, SettingOutlined },
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
        const getBindValue = computed(() => ({ ...attrs, ...props, ...unref(getProps) }) as Record<string, any>);
        // 父组件传入的props + 通过 useForm暴露出去的 setProps() 设置的props合集
        const getProps = computed((): FormProps => {
            console.log('getProps', unref(propsRef));
            return { ...props, ...unref(propsRef) } as FormProps;
        });

        // a-row 所需的api, 通过rowProps 和 baseRowStyle 控制
        const getRow = computed((): Record<string, any> => {
            const { baseRowStyle = {}, rowProps } = unref(getProps);
            return {
                style: baseRowStyle,
                ...rowProps,
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

        // 自定义筛选功能（条件性初始化）
        const customFilter = useCustomFilter(getSchema, {
            getProps,
            onConfigChange: (config) => {
                emit('customFilterChange', config);
                console.log('自定义筛选配置已更新:', config);
            },
        });

        // 获取显示的 schemas（经过自定义筛选处理）
        const displaySchemas = ref<FormSchema[]>([]);

        // 初始化数据, 数据处理
        const { handle_form_values, init_default } = use_form_values({
            getProps,
            defaultValueRef,
            getSchema: displaySchemas,
            formModel,
        });

        // 暴露出基本的 api, 供 useForm 以及本页面使用使用
        const { handleSubmit, setFieldsValue, clearValidate, validate, validateFields, getFieldsValue, updateSchema, resetSchema, appendSchemaByField, removeSchemaByFiled, resetFields, scrollToField } = use_form_events({
            emit: emit as EmitType,
            getProps,
            formModel,
            getSchema: displaySchemas,
            defaultValueRef,
            formElRef: formElRef as Ref<FormActionType>,
            schemaRef: schemaRef as Ref<FormSchema[]>,
            handle_form_values,
        });
        // inject 注入, 供 form-action使用
        create_form_context({
            resetAction: resetFields,
            submitAction: handleSubmit,
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
                immediate: true,
            },
        );

        // 监听 schemas,格式化 schemasRef = props.schemas, 区分出 分割线组件
        watch(
            () => unref(getProps).schemas,
            (schemas) => {
                resetSchema((unref(schemas) ?? []) as FormSchema[]);
            },
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
            },
        );

        // 监听schemas变化并更新显示
        watch(
            [() => getProps.value.enableCustomFilter, getSchema, () => customFilter.displaySchemas.value],
            () => {
                try {
                    if (getProps.value.enableCustomFilter) {
                        displaySchemas.value = [...(customFilter.displaySchemas.value || [])];
                    } else {
                        displaySchemas.value = [...(getSchema.value || [])];
                    }
                } catch (error) {
                    console.warn('更新显示schemas失败:', error);
                    displaySchemas.value = [...(getSchema.value || [])];
                }
            },
            { immediate: true, deep: true },
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
            // validate().then(() => {
            const value = getFieldsValue();
            emit('blur', value);
            // })
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
            scrollToField: scrollToField,
        };

        // 处理自定义筛选弹窗事件
        const handleCustomFilterConfirm = async (config: { selectedFields: string[]; fieldOrder: string[] }) => {
            if (!getProps.value.enableCustomFilter) return;
            try {
                // 确保传递的是纯对象
                const pureConfig = {
                    selectedFields: [...config.selectedFields], // 创建纯数组副本
                    fieldOrder: [...config.fieldOrder], // 创建纯数组副本
                    timestamp: Date.now(), // 添加时间戳
                };
                await customFilter.saveConfig(pureConfig);
                console.log('自定义筛选配置保存成功:', pureConfig);
            } catch (error) {
                console.error('保存自定义筛选配置失败:', error);
            }
        };

        const handleCustomFilterReset = async () => {
            if (!getProps.value.enableCustomFilter) return;
            try {
                await customFilter.resetConfig();
                console.log('自定义筛选配置重置成功');
            } catch (error) {
                console.error('重置自定义筛选配置失败:', error);
            }
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
            // 自定义筛选相关
            customFilter,
            handleCustomFilterConfirm,
            handleCustomFilterReset,
            displaySchemas,
            // 方便暴露给useForm
            ...formActionType,
        };
    },
}) as DefineComponent<ExtractPropTypes<typeof basicProps>>;

export default QAntdForm;
</script>
