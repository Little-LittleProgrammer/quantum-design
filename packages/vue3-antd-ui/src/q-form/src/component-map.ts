import type { Component } from 'vue';
import type { ComponentType } from './types/index';

/**
 * Component list, register here to setting it in the form
 */
import {
    Input,
    Select,
    Radio,
    Checkbox,
    AutoComplete,
    Cascader,
    DatePicker,
    InputNumber,
    Switch,
    TimePicker,
    TreeSelect,
    Slider,
    Rate,
    Divider
} from 'ant-design-vue';

import RadioButtonGroup from './components/radio-button-group.vue';
import { QIcon } from '../../q-icon';
import SelectAll from './components/select-all.vue';

const componentMap = new Map<ComponentType, Component>();

componentMap.set('Input', Input);
componentMap.set('InputGroup', Input.Group);
componentMap.set('InputPassword', Input.Password);
componentMap.set('InputSearch', Input.Search);
componentMap.set('InputTextArea', Input.TextArea);
componentMap.set('InputNumber', InputNumber);
componentMap.set('AutoComplete', AutoComplete);

componentMap.set('Select', Select);
componentMap.set('TreeSelect', TreeSelect);
componentMap.set('Switch', Switch);
componentMap.set('RadioButtonGroup', RadioButtonGroup);
componentMap.set('RadioGroup', Radio.Group);
componentMap.set('Checkbox', Checkbox);
componentMap.set('CheckboxGroup', Checkbox.Group);
componentMap.set('Cascader', Cascader);
componentMap.set('Slider', Slider);
componentMap.set('Rate', Rate);

componentMap.set('DatePicker', DatePicker);
componentMap.set('MonthPicker', DatePicker.MonthPicker);
componentMap.set('RangePicker', DatePicker.RangePicker);
componentMap.set('WeekPicker', DatePicker.WeekPicker);
componentMap.set('TimePicker', TimePicker);
componentMap.set('Icon', QIcon);

componentMap.set('Divider', Divider);
componentMap.set('SelectAll', SelectAll);

export function add(compName: ComponentType, component: Component) {
    componentMap.set(compName, component);
}

export function del(compName: ComponentType) {
    componentMap.delete(compName);
}

export { componentMap };
