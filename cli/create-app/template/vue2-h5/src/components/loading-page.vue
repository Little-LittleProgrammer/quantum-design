<template>

    <article class="km-loading-page" v-show="show">
        <div id="loading-page" class="loading-pic"></div>
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
            // show(value){
            //     setTimeout( () => {
            //         if(value == 0){
            //             this.aa();
            //         }else{
            //             this.bb();
            //         }
            //     }, 3000)
            // }
        },
        mounted() {

            lottie.loadAnimation({
                path: this.$store.state.domain + '/assets/loading/bodymovin/loading.json', //json文件路径
                loop: true,
                autoplay: true,
                renderer: 'svg', //渲染方式，有"html"、"canvas"和"svg"三种
                container: document.getElementById('loading-page')
            });
        },
        computed: {},
        components: {},
        methods: {
            // aa(){
            //     this.$emit('update:show', 1);
            //     console.log('aaaa')
            // },
            // bb(){
            //     this.$emit('update:show', 0);
            //     console.log('bbbb')
            // }
        }
    }
</script>

<style lang="scss" scoped>
    @import "~@style/mixin.scss";
    @import "~@style/base.scss";

    .km-loading-page{
        width: 120px;
        height: 120px;
        text-align: center;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        border-radius: 16px;
        z-index: 1010;
        overflow: hidden;
        .loading-pic{
            width: 80px;
            height: 62px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
        }
    }

</style>
