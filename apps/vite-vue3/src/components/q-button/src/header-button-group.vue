<!--  -->
<template>
    <q-button-group v-bind="getProps" class="m-b-10"></q-button-group>
</template>

<script lang='ts' setup>
import { computed, toRaw, PropType} from 'vue';
import QButtonGroup from './basic-button-group.vue';
import { useMessage } from '@qmfront/hooks/vue';
import { ActionItem } from './interface';

const enums:Recordable<'stop'|'start'|'del'|'add'> = {
    add: '新增',
    stop: '停用',
    start: '启用',
    del: '删除'
};
const {createMessage} = useMessage();
const props = defineProps({
    api: {
        type: Object as PropType<Record<'stop'|'start'|'del', Fn>>,
        default: () => {}
    },
    params: {
        type: Object as PropType<Record<string, any>>,
        default: () => {}
    }
});
const emit = defineEmits(['ok', 'open']);
const actions: ActionItem[] = (Object.keys(enums) as ('stop'|'start'|'del'|'add')[]).map((key): ActionItem => {
    const _baseAction: ActionItem = {
        label: enums[key],
        size: 'small'
    };
    if (key === 'add') {
        return {
            ..._baseAction,
            onClick: () => {
                emit('open');
            }
        };
    } else {
        return {
            ..._baseAction,
            popConfirm: {
                title: `是否确认${enums[key]}以选择项`,
                confirm: async() => {
                    const _res = await props.api[key](props.params);
                    if (_res.code === 200) {
                        emit('ok');
                        createMessage.success(`${enums[key]}成功`);
                    }
                }
            }
        };
    }
});
const getActions = computed(():ActionItem[] => {
    return (toRaw(actions) || []);
});
const getProps = {
    actions: getActions.value
};

</script>
<style lang='scss' scoped>
.m-b-10 {
    margin-bottom: 10px;
}
</style>
