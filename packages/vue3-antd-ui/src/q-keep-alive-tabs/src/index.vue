<!--  -->
<template>
    <div class="qm-keep-alive-tabs">
        <a-tabs
            type="editable-card"
            :animated="false"
            :hideAdd="true"
            size="small"
            :tabBarGutter="3"
            :activeKey="activeKey"
            @change="handle_change"
            @edit="handle_edit"
        >
            <template v-for="item in store.getTabList" :key="item.query ? item.fullPath : item.path">
                <a-tab-pane :closable="!(item.fullPath == initPath)">
                    <template #tab>
                        <tab-content :tabItem="item" />
                    </template>
                </a-tab-pane>
            </template>
            <template #rightExtra v-if="showQuick">
                <slot name="rightExtra"></slot>
                <TabContent isExtra :tabItem="$route" v-if="showQuick" />
            </template>
        </a-tabs>
    </div>
</template>

<script lang='ts'>
import { defineComponent, reactive, toRefs, watch, unref, computed, getCurrentInstance, onMounted} from 'vue';
import { useGo } from '@qmfront/hooks/vue';
import TabContent from './components/tab-content.vue';
import { init_affix_tabs } from './hooks/use-affix-tabs';
import { useTabsDrag } from './hooks/use-sortable';
import { Router } from 'vue-router';
import { ignore_t, useTabsStore } from './hooks/use-tabs-store';
import { tabsProps } from './props';
import { create_tab } from './hooks/use-router';
export default defineComponent({
    name: 'KeepAliveTabs',
    components: {TabContent},
    props: tabsProps,
    emits: ['cacheList', 'register'],
    setup(props, {emit}) {
        const store = useTabsStore();
        const data = reactive({
            activeKey: ''
        });
        const affixTextList = init_affix_tabs(props.initPath);
        props.canDrag && useTabsDrag(affixTextList);
        const instance = getCurrentInstance()!;
        const router = instance?.appContext.config.globalProperties.$router as Router;
        create_tab(router);
        const unClose = computed(() => unref(store.getTabList).length === 1);
        const go = useGo();
        watch(router.currentRoute, (val) => {
            if (val) {
                emit('cacheList', store.cacheTabList);
                if (val.query) {
                    data.activeKey = ignore_t(val.fullPath) as string;
                } else {
                    data.activeKey = val.path as string;
                }
            }
        }, { immediate: true });
        function handle_change(activeKey: any) {
            data.activeKey = activeKey;

            go(activeKey, false);
        }

        // Close the current tab
        function handle_edit(targetKey: string) {
        // Added operation to hide, currently only use delete operation
            if (unref(unClose)) {
                return;
            }
            store.close_tab_by_key({key: targetKey, router});
        }
        watch(() => props.initPath, (val) => {
            if (val) {
                store.initPath = val;
            }
        }, {immediate: true});
        const refData = toRefs(data);
        onMounted(() => {
            emit('register', {
                refreshPage: store.refresh_page
            });
        });
        return {
            ...refData,
            store,
            handle_edit,
            handle_change
        };
    }
});
</script>
<style lang='scss'>
$multiple-height: 30px;
.qm-keep-alive-tabs {
    .ant-tabs-small {
        height: $multiple-height;
    }
    .ant-tabs.ant-tabs-card {
        .ant-tabs-nav {
            height: $multiple-height;
            &::before {
                border: 0;
            }
            .ant-tabs-nav-more {
                display: flex;
            }
        }
        .ant-tabs-card-bar {
            height: $multiple-height;
            border: 0;
            margin: 0;
            box-shadow: none;
        }
        .ant-tabs-nav-container {
            height: $multiple-height;
        }
        .ant-tabs-tab {
            height: $multiple-height - 2px;
            padding-right: 12px;
            line-height: $multiple-height - 2px;
            @include text-color(text-color);
            transition: none;
            border-radius: 3px;

            &:hover {
                .ant-tabs-close-x {
                    opacity: 1;
                }
            }

            .ant-tabs-close-x {
                width: 8px;
                height: 12px;
                font-size: 12px;
                color: inherit;
                opacity: 0;
                transition: none;

                &:hover {
                    svg {
                        width: 0.8em !important;
                    }
                }
            }

            > div {
                display: flex;
                justify-content: center;
                align-items: center;
            }

            svg {
                @include text-color(text-color);
            }
        }
        .ant-tabs-tab:not(.ant-tabs-tab-active) {
            &:hover {
                color: $primary-color;
            }
        }
        .ant-tabs-tab-active {
            position: relative;
            padding-left: 18px;
            background: $primary-color;
            border: 0;
            transition: none;
            span {
                color: #fff !important;
            }
            .ant-tabs-close-x {
                opacity: 1;
            }

            svg {
                width: 0.7em;
                fill: #fff;
            }
        }
        .ant-tabs-tab:not(.ant-tabs-tab-active) {
            .anticon-close {
                font-size: 12px;

                svg {
                    width: 0.6em;
                }
            }
        }
        .ant-tabs-extra-content {
            margin-top: 2px;
            line-height: $multiple-height !important;
        }
        .ant-dropdown-trigger {
            display: inline-flex;
        }

        &--hide-close {
            .ant-tabs-close-x {
                opacity: 0 !important;
            }
        }
    }
}
</style>
