<!--  -->
<template>
    <a-modal :visible="visible" :width="600" :closable="false" :footer="null" @cancel="commit_cancel">
        <a-input class="search-input" v-model:value="data.searchText" size="large" allow-clear placeholder="搜索" @change="search_route">
            <template #prefix>
                <q-icon type="SearchOutlined"></q-icon>
            </template>
        </a-input>
        <q-loading :loading="data.loading">
            <template v-if="data.formList.length>0">
                <a-card size="small" class="mt qm-card" v-for="item in data.formList" :key="item.id">
                    <a-button type="link" @click="open_page(item)" >{{item.title}}</a-button>
                </a-card>
            </template>
            <div class="mt" v-else>
                <a-empty />
            </div>
        </q-loading>
    </a-modal>
</template>
<script lang='ts' setup>
import { reactive, onBeforeMount, onMounted, watch, nextTick, PropType} from 'vue';
import {Icon as QIcon} from '@/q-icon/src/icon';
import { find_search_route, ICacheObj } from './search';
import { js_utils_throttle_event } from '@quantum-design/utils';
import { useRouter } from 'vue-router';
import { QLoading } from '@quantum-design/vue3-pc-ui';
import type { IMenuData } from '@quantum-design/types/vue/router';

defineOptions({
    name: 'QAntdSearch'
});

interface IData {
    searchText: string,
    formList: ICacheObj[],
    loading: boolean
}
const props = defineProps({
    visible: {
        type: Boolean
    },
    mainMenuData: {
        type: Array as PropType<IMenuData[]>,
        default: () => []
    }
});
const emit = defineEmits(['cancel']);

const data:IData = reactive({
    searchText: '',
    formList: [],
    loading: false
});
const router = useRouter();
const input_focus = () => {
    const _el = document.querySelector('.search-input input') as Nullable<HTMLInputElement>;
    if (_el) {
        _el?.focus();
    }
};
watch(() => props.visible, (val) => {
    if (val) {
        nextTick(() => {
            input_focus();
        });
    }
});
onBeforeMount(() => {
});
onMounted(() => {
});
const commit_cancel = () => {
    emit('cancel');
    data.searchText = '';
    data.formList = [];
};
const search_route = () => {
    data.loading = true;
    js_utils_throttle_event(find_search_route, {time: 800, args: [data.searchText]})?.then(res => {
        data.loading = false;
        data.formList = res as ICacheObj[];
    });
};
const open_page = (item:ICacheObj) => {
    router.push({
        path: item.path
    });
    commit_cancel();
};
</script>
