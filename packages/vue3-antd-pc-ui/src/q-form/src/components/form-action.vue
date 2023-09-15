<!-- 提交, 重置, 更多 按钮-->
<template>
    <a-col v-if="showActionButtonGroup" v-bind="actionColOpt">
        <div style="width: 100%" :style="{ textAlign: actionColOpt.style.textAlign }">
            <a-form-item>
                <slot name="resetBefore"></slot>
                <a-button v-bind="getResetBtnOptions" v-if="showResetButton" @click="event.resetAction">
                    {{ getResetBtnOptions.title }}
                </a-button>
                <slot name="submitBefore"></slot>
                <a-button
                    type="primary"
                    class="ml"
                    v-bind="getSubmitBtnOptions"
                    @click="event.submitAction"
                    v-if="showSubmitButton"
                >
                    {{ getSubmitBtnOptions.title }}
                </a-button>
                <slot name="submitAfter"></slot>
            </a-form-item>
        </div>
    </a-col>
</template>

<script lang='ts' setup>
import { onMounted, PropType, computed} from 'vue';
import { propTypes } from '@quantum-design/types/vue/types';
import { ColEx } from '../types';
import type { ButtonProps } from 'ant-design-vue/es/button/buttonTypes';
import { use_form_context } from '../hooks/use-form-context';
import { Col as ACol, FormItem, Button as AButton } from 'ant-design-vue';

const props = defineProps({
    showActionButtonGroup: propTypes.bool.def(true), // 是否展示操作栏
    showResetButton: propTypes.bool.def(true), // 是否展示重置按钮
    showSubmitButton: propTypes.bool.def(true), // 是否展示提交按钮
    resetButtonOptions: { // 重置按钮属性, 详细属性查看 ButtonProps
        type: Object as PropType<Partial<ButtonProps>>,
        default: () => ({})
    },
    submitButtonOptions: { // 提交按钮属性
        type: Object as PropType<Partial<ButtonProps>>,
        default: () => ({})
    },
    actionColOptions: { // col属性
        type: Object as PropType<Partial<ColEx>>,
        default: () => ({})
    }
});
// 设置 col 的属性
const actionColOpt = computed(() => {
    const { actionColOptions } = props;
    const actionColOpt: Partial<ColEx> = {
        style: { textAlign: 'right' },
        ...actionColOptions
    };
    return actionColOpt;
});
const getResetBtnOptions = computed((): ButtonProps => {
    return Object.assign(
        {
            title: '重置'
        },
        props.resetButtonOptions
    );
});
const getSubmitBtnOptions = computed(() => {
    return Object.assign(
        {
            title: '查询'
        },
        props.submitButtonOptions
    );
});
const event = use_form_context();
onMounted(() => {
});
</script>
<style lang='scss' scoped>
</style>
