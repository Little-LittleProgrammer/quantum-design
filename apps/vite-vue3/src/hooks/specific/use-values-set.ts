import { format_str, format_nums } from '@/assets/ts/deal-bucket';
import { deep_copy, isArray, isObject } from '@qmfront/utils';
import { ref, watch } from 'vue';

interface IFormFunc {
    setFieldsValue: <T>(values: T) => Promise<void>
    resetFields: () => Promise<any>
}

export const useValuesSet = <P extends Record<'values' | 'visible', any> & {type?:string}>
(
    props:P,
    formFunc: IFormFunc
) => {
    const {setFieldsValue, resetFields} = formFunc;

    watch(() => props.visible, (val) => {
        if (val) {
            let _data:any = {};
            if (props.type) {
                _data = deep_copy(props.values[props.type]) || {};
            } else {
                _data = deep_copy(props.values);
            }
            // 特殊处理分桶
            if (_data.canary_groups && isArray(_data.canary_groups)) {
                _data.canary_groups.forEach((item: Record<'buckets', any>) => {
                    item.buckets = format_nums(item.buckets);
                });
            }
            setFieldsValue({
                ..._data
            });
        } else {
            resetFields();
        }
    });
};

export const useValuesGet = () => {
    const childRefs = ref<(Record<'validate' | 'getFieldsValue' | 'type', any>[]) | Record<'validate' | 'getFieldsValue' | 'type', any>>([]);
    async function getValues() {
        let _allValues: any = {};
        try {
            if (isArray(childRefs.value)) {
                for (const child of childRefs.value) {
                    await child.validate();
                }
                for (const child of childRefs.value) {
                    const _values = child.getFieldsValue();
                    if (child.type) {
                        _allValues[child.type] = {
                            ...(_allValues[child.type] || {}),
                            ..._values
                        };
                    } else {
                        _allValues = {
                            ..._allValues,
                            ..._values
                        };
                    }
                    // 特殊处理分桶
                    if (_allValues.canary_groups && isArray(_allValues.canary_groups)) {
                        // '1-2, 4-5' => [1,2,4,5]
                        _allValues.canary_groups.forEach((item: Record<'buckets', any>) => {
                            item.buckets = format_str(item.buckets);
                        });
                    }
                }
            } else {
                await childRefs.value.validate();
                const _values = childRefs.value.getFieldsValue();
                if (childRefs.value.type) {
                    _allValues[ childRefs.value.type] = {
                        ...(_allValues[ childRefs.value.type] || {}),
                        ..._values
                    };
                } else {
                    _allValues = {
                        ..._allValues,
                        ..._values
                    };
                }
                // 特殊处理分桶
                if (_allValues.canary_groups && isArray(_allValues.canary_groups)) {
                    // '1-2, 4-5' => [1,2,4,5]
                    _allValues.canary_groups.forEach((item: Record<'buckets', any>) => {
                        item.buckets = format_str(item.buckets);
                    });
                }
            }
            return _allValues;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
    return {
        getValues, childRefs
    };
};
