<template>
    <div class="m-demo-block js-md-content">
        <!-- 组件运行 -->
        <div class="demo"><slot></slot></div>
        <!-- 展开收起代码 -->
        <div class="up-down" @click="showCode=!showCode">
            <span>{{showCode ? '收起代码' : '展开代码'}}</span>
        </div>
        <!-- 代码展示 -->
        <transition name="el-zoom-in-top">
            <div class="code" v-if="!params.hideCode && showCode">
                <slot name="code"></slot>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    props: {
        data: Object,
        params: {
            type: Object,
            default () {
                return {};
            }
        }
    },
    data () {
        return {
            showCode: true
        };
    },
    methods: {
    }
};
</script>
<style lang="scss" scoped>
.up-down {
    font-size: 14px;
    padding: 10px 20px;
    text-align: center;
    border-top: 1px solid #d7e2ea;
    background: #d7e2ea;
    // span {
    cursor: pointer;
    transition: all .3s;
    &:hover {
        color: $brand_color;
    }
    // }
}
</style>
<style lang="scss">
.m-demo-block .code pre {
    background: #fff!important;
}
</style>
