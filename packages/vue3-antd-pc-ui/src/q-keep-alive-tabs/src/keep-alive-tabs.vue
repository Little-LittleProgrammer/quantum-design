<!--  -->
<template>
    <div class="q-keep-alive-tabs" id="q-keep-alive-tabs">
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
                <tab-content isExtra :tabItem="$route" v-if="showQuick" />
            </template>
        </a-tabs>
    </div>
</template>

<script lang='ts'>
import { defineComponent, reactive, toRefs, watch, unref, computed, getCurrentInstance, onMounted} from 'vue';
import { useGo } from '@quantum-design/hooks/vue';
import TabContent from './components/tab-content.vue';
import { init_affix_tabs } from './hooks/use-affix-tabs';
import { useTabsDrag } from './hooks/use-sortable';
import type { Router } from 'vue-router';
import { ignore_t, useTabsStore } from './hooks/use-tabs-store';
import { tabsProps } from './props';
import { create_tab } from './hooks/use-router';
import { Tabs as ATabs, TabPane as ATabPane } from 'ant-design-vue';
import './style/keep-alive-tabs.scss';

export default defineComponent({
    name: 'QAntdKeepAliveTabs',
    components: {TabContent, ATabs, ATabPane},
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
        watch(() => store.cacheTabList, (val) => {
            emit('cacheList', val);
        }, { immediate: true });
        watch(router.currentRoute, (val) => {
            if (val) {
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
