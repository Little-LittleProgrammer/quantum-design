<!--  -->
<template>
    <div class="q-project-setting-switch-item">
        <div>
            <a-tooltip v-if="props.tooltip" :title="props.tooltip">
                <q-icon class="g-mr" type="QuestionCircleOutlined"></q-icon>
            </a-tooltip>
            <span>{{ props.title }}</span>
        </div>
        <Switch
            v-bind = "getBindValue"
            @change="handle_change"
            :disabled="props.disabled"
            checked-children="开"
            un-checked-children="关"
        ></Switch>
    </div>
</template>

<script lang='ts' setup>
import { onMounted, type PropType, computed} from 'vue';
import { HandleEnum } from '../enums/enum';
import { propTypes } from '@quantum-design/types/vue/types';
import { Switch, Tooltip as ATooltip } from 'ant-design-vue';
import { set_handler } from '../tools/handler';
import {Icon as QIcon} from '@vue3-antd/q-icon/src/icon';
const props = defineProps({
    event: {
        type: Number as PropType<HandleEnum>
    },
    disabled: propTypes.bool.def(false),
    title: propTypes.string.def(''),
    default: propTypes.bool.def(false),
    tooltip: propTypes.string.def('')
});
const getBindValue = computed(() => {
    return props.default ? { checked: props.default } : {};
});
function handle_change(e: number) {
    (props.event || props.event === 0) && set_handler(props.event, e);
}
onMounted(() => {
});

</script>
<style lang='scss' scoped>

</style>
