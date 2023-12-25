<template>

    <article class="km-loading-text" v-show="show">
        <div id="loading-text" class="loading-pic"></div>
        <span class="s-txt">正在加载中...</span>
    </article>

</template>

<script>
    import lottie from 'lottie-web'
    export default {
        props: {
            show: {
                type: Number,
                default: 0
            }
        },
        data() {
            return {

            }
        },
        watch: {

        },
        mounted() {
            lottie.loadAnimation({
                path: this.$store.state.domain + '/assets/loading/bodymovin/loading_txt.json', //json文件路径
                loop: true,
                autoplay: true,
                renderer: 'svg', //渲染方式，有"html"、"canvas"和"svg"三种
                container: document.getElementById('loading-text')
            });
        },
        computed: {},
        components: {},
        methods: {

        }
    }
</script>

<style lang="scss" scoped>
    @import "~@style/mixin.scss";
    @import "~@style/base.scss";

    .km-loading-text{
        text-align: center;
        line-height: 88px;
        height: 88px;
        overflow: hidden;
        background: #f2f3f5;
        .loading-pic{
            width: 70px;
            height: 50px;
            display: inline-block;
            vertical-align: middle;
            margin-top: -8px;
            canvas,svg{
                vertical-align: top;
            }
        }
        .s-txt{
            display: inline-block;
            color: $third_color;
            front-size: 28px;
            vertical-align: middle;
        }
    }

</style>
