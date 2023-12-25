<template>
    <el-dialog :visible="visible" :custom-class="classname + ' qm-form-pop'" :modal-append-to-body="false" :center="true" :show-close="false" top="0" :title="title">
        <i class="el-icon-close close-pop-btn" @click="close_pop"></i>
        <div class="qm-form-pop-data"><slot name="slot-form-data"></slot></div>
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
                    
                }
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
.qm-form-pop{
    .el-form{
        &-item{
            margin-right: 0 !important;
            &:last-child{
                margin-bottom: 0 !important;
            }
        }
    }
}
</style>
