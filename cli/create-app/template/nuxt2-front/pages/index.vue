<template>
    <div class="main">
        this is a body demo
        <div class="flexbody">
            <div>313</div>
            <div>313</div>
            <div>313</div>
            <div>313</div>
            <div>313</div>
            <div>313</div>
        </div >
    </div>
</template>

<script>
export default {
    // head () {
    //     return {
    //         title: this.seo.title,
    //         meta: [
    //             // hid is used as unique identifier. Do not use `vmid` for it as it will not work
    //             {
    //                 hid: 'description',
    //                 name: 'description',
    //                 content: this.seo.description
    //             },
    //             {
    //                 name: 'keywords',
    //                 content: this.seo.keywords
    //             }
    //         ]
    //     };
    // },
    // 服务器渲染 生命周期
    // async asyncData ({ $axios, error, store }) {
    // // 生产环境不走proxy这里直接写域名
    //     const _rest = await $axios.get(types.API_HOME_INDEX);
    //     if (_rest.data.code == 200) {
    //         // store.dispatch('SET_NAVIGATION_DATA', _rest.data.data.navigation);
    //         return _rest.data.data;
    //     } else {
    //         error({
    //             statusCode: 500,
    //             message: '内部服务器错误'
    //         });
    //     }
    // },
    components: {},
    data () {
        return {};
    },
    mounted () {
    },
    destroyed () {},
    methods: {}
};
</script>
<style lang="scss">
.main{
    font-size: 80px;
}
.flexbody{
    display: flex;
    box-shadow: 0 5px 16px;
}
</style>
