<!--  -->
<template>
    <a-select v-bind="getAttrs" :options="props.options" v-model:value="selectVal">
        <template #dropdownRender="{ menuNode: menu }">
            <div class="checkbox-wrapper" @mousedown="e => e.preventDefault()">
                <a-checkbox v-model:checked="isAll">全选</a-checkbox>
            </div>
            <Divider style="margin: 4px 0" />
            <v-nodes :vnodes="menu" />
        </template>
    </a-select>
</template>

<script lang='ts'>
export default defineComponent({
    name: 'QAntdSelectAll',
    components: {
        VNodes: (_, { attrs }) => {
            return attrs.vnodes;
        }
    }
});
</script>

<script lang='ts' setup>
import { reactive, useAttrs, computed, watchEffect, PropType, getCurrentInstance, nextTick, defineComponent} from 'vue';
import { Divider } from 'ant-design-vue';

type OptionsItem = { label: string; value: string | number | boolean; disabled?: boolean; };
type SelectOption = OptionsItem;

const props = defineProps({
    value: {
        type: Array as PropType<string[]>
    },
    options: {
        type: Array as PropType<SelectOption[]>,
        default: () => []
    }
});
const attrs = useAttrs();
const getAttrs = computed(() => {
    return {
        ...attrs,
        mode: 'multiple'
    };
}

);

// 通过 子组件 改变父组件传递的 props
const instance = getCurrentInstance();
const emit = instance?.emit;
const innerState = reactive({
    value: props.value
});
watchEffect(() => {
    innerState.value = props.value;
});
const selectVal = computed({
    get() {
        return innerState.value;
    },
    set(value) {
        innerState.value = value as string[];
        nextTick(() => {
            emit?.('change', value);
        });
    }
});
const isAll = computed({
    get() {
        return !(props.options.some(n => {
            return !((selectVal.value as string[])?.includes(n.value as string));
        }));
    },
    set(value) {
        let _obj: string[] = [];
        if (value) {
            _obj = props.options.map(n => n.value as string);
        }
        nextTick(() => {
            emit?.('change', _obj);
        });
    }
});

</script>
