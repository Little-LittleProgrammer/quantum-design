<!-- \ -->
<template>
    <a-layout-sider
        theme="light"
        class="qm-aside"
        ref="refAsideMenu"
        :class="{ 'qm-aside-hide': !getArrowBtnShow || (getArrowBtnShow && !data.isShow)  }"
    >
        <a-menu
            class="qm-aside-tabs"
            mode="inline"
            v-model:openKeys="data.openKeys"
            :selectedKeys="data.selectedKeys"
            :inlineIndent="16"
            @click="jump_page"
        >
            <template v-for="second_level in props.menuData">
                <template v-if="second_level.children == undefined">
                    <a-menu-item :key="second_level.id" class="qm-aside-title">
                        <template #icon>
                            <q-antd-icon
                                :type="second_level.icon as 'default'"
                                v-if="second_level.icon != undefined && second_level.icon != ''"
                            ></q-antd-icon>
                        </template>
                        {{ second_level.auth_name }}
                    </a-menu-item>
                </template>
                <template v-else>
                    <a-sub-menu :key="second_level.id">
                        <template #icon>
                            <q-antd-icon
                                :type="second_level.icon as 'default'"
                                v-if="second_level.icon != undefined && second_level.icon != ''"
                            ></q-antd-icon>
                        </template>
                        <template #title>
                            <span class="qm-aside-title">{{ second_level.auth_name }}</span>
                        </template>
                        <template v-for="third_level in second_level.children" >
                            <template v-if="!!third_level.children">
                                <a-sub-menu :key="third_level.id">
                                    <template #icon>
                                        <q-antd-icon
                                            :type="third_level.icon as 'default'"
                                            v-if="third_level.icon != undefined && third_level.icon != ''"
                                        ></q-antd-icon>
                                    </template>
                                    <template #title>
                                        <span class="qm-aside-title-sub">{{ third_level.auth_name }}</span>
                                    </template>
                                    <a-menu-item class="qm-aside-link" :key="four_level.id" v-for="four_level in third_level.children">
                                        <template #icon>
                                            <q-antd-icon
                                                :type="four_level.icon as 'default'"
                                                v-if="four_level.icon != undefined && four_level.icon != ''"
                                            ></q-antd-icon>
                                        </template>
                                        {{ four_level.auth_name }}
                                    </a-menu-item>
                                </a-sub-menu>
                            </template>
                            <template v-else>
                                <a-menu-item class="qm-aside-link" :key="third_level.id">
                                    <template #icon>
                                        <q-antd-icon
                                            :type="third_level.icon as 'default'"
                                            v-if="third_level.icon != undefined && third_level.icon != ''"
                                        ></q-antd-icon>
                                    </template>
                                    {{ third_level.auth_name }}
                                </a-menu-item>
                            </template>
                        </template>
                    </a-sub-menu>
                </template>
            </template>
        </a-menu>
        <div class="qm-aside-arrow-btn" :class="getClass" @click="show_hide_aside">
            <template v-if="getArrowBtnShow">
                <q-antd-icon :type="getArrow[0] as 'default'" v-if="data.isShow" class="arrow-btn" />
                <q-antd-icon :type="getArrow[1] as 'default'" v-else class="arrow-btn" />
            </template>
        </div>
    </a-layout-sider>
</template>

<script lang='ts'>
import { Layout, Menu as AMenu } from 'ant-design-vue';
import { MenuInfo } from 'ant-design-vue/lib/menu/src/interface';
import { useSysStore } from '@/store/modules/systemManage';
import { useProjectSetting, QAntdIcon } from '@quantum-design/vue3-antd-pc-ui';
import type { IMenuData } from '@quantum-design/types/vue/router';
interface DataProps {
    openKeys: number[];
    selectedKeys: number[];
    init: boolean;
    isShow: boolean;
}

export default defineComponent({
    name: 'QmAside',
    components: {'a-layout-sider': Layout.Sider, },
});
</script>

<script lang='ts' setup>
import { defineComponent, reactive, type PropType, computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useGo } from '@quantum-design/hooks/vue/use-page';

const props = defineProps({
    menuData: {
        type: Array as PropType<IMenuData[]>,
        required: true,
        default: () => {
            return [];
        },
    },
});

const go = useGo();
const route = useRoute();
const sysStore = useSysStore();
const {getShowCacheTabsSetting, getBreadCrumb, getAsideRepeatClick, } = useProjectSetting();
const refAsideMenu = ref<Nullable<typeof Layout>>(null);
const data: DataProps = reactive({
    openKeys: [],
    selectedKeys: [],
    init: true, //  初始化
    isShow: true,
});
const getClass = computed(() => {
    if (getShowCacheTabsSetting.value || getBreadCrumb.value) {
        return 'qm-aside-arrow-btn-has';
    }
    return 'qm-aside-arrow-btn-no-has';
});
const getArrow = computed(() => {
    if (getShowCacheTabsSetting.value || getBreadCrumb.value) {
        return ['MenuFoldOutlined', 'MenuUnfoldOutlined'];
    }
    return ['CaretLeftOutlined', 'CaretRightOutlined'];
});
const getArrowBtnShow = computed(() => {
    return !(props.menuData.length === 0);
});

watch(route, (val) => {
    console.log(sysStore.getFormatPathRouteList);
    if (sysStore.getFormatPathRouteList[val.path]?.id) {
        data.selectedKeys = [sysStore.getFormatPathRouteList[val.path]?.id as number];
    } else {
        // 找不到 undefined，寻找父亲
        data.selectedKeys = [find_parent(val.path)];
    }
});

function find_parent(path: string): number {
    if (!path) {
        return -1;
    }
    if (sysStore.getFormatPathRouteList[path]?.id) {
        return sysStore.getFormatPathRouteList[path].id!;
    }
    return find_parent(path.split('/').slice(0, -1).join('/'));
}
watch(() => props.menuData, (val) => {
    // 延时处理， 等待router更新完成
    setTimeout(() => {
        const _routePath = route.path;
        const _selectedKey: number[] = [];
        const _defaultOpenKeys: number[] = [];

        // 处理 _selectedKey, _defaultOpenKeys
        function select_key(list: IMenuData[]) {
            list.forEach(e => {
                if (e.children) {
                    _defaultOpenKeys.push(e.id!);
                    select_key(e.children);
                } else {
                    if (_routePath.includes(e.path!)) {
                        _selectedKey.push(e.id!);
                    }
                }
            });
        }

        if (val.length == 0) {
            data.isShow = false;
        } else {
            data.isShow = true;
            select_key(val);
            data.openKeys = _defaultOpenKeys;
            data.selectedKeys = _selectedKey;
            setTimeout(() => {
                if (refAsideMenu.value) {
                    // 选中导航超出自动滚动到中间位置
                    const _height = refAsideMenu.value.$el.offsetHeight;
                    const $selectedMenu: NodeListOf<HTMLElement> = refAsideMenu.value.$el.querySelectorAll(
                        '.ant-menu-item-selected'
                    );
                    if ($selectedMenu.length > 0) {
                        const _topNum = $selectedMenu[0].offsetTop;
                        const _scrollTopNum = refAsideMenu.value.$el.scrollTop;
                        console.log(refAsideMenu.value);
                        if (_topNum >= _height + _scrollTopNum - 60) {
                            refAsideMenu.value.$el.children[0].scrollTop = _topNum - 200;
                        // (refAsideMenu.value as unknown as HTMLElement)?.c;
                        }
                    }
                }
            }, 500);
        }
    }, 300);
});
const jump_page = (item: MenuInfo) => {
    const _path = sysStore.getFormatIdRouteList[item.key as unknown as number].path || '/';
    const _query = getAsideRepeatClick.value ? {
        t: Date.now(),
    } : {};
    // 外链可以直接跳转
    if (
        !(
            _path.includes('http://') ||
            _path.includes('https://') ||
            _path.match(/^\/\//) != null
        )
    ) {
        go({
            path: _path,
            query: _query,
        });
    }
};
const show_hide_aside = () => {
    if (props.menuData.length === 0) {
        data.isShow = false;
    } else {
        data.isShow = !data.isShow;
    }
};

</script>
<style lang='scss'>
.qm-aside {
    @include bg-color(aside-bg);
    position: relative;
    width: $aside-width !important;
    min-width: $aside-width !important;
    max-width: $aside-width !important;
    transition: all .5s ease 0s;
    &:before {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        width: 0;
        height: 100%;
        z-index: 5;
        overflow: hidden;
        border-right: 1px solid $aside-right-border-color;
        @include border-color(border-color, right);
    }
    &-tabs {
        position: relative;
        z-index: 10;
        background: none;
        border: 0 none;
    }
    &-hide {
        width: 0 !important;
        min-width: 0 !important;
        max-width: 0 !important;
        .qm-aside-tabs {
            display: none;
        }
        &-arrow-btn {
            &:before {
                transform: rotateZ(180deg) translate(-50%, -50%);
            }
        }
    }
    &-arrow-btn {
        @include bg-color(aside-bg);
        cursor: pointer;
        position: absolute;
        border-left: 0 none;
        z-index: 5;
        .arrow-btn {
            @include text-color(text-color);
        }
    }
    &-arrow-btn-no-has {
        right: -10px;
        width: 11px;
        height: 100px;
        border-top-right-radius: 20px;
        border-bottom-right-radius: 20px;
        transform: translate(0, -50%);
        top: 50%;
        border: 1px solid $aside-right-border-color;
        @include border-color(border-color);
        border-left: transparent;
        .anticon {
            position: absolute;
            top: 50%;
            right: -1px;
            margin-top: -3px;
            font-size: 11px;
        }
        // &:before {
        //     content: '';

        //     border-top: 4px solid transparent;
        //     border-right: 4px solid #bbb;
        //     border-bottom: 4px solid transparent;
        //     width: 0;
        //     height: 0;

        //     /*transition: transform 0.3s linear;*/
        // }
        // &:hover {
        //     &:before {
        //         border-right: 4px solid #333;
        //     }
        // }
    }
    &-arrow-btn-has {
        right: -19px;
        width: 21px;
        height: 40px;
        @include border-color(border-color);
        border-left: 0 none;
        top: 0px;
        display: flex;
        align-items: center;
        z-index: 1000;
        .anticon {
            font-size: 16px;
            margin-left: 4px
        }
    }
    &-title {
        font-weight: bold;
        border-radius: 0;
        display: block;
        line-height: $aside-height;
        height: $aside-height;
        font-size: $aside-tabs-size;
        &-sub {
            @include text-color(text-color);
        }
    }
    &-link {
        display: block;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    .ant-menu {
        background: none;
        &-submenu {
            &-title {
                margin: 0;
            }
            &-selected {
                color: $primary-color !important;
            }
        }
        .ant-menu-item {
            line-height: $aside-height;
            height: $aside-height;
            margin: 0;
            font-size: $aside-tabs-size;
            color: $aside-tabs-color;
            @include text-color(text-color);
            box-sizing: border-box;
            &:after {
                display: none;
            }
            &:hover,
            &.ant-menu-item-selected {
                border: 0 none;
            }
            &:not(.ant-menu-item-selected) {
                &:hover{
                    background: $aside-tabs-hover-bg;
                    span {
                        color: $aside-tabs-hover-color;
                    }
                }
            }
            &.ant-menu-item-selected {
                background: $aside-tabs-cur-bg;
                font-weight: bold;
                color: $aside-tabs-cur-color;
                .qm-aside-title {
                    color: $aside-tabs-cur-color;
                }
            }
        }
    }
    .ant-layout-sider-children {
        overflow-y: auto;
        overflow-x: hidden;
        scroll-behavior: smooth;
    }
}
</style>
