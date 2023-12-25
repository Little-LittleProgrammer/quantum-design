<template>
    <el-dialog :visible.sync="data.visible" class="qm-async-export-notice-pop" :modal-append-to-body="false" :center="true" :show-close="false" top="0" title="导出">
        <div class="async-download-tips">
            <span class="s-tit">文件名：<em>{{ data.file }}</em></span>
            <span v-if="data.title && data.title != ''" v-html="data.title"></span>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submit">确定</el-button>
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
                    visible: false,
                    file: '',
                    title: ''
                };
            }
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
        }
    }
};
</script>
<style lang="scss" scoped>
// 异步提示弹窗
.qm-async-export-notice-pop{
    // display: flex;
    // justify-content: center;
    // align-items: center;
    .async-download-tips{
        span{
            display: block;
            line-height: 30px;
            font-size: 16px;
            &.s-tit{
                em{
                    font-weight: bold;
                    font-size: 18px;
                }
            }
            a{
                color: $primary-color;
            }
        }
    }
}
</style>
