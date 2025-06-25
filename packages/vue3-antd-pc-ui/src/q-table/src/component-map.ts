import type { Component } from 'vue';
import {
    Input,
    Select,
    Checkbox,
    InputNumber,
    Switch,
    DatePicker,
    TimePicker,
    AutoComplete,
    Radio,
    Button
} from 'ant-design-vue';
import type { ComponentType } from './types/component-type';
import QSelectAll from '@vue3-antd/q-form/src/components/select-all.vue';
import RadioButtonGroup from '@vue3-antd/q-form/src/components/radio-button-group.vue';

const componentMap = new Map<ComponentType, Component>();

componentMap.set('Input', Input);
componentMap.set('Button', Button);
componentMap.set('InputNumber', InputNumber);
componentMap.set('Select', Select);
componentMap.set('SelectAll', QSelectAll);
componentMap.set('AutoComplete', AutoComplete);
componentMap.set('Switch', Switch);
componentMap.set('Checkbox', Checkbox);
componentMap.set('DatePicker', DatePicker);
componentMap.set('MonthPicker', DatePicker.MonthPicker);

componentMap.set('RangePicker', DatePicker.RangePicker);
componentMap.set('WeekPicker', DatePicker.WeekPicker);
componentMap.set('TimePicker', TimePicker);
componentMap.set('RadioGroup', Radio.Group);
componentMap.set('RadioButtonGroup', RadioButtonGroup);

export function add(compName: ComponentType, component: Component) {
    componentMap.set(compName, component);
}

export function del(compName: ComponentType) {
    componentMap.delete(compName);
}

export { componentMap };

export const tableExtraList = new Map<string, Component>();

export function addTableExtra(component: Component) {
    tableExtraList.set(component.name || '', component);
}

export function delTableExtra(component: Component) {
    const name = component.name;
    if (name) {
        tableExtraList.delete(name);
    }
}
