<!--  -->
<template>
    <div class="q-project-setting-switch-item">
        <span>{{ props.title }}</span>
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
import { onMounted, PropType, computed} from 'vue';
import { HandleEnum } from '../enums/enum';
import { propTypes } from '@q-front-npm/types/vue/types';
import { Switch } from 'ant-design-vue';
import { set_handler } from '../tools/handler';
const props = defineProps({
    event: {
        type: Number as PropType<HandleEnum>
    },
    disabled: propTypes.bool.def(false),
    title: propTypes.string.def(''),
    default: propTypes.bool.def(false)
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
