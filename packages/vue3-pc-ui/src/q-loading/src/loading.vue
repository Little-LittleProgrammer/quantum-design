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
<style lang="scss">
@keyframes rotate{
    0%{
        transform: rotate(0deg);
    }
    50%{
        transform: rotate(180deg);
    }
    100%{
        transform: rotate(360deg);
    }
}
@keyframes wave{
    0%{
        transform: rotate(0deg);
        top: -100%;
    }
    100%{
        transform: rotate(360deg);
        top: -220%;
    }
}
@keyframes four-part1 {
    0% {
        top: -50px;
        left: 0;
        opacity: .1;
    }
    50% {
        top: 0px;
        left: 0;
        opacity: .7;
    }
    100% {
        top: 0px;
        left: 0;
        opacity: 1;
    }
}
@keyframes four-part2 {
    0% {
        top: 0px;
        right: -50px;
        opacity: .1;
    }
    50% {
        top: 0px;
        right: 0;
        opacity: .7;
    }
    100% {
        top: 0px;
        right: 0;
        opacity: 1;
    }
}
@keyframes four-part3 {
    0% {
        top: 50%;
        left: -50px;
        opacity: .1;
    }
    50% {
        top: 50%;
        left: 0;
        opacity: .7;
    }
    100% {
        top: 50%;
        left: 0;
        opacity: 1;
    }
}
@keyframes four-part4 {
    0% {
        bottom: -50px;
        right: 0;
        opacity: .1;
    }
    50% {
        bottom: 0;
        right: 0;
        opacity: .7;
    }
    100% {
        bottom: 0;
        right: 0;
        opacity: 1;
    }
}
@keyframes out-in1 {
    0% {
        left: -1000%;
        border-radius: 50%;
        margin-top:34%;
        height: 34%;
        opacity: .1;
    }
    35% {
        left: 0;
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        margin-top:0%;
        height: 100%;
        opacity: 1;
    }
    50% {
        left: 0;
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        margin-top:0%;
        height: 100%;
        opacity: 1;
    }
    65% {
        left: 0;
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        margin-top:0%;
        height: 100%;
        opacity: 1;
    }
    100% {
        left: 1000%;
        opacity: .1;
        margin-top:34%;
        height: 34%;
    }
}
@keyframes out-in2 {
    0% {
        left: -1000%;
        border-radius: 50%;
        margin-top:34%;
        height: 34%;
        opacity: .1;
    }
    35% {
        left: 34%;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        margin-top:0%;
        height: 100%;
        opacity: 1;
    }
    50% {
        left: 34%;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        margin-top:0%;
        height: 100%;
        opacity: 1;
    }
    65% {
        left: 34%;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        margin-top:0%;
        height: 100%;
        opacity: 1;
    }
    100% {
        left: 1000%;
        border-radius: 50%;
        margin-top:34%;
        height: 34%;
        opacity: .1;
    }
}
@keyframes out-in3 {
    0% {
        left: -1000%;
        border-radius: 50%;
        margin-top:34%;
        height: 34%;
        opacity: .1;
    }
    35% {
        left: 66%;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
        margin-top:0%;
        height: 100%;
        opacity: 1;
    }
    50% {
        left: 66%;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
        margin-top:0%;
        height: 100%;
        opacity: 1;
    }
    65% {
        left: 66%;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
        margin-top:0%;
        height: 100%;
        opacity: 1;
    }
    100% {
        left: 1000%;
        border-radius: 50%;
        margin-top:34%;
        height: 34%;
        opacity: .1;
    }
}
.page-container {
    position: relative;
    min-height: 60px;
    height: 100%;
    width: 100%;
    .loading-container {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        .loading{
            border-radius: 10px;
            position: relative;
            text-align: center;
            height: 46px;
            width: 46px;
            z-index: 888;
            &.large {
                height: 56px;
                width: 56px;
            }
            &.small {
                height: 36px;
                width: 36px;
            }
            .loading-back-four-part {
                height: 100%;
                width: 100%;
                border-radius: 10px;
                font-size: 0;
                .back1, .back2, .back3, .back4 {
                    position: absolute;
                    display: inline-block;
                    height: 50%;
                    width: 50%;
                    background-color: $header-environment-color;
                }
                .back1 {
                    border-top-left-radius: 10px;
                    animation: four-part1 2s infinite;
                }
                .back2 {
                    border-top-right-radius: 10px;
                    animation: four-part2 2s infinite;
                }
                .back3 {
                    border-bottom-left-radius: 10px;
                    animation: four-part3 2s infinite;
                }
                .back4 {
                    border-bottom-right-radius: 10px;
                    animation: four-part4 2s infinite;
                }
            }
            .loading-back-out-in {
                height: 100%;
                width: 100%;
                border-radius: 10px;
                font-size: 0;
                .back1, .back2, .back3 {
                    position: absolute;
                    display: inline-block;
                    height: 100%;
                    width: 34%;
                    background-color: $header-environment-color;
                }
                .back1 {
                    left: -1000%;
                    border-top-left-radius: 10px;
                    border-bottom-left-radius: 10px;
                    animation: out-in1 3s infinite;
                }
                .back2 {
                    left: -1000%;
                    animation: out-in2 3s infinite;
                    animation-delay: .3s;
                }
                .back3 {
                    left: -1000%;
                    border-top-right-radius: 10px;
                    border-bottom-right-radius: 10px;
                    animation: out-in3 3s infinite;
                    animation-delay: .7s;
                }
            }
            .loading-back-rotate {
                height: 100%;
                width: 100%;
                border-radius: 10px;
                font-size: 0;
                background-color: $header-environment-color;
                animation: rotate 1.5s infinite ;
            }
            .loading-back-wave {
                position: absolute;
                height: 100%;
                width: 100%;
                border-radius: 10px;
                font-size: 0;
                top: 0;
                overflow: hidden;
                background-color: $header-environment-color;
                .wave {
                    position: absolute;
                    height: 200%;
                    width: 200%;
                    @include bg-color(aside-bg);
                    border-radius: 30px;
                    left: -50%;
                    animation: wave 1.5s linear infinite ;
                    z-index: 100;
                }
            }
            .img-container {
                position: absolute;
                bottom: 0;
                width: 100%;
                height: 0%;
                background-image: url('data:image/svg+xml;base64, PHN2ZyBpZD0iQnVuIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4MCA3MCI+PHRpdGxlPkJ1biBMb2dvPC90aXRsZT48cGF0aCBpZD0iU2hhZG93IiBkPSJNNzEuMDksMjAuNzRjLS4xNi0uMTctLjMzLS4zNC0uNS0uNXMtLjMzLS4zNC0uNS0uNS0uMzMtLjM0LS41LS41LS4zMy0uMzQtLjUtLjUtLjMzLS4zNC0uNS0uNS0uMzMtLjM0LS41LS41LS4zMy0uMzQtLjUtLjVBMjYuNDYsMjYuNDYsMCwwLDEsNzUuNSwzNS43YzAsMTYuNTctMTYuODIsMzAuMDUtMzcuNSwzMC4wNS0xMS41OCwwLTIxLjk0LTQuMjMtMjguODMtMTAuODZsLjUuNS41LjUuNS41LjUuNS41LjUuNS41LjUuNUMxOS41NSw2NS4zLDMwLjE0LDY5Ljc1LDQyLDY5Ljc1YzIwLjY4LDAsMzcuNS0xMy40OCwzNy41LTMwQzc5LjUsMzIuNjksNzYuNDYsMjYsNzEuMDksMjAuNzRaIi8+PGcgaWQ9IkJvZHkiPjxwYXRoIGlkPSJCYWNrZ3JvdW5kIiBkPSJNNzMsMzUuN2MwLDE1LjIxLTE1LjY3LDI3LjU0LTM1LDI3LjU0UzMsNTAuOTEsMywzNS43QzMsMjYuMjcsOSwxNy45NCwxOC4yMiwxM1MzMy4xOCwzLDM4LDNzOC45NCw0LjEzLDE5Ljc4LDEwQzY3LDE3Ljk0LDczLDI2LjI3LDczLDM1LjdaIiBzdHlsZT0iZmlsbDojZmJmMGRmIi8+PHBhdGggaWQ9IkJvdHRvbV9TaGFkb3ciIGRhdGEtbmFtZT0iQm90dG9tIFNoYWRvdyIgZD0iTTczLDM1LjdhMjEuNjcsMjEuNjcsMCwwLDAtLjgtNS43OGMtMi43MywzMy4zLTQzLjM1LDM0LjktNTkuMzIsMjQuOTRBNDAsNDAsMCwwLDAsMzgsNjMuMjRDNTcuMyw2My4yNCw3Myw1MC44OSw3MywzNS43WiIgc3R5bGU9ImZpbGw6I2Y2ZGVjZSIvPjxwYXRoIGlkPSJMaWdodF9TaGluZSIgZGF0YS1uYW1lPSJMaWdodCBTaGluZSIgZD0iTTI0LjUzLDExLjE3QzI5LDguNDksMzQuOTQsMy40Niw0MC43OCwzLjQ1QTkuMjksOS4yOSwwLDAsMCwzOCwzYy0yLjQyLDAtNSwxLjI1LTguMjUsMy4xMy0xLjEzLjY2LTIuMywxLjM5LTMuNTQsMi4xNS0yLjMzLDEuNDQtNSwzLjA3LTgsNC43QzguNjksMTguMTMsMywyNi42MiwzLDM1LjdjMCwuNCwwLC44LDAsMS4xOUM5LjA2LDE1LjQ4LDIwLjA3LDEzLjg1LDI0LjUzLDExLjE3WiIgc3R5bGU9ImZpbGw6I2ZmZmVmYyIvPjxwYXRoIGlkPSJUb3AiIGQ9Ik0zNS4xMiw1LjUzQTE2LjQxLDE2LjQxLDAsMCwxLDI5LjQ5LDE4Yy0uMjguMjUtLjA2LjczLjMuNTksMy4zNy0xLjMxLDcuOTItNS4yMyw2LTEzLjE0QzM1LjcxLDUsMzUuMTIsNS4xMiwzNS4xMiw1LjUzWm0yLjI3LDBBMTYuMjQsMTYuMjQsMCwwLDEsMzksMTljLS4xMi4zNS4zMS42NS41NS4zNkM0MS43NCwxNi41Niw0My42NSwxMSwzNy45Myw1LDM3LjY0LDQuNzQsMzcuMTksNS4xNCwzNy4zOSw1LjQ5Wm0yLjc2LS4xN0ExNi40MiwxNi40MiwwLDAsMSw0NywxNy4xMmEuMzMuMzMsMCwwLDAsLjY1LjExYy45Mi0zLjQ5LjQtOS40NC03LjE3LTEyLjUzQzQwLjA4LDQuNTQsMzkuODIsNS4wOCw0MC4xNSw1LjMyWk0yMS42OSwxNS43NmExNi45NCwxNi45NCwwLDAsMCwxMC40Ny05Yy4xOC0uMzYuNzUtLjIyLjY2LjE4LTEuNzMsOC03LjUyLDkuNjctMTEuMTIsOS40NUMyMS4zMiwxNi40LDIxLjMzLDE1Ljg3LDIxLjY5LDE1Ljc2WiIgc3R5bGU9ImZpbGw6I2NjYmVhNztmaWxsLXJ1bGU6ZXZlbm9kZCIvPjxwYXRoIGlkPSJPdXRsaW5lIiBkPSJNMzgsNjUuNzVDMTcuMzIsNjUuNzUuNSw1Mi4yNy41LDM1LjdjMC0xMCw2LjE4LTE5LjMzLDE2LjUzLTI0LjkyLDMtMS42LDUuNTctMy4yMSw3Ljg2LTQuNjIsMS4yNi0uNzgsMi40NS0xLjUxLDMuNi0yLjE5QzMyLDEuODksMzUsLjUsMzgsLjVzNS42MiwxLjIsOC45LDMuMTRjMSwuNTcsMiwxLjE5LDMuMDcsMS44NywyLjQ5LDEuNTQsNS4zLDMuMjgsOSw1LjI3QzY5LjMyLDE2LjM3LDc1LjUsMjUuNjksNzUuNSwzNS43LDc1LjUsNTIuMjcsNTguNjgsNjUuNzUsMzgsNjUuNzVaTTM4LDNjLTIuNDIsMC01LDEuMjUtOC4yNSwzLjEzLTEuMTMuNjYtMi4zLDEuMzktMy41NCwyLjE1LTIuMzMsMS40NC01LDMuMDctOCw0LjdDOC42OSwxOC4xMywzLDI2LjYyLDMsMzUuNywzLDUwLjg5LDE4LjcsNjMuMjUsMzgsNjMuMjVTNzMsNTAuODksNzMsMzUuN0M3MywyNi42Miw2Ny4zMSwxOC4xMyw1Ny43OCwxMyw1NCwxMSw1MS4wNSw5LjEyLDQ4LjY2LDcuNjRjLTEuMDktLjY3LTIuMDktMS4yOS0zLTEuODRDNDIuNjMsNCw0MC40MiwzLDM4LDNaIi8+PC9nPjxnIGlkPSJNb3V0aCI+PGcgaWQ9IkJhY2tncm91bmQtMiIgZGF0YS1uYW1lPSJCYWNrZ3JvdW5kIj48cGF0aCBkPSJNNDUuMDUsNDNhOC45Myw4LjkzLDAsMCwxLTIuOTIsNC43MSw2LjgxLDYuODEsMCwwLDEtNCwxLjg4QTYuODQsNi44NCwwLDAsMSwzNCw0Ny43MSw4LjkzLDguOTMsMCwwLDEsMzEuMTIsNDNhLjcyLjcyLDAsMCwxLC44LS44MUg0NC4yNkEuNzIuNzIsMCwwLDEsNDUuMDUsNDNaIiBzdHlsZT0iZmlsbDojYjcxNDIyIi8+PC9nPjxnIGlkPSJUb25ndWUiPjxwYXRoIGlkPSJCYWNrZ3JvdW5kLTMiIGRhdGEtbmFtZT0iQmFja2dyb3VuZCIgZD0iTTM0LDQ3Ljc5YTYuOTEsNi45MSwwLDAsMCw0LjEyLDEuOSw2LjkxLDYuOTEsMCwwLDAsNC4xMS0xLjksMTAuNjMsMTAuNjMsMCwwLDAsMS0xLjA3LDYuODMsNi44MywwLDAsMC00LjktMi4zMSw2LjE1LDYuMTUsMCwwLDAtNSwyLjc4QzMzLjU2LDQ3LjQsMzMuNzYsNDcuNiwzNCw0Ny43OVoiIHN0eWxlPSJmaWxsOiNmZjYxNjQiLz48cGF0aCBpZD0iT3V0bGluZS0yIiBkYXRhLW5hbWU9Ik91dGxpbmUiIGQ9Ik0zNC4xNiw0N2E1LjM2LDUuMzYsMCwwLDEsNC4xOS0yLjA4LDYsNiwwLDAsMSw0LDEuNjljLjIzLS4yNS40NS0uNTEuNjYtLjc3YTcsNywwLDAsMC00LjcxLTEuOTMsNi4zNiw2LjM2LDAsMCwwLTQuODksMi4zNkE5LjUzLDkuNTMsMCwwLDAsMzQuMTYsNDdaIi8+PC9nPjxwYXRoIGlkPSJPdXRsaW5lLTMiIGRhdGEtbmFtZT0iT3V0bGluZSIgZD0iTTM4LjA5LDUwLjE5YTcuNDIsNy40MiwwLDAsMS00LjQ1LTIsOS41Miw5LjUyLDAsMCwxLTMuMTEtNS4wNSwxLjIsMS4yLDAsMCwxLC4yNi0xLDEuNDEsMS40MSwwLDAsMSwxLjEzLS41MUg0NC4yNmExLjQ0LDEuNDQsMCwwLDEsMS4xMy41MSwxLjE5LDEuMTksMCwwLDEsLjI1LDFoMGE5LjUyLDkuNTIsMCwwLDEtMy4xMSw1LjA1QTcuNDIsNy40MiwwLDAsMSwzOC4wOSw1MC4xOVptLTYuMTctNy40Yy0uMTYsMC0uMi4wNy0uMjEuMDlhOC4yOSw4LjI5LDAsMCwwLDIuNzMsNC4zN0E2LjIzLDYuMjMsMCwwLDAsMzguMDksNDlhNi4yOCw2LjI4LDAsMCwwLDMuNjUtMS43Myw4LjMsOC4zLDAsMCwwLDIuNzItNC4zNy4yMS4yMSwwLDAsMC0uMi0uMDlaIi8+PC9nPjxnIGlkPSJGYWNlIj48ZWxsaXBzZSBpZD0iUmlnaHRfQmx1c2giIGRhdGEtbmFtZT0iUmlnaHQgQmx1c2giIGN4PSI1My4yMiIgY3k9IjQwLjE4IiByeD0iNS44NSIgcnk9IjMuNDQiIHN0eWxlPSJmaWxsOiNmZWJiZDAiLz48ZWxsaXBzZSBpZD0iTGVmdF9CbHVjaCIgZGF0YS1uYW1lPSJMZWZ0IEJsdWNoIiBjeD0iMjIuOTUiIGN5PSI0MC4xOCIgcng9IjUuODUiIHJ5PSIzLjQ0IiBzdHlsZT0iZmlsbDojZmViYmQwIi8+PHBhdGggaWQ9IkV5ZXMiIGQ9Ik0yNS43LDM4LjhhNS41MSw1LjUxLDAsMSwwLTUuNS01LjUxQTUuNTEsNS41MSwwLDAsMCwyNS43LDM4LjhabTI0Ljc3LDBBNS41MSw1LjUxLDAsMSwwLDQ1LDMzLjI5LDUuNSw1LjUsMCwwLDAsNTAuNDcsMzguOFoiIHN0eWxlPSJmaWxsLXJ1bGU6ZXZlbm9kZCIvPjxwYXRoIGlkPSJJcmlzIiBkPSJNMjQsMzMuNjRhMi4wNywyLjA3LDAsMSwwLTIuMDYtMi4wN0EyLjA3LDIuMDcsMCwwLDAsMjQsMzMuNjRabTI0Ljc3LDBhMi4wNywyLjA3LDAsMSwwLTIuMDYtMi4wN0EyLjA3LDIuMDcsMCwwLDAsNDguNzUsMzMuNjRaIiBzdHlsZT0iZmlsbDojZmZmO2ZpbGwtcnVsZTpldmVub2RkIi8+PC9nPjwvc3ZnPg==');
                background-size: 90%;
                transform-origin: bottom;
                background-size: 100%;
                z-index: 999;
                background-position: bottom;
            }
        }
    }
    .main-conatiner {
        height: 100%;
        opacity: 1;
        transition: all .5s;
        overflow-y: auto;
    }
    .mask {
        pointer-events: none;
        opacity: .3;
    }
}
</style>
