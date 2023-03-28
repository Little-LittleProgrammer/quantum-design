<!--  -->
<template>
    <q-button-group v-bind="getProps" ></q-button-group>
</template>

<script lang='ts' setup>
import { computed, toRaw, PropType} from 'vue';
import QButtonGroup from './basic-button-group.vue';
import { useMessage } from '@wuefront/hooks/vue';
import { ActionItem } from './interface';
import { isString } from '@wuefront/utils';
import { propTypes } from '@wuefront/types/vue/types';

const enums:Recordable<'stop'|'start'|'del'|'add'> = {
    add: '新增',
    stop: '停用',
    start: '启用',
    del: '删除'
};
const {createMessage} = useMessage();
const props = defineProps({
    api: {
        type: Object as PropType<Partial<Record<'stop'|'start'|'del', Fn>>>,
        default: () => {}
    },
    params: {
        type: Object as PropType<Record<string, any>>,
        default: () => {}
    },
    customAfterApi: propTypes.bool.def(false)
});
const emit = defineEmits(['ok', 'open']);
const actions: ActionItem[] = (Object.keys(enums) as ('stop'|'start'|'del'|'add')[]).filter(key => {
    return [...Object.keys(props.api), 'add'].includes(key);
}).map((key): ActionItem => {
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
                title: `是否确认${enums[key]}已选择项`,
                confirm: async() => {
                    const _values = Object.values(props.params).flat();
                    const _req:any = {};
                    if (_values.length > 0) {
                        const _keys = Object.keys(props.params);
                        Object.values(props.params).forEach((values, index) => {
                            values.forEach((value: number | string) => {
                                if (isString(value) && value.includes('-')) {
                                    const _cache = value.split('-');
                                    if (_req[_keys[index]]) {
                                        _req[_keys[index]].push(_cache[0]);
                                    } else {
                                        _req[_keys[index]] = [_cache[0]];
                                    }
                                    if (_cache[1] === '2' && key !== 'del') {
                                        createMessage.error(`${_cache[0]}id已失效, 无法操作`);
                                        throw new Error('id失效');
                                    }
                                } else {
                                    if (_req[_keys[index]]) {
                                        _req[_keys[index]].push(value);
                                    } else {
                                        _req[_keys[index]] = [value];
                                    }
                                }
                            });
                        });
                        const _res = await props.api[key]!(_req);
                        if (_res.code === 200) {
                            emit('ok', _res.data);
                            if (!props.customAfterApi) {
                                createMessage.success(`${enums[key]}成功`);
                            }
                        }
                    } else {
                        createMessage.info(`请选择后再点击`);
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
