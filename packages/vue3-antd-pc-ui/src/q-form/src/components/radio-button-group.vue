<!--  -->
<template>
    <radio-group button-style="solid" v-bind="attrs" v-model:value="state">
        <template v-for="item in getOptions" :key="`${item.value}`">
            <radio-button :value="item.value" :disabled="item.disabled">
                {{item.label}}
                <Tooltip v-if="item.mark" :title="item.mark">
                    <QIcon type="QuestionCircleOutlined"></QIcon>
                </Tooltip>
            </radio-button>
        </template>
    </radio-group>
</template>

<script lang='ts' setup>
import { reactive, onMounted, useAttrs, type PropType, getCurrentInstance, computed, nextTick, watchEffect} from 'vue';
import { isString } from '@quantum-design/utils';
import {Icon as QIcon} from '@vue3-antd/q-icon/src/icon';
import {Tooltip, RadioGroup, RadioButton} from 'ant-design-vue';

type OptionsItem = { label: string; value: string | number | boolean; disabled?: boolean; mark?: string };
type RadioItem = string | OptionsItem;

const props = defineProps({
    value: {
        type: [String, Number, Boolean] as PropType<string | number | boolean>
    },
    options: {
        type: Array as PropType<RadioItem[]>,
        default: () => []
    }
});
const attrs = useAttrs();

// 通过 子组件 改变父组件传递的 props
const instance = getCurrentInstance();
const emit = instance?.emit;
const innerState = reactive({
    value: props.value
});
watchEffect(() => {
    innerState.value = props.value;
});
const state = computed({
    get() {
        return innerState.value;
    },
    set(value) {
        innerState.value = value as string | number | boolean;
        nextTick(() => {
            emit?.('change', value, []);
        });
    }
});

const getOptions = computed((): OptionsItem[] => {
    const { options } = props;
    if (!options || options?.length === 0) return [];

    const isStringArr = options.some((item) => isString(item));
    if (!isStringArr) return options as OptionsItem[];

    return options.map((item) => ({ label: item, value: item })) as OptionsItem[];
});

onMounted(() => {
});
</script>
<style lang='scss' scoped>
</style>
