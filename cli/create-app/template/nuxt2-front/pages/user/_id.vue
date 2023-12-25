<template>
    <div class="main-container">
        <div>{{ id }}</div>
    </div>
</template>
<script>
export default {
    name: 'Id',
    validate ({ params }) { // 验证参数，如果不符合直接404
        // 必须是number类型
        return /^\d+$/.test(params.id);
    },
    async asyncData ({ $axios, error, store, params }) {
        if (params.id == 3){
            error({
                statusCode: 500,
                message: '内部服务器错误'
            });
        }
        return params;
    },
    data () {
        return {
        };
    },
    mounted () {
    },
    methods: {
    }
};
</script>
<style lang="scss" scoped>
</style>
