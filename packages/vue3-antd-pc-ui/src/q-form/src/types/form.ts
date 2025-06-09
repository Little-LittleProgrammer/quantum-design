import type { DeepRequired, Flatten } from '@quantum-design/types/lib';
import type { TableActionType } from '@vue3-antd/q-table/src/types/table';
import type { ButtonProps } from 'ant-design-vue/lib/button';
import type { NamePath, RuleObject } from 'ant-design-vue/lib/form/interface';
import type { RowProps } from 'ant-design-vue/lib/grid/Row';
import type { CSSProperties, Ref, VNode } from 'vue';
import type { FormItem } from './form-item';
import type { BuiltInFormComponentPropsMap, ColEx } from './index';

export type FieldMapToTime = [string, [string, string], string?][];

export type FormModelType<T extends object = Record<string, any>> = (Flatten<DeepRequired<T>> | keyof T);

export type RegisterFn = (formInstance: FormActionType) => void;

export type UseFormReturnType = [RegisterFn, FormActionType];

export type Rule = RuleObject & {
    trigger?: 'blur' | 'change' | ['change', 'blur'];
};

export interface RenderCallbackParams<T extends object = Record<string, any>> {
    schema: FormSchema<T>;
    values: T;
    model: Record<string, any>;
    field: keyof T;
}

export interface HelpComponentProps {
    maxWidth: string;
    // Whether to display the serial number
    showIndex: boolean;
    // Text list
    text: any;
    // colour
    color: string;
    // font size
    fontSize: string;
    icon: string;
    absolute: boolean;
    // Positioning
    position: any;
}

/**
 * 获取组件props类型的工具类型
 */
type GetComponentProps<
    T,
    CustomComponentPropsMap extends Record<string, any>
> = T extends keyof BuiltInFormComponentPropsMap
    ? BuiltInFormComponentPropsMap[T]
    : T extends keyof CustomComponentPropsMap
        ? CustomComponentPropsMap[T]
        : never;

/**
 * 基础 FormSchema 接口，支持组件类型自动推断
 */
export interface BaseFormSchema<
    Fields extends Record<string, any> = Record<string, any>,
    CustomComponentPropsMap extends Record<string, any> = Record<string, any>
> {
    // Field name
    field: Flatten<DeepRequired<Fields>> | keyof Fields;
    // Event name triggered by internal value change, default change
    changeEvent?: string;
    // Variable name bound to v-model Default value
    valueField?: string;
    // Label name
    label: string | VNode;
    // Auxiliary text
    subLabel?: string;
    // 提示语
    helpMessage?: string | string[] | ((renderCallbackParams: RenderCallbackParams<Record<FormModelType<Fields>, any>>) => string | string[]);
    // BaseHelp component props
    helpComponentProps?: Partial<HelpComponentProps>;
    // Label width, if it is passed, the labelCol and WrapperCol configured by itemProps will be invalid
    labelWidth?: string | number;
    // Disable the adjustment of labelWidth with global settings of formModel, and manually set labelCol and wrapperCol by yourself
    disabledLabelWidth?: boolean;
    // Required
    required?: boolean | ((renderCallbackParams: RenderCallbackParams<Record<FormModelType<Fields>, any>>) => boolean);
    suffix?: string | number | ((values: RenderCallbackParams<Record<FormModelType<Fields>, any>>) => string | number);
    prefix?: string | number | ((values: RenderCallbackParams<Record<FormModelType<Fields>, any>>) => string | number);

    // 自定义 rules
    rules?: Rule[];
    // Check whether the information is added to the label
    rulesMessageJoinLabel?: boolean;

    // 用于设置form-item的属性, 具体详情查看 ant-design-vue的form-item
    itemProps?: Partial<FormItem>;

    // 设置整行所用宽度
    colProps?: Partial<ColEx>;

    // 默认值
    defaultValue?: any;

    // Matching details components
    span?: number;

    ifShow?: boolean | ((renderCallbackParams: RenderCallbackParams<Record<FormModelType<Fields>, any>>) => boolean);

    show?: boolean | ((renderCallbackParams: RenderCallbackParams<Record<FormModelType<Fields>, any>>) => boolean);

    // Render the content in the form-item tag
    render?: (renderCallbackParams: RenderCallbackParams<Record<FormModelType<Fields>, any>>) => VNode | VNode[] | string;

    // Rendering col content requires outer wrapper form-item
    renderColContent?: (renderCallbackParams: RenderCallbackParams<Record<FormModelType<Fields>, any>>) => VNode | VNode[] | string;

    renderComponentContent?: ((renderCallbackParams: RenderCallbackParams<Record<FormModelType<Fields>, any>>) => any) | VNode | VNode[] | string;

    // Custom slot, in from-item
    slot?: string;

    // Custom slot, similar to renderColContent
    colSlot?: string;

    dynamicDisabled?: boolean | ((renderCallbackParams: RenderCallbackParams<Record<FormModelType<Fields>, any>>) => boolean);

    dynamicRules?: (renderCallbackParams: RenderCallbackParams<Record<FormModelType<Fields>, any>>) => Rule[];
}

/**
 * 组件特定的 FormSchema，根据组件类型自动推断 componentProps
 */
export interface ComponentSpecificFormSchema<
    ComponentName extends keyof (BuiltInFormComponentPropsMap & CustomComponentPropsMap),
    Fields extends Record<string, any> = Record<string, any>,
    CustomComponentPropsMap extends Record<string, any> = Record<string, any>,
> extends BaseFormSchema<Fields, CustomComponentPropsMap> {
    // 调用的组件
    component: ComponentName;
    // 用于设置调用组件的属性, 根据component类型自动推断
    componentProps?: ((opt: {
        schema: ComponentSpecificFormSchema<ComponentName, Fields, CustomComponentPropsMap>;
        tableAction: TableActionType;
        formActionType: FormActionType;
        formModel: Record<FormModelType<Fields>, any>;
    }) => GetComponentProps<ComponentName, CustomComponentPropsMap>) | GetComponentProps<ComponentName, CustomComponentPropsMap>;
}

/**
 * 生成自定义组件FormSchema联合类型的工具类型
 * 使用分布式条件类型为每个自定义组件生成单独的类型分支
 */
type GenerateCustomComponentSchemas<
    CustomComponentPropsMap extends Record<string, any>,
    Fields extends Record<string, any> = Record<string, any>
> = keyof CustomComponentPropsMap extends never
    ? never
    : {
        [K in keyof CustomComponentPropsMap]: ComponentSpecificFormSchema<K, Fields, CustomComponentPropsMap>
    }[keyof CustomComponentPropsMap];

/**
 * FormSchema 联合类型，支持所有内置组件和自定义组件的自动类型推断
 */
export type FormSchema<
    Fields extends Record<string, any> = Record<string, any>,
    CustomComponentPropsMap extends Record<string, any> = Record<string, any>
> =
    // 内置组件 - 每个组件都有独立的类型分支
    | ComponentSpecificFormSchema<'Input', Fields, CustomComponentPropsMap>
    | ComponentSpecificFormSchema<'InputGroup', Fields, CustomComponentPropsMap>
    | ComponentSpecificFormSchema<'InputPassword', Fields, CustomComponentPropsMap>
    | ComponentSpecificFormSchema<'InputSearch', Fields, CustomComponentPropsMap>
    | ComponentSpecificFormSchema<'InputTextArea', Fields, CustomComponentPropsMap>
    | ComponentSpecificFormSchema<'InputNumber', Fields, CustomComponentPropsMap>
    | ComponentSpecificFormSchema<'AutoComplete', Fields, CustomComponentPropsMap>
    | ComponentSpecificFormSchema<'Select', Fields, CustomComponentPropsMap>
    | ComponentSpecificFormSchema<'TreeSelect', Fields, CustomComponentPropsMap>
    | ComponentSpecificFormSchema<'Switch', Fields, CustomComponentPropsMap>
    | ComponentSpecificFormSchema<'RadioButtonGroup', Fields, CustomComponentPropsMap>
    | ComponentSpecificFormSchema<'RadioGroup', Fields, CustomComponentPropsMap>
    | ComponentSpecificFormSchema<'Checkbox', Fields, CustomComponentPropsMap>
    | ComponentSpecificFormSchema<'CheckboxGroup', Fields, CustomComponentPropsMap>
    | ComponentSpecificFormSchema<'Cascader', Fields, CustomComponentPropsMap>
    | ComponentSpecificFormSchema<'Slider', Fields, CustomComponentPropsMap>
    | ComponentSpecificFormSchema<'Rate', Fields, CustomComponentPropsMap>
    | ComponentSpecificFormSchema<'DatePicker', Fields, CustomComponentPropsMap>
    | ComponentSpecificFormSchema<'MonthPicker', Fields, CustomComponentPropsMap>
    | ComponentSpecificFormSchema<'RangePicker', Fields, CustomComponentPropsMap>
    | ComponentSpecificFormSchema<'WeekPicker', Fields, CustomComponentPropsMap>
    | ComponentSpecificFormSchema<'TimePicker', Fields, CustomComponentPropsMap>
    | ComponentSpecificFormSchema<'TimeRangePicker', Fields, CustomComponentPropsMap>
    | ComponentSpecificFormSchema<'Icon', Fields, CustomComponentPropsMap>
    | ComponentSpecificFormSchema<'CardUpload', Fields, CustomComponentPropsMap>
    | ComponentSpecificFormSchema<'Transfer', Fields, CustomComponentPropsMap>
    | ComponentSpecificFormSchema<'Divider', Fields, CustomComponentPropsMap>
    | ComponentSpecificFormSchema<'SelectAll', Fields, CustomComponentPropsMap>
    | ComponentSpecificFormSchema<'Text', Fields, CustomComponentPropsMap>
    | ComponentSpecificFormSchema<'Link', Fields, CustomComponentPropsMap>
    | ComponentSpecificFormSchema<'Upload', Fields, CustomComponentPropsMap>
    // 自定义组件 - 使用分布式条件类型为每个自定义组件生成独立的类型分支
    | GenerateCustomComponentSchemas<CustomComponentPropsMap, Fields>;

/**
 * 向后兼容的 FormSchema 类型（保留原有API）
 * @deprecated 建议使用新的 createFormSchema 方法，可以自动推断组件属性
 */
export interface LegacyFormSchema<
    Fields extends Record<string, any> = Record<string, any>,
    CustomComponentPropsMap extends Record<string, any> = Record<string, any>,
    ComponentName extends keyof (BuiltInFormComponentPropsMap & CustomComponentPropsMap) = keyof (BuiltInFormComponentPropsMap & CustomComponentPropsMap),
    ComponentProps = ComponentName extends keyof BuiltInFormComponentPropsMap
        ? BuiltInFormComponentPropsMap[ComponentName]
        : ComponentName extends keyof CustomComponentPropsMap
            ? CustomComponentPropsMap[ComponentName]
            : never
> extends BaseFormSchema<Fields, CustomComponentPropsMap> {
    // 调用的组件
    component: ComponentName;
    // 用于设置调用组件的属性, 具体详情查看 ant-design-vue
    componentProps?: ((opt: {
        schema: LegacyFormSchema<Fields, CustomComponentPropsMap, ComponentName>;
        tableAction: TableActionType;
        formActionType: FormActionType;
        formModel: Record<FormModelType<Fields>, any>;
    }) => ComponentProps) | ComponentProps;
}

export interface FormActionType {
    submit: () => Promise<void>;
    setFieldsValue: <T extends Record<string, any>>(values: T) => Promise<void>;
    resetFields: () => Promise<void>;
    getFieldsValue: () => Record<string, any>;
    clearValidate: (name?: string | string[]) => Promise<void>;
    updateSchema: (data: Partial<FormSchema> | Partial<FormSchema>[]) => Promise<void>;
    resetSchema: (data: Partial<FormSchema> | Partial<FormSchema>[]) => Promise<void>;
    setProps: (formProps: Partial<FormProps>) => Promise<void>;
    removeSchemaByFiled: (field: string | string[]) => Promise<void>;
    appendSchemaByField: (schema: FormSchema, prefixField: string | undefined, first?: boolean | undefined) => Promise<void>;
    validateFields: (nameList?: NamePath[]) => Promise<any>;
    validate: (nameList?: NamePath[]) => Promise<any>;
    scrollToField: (name: NamePath, options?: ScrollOptions) => Promise<void>;
}

export interface FormProps {
    layout?: 'vertical' | 'inline' | 'horizontal';
    // Form value
    model?: Record<string, any>;
    // The width of all items in the entire form
    labelWidth?: number | string;
    // alignment
    labelAlign?: 'left' | 'right';
    // Row configuration for the entire form
    rowProps?: RowProps;
    // Submit form on reset
    submitOnReset?: boolean;
    // Col configuration for the entire form
    labelCol?: Partial<ColEx>;
    // Col configuration for the entire form
    wrapperCol?: Partial<ColEx>;

    // General row style
    baseRowStyle?: CSSProperties;

    // General col configuration
    baseColProps?: Partial<ColEx>;

    // Form configuration rules
    schemas?: Ref<FormSchema[]>;
    // Function values used to merge into dynamic control form items
    mergeDynamicData?: Record<string, any>;
    // Compact mode for search forms
    compact?: boolean;
    // Internal component size of the form
    size?: 'default' | 'small' | 'large';
    // Whether to disable
    disabled?: boolean;
    // Time interval fields are mapped into multiple
    fieldMapToTime?: FieldMapToTime;
    // Placeholder is set automatically
    autoSetPlaceHolder?: boolean;
    // Auto submit on press enter on input
    autoSubmitOnEnter?: boolean;
    // Check whether the information is added to the label
    rulesMessageJoinLabel?: boolean;
    // Whether to show the operation button
    showActionButtonGroup?: boolean;

    // Reset button configuration
    resetButtonOptions?: Partial<ButtonProps>;

    // Confirm button configuration
    submitButtonOptions?: Partial<ButtonProps>;

    // Operation column configuration
    actionColOptions?: Partial<ColEx>;

    // Show reset button
    showResetButton?: boolean;
    // Show confirmation button
    showSubmitButton?: boolean;

    resetFunc?: () => void;
    submitFunc?: () => void;
    transformDateFunc?: (date: any) => string;
    colon?: boolean;
}
