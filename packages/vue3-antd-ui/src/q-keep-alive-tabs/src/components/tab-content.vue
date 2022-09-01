<!--  -->
<template>
    <q-dropdown class="tabs-drop-down" :dropMenuList="getDropDownList" :trigger="getTrigger" @menuEvent="handle_menu_event">
        <div class="tabs-drop-down-info" @contextmenu="handle_context" v-if="getIsTabs">
            <span class="ml-1">{{ getTitle }}</span>
        </div>
        <span class="tabs-drop-down-extra-quick" v-else @click="handle_context">
            <q-icon type="DownOutlined" />
        </span>
    </q-dropdown>
</template>

<script lang='ts'>
import { defineComponent, reactive, toRefs, onMounted, PropType, computed, unref} from 'vue';
import { RouteLocationNormalized, useRouter } from 'vue-router';
import type { DropMenu } from '../../../q-dropdown';

import {QDropdown} from '../../../q-dropdown';
import { TableActionEnum, useTabs } from '../hooks/use-tabs';
import { QIcon } from '../../../q-icon';
import { useTabsStore } from '../hooks/use-tabs-store';
import { Nullable } from '@qmfront/shared/types/global';
import { propTypes } from '../../../utils/types';
interface DataProps {
    current: Nullable<RouteLocationNormalized>,
    currentIndex: number
}
export default defineComponent({
    name: 'TabContent',
    props: {
        tabItem: {
            type: Object as PropType<RouteLocationNormalized>,
            default: null
        },
        isExtra: Boolean,
        initPath: propTypes.string.def('home')
    },
    components: {QDropdown, QIcon},
    setup(props) {
        const tabsStore = useTabsStore();
        const { currentRoute } = useRouter();
        const { refreshPage, closeAll, close, closeLeft, closeOther, closeRight } = useTabs();
        const data: DataProps = reactive({
            current: null,
            currentIndex: 0
        });
        const getTitle = computed(() => {
            const { tabItem: { meta } = {} } = props;
            return meta && meta.title as string;
        });
        // 是否是tab (tab , 右侧下拉菜单按键)
        const getIsTabs = computed(() => !props.isExtra);
        // 触发方式
        const getTrigger = computed((): ('contextmenu' | 'click' | 'hover')[] =>
            unref(getIsTabs) ? ['contextmenu'] : ['click']
        );
        // 获取目标tab
        const getTargetTab = computed((): RouteLocationNormalized => {
            return unref(getIsTabs) ? props.tabItem : unref(currentRoute);
        });
        const getDropDownList = computed(() => {
            if (!unref(getTargetTab)) {
                return;
            }
            const { path } = unref(currentRoute);

            const curItem = data.current;
            const isCurItem = curItem ? curItem.path === path : false;

            // 重新刷新
            const index = data.currentIndex;
            const refreshDisabled = !isCurItem;
            // 关闭左侧
            const closeLeftDisabled = index === 0 || !isCurItem;
            const disabled = tabsStore.getTabList.length === 1;
            // 关闭右侧
            const closeRightDisabled = !isCurItem || (index === tabsStore.getTabList.length - 1 && tabsStore.getLastDragEndIndex >= 0);
            const dropMenuList: DropMenu[] = [
                {
                    icon: 'RedoOutlined',
                    event: TableActionEnum.REFRESH,
                    text: '重新加载',
                    disabled: refreshDisabled
                },
                {
                    icon: 'CloseOutlined',
                    event: TableActionEnum.CLOSE_CURRENT,
                    text: '关闭标签页',
                    disabled: !!(props.initPath == path) || disabled,
                    divider: true
                },
                {
                    icon: 'VerticalRightOutlined',
                    event: TableActionEnum.CLOSE_LEFT,
                    text: '关闭左侧标签页',
                    disabled: closeLeftDisabled,
                    divider: false
                },
                {
                    icon: 'VerticalLeftOutlined',
                    event: TableActionEnum.CLOSE_RIGHT,
                    text: '关闭右侧标签页',
                    disabled: closeRightDisabled,
                    divider: true
                },
                {
                    icon: 'PicCenterOutlined',
                    event: TableActionEnum.CLOSE_OTHER,
                    text: '关闭其他标签页',
                    disabled: disabled || !isCurItem
                },
                {
                    icon: 'DeleteOutlined',
                    event: TableActionEnum.CLOSE_ALL,
                    text: '关闭全部标签页',
                    disabled: disabled
                }
            ];
            return dropMenuList;
        });
        function handle_context_menu(tabItem: RouteLocationNormalized) {
            return (e: Event) => {
                if (!tabItem) {
                    return;
                }
                e?.preventDefault();
                const index = tabsStore.getTabList.findIndex((tab) => tab.path === tabItem.path);
                data.current = tabItem;
                data.currentIndex = index;
            };
        }
        // 右键点击事件
        function handle_menu_event(menu: DropMenu): void {
            const { event } = menu;
            switch (event) {
                case TableActionEnum.REFRESH:
                    // refresh page
                    refreshPage();
                    break;
                    // Close current
                case TableActionEnum.CLOSE_CURRENT:
                    close(props.tabItem);
                    break;
                    // Close left
                case TableActionEnum.CLOSE_LEFT:
                    closeLeft();
                    break;
                    // Close right
                case TableActionEnum.CLOSE_RIGHT:
                    closeRight();
                    break;
                    // Close other
                case TableActionEnum.CLOSE_OTHER:
                    closeOther();
                    break;
                    // Close all
                case TableActionEnum.CLOSE_ALL:
                    closeAll();
                    break;
            }
        }
        function handle_context(e: any) {
            props.tabItem && handle_context_menu(props.tabItem)(e);
        }
        onMounted(() => {
        });
        const refData = toRefs(data);
        return {
            ...refData,
            getTrigger,
            getIsTabs,
            tabsStore,
            handle_menu_event,
            handle_context,
            getDropDownList,
            getTitle
        };
    }
});
</script>
<style lang='scss' scoped>
$multiple-height: 30px;
.ml-1 {
    margin-left: 1px;
}
.tabs-drop-down {
    &-extra-quick {
        display: inline-block;
        width: 36px;
        height: $multiple-height;
        line-height: $multiple-height;
        @include text-color(text-color-secondary);
        text-align: center;
        cursor: pointer;
        border-left: 1px solid;
        @include border-color(border-color, 'left');

        &:hover {
            @include text-color(text-color);
        }
    }

    &-info {
        display: inline-block;
        width: 100%;
        height: $multiple-height - 2;
        padding-left: 0;
        margin-left: -10px;
        font-size: 12px;
        cursor: pointer;
        user-select: none;
    }
}
</style>
