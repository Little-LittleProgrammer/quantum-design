<template>
    <el-dialog :visible="visible" :custom-class="classname + ' qm-confirm-pop'" :modal-append-to-body="false" :center="true" :show-close="false" top="0">
        <i class="el-icon-close close-pop-btn" @click="close_pop"></i>
        <span class="s-tit" v-html="title"></span>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submit" :size="$store.state.elementUi.modelSize">确认</el-button>
            <el-button type="primary" @click="close_pop" :size="$store.state.elementUi.modelSize">取消</el-button>
        </span>
    </el-dialog>
</template>
<script>
export default {
    props: {
        data: {
            type: Object,
            default: () => {
                return {
                    title: ''
                };
            }
        },
        visible: {
            type: Boolean,
            default: false
        },
        classname: {
            type: String,
            default: 'w-500'
        },
        title: {
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
        submit(){
            this.$emit('submit', false);
        },
        close_pop(){
            this.$emit('update:visible', false);
        }
    }
};
</script>
<style lang="scss">
$popWidthArr: (300 400 500 600 700 800);

.qm-confirm-pop{
    .el-dialog__header{
        display: none;
    }
    .el-dialog__body{
        padding: $space;
        & > .s-tit{
            display: block;
            font-size: 16px;
            text-align: center;
            line-height: 36px;
            .strong{
                font-weight: bold;
            }
            .important{
                color: $important-color;
            }
        }
    }

    @for $i from 1 through length($popWidthArr){
        &.w-#{nth($popWidthArr, $i)}{
            .el-dialog{
                width: #{nth($popWidthArr, $i)}px;
            }
        }
    }
}
</style>
