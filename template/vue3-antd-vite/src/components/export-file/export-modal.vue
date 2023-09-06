<!--  -->
<template>
    <!-- 异步导出文件提示窗 -->
    <a-modal
        v-model:open="globalStore.asyncExportNoticePop.visible"
        class="async-export-notice-pop"
        :centered="true"
        :show-close="false"
        title="导出"
    >
        <div class="async-download-tips">
            <span class="s-tit">
                文件名：
                <em>{{ globalStore.asyncExportNoticePop.file }}</em>
            </span>
            <span
                v-if="globalStore.asyncExportNoticePop.title && globalStore.asyncExportNoticePop.title != ''"
                v-html="globalStore.asyncExportNoticePop.title"
            ></span>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <a-button type="primary" @click="globalStore.asyncExportNoticePop.visible = false">确定</a-button>
            </span>
        </template>
    </a-modal>
    <!-- 异步导出文件提示窗 -->
</template>

<script lang='ts' setup>
import { useGlobalStore } from '@/store/modules/global';
import { onMounted} from 'vue';
const globalStore = useGlobalStore();
onMounted(() => {
});

</script>
<style lang='scss' scoped>
// 异步提示弹窗
.async-export-notice-pop {
    .async-download-tips {
        span {
            display: block;
            line-height: 30px;
            font-size: 16px;
            &.s-tit {
                em {
                    font-weight: bold;
                    font-size: 18px;
                }
            }
            a {
                color: $primary-color;
            }
        }
    }
}
</style>
