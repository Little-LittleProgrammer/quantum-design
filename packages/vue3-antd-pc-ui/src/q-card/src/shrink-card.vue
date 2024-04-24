<!--  -->
<template>
    <a-card class="q-shrink-card" v-bind="getCardProps">
        <template #extra="slotData">
            <slot name="extra" v-bind="slotData|| {}"></slot>
            <a-button type="link" size="small" @click="change_show"> {{ data.containerShow ? '收起' : '展开'}}</a-button>
        </template>
        <div class="q-shrink-card-shrink-container" ref="shrinkContainerRef">
            <div ref="shrinkCardRef">
                <slot ></slot>
            </div>
        </div>
        <template #[slot]="slotData" v-for="slot in slots" :key="slot">
            <slot :name="slot" v-bind="slotData || {}"></slot>
        </template>
    </a-card>
</template>

<script lang='ts' setup>
import { reactive, onMounted, computed, PropType, ref} from 'vue';
import {CardProps} from 'ant-design-vue/lib/card/Card';
import {Card as ACard} from 'ant-design-vue';
import './style/shrink-card.scss';

defineOptions({
    name: 'QAntdShrinkCard'
});

const props = defineProps({
    componentProps: {
        type: Object as PropType<CardProps>,
        default: () => {}
    }
});

const slots = ['actions', 'cover', 'customTab', 'tabBarExtraContent', 'title'];
const shrinkContainerRef = ref<HTMLDivElement | null>(null);
const shrinkCardRef = ref<HTMLDivElement | null>(null);

interface DataProps {
    containerShow: boolean
}
const data: DataProps = reactive({
    containerShow: true
});
const getCardProps = computed<CardProps>(() => {
    return {...props.componentProps};
});
function change_show() {
    if (shrinkCardRef.value && shrinkContainerRef.value) {
        if (!data.containerShow) {
            shrinkContainerRef.value.style.maxHeight = shrinkCardRef.value.offsetHeight + 'px';
        } else {
            shrinkContainerRef.value.style.maxHeight = '0px';
        }
    }
    data.containerShow = !data.containerShow;
}
onMounted(() => {
});

</script>
<style lang='scss' scoped>

</style>
