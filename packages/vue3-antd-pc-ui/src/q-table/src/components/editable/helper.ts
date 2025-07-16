import type { ComponentType } from '../../types/component-type';

export function create_placeholder_message(component: ComponentType){
    if (component.includes('Input') || component.includes('AutoComplete')) {
        return '请输入';
    }
    if (component.includes('Picker')) {
        return '请选择日期';
    }

    if (
        component.includes('Select') ||
        component.includes('Checkbox') ||
        component.includes('Radio') ||
        component.includes('Switch')
    ) {
        return '请选择';
    }
    return '';
}
