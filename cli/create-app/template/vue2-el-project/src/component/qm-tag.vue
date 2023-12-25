<template>
    <span class="qm-tag" v-if="value && value != ''"><em :title="value">{{ value }}</em></span>
</template>
<script>
export default {
    props: {
        value: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
        };
    },
    computed: {
    },
    components: {
    },
    created() {
    },
    methods: {
    }
};
</script>
<style lang="scss" scoped>
    .qm-tag{
        display: inline-block;
        vertical-align: top;
        padding: $space/2 $space $space/2 0;
        em{
            display: block;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            vertical-align: top;
            font-size: 14px;
            line-height: 23px;
            height: 23px;
            color: $primary-color;
            border: 1px solid rgba( $primary-color, 0.8);
            background: rgba( $primary-color, 0.1);
            padding: 0 $space;
            @include borderRadius($border-radius-base);
            @include hack(box-sizing, border-box);
        }
    }
</style>
