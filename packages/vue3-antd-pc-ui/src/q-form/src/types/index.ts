import type { IconPickProps } from '@vue3-antd/q-icon/src/types';
import QTransfer from '@vue3-antd/q-transfer';
import QCardUpload from '@vue3-antd/q-upload';
import type { AutoCompleteProps } from 'ant-design-vue/es/auto-complete';
import type { CascaderProps } from 'ant-design-vue/es/cascader';
import type { CheckboxProps } from 'ant-design-vue/es/checkbox';
import type { InputNumber, UploadProps } from 'ant-design-vue/es/components';
import type { DatePickerProps, MonthPicker, RangePicker, WeekPicker } from 'ant-design-vue/es/date-picker';
import type { DividerProps } from 'ant-design-vue/es/divider';
import type { InputGroup, InputPassword, InputProps, InputSearch, TextAreaProps } from 'ant-design-vue/es/input';
import type { RadioGroupProps } from 'ant-design-vue/es/radio';
import type { RateProps } from 'ant-design-vue/es/rate';
import type { SelectProps } from 'ant-design-vue/es/select';
import type { SliderProps } from 'ant-design-vue/es/slider';
import type { SwitchProps } from 'ant-design-vue/es/switch';
import type { TimePickerProps, TimeRangePickerProps } from 'ant-design-vue/es/time-picker';
import type { TreeSelectProps } from 'ant-design-vue/es/tree-select';
import type { VNodeTypes } from 'vue';
import RadioButtonGroup from '../components/radio-button-group.vue';
import SelectAll from '../components/select-all.vue';

type ColSpanType = number | string;
export interface ColEx {
    style?: any;
    /**
   * raster number of cells to occupy, 0 corresponds to display: none
   * @default none (0)
   * @type ColSpanType
   */
    span?: ColSpanType;

    /**
   * raster order, used in flex layout mode
   * @default 0
   * @type ColSpanType
   */
    order?: ColSpanType;

    /**
   * the layout fill of flex
   * @default none
   * @type ColSpanType
   */
    flex?: ColSpanType;

    /**
   * the number of cells to offset Col from the left
   * @default 0
   * @type ColSpanType
   */
    offset?: ColSpanType;

    /**
   * the number of cells that raster is moved to the right
   * @default 0
   * @type ColSpanType
   */
    push?: ColSpanType;

    /**
   * the number of cells that raster is moved to the left
   * @default 0
   * @type ColSpanType
   */
    pull?: ColSpanType;
}

type ExtraProps = {
    [key: string]: any;
}
/**
 * 内置表单组件props映射关系
 * 获得更好的类型提示和约束
 */
export interface BuiltInFormComponentPropsMap {
    Text: VNodeTypes & ExtraProps;
    Link: VNodeTypes & ExtraProps;
    Input: InputProps;
    InputGroup: InstanceType<typeof InputGroup>['$props'];
    InputPassword: InstanceType<typeof InputPassword>['$props'];
    InputSearch: InstanceType<typeof InputSearch>['$props'];
    InputTextArea: TextAreaProps;
    InputNumber: InstanceType<typeof InputNumber>['$props'];
    AutoComplete: AutoCompleteProps;

    Select: SelectProps;
    TreeSelect: TreeSelectProps;
    Switch: SwitchProps;
    RadioButtonGroup: InstanceType<typeof RadioButtonGroup>['$props'];
    RadioGroup: RadioGroupProps;
    Checkbox: CheckboxProps;
    CheckboxGroup: CheckboxProps;
    Cascader: CascaderProps;
    Slider: SliderProps;
    Rate: RateProps;

    DatePicker: DatePickerProps;
    MonthPicker: InstanceType<typeof MonthPicker>['$props'];
    RangePicker: InstanceType<typeof RangePicker>['$props'];
    WeekPicker: InstanceType<typeof WeekPicker>['$props'];
    TimePicker: TimePickerProps;
    TimeRangePicker: TimeRangePickerProps;
    Icon: IconPickProps;
    CardUpload: InstanceType<typeof QCardUpload>['$props'];
    Transfer: InstanceType<typeof QTransfer>['$props'];
    Upload: UploadProps;
    Divider: DividerProps;
    SelectAll: InstanceType<typeof SelectAll>['$props'];
}
export interface FormComponentPropsMap extends BuiltInFormComponentPropsMap {
    [key: string]: any;
}
export type FormComponentNames = keyof FormComponentPropsMap;

export type ComponentType<T extends string> = keyof BuiltInFormComponentPropsMap | T;

/**
 * 定义自定义组件类型的帮助类型
 *
 * @example
 * ```typescript
 * type MyCustomComponents = DefineCustomComponents<{
 *   MyInput: { customProp: string; onChange: (value: string) => void };
 *   MySelect: { options: Array<{label: string; value: any}> };
 * }>;
 *
 * type MyFormSchema = FormSchema<Record<string, any>, MyCustomComponents>;
 * ```
 */
export type DefineCustomComponents<T extends Record<string, any>> = T;
