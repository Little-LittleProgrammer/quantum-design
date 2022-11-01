<!--  -->
<template>
    <a-input disabled :style="{width}" placeholder="点击选择图标" v-model:value="data.currentSelect">
        <template #addonAfter>
            <a-popover placement="bottomRight" trigger="click" v-model="data.visible" overlayClassName="icon-popover">
                <template #title>
                    <div class="qm-flex-between">
                        <a-input placeholder="搜索图标" @change="throttle_event_search" allowClear></a-input>
                    </div>
                </template>
                <template #content>
                    <div v-if="getPaginationList.length" class="icon-context">
                        <div class="icon-table">
                            <ul class="table-row">
                                <li
                                    v-for="icon in getPaginationList"
                                    class="table-element"
                                    :key="icon"
                                    :class="data.currentSelect === icon ? 'selected': ''"
                                    @click="handle_click(icon)"
                                    :title="icon"
                                >
                                    <Icon :type="icon"/>
                                </li>
                            </ul>
                        </div>

                        <div class="icon-pagination" v-if="getTotal >= pageSize">
                            <a-pagination
                                size="small"
                                :pageSize="pageSize"
                                :showSizeChanger="false"
                                :total="getTotal"
                                @change="handle_page_change"
                            />
                        </div>
                    </div>
                    <template v-else>
                        <Empty></Empty>
                    </template>
                </template>
                <Icon :type="data.currentSelect || 'AppstoreOutlined'" class="qm-cursor-style-point"></Icon>
            </a-popover>
        </template>
    </a-input>
</template>

<script lang="ts">

export default {
    name: 'QIconPicker'
};
</script>

<script lang='ts' setup>
import { reactive, onMounted, watch, watchEffect, ref} from 'vue';
import { icons } from '../data/icons-data';
import { throttle_event } from '@qmfront/utils';
import { usePagination } from '@qmfront/hooks/vue';
import {Icon} from './icon';
import {Empty} from 'ant-design-vue';
import { iconPickProps } from './types';
import {Input as AInput, Pagination as APagination, Popover as APopover} from 'ant-design-vue';
import './style/index.scss';
interface DataProps {
    currentSelect: string; // 当前选择的图标
    visible: boolean; // 图标选择可视
}
const props = defineProps(iconPickProps);

const emit = defineEmits(['change', 'update:value']);
const data: DataProps = reactive({
    currentSelect: '',
    visible: false
});
const currentList = ref(icons);

const { getPaginationList, getTotal, setCurrentPage } = usePagination(
    currentList,
    props.pageSize
);

function throttle_event_search(e:ChangeEvent) {
    throttle_event(handle_search_change, {
        time: 100,
        args: [e]
    });
}

function handle_page_change(page:number) {
    setCurrentPage(page);
}

watchEffect(() => {
    data.currentSelect = props.value;
});

watch(
    () => data.currentSelect,
    (val:string) => {
        emit('update:value', val);
        return emit('change', val);
    }
);

function handle_search_change(e: ChangeEvent) {
    const value = e.target.value;
    if (!value) {
        setCurrentPage(1);
        currentList.value = icons;
        return;
    }
    currentList.value = icons.filter((item) => {
        return item.includes(value) || item.toLowerCase().includes(value);
    });
}

function handle_click(icon: string) {
    if (data.currentSelect === icon) {
        data.currentSelect = '';
    } else {
        data.currentSelect = icon;
    }
}
onMounted(() => {
});

</script>
