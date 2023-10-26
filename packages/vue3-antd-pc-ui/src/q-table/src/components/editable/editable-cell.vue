<script lang="tsx">
import type {CSSProperties, PropType} from 'vue';
import {computed, defineComponent, nextTick, ref, toRaw, unref, watchEffect} from 'vue';
import type { BasicColumn } from '../../types/table';
import {propTypes} from '@quantum-design/types/vue/types';
import {js_is_array, js_is_boolean, js_is_function, js_is_number, js_is_string} from '@quantum-design/utils';
import {useTableContext} from '../../hooks/use-table-context';
import { create_placeholder_message } from './helper';
import { pick, set } from 'lodash-es';
import { FormOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons-vue';
import { Spin } from 'ant-design-vue';
import { CellComponent } from './cell-component';

export default defineComponent({
    name: 'EditableCell',
    components: {FormOutlined, CloseOutlined, CheckOutlined, CellComponent, Spin},
    props: {
        value: {
            type: [String, Number, Boolean, Object] as PropType< string | number | boolean | Record<string, any>>,
            default: ''
        },
        record: {
            type: Object as any
        },
        column: {
            type: Object as PropType<BasicColumn>,
            default: () => ({})
        },
        index: propTypes.number
    },
    setup(props) {
        const table = useTableContext();
        const isEdit = ref(false);
        const elRef = ref();
        const ruleVisible = ref(false);
        const ruleMessage = ref('');
        const currentValueRef = ref<any>(props.value);
        const defaultValueRef = ref<any>(props.value);
        const spinning = ref<boolean>(false);

        const prefixCls = 'q-table-editable-cell';

        const getComponent = computed(() => props.column?.editComponent || 'Input');
        const getRule = computed(() => props.column?.editRule);

        const getRuleVisible = computed(() => {
            return unref(ruleMessage) && unref(ruleVisible);
        });

        const getIsCheckComp = computed(() => {
            const _component = unref(getComponent);
            return ['Checkbox', 'Switch'].includes(_component);
        });

        const getComponentProps = computed(() => {
            const _isCheckVal = unref(getIsCheckComp);
            const _valueField = _isCheckVal ? 'checked' : 'value';

            const _val = unref(currentValueRef);
            const _value = _isCheckVal ? (js_is_number(_val) && js_is_boolean(_val) ? _val : !!_val) : _val;

            let _compProps = props.column?.editComponentProps ?? ({} as any);
            const {record, column, index} = props;

            if (js_is_function(_compProps)) {
                _compProps = _compProps({ text: _val, record, column, index }) ?? {};
            }

            // 用临时变量存储 onChange方法 用于 handleChange方法 获取，并删除原始onChange, 防止存在两个 onChange
            _compProps.onChangeTemp = _compProps.onChange;
            delete _compProps.onChange;

            up_edit_dynamic_disabled(record, column, _value);
            return {
                size: 'small',
                getPopupContainer: () => unref(table?.wrapRef.value) ?? document.body,
                placeholder: create_placeholder_message(unref(getComponent)),
                ..._compProps,
                [_valueField]: _value,
                disabled: unref(getDisable)
            };
        });

        function up_edit_dynamic_disabled(record: any, column: BasicColumn, value: any) {
            if (!record) return false;
            const { key, dataIndex } = column;
            if (!key && !dataIndex) return;
            const dataKey = (dataIndex || key) as string;
            set(record, dataKey, value);
        }

        const getDisable = computed(() => {
            const { editDynamicDisabled } = props.column;
            let disabled = false;
            if (js_is_boolean(editDynamicDisabled)) {
                disabled = editDynamicDisabled;
            }
            if (js_is_function(editDynamicDisabled)) {
                const { record } = props;
                disabled = editDynamicDisabled({ record });
            }
            return disabled;
        });

        const getValues = computed(() => {
            const {editValueMap} = props.column;

            const _value = unref(currentValueRef);

            if (editValueMap && js_is_function(editValueMap)) {
                return editValueMap(_value);
            }

            const _component = unref(getComponent);
            if (!_component.includes('Select') && !_component.includes('Radio')) {
                return _value;
            }

            const _options = unref(getComponentProps)?.options ?? (unref(getComponentProps)?.options || []);
            const _option = _options.find((item: any) => `${item.value}` === `${_value}`);

            return _option?.label ?? _value;
        });

        const getWrapperStyle = computed((): CSSProperties => {
            if (unref(getIsCheckComp) || unref(getRowEditable)) {
                return {};
            }
            return {
                width: 'calc(100% - 48px)'
            };
        });

        const getWrapperClass = computed(() => {
            const { align = 'center' } = props.column;
            return `edit-cell-align-${align}`;
        });

        const getRowEditable = computed(() => {
            const { editable } = props.record || {};
            return !!editable;
        });

        watchEffect(() => {
            // defaultValueRef.value = props.value;
            currentValueRef.value = props.value;
        });

        watchEffect(() => {
            const { editable } = props.column;
            if (js_is_boolean(editable) || js_is_boolean(unref(getRowEditable))) {
                isEdit.value = !!editable || unref(getRowEditable);
            }
        });

        function handle_edit() {
            if (unref(getRowEditable) || unref(props.column?.editRow)) return;
            ruleMessage.value = '';
            isEdit.value = true;
            nextTick(() => {
                const _el = unref(elRef);
                _el?.focus?.();
            });
        }

        // 单元格组件change 事件
        async function handle_change(e: any) {
            const _component = unref(getComponent);
            if (!e) {
                currentValueRef.value = e;
            } else if (_component === 'Checkbox') {
                currentValueRef.value = e.target.value;
            } else if (_component === 'Switch') {
                currentValueRef.value = e;
            } else if (e?.target && Reflect.has(e.target, 'value')) {
                currentValueRef.value = e.target.value;
            } else if (js_is_boolean(e) || js_is_string(e) || js_is_number(e) || js_is_array(e)) {
                currentValueRef.value = e;
            }

            const _onChange = unref(getComponentProps)?.onChangeTemp;
            if (_onChange && js_is_function(_onChange)) {
                _onChange(...arguments);
            }
            table.emit?.('edit-change', {
                column: props.column,
                value: unref(currentValueRef),
                record: toRaw(props.record)
            });
            handle_submit_rule();
        }

        // 单元格校验
        async function handle_submit_rule() {
            const {column, record} = props;
            const {editRule} = column;
            const _currentValue = unref(currentValueRef);

            if (editRule) {
                if (js_is_boolean(editRule) && !_currentValue && !js_is_number(_currentValue)) {
                    ruleVisible.value = true;
                    const _component = unref(getComponent);
                    ruleMessage.value = create_placeholder_message(_component);
                    return false;
                }
                if (js_is_function(editRule)) {
                    const _res = await editRule(_currentValue, record);
                    if (_res) {
                        ruleMessage.value = _res;
                        ruleVisible.value = true;
                        return false;
                    } else {
                        ruleMessage.value = '';
                        ruleVisible.value = false;
                        return true;
                    }
                }
            }
            ruleMessage.value = '';
            return true;
        }

        async function handle_submit(needEmit = true, valid = true) {
            if (valid) {
                const _isPass = await handle_submit_rule();
                if (!_isPass) return false;
            }

            const {column, index, record} = props;
            if (!record) return false;
            const {key, dataIndex} = column;
            const _value = unref(currentValueRef);
            if (!key && !dataIndex) return;

            const _dataKey = (dataIndex || key) as string;

            if (!record.editable) {
                const {getBindValues} = table;

                const { beforeEditSubmit, columns } = unref(getBindValues);

                if (beforeEditSubmit && js_is_function(beforeEditSubmit)) {
                    spinning.value = true;
                    const _keys: string[] = columns
                        .map((_column) => _column.dataIndex)
                        .filter((field) => !!field) as string[];
                    let result: any = true;
                    try {
                        result = await beforeEditSubmit({
                            record: pick(record, _keys),
                            index,
                            key: _dataKey as string,
                            value: _value
                        });
                    } catch (e) {
                        result = false;
                    } finally {
                        spinning.value = false;
                    }
                    if (result === false) {
                        return;
                    }
                }
            }
            set(record, _dataKey, _value);
            defaultValueRef.value = _value;
            needEmit && table.emit?.('edit-end', { record, index, key: _dataKey, value: _value });
            isEdit.value = false;
        }

        async function handle_enter() {
            if (props.column?.editRow) {
                return;
            }
            handle_submit();
        }

        function handle_submit_click() {
            handle_submit();
        }

        function handle_cancel() {
            currentValueRef.value = defaultValueRef.value;
            const { column, index, record } = props;
            const { key, dataIndex } = column;
            table.emit?.('edit-cancel', {
                record,
                index,
                key: dataIndex || key,
                value: unref(currentValueRef)
            });
            nextTick(() => {
                isEdit.value = false;
            });
        }

        function init_cbs(cbs: 'submitCbs' | 'validCbs' | 'cancelCbs', handle: Fn) {
            if (props.record) {
                /* eslint-disable  */
                js_is_array(props.record[cbs])
                    ? props.record[cbs]?.push(handle)
                    : (props.record[cbs] = [handle]);
            }
        }

        if (props.record) {
            init_cbs('submitCbs', handle_submit);
            init_cbs('validCbs', handle_submit_rule);
            init_cbs('cancelCbs', handle_cancel);

            
            if (props.column.dataIndex) {
                if (!props.record.editValueRefs) props.record.editValueRefs = {};
                props.record.editValueRefs[props.column.dataIndex as any] = currentValueRef;
            }
            props.record.onCancelEdit = () => {
                js_is_array(props.record?.cancelCbs) && props.record?.cancelCbs.forEach((fn:Fn) => fn());
            };
            props.record.onSubmitEdit = async() => {
                if (js_is_array(props.record?.submitCbs)) {
                    if (!props.record?.onValid?.()) return;
                    const submitFns = props.record?.submitCbs || [];
                    submitFns.forEach((fn: Fn) => fn(false, false));
                    table.emit?.('edit-row-end');
                    return true;
                }
            };
        }

        return {
            isEdit,
            prefixCls,
            handle_edit,
            currentValueRef,
            handle_submit,
            handle_change,
            handle_cancel,
            elRef,
            getComponent,
            getRule,
            ruleMessage,
            getRuleVisible,
            getComponentProps,
            getWrapperClass,
            getWrapperStyle,
            getRowEditable,
            getValues,
            handle_enter,
            handle_submit_click,
            spinning
        };
    },
    render() {
        return (
            <div class={this.prefixCls}>
                <div v-show={!this.isEdit} class={{ [`${this.prefixCls}-normal`]: true, 'ellipsis-cell': this.column.ellipsis }} onClick={this.handle_edit}>
                    <div class="cell-content" title={this.column.ellipsis ? this.getValues ?? '' : ''}>
                        {this.column.editRender
                            ? this.column.editRender({
                                text: this.value,
                                record: this.record,
                                column: this.column,
                                index: this.index
                            })
                            : this.getValues ?? '\u00A0'}
                    </div>
                    {!this.column.editRow && <FormOutlined class={`${this.prefixCls}-normal-icon`} />}
                </div>
                {this.isEdit && (
                    <Spin spinning={this.spinning}>
                        <div class={`${this.prefixCls}-wrapper`} >
                            <CellComponent
                                {...this.getComponentProps}
                                component={this.getComponent}
                                style={this.getWrapperStyle}
                                popoverVisible={this.getRuleVisible}
                                rule={this.getRule}
                                ruleMessage={this.ruleMessage}
                                class={this.getWrapperClass}
                                ref="elRef"
                                onChange={this.handle_change}
                                onPressEnter={this.handle_enter}
                            ></CellComponent>
                            {!this.getRowEditable && (
                                <div class={`${this.prefixCls}-action`}>
                                    <CheckOutlined
                                        class={[`${this.prefixCls}-icon`]}
                                        onClick={this.handle_submit_click}
                                    />
                                    <CloseOutlined class={`${this.prefixCls}-icon `} onClick={this.handle_cancel} />
                                </div>
                            )}
                        </div>
                    </Spin>
                )}
            </div>
        );
    }
});

</script>
