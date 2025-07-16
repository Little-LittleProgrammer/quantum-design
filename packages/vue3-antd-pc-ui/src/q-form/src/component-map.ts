import { h, type Component } from 'vue';
import type { FormComponentNames } from './types/index';

/**
 * Component list, register here to setting it in the form
 */
import {
    AutoComplete,
    Cascader,
    Checkbox,
    DatePicker,
    Divider,
    Input,
    InputNumber,
    Radio,
    Rate,
    Select,
    Slider,
    Switch,
    TimePicker,
    TreeSelect,
    Upload
} from 'ant-design-vue';

import { Icon as QIcon } from '@vue3-antd/q-icon/src/icon';
import QTransfer from '@vue3-antd/q-transfer';
import QCardUpload from '@vue3-antd/q-upload';
import RadioButtonGroup from './components/radio-button-group.vue';
import SelectAll from './components/select-all.vue';

const componentMap = new Map<FormComponentNames, Component>();

componentMap.set('Text', h('p'));
componentMap.set('Link', h('a'));
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
componentMap.set('TimeRangePicker', TimePicker.TimeRangePicker);
componentMap.set('Icon', QIcon);
componentMap.set('CardUpload', QCardUpload);
componentMap.set('Transfer', QTransfer);
componentMap.set('Upload', Upload);

componentMap.set('Divider', Divider);
componentMap.set('SelectAll', SelectAll);

export function add<T extends string>(compName: T, component: Component) {
    componentMap.set(compName, component);
}

export function del<T extends string>(compName: T) {
    componentMap.delete(compName);
}

export { componentMap };
