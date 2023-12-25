<template>
    <div class="free-pop">
        <div class="free-pop-mask" v-show="freePopData.isShow" @click="hide_pop"></div>
        <transition :name="freePopData.name ? freePopData.name : 'pop'">
            <div class="km-pop" v-show="freePopData.isShow" :class="freePopData.class">
                <slot name="freePop"></slot>
            </div>
        </transition>
    </div>
</template>
<script>
    export default {
        props: {
            freePopData: {
                isShow: {
                    type: Number,
                    default: 0
                },
                noClose: {
                    type: Number,
                    default: 0
                }
            }
        },
        data() {
            return {

            }
        },
        watch: {
            
        },
        mounted() {
            document.querySelectorAll('.free-pop-mask')[0].addEventListener('touchmove', function (event) {
                event.preventDefault();
            }, false);
        },
        computed: {},
        components: {},
        methods: {
            hide_pop() {
                if(!this.freePopData.noClose){
                    this.freePopData.isShow = 0;
                }
            },
        }
    }
</script>

<style lang="scss">
    @import "~@style/mixin.scss";
    @import "~@style/base.scss";

    .km-pop{
        position: fixed;
        z-index: $pop_index + 10;
        left: 50%;
        top: 50%;
        text-align: left;
        background: #fff;
        overflow: hidden;
        width: 600px;
        transform: translate(-50%,-50%);
        box-sizing: border-box;
        @extend %set_borderRadius;
        &-th{
            line-height: 90px;
            height: 90px;
            overflow: hidden;
            position: relative;
            display: flex;
            @include border1px(bottom,$border_color,before);
            .s-tit{
                display: block;
                text-align: center;
                font-size: 32px;
                color: $first_color;
                flex: 1;
                width: 100px;
                font-weight: bold;
                em{
                    font-size: 24px;
                    color: $second_color;
                }
            }
            .a-close-btn{
                width: 90px;
                height: 90px;
                line-height: 90px;
                overflow: hidden;
                text-align: center;
                position: absolute;
                right: 0;
                top: 0;
                .iconfont{
                    width: 90px;
                    height: 90px;
                    font-size: 30px;
                    color: $third_color;
                }
            }
            &.margin{
                margin: 0 $spacing_num;
            }
        }
        &-tb{
            @extend %set_padding;
            &.auto{
                padding: 0;
            }
            .txt-box{
                @include border1px(top,$border_color,before);
                padding: 30px 0;
                span{
                    display: block;
                    &.s-tit{
                        line-height: 45px;
                        font-size: 32px;
                        color: $first_color;
                    }
                    &.s-des{
                        line-height: 45px;
                        font-size: 28px;
                        color: $third_color;
                        padding-top: 18px;
                    }
                }
            }
        }
        &-bottom-btn{
            display: flex;
            line-height: 96px;
            text-align: center;
            overflow: hidden;
            @include border1px(top,$border_color,before);
            a{
                flex: 1;
                display: block;
                width: 0;
                font-size: 32px;
                color: $first_color;
                text-align: center;
                color: $second_color;
                @include border1px(left,$border_color,before);
                &.cur{
                    color: $orange_color;
                }
                &:first-child{
                    background: none;
                }
                &.orange{
                    background: $orange_color;
                    color: #fff;
                }
            }
        }
    }

    .free-pop{
        position: fixed;
        z-index: $pop_index + 10;
        text-align: left;
        background: #fff;
        .free-pop-mask{
            position: fixed;
            width: 100%;
            height: 100%;
            overflow: hidden;
            top: 0;
            left: 0;
            z-index: $pop_index;
            background: rgba(0,0,0,0.5);
        }
        .bottom{
            top: auto;
            left: 0;
            bottom: 0;
            transform: translate(0,0);
            width: 100%;
            background: #fff;
            border-radius: 0;
            .km-pop-th{
                .s-tit{
                    text-align: left;
                    padding-left: $spacing_num;
                }
                &.margin{
                    .s-tit{
                        padding: 0;
                    }
                }
            }
        }
        .confirm{
            .km-pop-tb{
                .txt{
                    padding: 60px 0;
                    span{
                        display: block;
                        &.s-tit{
                            line-height: 50px;
                            font-size: 32px;
                            text-align: center;
                            padding: 20px 0;
                        }
                    }
                }
            }
        }
    }


    .pop-enter,.pop-leave-to {
        opacity: 0;
        transform: translate(-50%,-80%) !important;
    }
    .pop-enter-active,.pop-leave-active {
        transition: all 0.3s ease-in-out;
    }

    .pop-bottom-enter,.pop-bottom-leave-to {
        opacity: 0;
        transform: translate(0,100%) !important;
    }
    .pop-bottom-enter-active,.pop-bottom-leave-active {
        transition: all 0.3s ease-in-out;
    }

</style>