<!--  -->
<template>
    <div class="page-container">
        <div class="loading-container" v-if="loading">
            <div class="loading" ref="ref-loading" :class="size">
                <template v-if="mode=='four-part'">
                    <div class="loading-back-four-part">
                        <div class="back1"></div>
                        <div class="back2"></div>
                        <div class="back3"></div>
                        <div class="back4"></div>
                    </div>
                </template>
                <template v-if="mode=='rotate'">
                    <div class="loading-back-rotate"></div>
                </template>
                <template v-if="mode=='out-in'">
                    <div class="loading-back-out-in">
                        <div class="back1"></div>
                        <div class="back2"></div>
                        <div class="back3"></div>
                    </div>
                </template>
                <div v-if="mode=='wave'" class="loading-back-wave">
                    <div class="wave"></div>
                </div>
                <div class="img-container" :style="'height:'+ data.height+'px'">
                </div>
            </div>
        </div>
        <div class="main-conatiner js-main-conatiner" :class="{'mask': loading}">
            <slot></slot>
        </div>
    </div>
</template>

<script lang='ts' setup>
import { reactive, onBeforeMount, watch, onBeforeUnmount} from 'vue';
import './style/index.scss';
import { loadingProps } from './loadingTypes';
defineOptions({
    name: 'QLoading'
});

const props = defineProps(loadingProps);

let timeout:ReturnType<typeof setTimeout>;
const data = reactive({
    height: 0
});
onBeforeMount(() => {
    clearInterval(timeout);
});
const max_height = (val:number, time: number) => {
    clearInterval(timeout);
    setTimeout(() => {
        data.height = 0;
        start_timeout(val, time);
    }, 500);
};
const start_timeout = (val:number, time: number) => {
    clearInterval(timeout);
    const _time = (time - 500) / (val - 7.2);
    timeout = setInterval(() => {
        if (data.height > 20 && data.height < 35) {
            data.height = data.height + 1;
        }
        data.height === val ? max_height(val, time) : data.height += 1;
    }, _time);
};
watch(() => props.loading, (val) => {
    if (val) {
        if (props.mode != 'wave') {
            data.height = 0;
            const _height = props.size === 'small' ? 36 : props.size === 'default' ? 46 : 56;
            const _time = props.mode === 'rotate' ? 1500 : props.mode === 'four-part' ? 2000 : 3000;
            start_timeout(_height, _time);
        } else {
            data.height = props.size === 'small' ? 36 : props.size === 'default' ? 46 : 56;
        }
    } else {
        clearInterval(timeout);
    }
}, {immediate: true});
onBeforeUnmount(() => {
    clearInterval(timeout);
});
</script>

