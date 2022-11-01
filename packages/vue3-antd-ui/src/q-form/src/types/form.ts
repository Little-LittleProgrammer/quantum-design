import type { CSSProperties, Ref, VNode } from 'vue';
import type { RowProps } from 'ant-design-vue/lib/grid/Row';
import type { NamePath, RuleObject } from 'ant-design-vue/lib/form/interface';
import { ColEx, ComponentType } from './index';
import { FormItem } from './form-item';
import { ButtonProps } from 'ant-design-vue/lib/button';

export type FieldMapToTime = [string, [string, string], string?][];

export type RegisterFn = (formInstance: FormActionType) => void;

export type UseFormReturnType = [RegisterFn, FormActionType];

export type Rule = RuleObject & {
    trigger?: 'blur' | 'change' | ['change', 'blur'];
};

export interface RenderCallbackParams {
    schema: FormSchema;
    values: Record<string, any>;
    model: Record<string, any>;
    field: string;
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

export interface FormSchema {
    // Field name
    field: string;
    // Event name triggered by internal value change, default change
    changeEvent?: string;
    // Variable name bound to v-model Default value
    valueField?: string;
    // Label name
    label: string | VNode;
    // Auxiliary text
    subLabel?: string;
    // 提示语
    helpMessage?:
    | string
    | string[]
    | ((renderCallbackParams: RenderCallbackParams) => string | string[]);
    // BaseHelp component props
    helpComponentProps?: Partial<HelpComponentProps>;
    // Label width, if it is passed, the labelCol and WrapperCol configured by itemProps will be invalid
    labelWidth?: string | number;
    // Disable the adjustment of labelWidth with global settings of formModel, and manually set labelCol and wrapperCol by yourself
    disabledLabelWidth?: boolean;
    // 调用的组件
    component: ComponentType;
    // 用于设置调用组件的属性, 具体详情查看 ant-design-vue
    componentProps?:
    | ((opt: {
        schema: FormSchema;
        formActionType: FormActionType;
        formModel: Record<string, any>;
    }) => Record<string, any>)
    | object;
    // Required
    required?: boolean | ((renderCallbackParams: RenderCallbackParams) => boolean);
    suffix?: string | number | ((values: RenderCallbackParams) => string | number);

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

    ifShow?: boolean | ((renderCallbackParams: RenderCallbackParams) => boolean);

    show?: boolean | ((renderCallbackParams: RenderCallbackParams) => boolean);

    // Render the content in the form-item tag
    render?: (renderCallbackParams: RenderCallbackParams) => VNode | VNode[] | string;

    // Rendering col content requires outer wrapper form-item
    renderColContent?: (renderCallbackParams: RenderCallbackParams) => VNode | VNode[] | string;

    renderComponentContent?:
    | ((renderCallbackParams: RenderCallbackParams) => any)
    | VNode
    | VNode[]
    | string;

    // Custom slot, in from-item
    slot?: string;

    // Custom slot, similar to renderColContent
    colSlot?: string;

    dynamicDisabled?: boolean | ((renderCallbackParams: RenderCallbackParams) => boolean);

    dynamicRules?: (renderCallbackParams: RenderCallbackParams) => Rule[];
}

export interface FormActionType {
    submit: () => Promise<void>;
    setFieldsValue: <T>(values: T) => Promise<void>;
    resetFields: () => Promise<void>;
    getFieldsValue: () => Record<string, any>;
    clearValidate: (name?: string | string[]) => Promise<void>;
    updateSchema: (data: Partial<FormSchema> | Partial<FormSchema>[]) => Promise<void>;
    resetSchema: (data: Partial<FormSchema> | Partial<FormSchema>[]) => Promise<void>;
    setProps: (formProps: Partial<FormProps>) => Promise<void>;
    removeSchemaByFiled: (field: string | string[]) => Promise<void>;
    appendSchemaByField: (
        schema: FormSchema,
        prefixField: string | undefined,
        first?: boolean | undefined,
    ) => Promise<void>;
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
