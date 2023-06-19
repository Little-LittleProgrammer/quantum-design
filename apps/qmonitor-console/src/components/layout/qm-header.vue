<!--  -->
<template>
    <header class="qm-header">
        <a :href="initMenu" class="qm-header-logo">
            <img src="@/assets/images/logo.png" />
            <span class="s-name" v-if="systemName != ''">{{ systemName }} </span>
        </a>
        <span class="qm-header-environment">
            &bull;
            <em> {{ environmentData.env == '1' ? '正式' : '测试' }}</em>
        </span>
        <div class="qm-header-tabs">
            <a-menu mode="horizontal" v-model:selectedKeys="selectedKeysAgent">
                <a-menu-item v-for="item in menuData" :key="item.id">
                    <a
                        :href="item.path"
                        target="_blank"
                        @click.stop="jump_page(item, $event)"
                    >{{ item.auth_name }}</a>
                </a-menu-item>
            </a-menu>
        </div>
        <div class="qm-header-function">
            <slot name="header-function"></slot>
        </div>
    </header>
</template>

<script lang='ts' setup>
import { useGo } from '@q-front-npm/hooks/vue';
import { onMounted, PropType, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useSysStore } from '@/store/modules/systemManage';
import { propTypes } from '@q-front-npm/types/vue/types';
import type { IMenuData } from '@q-front-npm/types/vue/router';

const props = defineProps({
    menuData: { // 导航数据
        type: Array as PropType<IMenuData[]>,
        required: true,
        default: () => {
            const _arr: IMenuData[] = [];
            return _arr;
        }
    },
    environmentData: { // 环境
        type: Object,
        default: () => {
            return {
                env: '', // 0:测试环境 1:正式环境
                title: ''
            };
        }
    },
    systemName: propTypes.string.def(''), // 系统名称,
    initMenu: propTypes.string.def('') // 初始页面
});
const store = useSysStore();
const route = useRoute();
const go = useGo();
const jump_page = (item: IMenuData, event: Event) => {
    if (item.path && !(item.path.includes('http://') || item.path.includes('https://') || item.path.match(/^\/\//) != null)) {
        if (item.children != undefined) {
            store.asideMenuData = item.children;
        } else { // 无二级导航时 清空二级导航数据
            store.asideMenuData = [];
        }
        event.preventDefault();
        if (item.children != undefined && item.children.length > 0) {
            if (item.children[0].path && (item.children[0].path.includes('http://') || item.children[0].path.includes('https://') || item.children[0].path.match(/^\/\//) != null)) {
                go({
                    path: item.path
                });
            } else {
                if (item.children[0].children != undefined && item.children[0].children.length > 0) {
                    go({
                        path: item.children[0].children[0].path!
                    });
                } else {
                    go({
                        path: item.children[0].path!
                    });
                }
            }
        } else {
            go({
                path: item.path
            });
        }
    }
};
const selectedKeysAgent = computed(() => {
    const _routePath = route.path;
    const _selectedKey: number[] = [];
    props.menuData.some((n) => {
        if (n.path && _routePath.includes(n.path)) {
            n.id && _selectedKey.push(n.id);
            if (n.children != undefined) {
                store.asideMenuData = n.children;
            } else {
                store.asideMenuData = [];
            }
            return true;
        }
    });
    return _selectedKey;
});
onMounted(() => {
});
</script>
<style lang="scss" >
.qm-header {
    padding: 0 $space;
    display: flex;
    background: $header-bg;
    &-logo {
        padding: $space 0;
        height: $header-height;
        box-sizing: border-box;
        display: block;
        img {
            display: inline-block;
            height: 28px;
            width: 28px;
            vertical-align: top;
        }
        .s-name {
            font-size: $header-system-size;
            color: $header-system-color;
            padding-left: 8px;
            display: inline-block;
            font-weight: bold;
            line-height: $header-height - $space * 2;
            height: $header-height - $space * 2;
        }
    }
    &-environment {
        font-size: $header-environment-size;
        color: $header-environment-color;
        display: block;
        font-weight: bold;
        line-height: $header-height;
        white-space: nowrap;
        padding-left: div($space, 2);
        em {
            padding-left: div($space, 2);
        }
    }
    &-tabs {
        flex: 1;
        width: 100%;
        display: block;
        text-align: left;
        overflow: hidden;
        padding-left: $space * 2;
        // overflow-x: scroll;
        .ant-menu {
            background: none;
            border: 0 none;
        }
        .ant-menu-item,
        .ant-menu-submenu {
            border: 0 none;
            color: $header-tabs-color;
            vertical-align: top;
            line-height: $header-height;
            height: $header-height;
            overflow: hidden;
            a {
                display: block;
                color: $header-tabs-color;
            }
            &:hover,
            &.ant-menu-item-active,
            &.ant-menu-item-selected,
            &.ant-menu-submenu-active,
            &.ant-menu-submenu-selected {
                border: 0 none;
            }
            &:hover,
            &.ant-menu-item-active,
            &.ant-menu-submenu-active {
                background: $header-tabs-hover-bg;
                a {
                    color: $header-tabs-hover-color;
                }
            }
            &.ant-menu-item-selected,
            &.ant-menu-submenu-selected {
                background: $header-tabs-cur-bg;
                font-weight: bold;
                a {
                    color: $header-tabs-cur-color;
                }
            }
        }
    }
    &-function {
        padding-left: $space * 2;
        display: block;
        @include flex-center();
        .ant-btn,
        a {
            margin-left: $space;
            display: inline-block;
            &:first-child {
                margin-left: 0;
            }
        }
        a {
            line-height: 32px;
        }
    }
}
</style>
