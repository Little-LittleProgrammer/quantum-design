<script lang="tsx">
import type { Slots } from 'vue';
import { isArray, isBoolean, isFunction, isNull, isNumber, isObject, isString, js_utils_first_to_upper } from '@quantum-design/utils';
import { defineComponent } from 'vue';
import { Rule } from 'ant-design-vue/lib/form/interface';
import { computed, PropType, Ref, toRefs, unref } from 'vue';
import { componentMap } from '../component-map';
import { create_placeholder_message, set_component_rule_type } from '../helper';
import { FormProps, FormSchema } from '../types/form';
import { FormActionType } from '../types/form';
import {Icon as QIcon} from '@vue3-antd/q-icon/src/icon';
import { cloneDeep } from 'lodash-es';
import { TableActionType } from '@vue3-antd/q-table/src/types/table';
import { Col, Divider, Form, Tooltip } from 'ant-design-vue';

export default defineComponent({
    name: 'QAntFormItem',
    inheritAttrs: false,
    props: {
        schema: { // form-item的 json 数据
            type: Object as PropType<FormSchema>,
            default: () => ({})
        },
        formProps: { // 父组件传递的props(即 q-form 的props)
            type: Object as PropType<FormProps>,
            default: () => ({})
        },
        allDefaultValues: { // 默认值
            type: Object as PropType<Record<string, any>>,
            default: () => ({})
        },
        formModel: { // formData
            type: Object as PropType<Record<string, any>>,
            default: () => ({})
        },
        setFormModel: {
            type: Function as PropType<(key: string, value: any, schema:FormSchema) => void>,
            default: null
        },
        tableAction: {
            type: Object as PropType<TableActionType>
        },
        formActionType: {
            type: Object as PropType<FormActionType>
        }
    },
    setup(props, {slots}) {
        const { schema, formProps } = toRefs(props) as {
            schema: Ref<FormSchema>;
            formProps: Ref<FormProps>;
        };
        const itemLabelWidthProp = get_label_width(schema.value, formProps.value);
        // 获取 form-item应该设置的 col 和 wrapper
        function get_label_width(schemaItem: FormSchema, formPropsItem: FormProps) {
            const { labelCol = {}, wrapperCol = {} } = schemaItem.itemProps || {};
            const { labelWidth, disabledLabelWidth } = schemaItem;

            const {
                labelWidth: globalLabelWidth,
                labelCol: globalLabelCol,
                wrapperCol: globWrapperCol
            } = formPropsItem;
            if ((!globalLabelWidth && !labelWidth && !globalLabelCol) || disabledLabelWidth) {
                labelCol.style = {
                    textAlign: 'left'
                };
                return { labelCol, wrapperCol };
            }
            let _width = labelWidth || globalLabelWidth;
            const _col = {...globalLabelCol, ...labelCol};
            const wrapCol = { ...globWrapperCol, ...wrapperCol };
            if (_width) {
                _width = isNumber(_width) ? `${_width}px` : _width;
            }
            return {
                labelCol: { style: { width: _width }, ..._col },
                wrapperCol: { style: { width: `calc(100% - ${_width})` }, ...wrapCol }
            };
        }
        // 获取 value
        const getValues = computed(() => {
            const { allDefaultValues, formModel, schema } = props;
            const { mergeDynamicData } = props.formProps;
            return {
                field: schema.field,
                model: formModel,
                values: {
                    ...mergeDynamicData,
                    ...allDefaultValues,
                    ...formModel
                } as Record<string, any>,
                schema: schema
            };
        });
        const getComponentsProps = computed(() => {
            const { schema, formModel, formActionType, tableAction } = props;
            let { componentProps = {}} = schema;
            if (isFunction(componentProps)) {
                componentProps = componentProps({schema, formModel, formActionType, tableAction}) ?? {};
            }
            if (schema.component === 'Divider') {
                componentProps = Object.assign({ type: 'horizontal' }, componentProps, {
                    orientation: 'left',
                    plain: true
                });
            }
            return componentProps as Record<string, any>;
        });
        const getDisable = computed(() => {
            const { disabled: globDisabled } = props.formProps;
            const { dynamicDisabled } = props.schema;
            const { disabled: itemDisabled = false } = unref(getComponentsProps);
            let disabled = !!globDisabled || itemDisabled;
            if (isBoolean(dynamicDisabled)) {
                disabled = dynamicDisabled;
            }
            if (isFunction(dynamicDisabled)) {
                disabled = dynamicDisabled(unref(getValues));
            }
            return disabled;
        });
        function get_slot(slots: Slots, slot = 'default', data?: any) {
            if (!slots || !Reflect.has(slots, slot)) {
                return null;
            }
            if (!isFunction(slots[slot])) {
                console.error(`${slot} is not a function!`);
                return null;
            }
            const slotFn = slots[slot];
            if (!slotFn) return null;
            return slotFn(data);
        }
        function get_show(): { isShow: boolean; isIfShow: boolean } {
            const { show, ifShow } = props.schema;

            let _isShow = true;
            let _isIfShow = true;

            if (isBoolean(show)) {
                _isShow = show;
            }
            if (isBoolean(ifShow)) {
                _isIfShow = ifShow;
            }
            if (isFunction(show)) {
                _isShow = show(unref(getValues));
            }
            if (isFunction(ifShow)) {
                _isIfShow = ifShow(unref(getValues));
            }
            return { isShow: _isShow, isIfShow: _isIfShow };
        }
        function handle_rules():Rule[] {
            const {
                rules: defRules = [],
                component,
                rulesMessageJoinLabel,
                label,
                dynamicRules,
                required
            } = props.schema;
            if (isFunction(dynamicRules)) {
                return dynamicRules(unref(getValues)) as Rule[];
            }
            let _rules: Rule[] = cloneDeep(defRules) as Rule[];
            const { rulesMessageJoinLabel: globalRulesMessageJoinLabel } = props.formProps;
            const _joinLabel = Reflect.has(props.schema, 'rulesMessageJoinLabel') ? rulesMessageJoinLabel : globalRulesMessageJoinLabel;
            const _defaultMsg = create_placeholder_message(component) + `${_joinLabel ? label : ''}`;
            function validator(rule: any, value: any) {
                const _msg = rule.message || _defaultMsg;
                if (value === undefined || isNull(value)) {
                    // 空值
                    return Promise.reject(_msg);
                } else if (isArray(value) && value.length === 0) {
                    // 数组类型
                    return Promise.reject(_msg);
                } else if (isString(value) && value.trim() === '') {
                    // 空字符串
                    return Promise.reject(_msg);
                } else if (
                    isObject(value) && Reflect.has(value, 'checked') && Reflect.has(value, 'halfChecked') && isArray(value.checked) && isArray(value.halfChecked) && value.checked.length === 0 && value.halfChecked.length === 0
                ) {
                    // 非关联选择的tree组件
                    return Promise.reject(_msg);
                }
                return Promise.resolve();
            }
            const _getRequired = isFunction(required) ? required(unref(getValues)) : required;
            if ((!_rules || _rules.length === 0) && _getRequired) {
                _rules = [{ required: _getRequired, validator }];
            }
            const _requiredRuleIndex: number = _rules.findIndex(
                (rule) => Reflect.has(rule, 'required') && !Reflect.has(rule, 'validator')
            );
            if (_requiredRuleIndex !== -1) {
                const _rule = _rules[_requiredRuleIndex];
                const { isShow } = get_show();
                if (!isShow) {
                    _rule.required = false;
                }
                if (component) {
                    if (!Reflect.has(_rule, 'type')) {
                        _rule.type = component === 'InputNumber' ? 'number' : 'string';
                    }

                    _rule.message = _rule.message || _defaultMsg;

                    if (component.includes('Input') || component.includes('Textarea')) {
                        _rule.whitespace = true;
                    }
                    const valueFormat = unref(getComponentsProps)?.valueFormat;
                    set_component_rule_type(_rule, component, valueFormat);
                }
            }
            // Maximum input length rule check
            const _characterInx = _rules.findIndex((val) => val.max);
            if (_characterInx !== -1 && !_rules[_characterInx].validator) {
                _rules[_characterInx].message = _rules[_characterInx].message || `字符应小于${[_rules[_characterInx].max] as Record<string, any>}位`;
            }
            return _rules;
        }
        function render_component() {
            const {
                renderComponentContent,
                component,
                field,
                changeEvent = 'change',
                valueField
            } = props.schema;
            const _isCheck = component && ['Switch', 'Checkbox'].includes(component);

            const _eventKey = `on${js_utils_first_to_upper(changeEvent)}`;
            const _on = {
                [_eventKey]: (...args:Nullable<Record<string, any>>[]) => {
                    const [e] = args;
                    const _target = e ? e.target : null;
                    const _value = _target ? (_isCheck ? _target.checked : _target.value) : e;
                    props.setFormModel(field, _value, props.schema);
                    // 自定义 change 事件
                    if (_propsData[_eventKey]) { // 解决 如果 RadioButtonGroup 里也设置了change事件, 会于 emit(‘change’) 冲突, 造成执行2次
                        if (!(component === 'RadioButtonGroup' && e && e.target)) {
                            _propsData[_eventKey](...args);
                        }
                    }
                }
            };
            const Comp = componentMap.get(component) as ReturnType<typeof defineComponent>;
            const { autoSetPlaceHolder, size } = props.formProps;
            const _propsData: Record<string, any> = {
                allowClear: true,
                getPopupContainer: (trigger: Element) => trigger.parentNode,
                size,
                ...getComponentsProps.value,
                disabled: unref(getDisable)
            };

            const _isCreatePlaceholder = !_propsData.disabled && autoSetPlaceHolder;
            // RangePicker place is an array
            if (_isCreatePlaceholder && component !== 'RangePicker' && component) {
                _propsData.placeholder =
            unref(getComponentsProps)?.placeholder || create_placeholder_message(component);
            }
            _propsData.codeField = field;
            _propsData.formValues = unref(getValues);

            const _bindValue: Record<string, any> = {
                [valueField || (_isCheck ? 'checked' : 'value')]: props.formModel[field]
            };

            const _compAttr: Record<string, any> = {
                ..._propsData,
                ..._on,
                ..._bindValue
            };

            const _deafultAttr = {
                ..._on,
                href: props.formModel[field],
                ...getComponentsProps.value
            };

            if (['Text', 'Link'].includes(component)) {
                return <Comp {..._deafultAttr}>{props.formModel[field]}</Comp>;
            }

            if (!renderComponentContent) {
                return <Comp {..._compAttr}/>;
            }
            const compSlot = isFunction(renderComponentContent)
                ? { ...renderComponentContent(unref(getValues)) }
                : {
                    default: () => renderComponentContent
                };
            return <Comp {..._compAttr}>{compSlot}</Comp>;
        }

        function render_label_help_message() {
            const { label, helpMessage, helpComponentProps, subLabel } = props.schema;
            const _renderLabel = subLabel ? (
                <span>
                    {label} <span class="text-secondary">{subLabel}</span>
                </span>
            ) : (
                label
            );
            const getHelpMessage = isFunction(helpMessage)
                ? helpMessage(unref(getValues))
                : helpMessage;
            if (!getHelpMessage || (Array.isArray(getHelpMessage) && getHelpMessage.length === 0)) {
                return _renderLabel;
            }
            let getTooltipStyle = {};
            let getOverlayStyle = {};
            if (helpComponentProps) {
                getTooltipStyle = {
                    color: helpComponentProps.color, fontSize: helpComponentProps.fontSize
                };
                getOverlayStyle = {
                    maxWidth: helpComponentProps.maxWidth
                };
            }
            return (
                <span>
                    <Tooltip
                        placement="top"
                        class="mr"
                        title={<div style={getTooltipStyle}>{getHelpMessage}</div>}
                        overlayStyle={getOverlayStyle}
                    >
                        <QIcon type="QuestionCircleOutlined"></QIcon>
                    </Tooltip>
                    {_renderLabel}
                </span>
            );
        }
        function render_item() {
            const { itemProps, slot, render, field, suffix, component, prefix } = props.schema;
            const { labelCol, wrapperCol } = unref(itemLabelWidthProp);
            const { colon } = props.formProps;
            if (component === 'Divider') {
                return (
                    <Col span={24}>
                        <Divider {...unref(getComponentsProps)}>{render_label_help_message()}</Divider>
                    </Col>
                );
            } else {
                const get_content = () => {
                    return slot ? get_slot(slots, slot, unref(getValues)) : render ? render(unref(getValues)) : render_component();
                };
                const _showSuffix = !!suffix;
                const _showPrefix = !!prefix;
                const _getSuffix = isFunction(suffix) ? suffix(unref(getValues)) : suffix;
                const _getPrefix = isFunction(prefix) ? prefix(unref(getValues)) : prefix;
                return (
                    <Form.Item
                        name={field}
                        colon={colon}
                        class={{ 'suffix-item': _showSuffix || _showPrefix }}
                        {...(itemProps as Record<string, any>)}
                        label={render_label_help_message()}
                        rules={handle_rules()}
                        labelCol={labelCol}
                        wrapperCol={wrapperCol}
                    >
                        <div style="display:flex">
                            {_showPrefix && <span class="prefix">{_getPrefix}</span>}
                            <div style="flex:1; max-width: 100%">{get_content()}</div>
                            {_showSuffix && <span class="suffix">{_getSuffix}</span>}
                        </div>
                    </Form.Item>
                );
            }
        }
        return () => {
            const { colProps = {}, colSlot, renderColContent, component } = props.schema;
            if (!componentMap.has(component)) {
                return null;
            }

            const { baseColProps = {} } = props.formProps;
            const realColProps = { ...baseColProps, ...colProps };
            const { isIfShow, isShow } = get_show();
            const values = unref(getValues);
            const getContent = () => {
                return colSlot ? get_slot(slots, colSlot, unref(getValues))
                    : renderColContent
                        ? renderColContent(values)
                        : render_item();
            };
            return (
                isIfShow && (
                    <Col {...realColProps} v-show={isShow}>
                        {getContent()}
                    </Col>
                )
            );
        };
    }

});
</script>
