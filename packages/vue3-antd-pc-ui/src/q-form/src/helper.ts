import { isNumber, isObject } from '@quantum-design/utils';
import type { Rule } from 'ant-design-vue/lib/form/interface';
import type { ComponentType } from './types/index';
import dayjs from 'dayjs';

/**
 * @description: 生成placeholder
 */
export function create_placeholder_message(component: ComponentType<''>) {
    if (component.includes('Input') || component.includes('Complete')) {
        return '请输入';
    }
    if (component.includes('Picker')) {
        return '请选择';
    }
    if (
        component.includes('Select') ||
        component.includes('Cascader') ||
        component.includes('Checkbox') ||
        component.includes('Radio') ||
        component.includes('Switch')
    ) {
        return `请选择`;
    }
    return '';
}

const DATE_TYPE = ['DatePicker', 'MonthPicker', 'WeekPicker', 'TimePicker'];

function gen_type() {
    return [...DATE_TYPE, 'RangePicker'];
}

// 设置 rules 校验的 type 属性
export function set_component_rule_type(
    rule: Rule,
    component: ComponentType<''>,
    valueFormat: string
) {
    if (['DatePicker', 'MonthPicker', 'WeekPicker', 'TimePicker'].includes(component)) {
        rule.type = valueFormat ? 'string' : 'object';
    } else if (['RangePicker', 'Upload', 'CheckboxGroup'].includes(component)) {
        rule.type = 'array';
    } else if (['InputNumber'].includes(component)) {
        rule.type = 'number';
    }
}

// 处理日期格式
export function process_date_value(attr: Record<string, any>, component: string) {
    const { valueFormat, value } = attr;
    if (valueFormat) {
        attr.value = isObject(value) ? dayjs(value as any).format(valueFormat) : value;
    } else if (DATE_TYPE.includes(component) && value) {
        attr.value = dayjs(attr.value);
    }
}

// 处理 input 输入框,将数据变成string
export function handle_input_number_value(component?: ComponentType<''>, val?: any) {
    if (!component) return val;
    if (['Input', 'InputPassword', 'InputSearch', 'InputTextArea'].includes(component)) {
        return val && isNumber(val) ? `${val}` : val;
    }
    return val;
}

/**
 * 时间字段
 */
export const dateItemType = gen_type();
