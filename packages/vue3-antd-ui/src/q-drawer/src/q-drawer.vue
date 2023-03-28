<!--  -->
<template>
    <drawer class="q-drawer container drawer-container add-weight" v-bind="getBindValues" @close="on_close">
        <template #title v-if="!slots.title">
            <drawer-header :title="getMergeProps.title" :is-detail="isDetail" :show-detail-back="showDetailBack" @close="on_close">
                <template #titleToolbar>
                    <slot name="titleToolbar"></slot>
                </template>
            </drawer-header>
        </template>
        <template v-else #title>
            <slot name="title"></slot>
        </template>
        <q-loading :loading="getLoading" class="q-drawer-content js-drawer-content" :style="getScrollContentStyle">
            <slot></slot>
        </q-loading>
        <DrawerFooter v-bind="getProps" @close="on_close" @ok="handle_ok" :height="getFooterHeight">
            <template #[item]="data" v-for="item in Object.keys(slots)" >
                <slot :name="item" v-bind="data || {}"></slot>
            </template>
        </DrawerFooter>
    </drawer>
</template>

<script lang='ts' setup>
import { onMounted, computed, useAttrs, unref, ref, toRaw, getCurrentInstance, CSSProperties, nextTick, watch, useSlots} from 'vue';
import {Drawer} from 'ant-design-vue';
import {QLoading} from '@wuefront/vue3-ui';
import {basicProps} from './props';
import { deep_merge, isFunction, isNumber } from '@wuefront/utils';
import { DrawerInstance, DrawerProps } from './type';
import DrawerHeader from './components/drawer-header.vue';
import DrawerFooter from './components/drawer-footer.vue';
import './style/index.scss';

const visibleRef = ref(false);
const attrs = useAttrs();
const props = defineProps({...basicProps});
const slots = useSlots();
const emit = defineEmits(['register', 'visible-change', 'ok', 'close']);
const propsRef = ref<Partial<Nullable<DrawerProps>>>(null); // useDrawer

const drawerInstance: DrawerInstance = {
    setDrawerProps: set_drawer_props,
    emitVisible: undefined,
    events: {
        onClose: on_close
    }
};

const instance = getCurrentInstance(); // 父组件实例

instance && emit('register', drawerInstance, instance.uid);

const getMergeProps = computed((): DrawerProps => {
    return deep_merge(toRaw(props), unref(propsRef));
});
const getProps = computed(():DrawerProps => {
    const opt = {
        placement: 'right',
        ...unref(attrs),
        ...unref(getMergeProps),
        visible: unref(visibleRef)
    };
    opt.title = undefined;
    const { isDetail, width, wrapClassName, getContainer } = opt;
    if (isDetail) {
        if (!width) {
            opt.width = '100%';
        }
        const detailCls = `q-drawer-detail`;
        opt.class = wrapClassName ? `${wrapClassName} ${detailCls}` : detailCls;
        opt.closable = false;
        if (!getContainer) {
            opt.getContainer = `.layout-content`;
        }
    }
    return opt as DrawerProps;
});
const getBindValues = computed(() => {
    return { ...attrs, ...unref(getProps) };
});

// Custom implementation of the bottom button,
const getFooterHeight = computed(() => {
    const { footerHeight, showFooter } = unref(getProps);
    if (showFooter && footerHeight) {
        return isNumber(footerHeight)
            ? `${footerHeight}px`
            : `${footerHeight.replace('px', '')}px`;
    }
    return `0px`;
});

const getScrollContentStyle = computed((): CSSProperties => {
    const footerHeight = unref(getFooterHeight);
    return {
        position: 'relative',
        height: `calc(100% - ${footerHeight})`
    };
});

const getLoading = computed(() => {
    return !!unref(getProps)?.loading;
});

watch(() => visibleRef.value, (visible: boolean) => {
    nextTick(() => {
        emit('visible-change', visible);
        instance && drawerInstance.emitVisible?.(visible, instance.uid);
    });
});

// Cancel event
async function on_close(e: Record<string, any>) {
    const { closeFunc } = unref(getProps);
    emit('close', e);
    if (closeFunc && isFunction(closeFunc)) {
        const res = await closeFunc();
        visibleRef.value = !res;
        return;
    }
    visibleRef.value = false;
}

function set_drawer_props(props: Partial<DrawerProps>): void {
    // Keep the last setDrawerProps
    propsRef.value = deep_merge(unref(propsRef) || ({} as any), props);

    if (Reflect.has(props, 'visible')) {
        visibleRef.value = !!props.visible;
    }
}

function handle_ok() {
    emit('ok');
}
onMounted(() => {
});

</script>
<style lang='scss'>

</style>
