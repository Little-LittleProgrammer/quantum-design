<template>
    <transition name="toast">
        <div class="km-toast" v-show="isShow">
            <div class="km-toast-con">
                <i class="icon" :class="params.type" v-if="params.type != ''"></i>
                <article class="txt">
                    <span class="s-tit" v-if="params.title != ''">{{params.title}}</span>
                    <span class="s-txt" v-if="params.text != ''">{{params.text}}</span>
                </article>
            </div>
        </div>
    </transition>
</template>
<script>
    export default {
        props: {
            params: {
                type: Object,
                default: {
                    title: {
                        type: String,
                        default: ''
                    },
                    text: {
                        type: String,
                        default: ''
                    },
                    type: {    //default、success、loading、error
                        type: String,
                        default: ''
                    },
                    delay: {
                        type: Number,
                        default: 2000
                    }
                }
            },
            isShow: {
                type: Number,
                default: 0
            },
        },
        data() {
            return {
            }
        },
        watch: {
            isShow(to) {
                if (to && this.params.delay) {
                    setTimeout(() => {
                        this.$emit('update:isShow', false);
                    }, this.params.delay)
                }
            }
        },
        mounted() {
        },
        computed: {},
        components: {},
        methods: {}
    }
</script>

<style lang="scss" scoped>
    @import "~@style/mixin.scss";
    @import "~@style/base.scss";

    .km-toast {
        position: fixed;
        top: 50%;
        left: 50%;
        width: 460px;
        overflow: hidden;
        background: rgba(0,0,0,0.5);
        text-align: center;
        margin-top: -1%;
        margin-left: -230px;
        padding: $spacing_num;
        z-index: $toast_index;
        border-radius: 8px;
        @supports (transform: translate(-50%,-50%)) {
            margin-top: 0;
            margin-left: 0;
            width: auto;
            max-width: 460px;
            transform: translate(-50%,-50%);
        }
        .km-toast-con{
            display: flex;
        }
        .icon{
            &.success{

            }
            &.error{
            
            }
            &.loading{

            }
        }
        .txt{
            flex: 1;
        }
        .s-tit{
            line-height: 40px;
            font-size: 28px;
            color: #fff;
            word-break: break-word;
            /*white-space: nowrap;*/
        }
        .s-txt{
            line-height:40px;
            font-size: 28px;
            color: #fff;
            word-break: break-word;
        }
    }

    .toast-enter,.toast-leave-to {
        opacity: 0;
        transform: translate(-50%,-80%) !important;
    }
    .toast-enter-active,.toast-leave-active {
        transition: all 0.3s ease-in-out;
    }
</style>